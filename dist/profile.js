/* Cropping uses image pixels only; photos never leave this device. */
const PhotoCrop={
 size:600,
 fit(w,h){return Math.max(this.size/w,this.size/h)},
 clamp(model){const s=this.fit(model.w,model.h)*model.zoom;model.x=Math.min(0,Math.max(this.size-model.w*s,model.x));model.y=Math.min(0,Math.max(this.size-model.h*s,model.y));return model},
 zoomAt(model,zoom,px=300,py=300){const previous=model.zoom,next=Math.max(1,Math.min(5,zoom)),ratio=next/previous;model.x=px-(px-model.x)*ratio;model.y=py-(py-model.y)*ratio;model.zoom=next;return this.clamp(model)}
};
(()=>{
 const $=id=>document.getElementById(id),canvas=$('crop-canvas'),dialog=$('photo-dialog'),fileInput=$('profile-photo-file');
 let draft=null,image=null,model=null,objectURL=null,loadToken=0;
 const points=new Map();let gesture=null;
 const validPhoto=s=>typeof s==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(s);
 function avatar(node,photo,name){node.replaceChildren();if(validPhoto(photo)){const img=document.createElement('img');img.src=photo;img.alt='';node.append(img)}else node.textContent=name?Array.from(name.trim())[0]?.toLocaleUpperCase('pt-BR')||'●':'●'}
 function preview(){avatar($('profile-photo-preview'),draft,$('user-name').value||state.profile?.name);$('remove-profile-photo').hidden=!draft}
 function refresh(){avatar($('profile-initial'),state.profile?.photo,state.profile?.name)}
 window.OSProfile={open(){draft=validPhoto(state.profile?.photo)?state.profile.photo:null;fileInput.value='';preview()},photo:()=>draft,refresh};
 function draw(){if(!image||!model)return;PhotoCrop.clamp(model);const ctx=canvas.getContext('2d');ctx.clearRect(0,0,600,600);const scale=PhotoCrop.fit(model.w,model.h)*model.zoom;ctx.drawImage(image,model.x,model.y,model.w*scale,model.h*scale);$('photo-zoom').value=String(model.zoom)}
 function release(){loadToken++;if(objectURL)URL.revokeObjectURL(objectURL);objectURL=null;points.clear();gesture=null;image=null;model=null;fileInput.value=''}
 fileInput.onchange=async()=>{const file=fileInput.files?.[0];if(!file)return;if(file.size>20*1024*1024){notify('Escolha uma foto com até 20 MB.');fileInput.value='';return}if(file.type&&!file.type.startsWith('image/')){notify('Selecione um arquivo de imagem.');return}release();const token=loadToken;objectURL=URL.createObjectURL(file);const url=objectURL,img=new Image();try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});if(token!==loadToken)return;if(!img.naturalWidth||!img.naturalHeight)throw Error('invalid image');image=img;const scale=PhotoCrop.fit(img.naturalWidth,img.naturalHeight);model={w:img.naturalWidth,h:img.naturalHeight,zoom:1,x:(600-img.naturalWidth*scale)/2,y:(600-img.naturalHeight*scale)/2};draw();dialog.showModal()}catch{if(token===loadToken){release();notify('Não foi possível abrir essa foto. Tente uma imagem JPG, PNG ou WebP.')}}};
 function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*600/r.width,y:(e.clientY-r.top)*600/r.height}}
 function resetGesture(){const ps=[...points.values()];if(!model||!ps.length){gesture=null;return}if(ps.length===1)gesture={kind:'pan',point:ps[0],x:model.x,y:model.y};else{const [a,b]=ps;gesture={kind:'pinch',distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),center:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},zoom:model.zoom,x:model.x,y:model.y}}}
 canvas.addEventListener('pointerdown',e=>{if(!model)return;e.preventDefault();points.set(e.pointerId,point(e));canvas.setPointerCapture?.(e.pointerId);resetGesture()});
 canvas.addEventListener('pointermove',e=>{if(!points.has(e.pointerId)||!model)return;e.preventDefault();points.set(e.pointerId,point(e));const ps=[...points.values()];if(gesture?.kind==='pan'&&ps.length===1){model.x=gesture.x+ps[0].x-gesture.point.x;model.y=gesture.y+ps[0].y-gesture.point.y}else if(gesture?.kind==='pinch'&&ps.length>=2){const [a,b]=ps,center={x:(a.x+b.x)/2,y:(a.y+b.y)/2},zoom=Math.max(1,Math.min(5,gesture.zoom*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance)),ratio=zoom/gesture.zoom;model.zoom=zoom;model.x=center.x-(gesture.center.x-gesture.x)*ratio;model.y=center.y-(gesture.center.y-gesture.y)*ratio}draw()});
 function end(e){points.delete(e.pointerId);resetGesture()}
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,end);
 $('photo-zoom').oninput=e=>{if(!model)return;PhotoCrop.zoomAt(model,Number(e.target.value));draw();resetGesture()};
 canvas.addEventListener('wheel',e=>{if(!model)return;e.preventDefault();const p=point(e);PhotoCrop.zoomAt(model,model.zoom*Math.exp(-e.deltaY*.002),p.x,p.y);draw();resetGesture()},{passive:false});
 document.querySelectorAll('[data-pan]').forEach(b=>b.onclick=()=>{if(!model)return;const direction=b.dataset.pan;model.x+=(direction==='left'?-24:direction==='right'?24:0);model.y+=(direction==='up'?-24:direction==='down'?24:0);draw()});
 $('cancel-photo').onclick=()=>dialog.close();dialog.addEventListener('close',release);
 $('apply-photo').onclick=()=>{if(!image||!model)return;try{const out=document.createElement('canvas');out.width=out.height=320;const ctx=out.getContext('2d');ctx.fillStyle='#edf2e6';ctx.fillRect(0,0,320,320);ctx.drawImage(canvas,0,0,320,320);draft=out.toDataURL('image/jpeg',.86);preview();dialog.close()}catch{notify('Não foi possível recortar a foto. Tente uma imagem menor.')}};
 $('remove-profile-photo').onclick=()=>{draft=null;preview()};
 $('user-name').addEventListener('input',preview);refresh();
})();
