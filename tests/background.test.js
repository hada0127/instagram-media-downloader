import test from 'node:test';
import assert from 'node:assert/strict';
let listener;
const calls=[];
globalThis.chrome={runtime:{id:'test',onMessage:{addListener:fn=>listener=fn}},downloads:{download:async options=>{calls.push(options);if(options.url.includes('fail'))throw new Error('NETWORK_FAILED');return calls.length;}}};
await import('../extension/background.js');
const item = (id) => ({id,type:'image',url:`https://cdninstagram.com/${id}.jpg`,post:'ABC',index:1});
const send = items => new Promise(resolve => listener({type:'download',items},{id:'test'},resolve));
test('batch retains individual failures and continues remaining downloads',async()=>{
  const {results}=await send([item('one'),item('fail'),item('three')]);
  assert.equal(results.length,3);assert.equal(results[1].error,'NETWORK_FAILED');assert.ok(results[2].downloadId);
});
test('invalid download destination rejects whole batch',async()=>{
  const before=calls.length;
  assert.ok((await send([{...item('x'),url:'https://evil.test/x'}])).error);
  assert.equal(calls.length,before);
});
