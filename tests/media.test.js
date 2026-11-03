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
  assert.equal(filename({...image,post:'../../abc',index:1}), 'Instagram/abc/abc_01.jpg');
  assert.equal(filename({...image,type:'video',index:2}), 'Instagram/ABC/ABC_02.mp4');
});
test('invalid URLs and poster previews are removed', () => {
  assert.equal(normalizeItems([{...image,url:'blob:secret'}]).length,0);
  assert.equal(normalizeItems([{...image,type:'video',preview:'https://evil.test/a'}])[0].preview,'');
});
