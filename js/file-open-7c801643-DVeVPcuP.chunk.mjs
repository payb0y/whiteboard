/*! third party licenses: js/vendor.LICENSE.txt */
var l=async(t=[{}])=>(Array.isArray(t)||(t=[t]),new Promise((c,p)=>{const e=document.createElement("input");e.type="file";const s=[...t.map(a=>a.mimeTypes||[]),...t.map(a=>a.extensions||[])].join();e.multiple=t[0].multiple||!1,e.accept=s||"";const i=a=>{typeof n=="function"&&n(),c(a)},n=t[0].legacySetup&&t[0].legacySetup(i,()=>n(p),e);e.addEventListener("change",()=>{i(e.multiple?Array.from(e.files):e.files[0])}),e.click()}));export{l as default};
//# sourceMappingURL=file-open-7c801643-DVeVPcuP.chunk.mjs.map
