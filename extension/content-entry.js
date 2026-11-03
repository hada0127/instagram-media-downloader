// Modules stay in the content script's isolated world; no page-world bridge.
import(chrome.runtime.getURL('inline.js')).then(module => module.mountInlineButtons()).catch(error => {
  console.warn('Insta Pick: 버튼을 불러오지 못했습니다. 페이지를 새로고침해 주세요.', error.message);
});
