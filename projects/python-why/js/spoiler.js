// Spoiler Toggle - 답안 접기/펼치기
// <details>/<summary> 기본 동작 사용 (JS 없이도 작동)
// 이 파일은 추가 기능(애니메이션 등)을 위한 확장용
document.addEventListener('DOMContentLoaded', () => {
  // 답안을 모두 접은 상태로 시작 (기본)
  document.querySelectorAll('details.answer').forEach(d => {
    d.removeAttribute('open');
  });
});
