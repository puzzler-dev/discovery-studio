let db;
export async function openStorage(){
  db=await new Promise((resolve,reject)=>{const r=indexedDB.open('puzzler-discovery-studio',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
}
export async function storeFile(key,value){
  if(!db)throw Error('Browser storage is unavailable');
  await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage transaction cancelled'));});
}
export async function deleteFile(key){
  if(!db)return;
  await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').delete(key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
export async function storedFiles(){
  if(!db)return [];
  return new Promise((resolve,reject)=>{const result=[];const r=db.transaction('files').objectStore('files').openCursor();r.onsuccess=()=>{const c=r.result;if(c){result.push([c.key,c.value]);c.continue();}else resolve(result);};r.onerror=()=>reject(r.error);});
}
export async function inspectFile(file){
  const video=/\.(mp4|mkv|webm|mov)$/i.test(file.name)||file.type.startsWith('video/');
  const url=URL.createObjectURL(file);
  const asset={name:file.name,size:file.size,mime:file.type,url,video,width:null,height:null,duration:null,alpha:null,custom:true};
  if(video){
    await new Promise(resolve=>{const v=document.createElement('video');let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);if(v.videoWidth){asset.width=v.videoWidth;asset.height=v.videoHeight;asset.duration=Number.isFinite(v.duration)?v.duration:null;}v.removeAttribute('src');v.load();resolve();};const timer=setTimeout(finish,12000);v.preload='metadata';v.onloadedmetadata=finish;v.onerror=finish;v.src=url;});
  }else{
    try{const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});asset.width=img.naturalWidth;asset.height=img.naturalHeight;
      if(file.type==='image/png'||/\.png$/i.test(file.name)){
        if(asset.width*asset.height<=24000000){const c=document.createElement('canvas');c.width=asset.width;c.height=asset.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const d=ctx.getImageData(0,0,c.width,c.height).data;asset.alpha=false;for(let i=3;i<d.length;i+=4){if(d[i]<255){asset.alpha=true;break;}}}else asset.alpha=null;
      }else asset.alpha=false;
    }catch{asset.decodeError=true;}
  }
  return asset;
}
