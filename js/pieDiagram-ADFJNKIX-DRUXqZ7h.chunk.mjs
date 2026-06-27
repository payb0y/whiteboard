/*! third party licenses: js/vendor.LICENSE.txt */
import{v as U,a8 as V,w as X,a9 as Z,z as j,ab as q,a as o,U as w,y as H,f as J,a7 as K,X as Q,n as Y,g as tt,r as et}from"./NcSelect-DSCEY8Nj.chunk.mjs";import{p as at}from"./chunk-4BX2VUAB-QQN61axu.chunk.mjs";import{p as rt}from"./treemap-KMMF4GRG-CQElU5PQ.chunk.mjs";import"./isEmpty-CSQ-IDKs.chunk.mjs";import{a as G}from"./arc-DvWZwo3-.chunk.mjs";import{o as it}from"./ordinal-Cjn7au0y.chunk.mjs";import{p as ot}from"./pie-DU5NfpVS.chunk.mjs";import"./whiteboard-main.mjs";import"./index-Ci-Hw-W_.chunk.mjs";import"./vendor-BCFzZIhH.chunk.mjs";import"./index-BFepaCOM.chunk.mjs";import"./index-DTTRrbCb.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./_plugin-vue2_normalizer-5Cf0bYJc.chunk.mjs";import"./translation-DoG5ZELJ-D4ouSyqZ.chunk.mjs";import"./en-VV73LM57-CI_zUQG6.chunk.mjs";import"./useJwtStore-CJ6U9GJ2.chunk.mjs";import"./NcTextField-DZHP0Dfw-G6GPgvuC.chunk.mjs";import"./NcCheckboxRadioSwitch-DJmw98x9--AmcBeGk.chunk.mjs";import"./client-D_hev5Lw.chunk.mjs";import"./line-oyEyIoVf.chunk.mjs";import"./array-C2t8gMvs.chunk.mjs";import"./path-XU_ms2pa.chunk.mjs";import"./min-BeIYxZpr.chunk.mjs";import"./_baseUniq-c3bjFfeD.chunk.mjs";import"./init-CkYhHwnE.chunk.mjs";var st=et.pie,D={sections:new Map,showData:!1},m=D.sections,C=D.showData,lt=structuredClone(st),nt=o(()=>structuredClone(lt),"getConfig"),ct=o(()=>{m=new Map,C=D.showData,tt()},"clear"),pt=o(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);m.has(t)||(m.set(t,a),w.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),dt=o(()=>m,"getSections"),mt=o(t=>{C=t},"setShowData"),gt=o(()=>C,"getShowData"),W={getConfig:nt,clear:ct,setDiagramTitle:q,getDiagramTitle:j,setAccTitle:Z,getAccTitle:X,setAccDescription:V,getAccDescription:U,addSection:pt,getSections:dt,setShowData:mt,getShowData:gt},ft=o((t,a)=>{at(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),ut={parse:o(async t=>{const a=await rt("pie",t);w.debug(a),ft(a,W)},"parse")},ht=o(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),vt=ht,St=o(t=>{const a=[...t.values()].reduce((r,s)=>r+s,0),$=[...t.entries()].map(([r,s])=>({label:r,value:s})).filter(r=>r.value/a*100>=1).sort((r,s)=>s.value-r.value);return ot().value(r=>r.value)($)},"createPieArcs"),xt=o((t,a,$,y)=>{w.debug(`rendering pie chart
`+t);const r=y.db,s=H(),T=J(r.getConfig(),s.pie),A=40,l=18,p=4,c=450,g=c,f=K(a),n=f.append("g");n.attr("transform","translate("+g/2+","+c/2+")");const{themeVariables:i}=s;let[b]=Q(i.pieOuterStrokeWidth);b??(b=2);const E=T.textPosition,d=Math.min(g,c)/2-A,M=G().innerRadius(0).outerRadius(d),N=G().innerRadius(d*E).outerRadius(d*E);n.append("circle").attr("cx",0).attr("cy",0).attr("r",d+b/2).attr("class","pieOuterCircle");const u=r.getSections(),O=St(u),P=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let h=0;u.forEach(e=>{h+=e});const _=O.filter(e=>(e.data.value/h*100).toFixed(0)!=="0"),v=it(P);n.selectAll("mySlices").data(_).enter().append("path").attr("d",M).attr("fill",e=>v(e.data.label)).attr("class","pieCircle"),n.selectAll("mySlices").data(_).enter().append("text").text(e=>(e.data.value/h*100).toFixed(0)+"%").attr("transform",e=>"translate("+N.centroid(e)+")").style("text-anchor","middle").attr("class","slice"),n.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const k=[...u.entries()].map(([e,x])=>({label:e,value:x})),S=n.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(e,x)=>{const F=l+p,I=F*k.length/2,L=12*l,B=x*F-I;return"translate("+L+","+B+")"});S.append("rect").attr("width",l).attr("height",l).style("fill",e=>v(e.label)).style("stroke",e=>v(e.label)),S.append("text").attr("x",l+p).attr("y",l-p).text(e=>r.getShowData()?`${e.label} [${e.value}]`:e.label);const R=Math.max(...S.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0)),z=g+A+l+p+R;f.attr("viewBox",`0 0 ${z} ${c}`),Y(f,c,z,T.useMaxWidth)},"draw"),wt={draw:xt},jt={parser:ut,db:W,renderer:wt,styles:vt};export{jt as diagram};
//# sourceMappingURL=pieDiagram-ADFJNKIX-DRUXqZ7h.chunk.mjs.map
