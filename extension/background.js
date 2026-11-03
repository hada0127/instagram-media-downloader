import { allowedMediaUrl, filename } from './media.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id || message?.type !== 'download') return false;
  const items = message.items;
  if (!Array.isArray(items) || !items.length || items.length > 100 || items.some(item =>
    !item || !allowedMediaUrl(item.url) || !['image','video'].includes(item.type) || !Number.isInteger(item.index) || item.index < 1)) {
    sendResponse({error:'다운로드할 항목이 올바르지 않아.'});
    return false;
  }
  (async () => {
    const results = [];
    for (const item of items) {
      try {
        const downloadId = await chrome.downloads.download({url:item.url, filename:filename(item), conflictAction:'uniquify', saveAs:false});
        results.push({id:item.id, downloadId});
      } catch (error) { results.push({id:item.id, error:error.message}); }
    }
    sendResponse({results});
  })().catch(error => sendResponse({error:error.message}));
  return true;
});
