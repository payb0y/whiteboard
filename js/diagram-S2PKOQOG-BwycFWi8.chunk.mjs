/*! third party licenses: js/vendor.LICENSE.txt */
import{a as g,f as w,a8 as C,n as v,V as u,aa as P,x as z,ac as S,B as F,w as W,a9 as E,s as T,y as D,g as A}from"./NcSelect-Bz9Ii8rD.chunk.mjs";import{p as R}from"./chunk-4BX2VUAB-iQbAyCHS.chunk.mjs";import{p as Y}from"./treemap-KMMF4GRG-CWnsXaWZ.chunk.mjs";import"./whiteboard-main.mjs";import"./index-CG2lkMPF.chunk.mjs";import"./vendor-D2kKKjiY.chunk.mjs";import"./index-BB2Ykc4b.chunk.mjs";import"./index-BswEilqa.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./_plugin-vue2_normalizer-BXM20joE.chunk.mjs";import"./translation-DoG5ZELJ-BXUR7i66.chunk.mjs";import"./en-Y6Q6P44L-BJZKJ-lu.chunk.mjs";import"./useJwtStore-C5acJuD8.chunk.mjs";import"./NcTextField-DZHP0Dfw-B5z_Piv4.chunk.mjs";import"./NcCheckboxRadioSwitch-DJmw98x9-2_FYfQf1.chunk.mjs";import"./client-DIEYmXnD.chunk.mjs";import"./isEmpty-nAvd3QfV.chunk.mjs";import"./line-CEmbmVmL.chunk.mjs";import"./array-Cg_lHFoG.chunk.mjs";import"./path-i7Zvihw6.chunk.mjs";import"./min-DBuv1J6p.chunk.mjs";import"./_baseUniq-BAg9zw8k.chunk.mjs";var H=T.packet,f,y=(f=class{constructor(){this.packet=[],this.setAccTitle=P,this.getAccTitle=z,this.setDiagramTitle=S,this.getDiagramTitle=F,this.getAccDescription=W,this.setAccDescription=E}getConfig(){const t=w({...H,...D().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){A(),this.packet=[]}},g(f,"PacketDB"),f),L=1e4,M=g((e,t)=>{R(e,t);let r=-1,o=[],n=1;const{bitsPerRow:l}=t.getConfig();for(let{start:a,end:s,bits:d,label:c}of e.blocks){if(a!==void 0&&s!==void 0&&s<a)throw new Error(`Packet block ${a} - ${s} is invalid. End must be greater than start.`);if(a??(a=r+1),a!==r+1)throw new Error(`Packet block ${a} - ${s??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(s??(s=a+(d??1)-1),d??(d=s-a+1),r=s,u.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=l+1&&t.getPacket().length<L;){const[p,i]=j({start:a,end:s,bits:d,label:c},n,l);if(o.push(p),p.end+1===n*l&&(t.pushWord(o),o=[],n++),!i)break;({start:a,end:s,bits:d,label:c}=i)}}t.pushWord(o)},"populate"),j=g((e,t,r)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*r)return[e,void 0];const o=t*r-1,n=t*r;return[{start:e.start,end:o,label:e.label,bits:o-e.start},{start:n,end:e.end,label:e.label,bits:e.end-n}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:g(async e=>{const t=await Y("packet",e),r=x.parser?.yy;if(!(r instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");u.debug(t),M(t,r)},"parse")},I=g((e,t,r,o)=>{const n=o.db,l=n.getConfig(),{rowHeight:a,paddingY:s,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),i=n.getDiagramTitle(),b=a+s,h=b*(p.length+1)-(i?0:a),k=d*c+2,m=C(t);m.attr("viewbox",`0 0 ${k} ${h}`),v(m,h,k,l.useMaxWidth);for(const[$,B]of p.entries())N(m,B,$,l);m.append("text").text(i).attr("x",k/2).attr("y",h-b/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),N=g((e,t,r,{rowHeight:o,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:s,showBits:d})=>{const c=e.append("g"),p=r*(o+l)+l;for(const i of t){const b=i.start%s*a+1,h=(i.end-i.start+1)*a-n;if(c.append("rect").attr("x",b).attr("y",p).attr("width",h).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",b+h/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!d)continue;const k=i.end===i.start,m=p-2;c.append("text").attr("x",b+(k?h/2:0)).attr("y",m).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(i.start),k||c.append("text").attr("x",b+h).attr("y",m).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),V={draw:I},G={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},K=g(({packet:e}={})=>{const t=w(G,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),kt={parser:x,get db(){return new y},renderer:V,styles:K};export{kt as diagram};
//# sourceMappingURL=diagram-S2PKOQOG-BwycFWi8.chunk.mjs.map
