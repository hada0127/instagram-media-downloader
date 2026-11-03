// Self-contained: chrome.scripting serializes this function without its module scope.
export async function collectMedia(options = {}) {
  const pathname = options.postPath || location.pathname;
  const match = pathname.match(/^\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)\/?/);
  if (!match) return { items: [], warning: '저장할 게시물이나 릴스를 먼저 열어 줘. 주소에 /p/ 또는 /reel/이 있어야 해.' };
  const code = match[1];
  const items = [];
  let expected = 0;
  const best = candidates => [...(candidates || [])].filter(x => x?.url)
    .sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0))[0]?.url;
  function extract(post) {
    const children = post.carousel_media || post.edge_sidecar_to_children?.edges?.map(edge => edge.node) || [post];
    expected = Math.max(expected, post.carousel_media_count || children.length);
    for (const [index, child] of children.entries()) {
      const preview = best(child.image_versions2?.candidates) || child.display_url || best(child.display_resources?.map(x => ({url:x.src, width:x.config_width, height:x.config_height})));
      const video = best(child.video_versions) || child.video_url;
      const isVideo = child.media_type === 2 || child.is_video === true;
      // Never offer a video's poster as if it were the video itself.
      if (isVideo && !video) continue;
      const url = video || preview;
      if (url) {
        const item = {id:String(child.pk || child.id || `${code}_${index + 1}`), type:video ? 'video' : 'image', url, preview, post:code, index:index + 1, aliases:[...(child.image_versions2?.candidates || []).map(x => x.url), ...(child.display_resources || []).map(x => x.src), ...(child.video_versions || []).map(x => x.url)]};
        const existing = items.findIndex(value => value.id === item.id);
        if (existing === -1) items.push(item); else items[existing] = item;
      }
    }
  }
  // Embedded data is preferred: it needs no extra Instagram requests.
  for (const script of document.querySelectorAll('script[type="application/json"]')) {
    if (!script.textContent.includes(code)) continue;
    let data;
    try { data = JSON.parse(script.textContent); } catch { continue; }
    const stack = [data];
    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object') continue;
      if ((node.code === code || node.shortcode === code) && (node.image_versions2 || node.display_url || node.carousel_media || node.edge_sidecar_to_children || node.video_versions)) {
        extract(node);
      } else {
        for (const value of Object.values(node)) if (value && typeof value === 'object') stack.push(value);
      }
    }
  }
  let apiError = '';
  if (!items.length || items.length < expected) {
    try {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      let id = 0n;
      for (const char of code) id = id * 64n + BigInt(alphabet.indexOf(char));
      // Instagram's undocumented web endpoint may change. See docs/architecture.md.
      const response = await fetch(`/api/v1/media/${id}/info/`, {
        credentials: 'same-origin', headers: {'X-IG-App-ID': '936619743392459'},
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.items?.length) throw new Error('미디어 정보 없음');
      const post = data.items.find(x => x.code === code || String(x.pk) === String(id) || String(x.id).split('_')[0] === String(id));
      if (!post) throw new Error('게시물 정보 불일치');
      items.length = 0;
      extract(post);
    } catch (error) { apiError = error.name === 'TimeoutError' ? '응답 시간 초과' : error.message; }
  }
  if (items.length) return {items, warning: items.length < expected ? `전체 ${expected}개 중 ${items.length}개만 읽었어. 일부 영상 주소를 찾지 못했어.` : '', source:'post', complete:items.length === expected};

  // Fallback is deliberately partial and labeled; no claim of a complete carousel.
  const root = options.scopeId && /^\d+$/.test(options.scopeId)
    ? document.querySelector(`[data-insta-pick-scope="${options.scopeId}"]`)
    : document.querySelector('[role="dialog"] article') || document.querySelector('article');
  if (root) {
    for (const video of root.querySelectorAll('video')) {
      const url = video.currentSrc || video.src || video.querySelector('source')?.src;
      if (url?.startsWith('https:')) items.push({type:'video', url, preview:video.poster, post:code});
    }
    for (const img of root.querySelectorAll('img')) {
      if (img.closest('header') || img.closest('a') || img.closest('button')) continue;
      if (img.naturalWidth < 250 || img.naturalHeight < 200) continue;
      if (root.querySelector('video')) continue;
      const candidates = (img.srcset || '').split(',').map(part => part.trim().split(/\s+/)).filter(pair => pair[0]);
      candidates.sort((a,b) => parseFloat(b[1] || 0) - parseFloat(a[1] || 0));
      const url = candidates[0]?.[0] || img.currentSrc || img.src;
      if (url) items.push({type:'image', url, preview:url, post:code});
    }
  }
  return {items, source:'screen', complete:false, warning: `게시물 전체를 읽지 못했어${apiError ? ` (${apiError})` : ''}. ${items.length ? '현재 로드된 항목만 표시해. 다음 장으로 넘긴 뒤 다시 읽으면 목록에 추가돼.' : '로그인 상태를 확인하고 게시물을 새로고침해 줘. blob 방식 영상은 직접 주소를 찾지 못하면 저장할 수 없어.'}`};
}
