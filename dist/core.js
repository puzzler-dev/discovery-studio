export const specs = [
  {id:'landscape',name:'Landscape · with text',short:'Landscape',w:1920,h:1080,max:5,ext:['png','jpg','jpeg'],group:'variant',required:true},
  {id:'landscapeArt',name:'Landscape · art only',short:'Landscape art',w:1920,h:1080,max:5,ext:['png','jpg','jpeg'],group:'variant',future:true,manual:'No text, logos, or calls to action'},
  {id:'portrait',name:'Portrait · with text',short:'Portrait',w:1440,h:1920,max:5,ext:['png','jpg','jpeg'],group:'variant',future:true},
  {id:'portraitArt',name:'Portrait · art only',short:'Portrait art',w:1440,h:1920,max:5,ext:['png','jpg','jpeg'],group:'variant',future:true,manual:'No text, logos, or calls to action'},
  {id:'logo',name:'Island logo',short:'Logo',w:1440,h:608,max:3,ext:['png'],group:'variant',future:true,alpha:true},
  {id:'trailer',name:'Trailer',short:'Trailer',w:1920,h:1080,max:400,ext:['mp4','mkv','webm','mov'],group:'shared',video:true,manual:'General Audience suitability for promotional placement'},
  {id:'gameplay',name:'Gameplay video',short:'Gameplay',w:1920,h:1080,max:400,ext:['mp4','mkv','webm','mov'],group:'shared',video:true,manual:'Real, unedited gameplay including in-game UI'},
  ...[1,2,3].map(n=>({id:'screen'+n,name:'In-game screenshot '+n,short:'Screenshot '+n,w:1920,h:1080,max:5,ext:['png','jpg','jpeg'],group:'shared',manual:'Real gameplay from your island'})),
  {id:'lobby',name:'Lobby background',short:'Lobby',w:2048,h:1024,max:10,ext:['png','jpg','jpeg'],group:'shared',manual:'Review navigation and avatar overlap'}
];
export const placements = [
  {id:'discover',name:'Discover',icon:'grid',label:'Discover rows',source:'landscape',note:'Landscape tiles at small and featured sizes, with example player-count badges.',calibrated:true},
  {id:'hero',name:'Featured',icon:'spark',label:'Featured banner',source:'landscapeArt',note:'Wide crop simulation. Art-only landscape + logo; a supplied trailer can be played.',calibrated:true},
  {id:'mobile',name:'Mobile',icon:'phone',label:'Portrait discovery',source:'portrait',note:'Illustrative mobile layout using the 3:4 portrait asset. Mobile layout is not calibrated to an in-game screenshot.'},
  {id:'detail',name:'Island details',icon:'layout',label:'Island detail page',source:'landscape',note:'Layout measured from a 1920 × 1080 in-game Island Details screenshot. Example metadata and a reference ESRB panel accompany your media.',calibrated:true},
  {id:'lobby',name:'Lobby',icon:'users',label:'Pre-game lobby',source:'lobby',note:'16:9 pad and UI positions measured from in-game lobby screenshots. Fixed character poses, simulated floor lighting and example friend activity.',calibrated:true},
  {id:'news',name:'News',icon:'news',label:'News spotlight',source:'landscape',note:'Large promotional panel with headline, description and a simulated call-to-action.',calibrated:true},
  {id:'post',name:'Creator post',icon:'message',label:'Creator update',source:'landscape',note:'Landscape media beside creator copy, based on your in-game update screenshot.',calibrated:true},
  {id:'event',name:'Events',icon:'calendar',label:'Community events',source:'landscape',note:'Landscape media cropped into a taller event-card image area; this is not a separate upload format.',calibrated:true}
];
export const defaultState = {page:'preview',placement:'discover',variant:'A',mode:'text',ratio:'16/9',guides:false,ui:true,profile:'current',title:'ARCADE CHESS',creator:'Puzzler Creations',description:'Your next move changes everything. Jump in, challenge a friend, and rule the board.',headline:'DISCOVER SOMETHING NEW',newsTagline:'Explore a new experience and see what is waiting for you.',count:'1.2K',eventTitle:'COMMUNITY EVENT',eventTagline:'Join the community and be part of the experience.',postTitle:'ISLAND UPDATE',postBody:'See what is new, explore the island, and join the community.',islandCode:'0000-0000-0000',updated:'Oct 11, 2026',released:'Oct 11, 2026',maxPlayers:'16',favorites:'1.2K',detailMedia:'thumbnail',crop:{},logo:{x:50,y:22,width:42},logoPlacements:{},review:{},selectedSlot:'landscape',video:'trailer',useVideo:false,showBannerLogo:true,lobbyCount:4};
export const defaultLogoPlacements={discover:{x:50,y:22,width:42},hero:{x:76,y:46,width:28},mobile:{x:50,y:20,width:70}};
export function logoPlacement(state,placement=state.placement){return {...(defaultLogoPlacements[placement]||defaultState.logo),...state.logoPlacements?.[placement]};}
export function restoreState(saved){
 const s=saved&&typeof saved==='object'?saved:{};
 const next={...structuredClone(defaultState),...s,crop:s.crop||{},review:s.review||{},logoPlacements:structuredClone(s.logoPlacements||{})};
 // Preserve a customized legacy logo on the last edited placement; new placements are independent.
 if(!s.logoPlacements&&s.logo&&Object.keys(defaultState.logo).some(k=>s.logo[k]!==defaultState.logo[k]))next.logoPlacements[s.placement||'discover']={...defaultState.logo,...s.logo};
 if(s.headline==='YOUR NEXT MOVE STARTS HERE')next.headline=defaultState.headline;
 if(s.postTitle==='A NEW CHALLENGE AWAITS')next.postTitle=defaultState.postTitle;
 if(s.eventTitle==='ARCADE CHESS COMMUNITY NIGHT')next.eventTitle=defaultState.eventTitle;
 if(next.placement==='recents')next.placement='lobby';
 if(!placements.some(p=>p.id===next.placement))next.placement='discover';
 if(!['preview','library','compare','checklist','settings'].includes(next.page))next.page='preview';
 if(next.page==='compare'&&next.placement==='lobby')next.placement='discover';
 next.lobbyCount=Math.max(0,Math.min(4,Math.trunc(Number(next.lobbyCount)||0)));
 return next;
}
export const escapeHtml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const required = (spec,profile) => !!spec.required || (profile==='oct22' && !!spec.future);
export function checksFor(asset,spec) {
  if(!asset) return [];
  const extension=asset.name.split('.').pop().toLowerCase();
  const checks=[
    {name:'File type',ok:spec.ext.includes(extension),detail:extension.toUpperCase()+' · accepts '+spec.ext.join(', ').toUpperCase()},
    {name:'Dimensions',ok:asset.width&&asset.height ? asset.width===spec.w&&asset.height===spec.h : null,detail:asset.width ? `${asset.width} × ${asset.height} px · expected ${spec.w} × ${spec.h}` : 'Metadata unavailable in this browser'},
    {name:'File size',ok:asset.size<spec.max*1000000,detail:`${(asset.size/1000000).toFixed(2)} MB · must be < ${spec.max} MB`}
  ];
  if(spec.alpha) checks.push({name:'Transparency',ok:asset.alpha??null,detail:asset.alpha===true?'Transparent pixels detected':asset.alpha===false?'No transparent pixels detected':'Could not inspect transparency'});
  if(spec.video) checks.push({name:'Duration',ok:Number.isFinite(asset.duration)?asset.duration>=10&&asset.duration<=40:null,detail:Number.isFinite(asset.duration)?`${asset.duration.toFixed(1)} seconds · expected 10–40 seconds`:'Container/codec not readable here; review externally'});
  return checks;
}
export function statusFor(asset,spec) {
  if(!asset) return 'empty';
  const checks=checksFor(asset,spec);
  return checks.some(x=>x.ok===false)?'error':checks.some(x=>x.ok===null)?'unknown':'pass';
}
export function inferSlot(file) {
  const n=file.name.toLowerCase();
  if(/logo/.test(n))return 'logo';
  if(/lobby/.test(n)||file.width===2048&&file.height===1024)return 'lobby';
  if(/gameplay/.test(n)&&file.video)return 'gameplay';
  if(file.video)return 'trailer';
  const shot=n.match(/screenshot[_ -]?([0-2])/); if(shot)return 'screen'+(+shot[1]+1);
  if(file.width===1440&&file.height===1920)return /art/.test(n)?'portraitArt':'portrait';
  if(file.width===1920&&file.height===1080)return /art/.test(n)?'landscapeArt':'landscape';
  return '';
}
export function cropKey(state,slot,variant=state.variant) {return `${variant}:${state.placement}:${slot}`;}
