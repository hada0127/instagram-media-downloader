import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseCurrent} from '../extension/inline-media.js';
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
