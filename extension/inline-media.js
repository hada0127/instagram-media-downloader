export function isPostPath(path) {
  return /^\/(?:p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?$/.test(path);
}

function mediaKey(value) {
  try { return new URL(value).pathname.split('/').pop(); } catch { return ''; }
}

// Match every resolution variant, never assume the first carousel item is active.
export function chooseCurrent(items, snapshot, {singleVideo = false} = {}) {
  if (!snapshot) return null;
  if (singleVideo && items.length === 1 && items[0].type === 'video' && snapshot.type === 'video') return items[0];
  const keys = new Set(snapshot.urls.map(mediaKey).filter(Boolean));
  const matches = items.filter(item => item.type === snapshot.type &&
    [item.url, item.preview, ...(item.aliases || [])].some(url => keys.has(mediaKey(url))));
  return matches.length === 1 ? matches[0] : null;
}

export function visibleMedia(root) {
  const candidates = [];
  for (const element of root.querySelectorAll('video, img')) {
    if (element.closest('header') || element.closest('[data-insta-pick-toolbar]')) continue;
    const video = element.tagName === 'VIDEO';
    const rect = element.getBoundingClientRect();
    if (rect.width < 150 || rect.height < 150) continue;
    let left = Math.max(0, rect.left), top = Math.max(0, rect.top);
    let right = Math.min(innerWidth, rect.right), bottom = Math.min(innerHeight, rect.bottom);
    let hidden = false;
    for (let parent = element; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') { hidden = true; break; }
      const bounds = parent.getBoundingClientRect();
      if (/(hidden|clip|scroll|auto)/.test(style.overflowX)) { left = Math.max(left,bounds.left); right = Math.min(right,bounds.right); }
      if (/(hidden|clip|scroll|auto)/.test(style.overflowY)) { top = Math.max(top,bounds.top); bottom = Math.min(bottom,bounds.bottom); }
    }
    const area = Math.max(0,right-left) * Math.max(0,bottom-top);
    if (hidden || area < 10000) continue;
    const urls = [element.currentSrc, element.src, video ? element.poster : '', ...(!video ? (element.srcset || '').split(',').map(x => x.trim().split(/\s+/)[0]) : [])].filter(Boolean);
    candidates.push({type:video ? 'video' : 'image', urls, area, box:{left,top,right,bottom}});
  }
  candidates.sort((a,b) => b.area - a.area || (a.type === 'video' ? -1 : 1));
  // Instagram draws a slightly larger blurred image behind some reel players.
  const backdrop = candidates[0];
  const player = backdrop?.type === 'image' && candidates.find(candidate => {
    if (candidate.type !== 'video' || candidate.area < backdrop.area * 0.9) return false;
    const a=candidate.box,b=backdrop.box;
    const overlap=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    return overlap >= candidate.area * 0.9;
  });
  if (player) return player;
  // Adjacent equally visible slides are ambiguous during a swipe animation.
  if (candidates[1] && candidates[0].type === candidates[1].type && candidates[1].area > candidates[0].area * 0.9) return null;
  return candidates[0] || null;
}
