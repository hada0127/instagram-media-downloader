import {collectMedia} from './collector.js';
import {normalizeItems} from './media.js';
import {chooseCurrent, visibleMedia} from './inline-media.js';

export function mountInlineButtons() {
  if (document.documentElement.dataset.instaPickMounted) return;
  document.documentElement.dataset.instaPickMounted = 'true';
  let serial = 0, scheduled = false;
  const mounted = new Map();
  const postPattern = /^\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)\/?/;
  function postPath(root) {
    const links = [...root.querySelectorAll('a[href]')].filter(a => {
      try { return new URL(a.href).origin === location.origin && postPattern.test(new URL(a.href).pathname); } catch { return false; }
    });
    const link = links.find(a => a.querySelector('time')) || links[0];
    if (link) return new URL(link.href).pathname;
    return postPattern.test(location.pathname) && (root.tagName !== 'ARTICLE' || document.querySelectorAll('article').length === 1) ? location.pathname : '';
  }
  function attach(root) {
    const path = postPath(root);
    if (!path || !root.querySelector('video, img')) return;
    const previous = mounted.get(root);
    if (previous?.host.isConnected) return;
    const scopeId = String(++serial);
    root.dataset.instaPickScope = scopeId;
    const host = document.createElement('div');
    host.dataset.instaPickToolbar = '';
    // Overlay does not add a flex/grid child that shifts Instagram’s media layout.
    const oldPosition = root.style.position;
    const positioned = getComputedStyle(root).position === 'static';
    if (positioned) root.style.position = 'relative';
    host.style.cssText = 'display:block!important;position:absolute!important;top:56px!important;right:8px!important;z-index:10!important;max-width:calc(100% - 16px)!important;';
    const shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = `<style>
      :host{color-scheme:light;font:12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 10px;background:#ffffffed;border:1px solid #e9e9ee;border-radius:12px;box-shadow:0 2px 12px #0002;color:#333}
      .brand{font-size:11px;font-weight:750;color:#df3e59;margin-right:auto}
      button{appearance:none;border:1px solid #e4e4eb;border-radius:8px;background:#fff;color:#333;padding:7px 10px;font:600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
      button.all{background:#e74760;color:#fff;border-color:#e74760}button:hover{filter:brightness(.94)}button:disabled{opacity:.5;cursor:wait}button:focus-visible{outline:2px solid #6677ef;outline-offset:2px}
      .status{display:none;width:100%;font-size:11px;line-height:1.5;overflow-wrap:anywhere}.status:not(:empty){display:block}
    </style><div class="bar"><span class="brand">↘ Insta Pick</span><button class="one" type="button">현재 항목 저장</button><button class="all" type="button">게시물 전체 저장</button><span class="status" role="status" aria-live="polite"></span></div>`;
    root.prepend(host);
    mounted.set(root,{host,positioned,oldPosition});
    const buttons = [...shadow.querySelectorAll('button')];
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
        let chosen = all ? items : [chooseCurrent(items,current)].filter(Boolean);
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
      if (!root.isConnected || !postPath(root)) {entry.host.remove();if (entry.positioned) root.style.position=entry.oldPosition;mounted.delete(root);}
    }
    const articles = [...document.querySelectorAll('article')];
    articles.forEach(attach);
    // Reel/detail layouts can omit article entirely; avoid attaching to an unrelated feed.
    if (!articles.length && postPattern.test(location.pathname)) {
      const root = document.querySelector('[role="dialog"]') || document.querySelector('main');
      if (root) attach(root);
    }
  }
  const observer = new MutationObserver(() => {
    if (!scheduled) {scheduled = true; setTimeout(scan,200);}
  });
  observer.observe(document.body,{childList:true,subtree:true});
  addEventListener('popstate',scan);
  scan();
}
