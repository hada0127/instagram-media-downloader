import { collectMedia } from './collector.js';
import { normalizeItems } from './media.js';
const $ = id => document.getElementById(id);
let items = [], selected = new Set(), postUrl = '', busy = false;
const downloads = new Map();
const states = new Map();
function notice(text, error = false) { $('notice').textContent = text; $('notice').classList.toggle('error', error); }
function controls() {
  $('scan').disabled = busy;
  $('selected').disabled = busy || !selected.size;
  $('all').disabled = busy || !items.length;
  $('selected').textContent = `선택 저장 (${selected.size})`;
  $('select-all').checked = items.length > 0 && selected.size === items.length;
  $('select-all').indeterminate = selected.size > 0 && selected.size < items.length;
}
function render() {
  $('grid').replaceChildren();
  $('toolbar').hidden = !items.length;
  $('empty').hidden = !!items.length;
  $('count').textContent = `사진 ${items.filter(x => x.type === 'image').length} · 영상 ${items.filter(x => x.type === 'video').length}`;
  for (const item of items) {
    const card = document.createElement('article'); card.className = 'card';
    const preview = document.createElement('div'); preview.className = 'preview';
    if (item.preview) { const img = document.createElement('img'); img.src = item.preview; img.alt = `${item.index}번 ${item.type === 'video' ? '영상' : '사진'} 미리보기`; img.referrerPolicy = 'no-referrer'; img.onerror = () => { img.hidden = true; const fallback = document.createElement('span'); fallback.textContent = '미리보기 없음'; preview.prepend(fallback); }; preview.append(img); }
    else preview.textContent = '▶';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = selected.has(item.id); check.setAttribute('aria-label', `${item.index}번 선택`);
    check.onchange = () => { if (check.checked) selected.add(item.id); else selected.delete(item.id); controls(); };
    const kind = document.createElement('span'); kind.className = 'kind'; kind.textContent = item.type === 'video' ? '▶ 영상' : '사진'; preview.append(check, kind);
    const info = document.createElement('div'); info.className = 'card-info';
    const title = document.createElement('strong'); title.textContent = `${String(item.index).padStart(2,'0')} · ${item.type === 'video' ? '영상' : '사진'}`;
    const button = document.createElement('button'); button.textContent = '이 항목 저장 ↓'; button.disabled = busy; button.onclick = () => save([item]);
    const state = document.createElement('span'); state.className = 'state'; state.textContent = states.get(item.id) || ''; state.dataset.itemId = item.id;
    info.append(title, button, state); card.append(preview, info); $('grid').append(card);
  }
  controls();
}
function setState(id, text) { states.set(id, text); for (const element of document.querySelectorAll('.state')) if (element.dataset.itemId === id) element.textContent = text; }
function updateDownload(download) {
  const id = downloads.get(download.id); if (!id) return;
  setState(id, download.state === 'complete' ? '저장 완료 ✓' : download.state === 'interrupted' ? `저장 실패: ${download.error || '중단됨'}` : '다운로드 중…');
}
chrome.downloads.onChanged.addListener(async delta => {
  if (!downloads.has(delta.id)) return;
  try { const [download] = await chrome.downloads.search({id:delta.id}); if (download) updateDownload(download); } catch { /* Chrome download history remains authoritative. */ }
});
async function save(chosen) {
  if (busy || !chosen.length) return;
  busy = true; render();
  chosen.forEach(item => setState(item.id, '다운로드 요청 중…'));
  try {
    const response = await chrome.runtime.sendMessage({type:'download', items:chosen});
    if (response?.error || !response?.results) throw new Error(response?.error || '다운로드 응답이 없어.');
    for (const result of response.results) {
      if (result.error) { setState(result.id, `요청 실패: ${result.error}`); continue; }
      downloads.set(result.downloadId, result.id);
      setState(result.id, '다운로드 중…');
      const [download] = await chrome.downloads.search({id:result.downloadId});
      if (download) updateDownload(download);
    }
    const failed = response.results.filter(x => x.error).length;
    notice(`${chosen.length - failed}개 다운로드 요청${failed ? ` · ${failed}개 요청 실패` : ''}. 완료 여부는 항목 상태나 Chrome 다운로드 내역에서 확인해 줘.`, failed > 0);
  } catch (error) { chosen.forEach(item => setState(item.id, '요청 상태 확인 필요')); notice(error.message, true); }
  finally { busy = false; render(); }
}
$('scan').onclick = async () => {
  busy = true; controls(); notice('사진과 영상 목록을 읽고 있어…');
  try {
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    const url = new URL(tab?.url || 'about:blank');
    if (!['www.instagram.com','instagram.com'].includes(url.hostname) || url.protocol !== 'https:') throw new Error('인스타그램 게시물 탭에서 확장 프로그램을 열어 줘.');
    const currentPost = url.origin + url.pathname;
    const cacheKey = `tab:${tab.id}`;
    const cached = (await chrome.storage.session.get(cacheKey))[cacheKey];
    if (postUrl !== currentPost) { items = []; selected.clear(); states.clear(); downloads.clear(); postUrl = currentPost; }
    if (cached?.postUrl === currentPost) items = normalizeItems(cached.items || []);
    const [{result}] = await chrome.scripting.executeScript({target:{tabId:tab.id}, func:collectMedia});
    if (!result) throw new Error('게시물을 읽지 못했어. 탭을 새로고침해 줘.');
    items = normalizeItems(result.source === 'screen' ? [...items, ...result.items] : result.items);
    await chrome.storage.session.set({[cacheKey]: {postUrl:currentPost, items}});
    selected = new Set(items.map(item => item.id));
    notice(result.warning || (items.length ? `${items.length}개를 찾았어. 원하는 항목을 골라 저장해 줘.` : '저장할 항목을 찾지 못했어.'), !items.length);
  } catch (error) { notice(error.message, true); }
  finally { busy = false; render(); }
};
$('select-all').onchange = event => { selected = event.target.checked ? new Set(items.map(item => item.id)) : new Set(); render(); };
$('selected').onclick = () => save(items.filter(item => selected.has(item.id)));
$('all').onclick = () => save(items);
$('history').onclick = () => chrome.tabs.create({url:'chrome://downloads/'});
