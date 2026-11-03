import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseCurrent,isPostPath} from '../extension/inline-media.js';
const items=[
 {id:'first',type:'image',url:'https://cdninstagram.com/large/1.jpg',aliases:['https://cdninstagram.com/small/1.jpg']},
 {id:'second',type:'image',url:'https://cdninstagram.com/large/2.jpg',aliases:['https://cdninstagram.com/small/2.jpg']},
 {id:'third',type:'video',url:'https://fbcdn.net/3.mp4',preview:'https://cdninstagram.com/3.jpg'}
];
test('current carousel image is matched to second item across resolution variants',()=>{
 assert.equal(chooseCurrent(items,{type:'image',urls:['https://cdninstagram.com/small/2.jpg?token=new']}).id,'second');
});
test('blob video identifies actual mp4 through its poster',()=>{
 assert.equal(chooseCurrent(items,{type:'video',urls:['blob:abc','https://cdninstagram.com/3.jpg']}).id,'third');
});
test('unknown or ambiguous current slide never silently falls back to first',()=>{
 assert.equal(chooseCurrent(items,{type:'image',urls:['https://cdninstagram.com/missing.jpg']}),null);
 assert.equal(chooseCurrent([...items,items[1]],{type:'image',urls:['https://cdninstagram.com/2.jpg']}),null);
 assert.equal(chooseCurrent(items,null),null);
});
test('verified single-video post can save a blob player without a poster',()=>{
 assert.equal(chooseCurrent([items[2]],{type:'video',urls:['blob:only']},{singleVideo:true})?.id,'third');
 assert.equal(chooseCurrent(items,{type:'video',urls:['blob:only']},{singleVideo:true}),null);
});

test('audio navigation must not be interpreted as a reel post',()=>{
 assert.equal(isPostPath('/reels/audio/12345/'),false);
 assert.equal(isPostPath('/reels/De6x_lnvbLy/'),true);
 assert.equal(isPostPath('/p/ABC/'),true);
});
test('decorative image behind a video must not replace the visible video', async()=>{
 const {visibleMedia}=await import('../extension/inline-media.js');
 const element=(tag,w,h)=>({tagName:tag,parentElement:null,currentSrc:tag==='VIDEO'?'blob:test':'https://cdninstagram.com/blur.jpg',srcset:'',closest:()=>null,getBoundingClientRect:()=>({left:100,top:100,right:100+w,bottom:100+h,width:w,height:h})});
 globalThis.innerWidth=1500;globalThis.innerHeight=900;
 globalThis.getComputedStyle=()=>({display:'block',visibility:'visible',opacity:'1',overflowX:'visible',overflowY:'visible'});
 try { assert.equal(visibleMedia({querySelectorAll:()=>[element('IMG',856,475),element('VIDEO',838,472)]}).type,'video'); }
 finally {delete globalThis.innerWidth;delete globalThis.innerHeight;delete globalThis.getComputedStyle;}
});
