// Minimal Python syntax highlighter (no CDN dependency)
(function () {
  const KEYWORDS = new Set([
    'False','None','True','and','as','assert','async','await',
    'break','class','continue','def','del','elif','else','except',
    'finally','for','from','global','if','import','in','is',
    'lambda','nonlocal','not','or','pass','raise','return',
    'try','while','with','yield'
  ]);
  const BUILTINS = new Set([
    'abs','all','any','bin','bool','bytes','callable','chr','dict',
    'dir','divmod','enumerate','eval','exec','filter','float',
    'format','frozenset','getattr','globals','hasattr','hash',
    'help','hex','id','input','int','isinstance','issubclass',
    'iter','len','list','locals','map','max','min','next','object',
    'oct','open','ord','pow','print','property','range','repr',
    'reversed','round','set','setattr','slice','sorted','staticmethod',
    'str','sum','super','tuple','type','vars','zip'
  ]);

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function tokenize(code) {
    // Tokenizer: returns array of {type, value} objects
    const tokens = [];
    let i = 0;
    while (i < code.length) {
      // Triple-quoted strings
      if ((code[i] === '"' || code[i] === "'") &&
          code.slice(i, i+3) === code[i].repeat(3)) {
        const q = code[i].repeat(3);
        const end = code.indexOf(q, i + 3);
        const raw = end === -1 ? code.slice(i) : code.slice(i, end + 3);
        tokens.push({type:'string', value: raw});
        i += raw.length;
        continue;
      }
      // Single/double quoted strings (with f/b/r prefix)
      if (/^[fFbBrRuU]?["']/.test(code.slice(i))) {
        const prefix = /^[fFbBrRuU]/.test(code[i]) ? 1 : 0;
        const q = code[i + prefix];
        let j = i + prefix + 1;
        while (j < code.length) {
          if (code[j] === '\\') { j += 2; continue; }
          if (code[j] === q) { j++; break; }
          j++;
        }
        tokens.push({type:'string', value: code.slice(i, j)});
        i = j;
        continue;
      }
      // Comments
      if (code[i] === '#') {
        const end = code.indexOf('\n', i);
        const raw = end === -1 ? code.slice(i) : code.slice(i, end);
        tokens.push({type:'comment', value: raw});
        i += raw.length;
        continue;
      }
      // Decorators
      if (code[i] === '@') {
        const m = code.slice(i).match(/^@[\w.]+/);
        if (m) { tokens.push({type:'decorator', value: m[0]}); i += m[0].length; continue; }
      }
      // Numbers (int, float, complex, 0x hex, 0b bin, 0o oct)
      if (/[0-9]/.test(code[i]) || (code[i] === '.' && /[0-9]/.test(code[i+1]||''))) {
        const m = code.slice(i).match(/^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|[0-9][0-9_]*\.?[0-9_]*(?:[eE][+-]?[0-9_]+)?j?|[0-9]*\.[0-9_]+(?:[eE][+-]?[0-9_]+)?j?)/);
        if (m) { tokens.push({type:'number', value: m[0]}); i += m[0].length; continue; }
      }
      // Identifiers / keywords / builtins
      if (/[a-zA-Z_]/.test(code[i])) {
        const m = code.slice(i).match(/^[a-zA-Z_]\w*/);
        const word = m[0];
        let type = 'ident';
        if (KEYWORDS.has(word)) type = 'keyword';
        else if (BUILTINS.has(word)) type = 'builtin';
        tokens.push({type, value: word});
        i += word.length;
        continue;
      }
      // Everything else: punctuation, operators, whitespace
      tokens.push({type:'plain', value: code[i]});
      i++;
    }
    return tokens;
  }

  function highlight(code) {
    const tokens = tokenize(code);
    return tokens.map(t => {
      const v = escHtml(t.value);
      switch(t.type) {
        case 'keyword':   return `<span class="hl-kw">${v}</span>`;
        case 'builtin':   return `<span class="hl-bi">${v}</span>`;
        case 'string':    return `<span class="hl-str">${v}</span>`;
        case 'comment':   return `<span class="hl-cmt">${v}</span>`;
        case 'number':    return `<span class="hl-num">${v}</span>`;
        case 'decorator': return `<span class="hl-dec">${v}</span>`;
        default:          return v;
      }
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('code.language-python').forEach(el => {
      // Avoid double-highlighting
      if (el.dataset.highlighted) return;
      el.dataset.highlighted = '1';
      el.innerHTML = highlight(el.textContent);
    });
  });
})();
