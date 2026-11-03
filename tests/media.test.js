import test from 'node:test';
import assert from 'node:assert/strict';
import {allowedMediaUrl, normalizeItems, filename} from '../extension/media.js';
const image = {type:'image',url:'https://scontent.cdninstagram.com/a.jpg?token=1',post:'ABC'};
test('only HTTPS Instagram media CDN hosts are accepted', () => {
  for (const url of ['javascript:alert(1)','https://cdninstagram.com.evil.test/a','http://scontent.cdninstagram.com/a','https://user:pass@cdninstagram.com/a','file:///a','https://example.com/a']) assert.equal(allowedMediaUrl(url),false,url);
  assert.equal(allowedMediaUrl(image.url),true);
  assert.equal(allowedMediaUrl('https://video.xx.fbcdn.net/a.mp4'),true);
});
test('fallback re-scan merges without duplicates and retains stable selection IDs', () => {
  const first = normalizeItems([image]);
  const second = normalizeItems([...first, {...image,url:image.url.replace('token=1','token=2')}, {...image,url:'https://scontent.cdninstagram.com/b.jpg'}]);
  assert.equal(second.length,2);
  assert.equal(second[0].id,first[0].id);
});
test('filenames cannot escape download directory; video is mp4', () => {
  assert.equal(filename({...image,post:'../../abc',index:1}), 'abc_01.jpg');
  assert.equal(filename({...image,type:'video',index:2}), 'ABC_02.mp4');
});
test('invalid URLs and poster previews are removed', () => {
  assert.equal(normalizeItems([{...image,url:'blob:secret'}]).length,0);
  assert.equal(normalizeItems([{...image,type:'video',preview:'https://evil.test/a'}])[0].preview,'');
});
test('caption prefix uses ten readable characters and two-digit post order', () => {
  const item={...image,caption:'가나다라마바사아자차카타파하',index:2};
  assert.equal(filename(item),'가나다라마바사아자차_02.jpg');
  assert.equal(filename({...item,type:'video',index:1}),'가나다라마바사아자차_01.mp4');
});
test('filename strips forbidden characters, control codes and trailing dots', () => {
  assert.equal(filename({...image,caption:'  여행:/사진*?<>"|\\\u0000\n좋다... ',index:1}),'여행사진 좋다_01.jpg');
  assert.equal(filename({...image,caption:'CON.txt',index:1}),'CONtxt_01.jpg');
});
test('caption removes emoji and symbols before taking ten characters', () => {
  assert.equal(filename({...image,caption:'👩‍👩‍👧‍👦가나다라마바사아자차',index:1}),'가나다라마바사아자차_01.jpg');
  assert.equal(filename({...image,caption:'<>:/...',index:1}),'ABC_01.jpg');
  assert.equal(filename({...image,caption:'色集め🐟水族館! #수족관✨',index:1}),'色集め水族館 수족관_01.jpg');
  assert.equal(filename({...image,caption:'1️⃣🇰🇷👍🏽©™★_-=+😀',post:'A-B_C',index:1}),'ABC_01.jpg');
  assert.equal(normalizeItems([{...image,caption:'본문',index:3}])[0].caption,'본문');
});
