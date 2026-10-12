// Pad centers/sizes measured in the UDTTKSRV8F 1920 × 1080 reference, kept in px for the footing maths.
// Height runs from the mirror top's back edge to the bottom of the dark side band (column profiles through each pad).
const pad=(id,x,y,width,height)=>({id,x:x/19.2,y:y/10.8,width:width/19.2,height:height/10.8,px:{x,y,width,height}});
export const lobbyPads=[
 pad('leader',1016,924,358,74),
 pad('left',714,848,286,50),
 pad('right',1245,848,286,50),
 pad('far-right',1462,820,262,41),
 pad('far-left',557,814,250,39)
];
// The glossy floor meets the backdrop here (y ≈ 700 of 1080); the floor and empty pad tops mirror the picture about it.
export const lobbyFloorLine=700/10.8;
// The rim drawn in reference-layouts.css (--side, --bevel, --bevel-x) in 1920-wide px; the top face sits inside it.
const rim={side:.29*19.2,bevel:.28*19.2,bevelX:.36*19.2};
// Screen px per cutout px on the leader's pad (~690-700 px tall leaders); farther pads shrink with their width.
const leaderScale=702/1894;
// bounds crop each 2048 px cutout. soles are each foot's ground contact (the mean of its sole's bottom edge), its toe
// tip (the lowest point) and its width, in cutout px: [x,y,tipX,tipY,width]. Crossed-arms' stagger is ~40 px at a near
// pad's scale, deeper than a near pad's top (~34 px there): her back foot stays on the pad and her front toe rests on
// the rim until a level-feet pose replaces this cutout. Chill's toe overhangs by ~3 px.
export const lobbyCharacters=[
 {file:'silver-hips',alt:'Silver outfit character with hands on hips',bounds:[657,105,708,1854],soles:[[728.5,1950.9,714,1956,100],[1271.5,1876.2,1322,1891,184]]},
 {file:'crossed-arms',alt:'Character with crossed arms and red trousers',bounds:[757,68,548,1899],soles:[[879.5,1814.7,809.5,1829,244],[1229.5,1957.9,1230,1965,136]]},
 {file:'chill',alt:'Green character in a yellow outfit with hands on hips',bounds:[572,76,749,1885],soles:[[872.5,1950.2,874.7,1958,138],[1194,1822.7,1253.5,1836,251]]},
 {file:'wave',alt:'Pink-haired character waving',bounds:[651,43,729,1981],soles:[[934.5,2016.1,942,2022,120],[1184.5,2013.1,1202,2021,136]]}
];
// Centres the feet on the pad, then picks a height that keeps each sole's contact 2 px inside the top face's back edge
// and each toe tip 2 px inside its front edge. When a stance is deeper than the pad, the back foot wins: a toe on the
// rim reads as standing at the edge, a heel above the back edge reads as floating. Returns stage percentages plus a
// contact shadow under each sole.
export function characterPlacement(character,pad){
 const [bx,by,bw,bh]=character.bounds,{x,y,width,height}=pad.px;
 const scale=leaderScale*width/lobbyPads[0].px.width;
 const faceRX=width/2-rim.bevelX,faceRY=(height-rim.side-rim.bevel)/2,faceCY=y-height/2+faceRY;
 const [[x1,y1],[x2,y2]]=character.soles,midX=(x1+x2)/2,midY=(y1+y2)/2;
 let low=-Infinity,high=Infinity;
 const reach=dx=>faceRY*Math.sqrt(Math.max(0,1-(dx/faceRX)**2));
 for(const [fx,fy,tx,ty] of character.soles){
  low=Math.max(low,faceCY-reach((fx-midX)*scale)+2-(fy-midY)*scale);
  high=Math.min(high,faceCY+reach((tx-midX)*scale)-2-(ty-midY)*scale);
 }
 const anchorY=low<=high?(low+high)/2:low;
 return {
  left:x/19.2,bottom:100-(anchorY+(by+bh-midY)*scale)/10.8,height:bh*scale/10.8,anchor:(midX-bx)/bw*100,
  shadows:character.soles.map(([fx,fy,,,fw])=>{const w=fw*scale*1.6;return {x:(x+(fx-midX)*scale)/19.2,y:(anchorY+(fy-midY)*scale)/10.8,width:w/19.2,height:w*faceRY/faceRX*2.6/10.8};})
 };
}
