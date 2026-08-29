/*! third party licenses: js/vendor.LICENSE.txt */
import{v as j,a8 as q,w as G,a9 as H,z as I,ab as J,a as o,U as $,y as K,f as Q,a7 as Y,X as Z,n as _,g as tt,r as et}from"./NcSelect-CkdBfDaL.chunk.mjs";import{p as at}from"./chunk-4BX2VUAB-Ckohi95m.chunk.mjs";import{p as it}from"./treemap-KMMF4GRG-B4JNmKp6.chunk.mjs";import"./isEmpty-Cn8MLMzF.chunk.mjs";import{a as R}from"./arc-BgOBFqzj.chunk.mjs";import{o as rt}from"./ordinal-Bt1svyuw.chunk.mjs";import{p as ot}from"./pie-DB3TA3Oi.chunk.mjs";import"./whiteboard-main.mjs";import"./index-CG2lkMPF.chunk.mjs";import"./vendor-D2kKKjiY.chunk.mjs";import"./index-BB2Ykc4b.chunk.mjs";import"./index-BswEilqa.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./_plugin-vue2_normalizer-BXM20joE.chunk.mjs";import"./translation-DoG5ZELJ-BXUR7i66.chunk.mjs";import"./en-Y6Q6P44L-BxF-Ph6j.chunk.mjs";import"./useJwtStore-C5acJuD8.chunk.mjs";import"./NcTextField-DZHP0Dfw-B5z_Piv4.chunk.mjs";import"./NcCheckboxRadioSwitch-DJmw98x9-2_FYfQf1.chunk.mjs";import"./client-DIEYmXnD.chunk.mjs";import"./line-DeeWMbCf.chunk.mjs";import"./array-Cg_lHFoG.chunk.mjs";import"./path-i7Zvihw6.chunk.mjs";import"./min-CJ1775eC.chunk.mjs";import"./_baseUniq-CcKC1-Ot.chunk.mjs";import"./init-q33yAy1W.chunk.mjs";var lt=et.pie,v={sections:new Map,showData:!1},m=v.sections,y=v.showData,st=structuredClone(lt),pt=o(()=>structuredClone(st),"getConfig"),nt=o(()=>{m=new Map,y=v.showData,tt()},"clear"),ct=o(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);m.has(t)||(m.set(t,a),$.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),dt=o(()=>m,"getSections"),mt=o(t=>{y=t},"setShowData"),ut=o(()=>y,"getShowData"),W={getConfig:pt,clear:nt,setDiagramTitle:J,getDiagramTitle:I,setAccTitle:H,getAccTitle:G,setAccDescription:q,getAccDescription:j,addSection:ct,getSections:dt,setShowData:mt,getShowData:ut},gt=o((t,a)=>{at(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),ft={parse:o(async t=>{const a=await it("pie",t);$.debug(a),gt(a,W)},"parse")},ht=o(t=>`
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
`,"getStyles"),wt=ht,xt=o(t=>{const a=[...t.values()].reduce((r,l)=>r+l,0),b=[...t.entries()].map(([r,l])=>({label:r,value:l})).filter(r=>r.value/a*100>=1).sort((r,l)=>l.value-r.value);return ot().value(r=>r.value)(b)},"createPieArcs"),St=o((t,a,b,r)=>{$.debug(`rendering pie chart
`+t);const l=r.db,D=K(),T=Q(l.getConfig(),D.pie),C=40,s=18,c=4,n=450,u=n,g=Y(a),p=g.append("g");p.attr("transform","translate("+u/2+","+n/2+")");const{themeVariables:i}=D;let[k]=Z(i.pieOuterStrokeWidth);k??(k=2);const A=T.textPosition,d=Math.min(u,n)/2-C,B=R().innerRadius(0).outerRadius(d),E=R().innerRadius(d*A).outerRadius(d*A);p.append("circle").attr("cx",0).attr("cy",0).attr("r",d+k/2).attr("class","pieOuterCircle");const f=l.getSections(),L=xt(f),P=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let h=0;f.forEach(e=>{h+=e});const z=L.filter(e=>(e.data.value/h*100).toFixed(0)!=="0"),w=rt(P);p.selectAll("mySlices").data(z).enter().append("path").attr("d",B).attr("fill",e=>w(e.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(z).enter().append("text").text(e=>(e.data.value/h*100).toFixed(0)+"%").attr("transform",e=>"translate("+E.centroid(e)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(l.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...f.entries()].map(([e,S])=>({label:e,value:S})),x=p.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(e,S)=>{const M=s+c,U=M*O.length/2,V=12*s,X=S*M-U;return"translate("+V+","+X+")"});x.append("rect").attr("width",s).attr("height",s).style("fill",e=>w(e.label)).style("stroke",e=>w(e.label)),x.append("text").attr("x",s+c).attr("y",s-c).text(e=>l.getShowData()?`${e.label} [${e.value}]`:e.label);const N=Math.max(...x.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0)),F=u+C+s+c+N;g.attr("viewBox",`0 0 ${F} ${n}`),_(g,n,F,T.useMaxWidth)},"draw"),$t={draw:St},It={parser:ft,db:W,renderer:$t,styles:wt};export{It as diagram};
//# sourceMappingURL=pieDiagram-ADFJNKIX-COiY2Sj9.chunk.mjs.map
