import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {collectMedia} from '../extension/collector.js';
const photo = (id) => ({pk:id,media_type:1,image_versions2:{candidates:[{url:`https://cdninstagram.com/${id}.jpg`,width:1080,height:1080},{url:`https://cdninstagram.com/${id}-small.jpg`,width:200,height:200}]}});
function run({path='/p/ABC/', embedded=[], response, root=null}={}) {
  return vm.runInNewContext(`(${collectMedia.toString()})()`, {
    location:{pathname:path}, document:{querySelectorAll:()=>embedded.map(x=>({textContent:JSON.stringify(x)})),querySelector:()=>root},
    AbortSignal, fetch: async () => { if (response) return {ok:true,json:async()=>response}; throw new Error('HTTP 403'); },
  });
}
test('mixed carousel selects largest photos and actual video, without extra request', async () => {
  const post = {code:'ABC',carousel_media:[photo('1'),{...photo('2'),media_type:2,video_versions:[{url:'https://fbcdn.net/2.mp4',width:1080,height:1920}]}]};
  const result = await run({embedded:[{data:post}]});
  assert.equal(result.items.length,2); assert.equal(result.items[0].url,'https://cdninstagram.com/1.jpg'); assert.equal(result.items[1].type,'video'); assert.equal(result.warning,'');
});
test('authenticated API fallback provides carousel', async () => {
  const result = await run({response:{items:[{code:'ABC',carousel_media:[photo('1'),photo('2')]}]}});
  assert.equal(result.items.length,2);
});
test('unavailable video is not silently replaced by its poster', async () => {
  const result = await run({embedded:[{code:'ABC',carousel_media:[photo('1'),{...photo('2'),media_type:2}]}]});
  assert.equal(result.items.length,1); assert.match(result.warning,/2개 중 1개/);
});
test('wrong API post is rejected, no unrelated media downloaded', async () => {
  const result = await run({response:{items:[{code:'OTHER',...photo('1')}]}});
  assert.equal(result.items.length,0); assert.match(result.warning,/불일치/);
});
test('login/API errors are visible and non-post pages have guidance', async () => {
  assert.match((await run()).warning,/HTTP 403/);
  assert.match((await run({path:'/someprofile/'})).warning,/게시물이나 릴스/);
});
test('duplicate embedded records do not hide a missing carousel video', async () => {
  const post={code:'ABC',carousel_media:[photo('1'),{...photo('2'),media_type:2}]};
  const result=await run({embedded:[{one:post,two:post}]});
  assert.equal(result.items.length,1); assert.match(result.warning,/2개 중 1개/);
});
