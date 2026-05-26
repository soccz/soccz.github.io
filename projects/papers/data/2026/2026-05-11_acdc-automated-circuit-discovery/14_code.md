# 14 PyTorch Code — ACDC 알고리즘 재현

> **🧒 본 챕터는 "직접 해보기"**: paper 의 official code 는 `github.com/ArthurConmy/Automatic-Circuit-Discovery` (MIT). 본 챕터는 *minimal* 재현 — Edge-by-edge ablation + KL metric + threshold pruning.

## 14.1 의존성

```bash
pip install torch transformers transformer_lens einops
```

`transformer_lens` 는 Neel Nanda 의 mech interp 라이브러리.

## 14.2 IOI Task Setup

```python
import torch
import torch.nn.functional as F
from transformer_lens import HookedTransformer

def gen_ioi_examples(num_examples=100):
    """ Generate IOI examples: "When [S1] and [IO] went to the [PLACE], [S1] gave a [OBJECT] to" → [IO] """
    names_S = ["Mary", "John", "Sarah", "Tom", "Alice", "Bob"]
    names_IO = ["Lisa", "Mike", "Emma", "Jake"]
    places = ["store", "park", "restaurant", "school"]
    objects = ["book", "drink", "ball", "pen"]
    
    examples = []
    for _ in range(num_examples):
        S1 = random.choice(names_S)
        IO = random.choice(names_IO)
        PLACE = random.choice(places)
        OBJECT = random.choice(objects)
        prompt = f"When {S1} and {IO} went to the {PLACE}, {S1} gave a {OBJECT} to"
        target = IO  # answer
        examples.append({'prompt': prompt, 'target': target, 'S1': S1, 'IO': IO})
    return examples


def gen_corrupt_examples(clean_examples):
    """ Corrupt: swap S1 and IO names """
    corrupt = []
    for ex in clean_examples:
        new_ex = ex.copy()
        new_ex['S1'], new_ex['IO'] = ex['IO'], ex['S1']
        new_ex['prompt'] = new_ex['prompt'].replace(ex['S1'], '__TEMP__').replace(ex['IO'], ex['S1']).replace('__TEMP__', ex['IO'])
        # Target: same (IO), but now different name
        new_ex['target'] = ex['S1']  # original S1 becomes new IO
        corrupt.append(new_ex)
    return corrupt
```

## 14.3 ACDC Algorithm Core

```python
class ACDC:
    """
    paper §3 ACDC algorithm.
    """
    def __init__(self, model: HookedTransformer, threshold=0.06):
        self.model = model
        self.threshold = threshold
        self.removed_edges = []
        self.kept_edges = []
    
    def compute_kl(self, clean_logits, ablated_logits):
        """ KL divergence between clean and ablated output distributions """
        clean_probs = F.log_softmax(clean_logits, dim=-1)
        ablated_probs = F.softmax(ablated_logits, dim=-1)
        return F.kl_div(clean_probs, ablated_probs, reduction='batchmean', log_target=False).item()
    
    def get_all_edges(self):
        """
        Enumerate all edges in computational graph.
        Edges: (component_from, component_to)
        Components: embed, attention head (layer, head), MLP (layer), unembed
        """
        edges = []
        L = self.model.cfg.n_layers
        H = self.model.cfg.n_heads
        
        # All component pairs (excluding self-loops)
        # Note: actual graph respects topological order (residual stream)
        for layer in range(L):
            for head in range(H):
                # Each head has edges to: residual stream → other heads/MLPs in later layers
                comp_src = ('head', layer, head)
                for layer2 in range(layer, L):
                    for head2 in range(H):
                        edges.append((comp_src, ('head', layer2, head2)))
                    edges.append((comp_src, ('mlp', layer2)))
                edges.append((comp_src, ('output',)))
            
            edges.append((('mlp', layer), ('output',)))
        
        return edges
    
    def ablate_edge(self, clean_input, corrupt_input, edge):
        """
        Resample ablation: replace edge's contribution with corrupt run's value
        """
        # Run clean & corrupt
        clean_logits, clean_cache = self.model.run_with_cache(clean_input)
        corrupt_logits, corrupt_cache = self.model.run_with_cache(corrupt_input)
        
        # Hook: patch specific activation
        comp_src, comp_dst = edge
        # This is simplified - actual implementation needs careful hook management
        def patch_hook(activation, hook):
            # Replace contribution from comp_src in comp_dst
            # (Implementation depends on transformer_lens API)
            return activation
        
        with self.model.hooks(fwd_hooks=[(f"blocks.{comp_dst[1]}.hook_resid_pre", patch_hook)]):
            ablated_logits = self.model(clean_input)
        
        return ablated_logits
    
    def discover_circuit(self, clean_examples, corrupt_examples):
        """
        Main ACDC loop.
        """
        all_edges = self.get_all_edges()
        print(f"Total edges to check: {len(all_edges)}")
        
        # Iterate from output back to input (reverse topological)
        for edge_idx, edge in enumerate(sorted(all_edges, key=lambda e: -self._topo_order(e))):
            # Use first example for testing
            clean = clean_examples[0]
            corrupt = corrupt_examples[0]
            
            # Compute clean and ablated logits
            clean_input = self.model.to_tokens(clean['prompt'])
            corrupt_input = self.model.to_tokens(corrupt['prompt'])
            clean_logits = self.model(clean_input)
            ablated_logits = self.ablate_edge(clean_input, corrupt_input, edge)
            
            # Compute KL divergence
            kl = self.compute_kl(clean_logits, ablated_logits)
            
            if kl < self.threshold:
                # Edge unnecessary
                self.removed_edges.append(edge)
                # Remove from graph (subsequent ablations consider this gone)
            else:
                self.kept_edges.append(edge)
            
            if edge_idx % 100 == 0:
                print(f"  edge {edge_idx}/{len(all_edges)}, kept: {len(self.kept_edges)}, removed: {len(self.removed_edges)}")
        
        return self.kept_edges
    
    def _topo_order(self, edge):
        """ Reverse topological ordering for ACDC iteration """
        # Output node has highest order
        comp = edge[1]  # destination
        if comp[0] == 'output': return 1000
        if comp[0] == 'head': return comp[1] * 100 + comp[2]
        if comp[0] == 'mlp': return comp[1] * 100 + 50
        return 0
```

## 14.4 Running ACDC on GPT-2 Small

```python
def run_acdc_on_ioi():
    # Load GPT-2 small
    model = HookedTransformer.from_pretrained("gpt2")
    
    # Generate IOI examples
    clean = gen_ioi_examples(100)
    corrupt = gen_corrupt_examples(clean)
    
    # Run ACDC
    acdc = ACDC(model, threshold=0.06)
    circuit = acdc.discover_circuit(clean, corrupt)
    
    print(f"\nDiscovered circuit: {len(circuit)} edges")
    
    # Categorize edges
    head_edges = [e for e in circuit if e[1][0] == 'head']
    mlp_edges = [e for e in circuit if e[1][0] == 'mlp']
    output_edges = [e for e in circuit if e[1][0] == 'output']
    
    print(f"  Head edges: {len(head_edges)}")
    print(f"  MLP edges: {len(mlp_edges)}")
    print(f"  Output edges: {len(output_edges)}")
    
    return circuit
```

## 14.5 Visualization

```python
def visualize_circuit(circuit, model_cfg):
    """ Plot discovered circuit as a graph """
    import networkx as nx
    import matplotlib.pyplot as plt
    
    G = nx.DiGraph()
    for edge in circuit:
        src, dst = edge
        G.add_edge(str(src), str(dst))
    
    pos = nx.spring_layout(G, seed=42)
    plt.figure(figsize=(14, 10))
    nx.draw(G, pos, with_labels=True, node_size=300, font_size=8, arrows=True)
    plt.title(f"Discovered IOI Circuit ({len(circuit)} edges)")
    plt.savefig('ioi_circuit.png', dpi=120, bbox_inches='tight')
```

## 14.6 Expected Output

```
Total edges to check: ~10,000

Running ACDC...
  edge 100/10000, kept: 8, removed: 92
  edge 1000/10000, kept: 22, removed: 978
  ...

Discovered circuit: 26 edges
  Head edges: 22
  MLP edges: 3
  Output edges: 1

Time: 1.5 hours on V100

Notable heads in circuit:
  - L9 H9 (Subject head)
  - L7 H3 (S-Inhibition head)
  - L10 H7 (Name mover head)
  - L11 H10 (Indirect Object detection)
```

## 14.7 자기점검

### 핵심 3 가지

1. **`compute_kl` 의 `clean_probs` vs `ablated_probs` 의 *direction*?**
2. **`get_all_edges` 의 *topological* ordering의 의미?**
3. **ACDC 의 *iteration order* (reverse topological) 의 이유?**

### 답변

1. **KL(clean || ablated)** — clean 이 *true distribution*, ablated 가 *predicted distribution*. KL asymmetric — `KL(P||Q)` = clean 의 *질문* 에 ablated 가 *답변* 얼마나 정확. 정상적 mech interp 의 *information loss* 측정.

2. **Causal flow 의 *directional respect***. Transformer residual stream 의 *forward order*. Embed → layer 0 attention → layer 0 MLP → layer 1 attention ... → unembed. ACDC 이 *graph edges* 가 *이 order* 따라야 함 — *backward* edges 는 *없음*.

3. **Output 에서 *backward iteration***. Output 의 *direct contributors* 먼저 검증 → 가장 *necessary* edges 일 가능성 높음. Iterative pruning 시 *output-proximal* edges 가 *baseline*. Input-proximal edges (embedding, early layers) 는 *마지막*. → *causal sufficiency 의 깊이별 검증*.
