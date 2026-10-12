import test from 'node:test';
import assert from 'node:assert/strict';
import {specs,checksFor,statusFor,required,inferSlot} from '../dist/core.js';
const spec=id=>specs.find(s=>s.id===id);
const image={name:'image.jpg',width:1920,height:1080,size:4999999,alpha:false};
test('strict decimal file limits accept below but reject equality',()=>{
 assert.equal(statusFor(image,spec('landscape')),'pass');
 assert.equal(statusFor({...image,size:5000000},spec('landscape')),'error');
 assert.equal(statusFor({...image,size:5000001},spec('landscape')),'error');
});
test('aspect ratio alone does not satisfy exact pixel dimensions',()=>{
 assert.equal(statusFor({...image,width:1280,height:720},spec('landscape')),'error');
 assert.equal(statusFor({...image,width:1440,height:1920},spec('portrait')),'pass');
});
test('logo requires PNG, exact dimensions and transparent pixels',()=>{
 const logo={...image,name:'logo.png',width:1440,height:608,size:2999999,alpha:true};
 assert.equal(statusFor(logo,spec('logo')),'pass');
 for(const update of [{alpha:false},{alpha:null},{name:'logo.jpg'},{size:3000000}]) assert.notEqual(statusFor({...logo,...update},spec('logo')),'pass');
});
test('video duration is inclusive of endpoints; unreadable metadata never passes',()=>{
 const video={...image,name:'trailer.MP4',duration:10};
 assert.equal(statusFor(video,spec('trailer')),'pass');
 assert.equal(statusFor({...video,duration:40},spec('trailer')),'pass');
 for(const duration of [9.99,40.01]) assert.equal(statusFor({...video,duration},spec('trailer')),'error');
 assert.equal(statusFor({...video,duration:null,width:null,height:null},spec('trailer')),'unknown');
});
test('upcoming profile changes only the five promotional requirements',()=>{
 assert.equal(specs.filter(s=>required(s,'current')).length,1);
 assert.equal(specs.filter(s=>required(s,'oct22')).length,5);
 assert.equal(required(spec('lobby'),'oct22'),false);
 assert.equal(specs.filter(s=>s.id.startsWith('screen')).length,3);
});
test('slot inference uses orientation, names and shared media roles',()=>{
 assert.equal(inferSlot({...image,name:'landscape_art.jpeg'}),'landscapeArt');
 assert.equal(inferSlot({...image,name:'portrait_art.jpeg',width:1440,height:1920}),'portraitArt');
 assert.equal(inferSlot({...image,name:'screenshot_2.jpeg'}),'screen3');
 assert.equal(inferSlot({...image,name:'lobby.jpg',width:2048,height:1024}),'lobby');
 assert.equal(inferSlot({...image,name:'gameplay.mov',video:true}),'gameplay');
 assert.equal(inferSlot({...image,width:100,height:100}),'');
});
