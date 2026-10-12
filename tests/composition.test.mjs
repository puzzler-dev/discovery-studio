import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultState,placements,restoreState,logoPlacement} from '../dist/core.js';

test('saved sessions using removed templates resume in a supported placement without losing media settings',()=>{
 const saved={placement:'sponsored',title:'My island',crop:{'A:discover:landscape':{x:28,y:65,zoom:105}},lobbyCount:3};
 const restored=restoreState(saved);
 assert.equal(restored.placement,'discover');
 assert.equal(restored.title,saved.title);
 assert.deepEqual(restored.crop,saved.crop);
 assert.equal(restored.lobbyCount,3);
 assert.equal(restoreState({placement:'recents'}).placement,'lobby');
 assert.equal(restoreState({placement:'recents',page:'compare'}).placement,'discover');
 assert.ok(!placements.some(p=>['sponsored','recents'].includes(p.id)));
});

test('placement logo controls stay independent after saving and reloading, including legacy customization',()=>{
 const state=restoreState({placement:'hero',logo:{x:82,y:31,width:26}});
 assert.deepEqual(logoPlacement(state,'hero'),{x:82,y:31,width:26});
 const originalMobile=logoPlacement(state,'mobile');
 state.logoPlacements.discover={x:15,y:71,width:36};
 const reloaded=restoreState(JSON.parse(JSON.stringify(state)));
 assert.deepEqual(logoPlacement(reloaded,'discover'),{x:15,y:71,width:36});
 assert.deepEqual(logoPlacement(reloaded,'hero'),{x:82,y:31,width:26});
 assert.deepEqual(logoPlacement(reloaded,'mobile'),originalMobile);
 assert.deepEqual(defaultState.logoPlacements,{});
});

test('generic promotional copy replaces old starter copy while preserving custom island text',()=>{
 const migrated=restoreState({headline:'YOUR NEXT MOVE STARTS HERE',postTitle:'A NEW CHALLENGE AWAITS',eventTitle:'ARCADE CHESS COMMUNITY NIGHT',description:'My own description'});
 assert.equal(migrated.headline,'DISCOVER SOMETHING NEW');
 assert.equal(migrated.postTitle,'ISLAND UPDATE');
 assert.equal(migrated.eventTitle,'COMMUNITY EVENT');
 assert.equal(migrated.description,'My own description');
 assert.notEqual(migrated.newsTagline,migrated.description);
 assert.notEqual(migrated.postBody,migrated.description);
 const custom=restoreState({headline:'Our custom headline',postTitle:'Our update',eventTitle:'Our event'});
 assert.equal(custom.headline,'Our custom headline');
 assert.equal(custom.postTitle,'Our update');
 assert.equal(custom.eventTitle,'Our event');
});
