import {collectMedia} from './collector.js';
import {normalizeItems} from './media.js';
import {chooseCurrent, visibleMedia, isPostPath} from './inline-media.js';

export function mountInlineButtons() {
  if (document.documentElement.dataset.instaPickMounted) return;
  document.documentElement.dataset.instaPickMounted = 'true';
  let serial = 0, scheduled = false;
  const mounted = new Map();
  function action(root, reel) {
    const names = reel ? ['좋아요','좋아요 취소','Like','Unlike'] : ['저장','저장 취소','Save','Remove'];
    const icon = [...root.querySelectorAll('[aria-label]')].find(element => names.includes(element.getAttribute('aria-label')));
    return icon?.closest('button,[role="button"]') || null;
  }
  function postPath(root) {
    // Reel caption links can point at the active URL even in preloaded offscreen cards.
    // Only the card at the viewport center may use that URL.
    if (/^\/reels?\//.test(location.pathname) && isPostPath(location.pathname) && root.tagName !== 'ARTICLE') {
      const bounds=root.getBoundingClientRect();
      return root.querySelectorAll('video').length === 1 && bounds.top < innerHeight/2 && bounds.bottom > innerHeight/2 ? location.pathname : '';
    }
    const links = [...root.querySelectorAll('a[href]')].filter(a => {
      try { return new URL(a.href).origin === location.origin && isPostPath(new URL(a.href).pathname); } catch { return false; }
    });
    const link = links.find(a => a.querySelector('time')) || links[0];
    if (link) return new URL(link.href).pathname;
    return isPostPath(location.pathname) && root.querySelectorAll('video').length <= 1 && visibleMedia(root) && (root.tagName !== 'ARTICLE' || document.querySelectorAll('article').length === 1) ? location.pathname : '';
  }
  function attach(root) {
    const path = postPath(root);
    if (!path || !root.querySelector('video, img')) return;
    const previous = mounted.get(root);
    if (previous?.host.isConnected) { previous.place(); return; }
    const reel = /^\/reels?\//.test(path);
    const scopeId = String(++serial);
    root.dataset.instaPickScope = scopeId;
    const host = document.createElement('div');
    host.dataset.instaPickToolbar = '';
    host.dataset.reel = String(reel);
    // Overlay does not add a flex/grid child that shifts Instagram’s media layout.
    const oldPosition = root.style.position;
    const positioned = getComputedStyle(root).position === 'static';
    if (positioned) root.style.position = 'relative';
    host.style.cssText = 'display:block!important;position:absolute!important;top:56px!important;right:8px!important;z-index:10!important;max-width:calc(100% - 16px)!important;';
    const shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = `<style>
      :host{color-scheme:light;font:12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      :host([data-reel="true"]) .all{display:none}
      .bar{display:flex;align-items:center;gap:0;flex-wrap:nowrap;padding:0;color:inherit}
      button{appearance:none;border:0;border-radius:0;background:transparent;color:inherit;padding:0;width:40px;height:40px;display:grid;place-items:center;font:600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
      button:hover{opacity:.6}button:disabled{opacity:.5;cursor:wait}button:focus-visible{outline:2px solid #6677ef;outline-offset:2px}
      img{display:block;pointer-events:none;filter:brightness(0)}
      /* Measured alpha bounds; reproduce with scripts/measure-icons.py. */
      .one img{width:32.267px;height:32.267px;transform:translate(0.013px,-0.579px)}
      .all img{width:31.931px;height:31.931px;transform:translate(0.000px,-0.573px)}
      :host([data-light-icons]) img{filter:brightness(0) invert(1)}
      .status{position:absolute;right:0;top:44px;display:none;width:220px;padding:8px 10px;background:#fff;border:1px solid #e9e9ee;border-radius:8px;box-shadow:0 2px 8px #0002;font-size:11px;line-height:1.5;overflow-wrap:anywhere}.status:not(:empty){display:block}
    </style><div class="bar"><button class="one" type="button" title="현재 사진·영상 저장" aria-label="현재 항목 저장"><img alt="" aria-hidden="true"></button><button class="all" type="button" title="게시물 전체 저장" aria-label="게시물 전체 저장"><img alt="" aria-hidden="true"></button><span class="status" role="status" aria-live="polite"></span></div>`;
    shadow.querySelector('.one img').src=chrome.runtime.getURL('assets/download-one.png');
    shadow.querySelector('.all img').src=chrome.runtime.getURL('assets/download-all.png');
    root.prepend(host);
    function place() {
      const target = action(root,reel);
      if (!target) { host.style.setProperty('display','none','important'); return; }
      host.style.setProperty('display','block','important');
      const base = root.getBoundingClientRect(), anchor = target.getBoundingClientRect();
      const width = reel ? 40 : 80;
      // Reel: same column, above Like. Feed: immediately left of Bookmark.
      const columnLeft=anchor.left-base.left+(anchor.width-40)/2;
      const left = reel ? columnLeft : columnLeft-width;
      const top = reel ? anchor.top-base.top-56 : anchor.top-base.top+(anchor.height-40)/2;
      host.style.setProperty('left',`${Math.max(0,left)}px`,'important');
      host.style.setProperty('right','auto','important');
      host.style.setProperty('top',`${top+root.scrollTop}px`,'important');
      const color=getComputedStyle(target).color;
      host.style.color=color;
      const rgb=color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [0,0,0];
      host.toggleAttribute('data-light-icons',rgb.reduce((sum,value)=>sum+value,0)>384);

    }
    const resize = new ResizeObserver(place);
    resize.observe(root);
    mounted.set(root,{host,positioned,oldPosition,place,resize});
    place();
    const buttons = [...shadow.querySelectorAll('button')];
    if (reel) { buttons[0].title='영상 저장'; buttons[0].setAttribute('aria-label','영상 저장'); }
    const status = shadow.querySelector('.status');
    async function save(all) {
      if (buttons[0].disabled) return;
      const currentPath = postPath(root);
      // Snapshot before awaiting network: moving the carousel must not change the clicked target.
      const current = all ? null : visibleMedia(root);
      if (!currentPath) { status.textContent = '게시물을 찾지 못했어. 게시물을 다시 열어 줘.'; return; }
      if (!all && !current) { status.textContent = '저장할 사진·영상을 화면 중앙에 보이게 한 뒤 다시 눌러 줘.'; return; }
      buttons.forEach(button => {button.disabled=true;});
      status.textContent = '게시물을 읽고 있어…';
      try {
        const result = await collectMedia({postPath:currentPath, scopeId});
        if (postPath(root) !== currentPath) throw new Error('게시물이 바뀌었어. 다시 눌러 줘.');
        const items = normalizeItems(result.items);
        if (all && (!result.complete || items.length !== result.items.length)) throw new Error('게시물 전체를 확인하지 못했어. 현재 항목 저장을 이용하거나 새로고침 후 다시 눌러 줘.');
        let chosen = all ? items : [chooseCurrent(items,current,{singleVideo:result.complete})].filter(Boolean);
        if (!chosen.length) throw new Error(result.warning || '현재 항목의 원본 주소를 찾지 못했어. 재생하거나 새로고침한 뒤 다시 눌러 줘.');
        const response = await chrome.runtime.sendMessage({type:'download',items:chosen});
        if (response?.error || !response?.results) throw new Error(response?.error || '다운로드 응답이 없어.');
        const failures = response.results.filter(item => item.error);
        status.textContent = `${chosen.length-failures.length}개 다운로드 시작${failures.length ? ` · ${failures.length}개 실패` : ''} · 완료 여부는 Chrome 다운로드 내역에서 확인해 줘.`;
      } catch (error) {
        status.textContent = /Extension context invalidated/.test(error.message) ? '확장이 업데이트됐어. 인스타그램 페이지를 새로고침해 줘.' : error.message;
      } finally { buttons.forEach(button=>{button.disabled=false;}); }
    }
    buttons[0].addEventListener('click', event => {event.preventDefault();event.stopPropagation();save(false);});
    buttons[1].addEventListener('click', event => {event.preventDefault();event.stopPropagation();save(true);});
  }
  function scan() {
    scheduled = false;
    for (const [root, entry] of mounted) {
      if (!root.isConnected || !postPath(root)) {entry.resize.disconnect();entry.host.remove();if (entry.positioned) root.style.position=entry.oldPosition;mounted.delete(root);}
    }
    const articles = [...document.querySelectorAll('article')];
    articles.forEach(attach);
    // Reel cards have no article. Find the smallest per-video ancestor with its like action.
    if (/^\/reels?(?:\/|$)/.test(location.pathname)) {
      for (const video of document.querySelectorAll('main video')) {
        for (let root=video.parentElement; root && root.tagName !== 'MAIN'; root=root.parentElement) {
          if (root.querySelectorAll('video').length > 1) break;
          if (action(root,true)) {attach(root);break;}
        }
      }
    }

  }
  const observer = new MutationObserver(() => {
    if (!scheduled) {scheduled = true; setTimeout(scan,200);}
  });
  observer.observe(document.body,{childList:true,subtree:true});
  addEventListener('popstate',scan);
  addEventListener('scroll',() => { if (!scheduled) {scheduled=true;setTimeout(scan,100);} },{capture:true,passive:true});
  scan();
}
