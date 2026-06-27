/*! third party licenses: js/vendor.LICENSE.txt */
import{v as ie,a8 as re,z as ae,ab as ne,w as ce,a9 as oe,a as o,y as K,n as le,U as kt,l as ue,s as de,g as fe,ai as he}from"./NcSelect-DSCEY8Nj.chunk.mjs";import{aI as dt,Z as L}from"./isEmpty-CSQ-IDKs.chunk.mjs";import{t as ke,g as me,m as ye,i as ge,a as pe,j as Pt,p as Rt,r as ve,q as Te,k as be,u as xe,w as we,v as _e,o as De,h as Yt,l as Nt,n as Bt,s as zt,f as qt,b as Ce,e as Ee,c as Se,d as Ie}from"./advancedFormat-VEZpfH3r.chunk.mjs";import{l as Ae}from"./linear-7Nk-sSvJ.chunk.mjs";import"./whiteboard-main.mjs";import"./index-Ci-Hw-W_.chunk.mjs";import"./vendor-BCFzZIhH.chunk.mjs";import"./index-BFepaCOM.chunk.mjs";import"./index-DTTRrbCb.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./_plugin-vue2_normalizer-5Cf0bYJc.chunk.mjs";import"./translation-DoG5ZELJ-D4ouSyqZ.chunk.mjs";import"./en-VV73LM57-CI_zUQG6.chunk.mjs";import"./useJwtStore-CJ6U9GJ2.chunk.mjs";import"./NcTextField-DZHP0Dfw-G6GPgvuC.chunk.mjs";import"./NcCheckboxRadioSwitch-DJmw98x9--AmcBeGk.chunk.mjs";import"./client-D_hev5Lw.chunk.mjs";import"./line-oyEyIoVf.chunk.mjs";import"./array-C2t8gMvs.chunk.mjs";import"./path-XU_ms2pa.chunk.mjs";import"./init-CkYhHwnE.chunk.mjs";import"./defaultLocale-B3BLa2dh.chunk.mjs";var bt=(function(){var t=o(function(b,l,d,f){for(d=d||{},f=b.length;f--;d[b[f]]=l);return d},"o"),i=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],n=[1,27],a=[1,28],m=[1,29],h=[1,30],V=[1,31],Y=[1,32],N=[1,33],E=[1,34],F=[1,9],z=[1,10],O=[1,11],P=[1,12],w=[1,13],Q=[1,14],$=[1,15],tt=[1,16],et=[1,19],st=[1,20],it=[1,21],rt=[1,22],at=[1,23],y=[1,25],T=[1,35],p={trace:o(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:o(function(l,d,f,u,k,s,c){var e=s.length-1;switch(k){case 1:return s[e-1];case 2:this.$=[];break;case 3:s[e-1].push(s[e]),this.$=s[e-1];break;case 4:case 5:this.$=s[e];break;case 6:case 7:this.$=[];break;case 8:u.setWeekday("monday");break;case 9:u.setWeekday("tuesday");break;case 10:u.setWeekday("wednesday");break;case 11:u.setWeekday("thursday");break;case 12:u.setWeekday("friday");break;case 13:u.setWeekday("saturday");break;case 14:u.setWeekday("sunday");break;case 15:u.setWeekend("friday");break;case 16:u.setWeekend("saturday");break;case 17:u.setDateFormat(s[e].substr(11)),this.$=s[e].substr(11);break;case 18:u.enableInclusiveEndDates(),this.$=s[e].substr(18);break;case 19:u.TopAxis(),this.$=s[e].substr(8);break;case 20:u.setAxisFormat(s[e].substr(11)),this.$=s[e].substr(11);break;case 21:u.setTickInterval(s[e].substr(13)),this.$=s[e].substr(13);break;case 22:u.setExcludes(s[e].substr(9)),this.$=s[e].substr(9);break;case 23:u.setIncludes(s[e].substr(9)),this.$=s[e].substr(9);break;case 24:u.setTodayMarker(s[e].substr(12)),this.$=s[e].substr(12);break;case 27:u.setDiagramTitle(s[e].substr(6)),this.$=s[e].substr(6);break;case 28:this.$=s[e].trim(),u.setAccTitle(this.$);break;case 29:case 30:this.$=s[e].trim(),u.setAccDescription(this.$);break;case 31:u.addSection(s[e].substr(8)),this.$=s[e].substr(8);break;case 33:u.addTask(s[e-1],s[e]),this.$="task";break;case 34:this.$=s[e-1],u.setClickEvent(s[e-1],s[e],null);break;case 35:this.$=s[e-2],u.setClickEvent(s[e-2],s[e-1],s[e]);break;case 36:this.$=s[e-2],u.setClickEvent(s[e-2],s[e-1],null),u.setLink(s[e-2],s[e]);break;case 37:this.$=s[e-3],u.setClickEvent(s[e-3],s[e-2],s[e-1]),u.setLink(s[e-3],s[e]);break;case 38:this.$=s[e-2],u.setClickEvent(s[e-2],s[e],null),u.setLink(s[e-2],s[e-1]);break;case 39:this.$=s[e-3],u.setClickEvent(s[e-3],s[e-1],s[e]),u.setLink(s[e-3],s[e-2]);break;case 40:this.$=s[e-1],u.setLink(s[e-1],s[e]);break;case 41:case 47:this.$=s[e-1]+" "+s[e];break;case 42:case 43:case 45:this.$=s[e-2]+" "+s[e-1]+" "+s[e];break;case 44:case 46:this.$=s[e-3]+" "+s[e-2]+" "+s[e-1]+" "+s[e];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(i,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:n,14:a,15:m,16:h,17:V,18:Y,19:18,20:N,21:E,22:F,23:z,24:O,25:P,26:w,27:Q,28:$,29:tt,30:et,31:st,33:it,35:rt,36:at,37:24,38:y,40:T},t(i,[2,7],{1:[2,1]}),t(i,[2,3]),{9:36,11:17,12:r,13:n,14:a,15:m,16:h,17:V,18:Y,19:18,20:N,21:E,22:F,23:z,24:O,25:P,26:w,27:Q,28:$,29:tt,30:et,31:st,33:it,35:rt,36:at,37:24,38:y,40:T},t(i,[2,5]),t(i,[2,6]),t(i,[2,17]),t(i,[2,18]),t(i,[2,19]),t(i,[2,20]),t(i,[2,21]),t(i,[2,22]),t(i,[2,23]),t(i,[2,24]),t(i,[2,25]),t(i,[2,26]),t(i,[2,27]),{32:[1,37]},{34:[1,38]},t(i,[2,30]),t(i,[2,31]),t(i,[2,32]),{39:[1,39]},t(i,[2,8]),t(i,[2,9]),t(i,[2,10]),t(i,[2,11]),t(i,[2,12]),t(i,[2,13]),t(i,[2,14]),t(i,[2,15]),t(i,[2,16]),{41:[1,40],43:[1,41]},t(i,[2,4]),t(i,[2,28]),t(i,[2,29]),t(i,[2,33]),t(i,[2,34],{42:[1,42],43:[1,43]}),t(i,[2,40],{41:[1,44]}),t(i,[2,35],{43:[1,45]}),t(i,[2,36]),t(i,[2,38],{42:[1,46]}),t(i,[2,37]),t(i,[2,39])],defaultActions:{},parseError:o(function(l,d){if(d.recoverable)this.trace(l);else{var f=new Error(l);throw f.hash=d,f}},"parseError"),parse:o(function(l){var d=this,f=[0],u=[],k=[null],s=[],c=this.table,e="",D=0,x=0,_=2,A=1,C=s.slice.call(arguments,1),S=Object.create(this.lexer),q={yy:{}};for(var gt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,gt)&&(q.yy[gt]=this.yy[gt]);S.setInput(l,q.yy),q.yy.lexer=S,q.yy.parser=this,typeof S.yylloc>"u"&&(S.yylloc={});var pt=S.yylloc;s.push(pt);var ee=S.options&&S.options.ranges;typeof q.yy.parseError=="function"?this.parseError=q.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function se(W){f.length=f.length-2*W,k.length=k.length-W,s.length=s.length-W}o(se,"popStack");function Wt(){var W;return W=u.pop()||S.lex()||A,typeof W!="number"&&(W instanceof Array&&(u=W,W=u.pop()),W=d.symbols_[W]||W),W}o(Wt,"lex");for(var M,X,R,vt,H={},lt,j,Ot,ut;;){if(X=f[f.length-1],this.defaultActions[X]?R=this.defaultActions[X]:((M===null||typeof M>"u")&&(M=Wt()),R=c[X]&&c[X][M]),typeof R>"u"||!R.length||!R[0]){var Tt="";ut=[];for(lt in c[X])this.terminals_[lt]&&lt>_&&ut.push("'"+this.terminals_[lt]+"'");S.showPosition?Tt="Parse error on line "+(D+1)+`:
`+S.showPosition()+`
Expecting `+ut.join(", ")+", got '"+(this.terminals_[M]||M)+"'":Tt="Parse error on line "+(D+1)+": Unexpected "+(M==A?"end of input":"'"+(this.terminals_[M]||M)+"'"),this.parseError(Tt,{text:S.match,token:this.terminals_[M]||M,line:S.yylineno,loc:pt,expected:ut})}if(R[0]instanceof Array&&R.length>1)throw new Error("Parse Error: multiple actions possible at state: "+X+", token: "+M);switch(R[0]){case 1:f.push(M),k.push(S.yytext),s.push(S.yylloc),f.push(R[1]),M=null,x=S.yyleng,e=S.yytext,D=S.yylineno,pt=S.yylloc;break;case 2:if(j=this.productions_[R[1]][1],H.$=k[k.length-j],H._$={first_line:s[s.length-(j||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(j||1)].first_column,last_column:s[s.length-1].last_column},ee&&(H._$.range=[s[s.length-(j||1)].range[0],s[s.length-1].range[1]]),vt=this.performAction.apply(H,[e,x,D,q.yy,R[1],k,s].concat(C)),typeof vt<"u")return vt;j&&(f=f.slice(0,-1*j*2),k=k.slice(0,-1*j),s=s.slice(0,-1*j)),f.push(this.productions_[R[1]][0]),k.push(H.$),s.push(H._$),Ot=c[f[f.length-2]][f[f.length-1]],f.push(Ot);break;case 3:return!0}}return!0},"parse")},v=(function(){var b={EOF:1,parseError:o(function(d,f){if(this.yy.parser)this.yy.parser.parseError(d,f);else throw new Error(d)},"parseError"),setInput:o(function(l,d){return this.yy=d||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:o(function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var d=l.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},"input"),unput:o(function(l){var d=l.length,f=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var u=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var k=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===u.length?this.yylloc.first_column:0)+u[u.length-f.length].length-f[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[k[0],k[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:o(function(){return this._more=!0,this},"more"),reject:o(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:o(function(l){this.unput(this.match.slice(l))},"less"),pastInput:o(function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:o(function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:o(function(){var l=this.pastInput(),d=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:o(function(l,d){var f,u,k;if(this.options.backtrack_lexer&&(k={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(k.yylloc.range=this.yylloc.range.slice(0))),u=l[0].match(/(?:\r\n?|\n).*/g),u&&(this.yylineno+=u.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:u?u[u.length-1].length-u[u.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],f=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var s in k)this[s]=k[s];return!1}return!1},"test_match"),next:o(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,d,f,u;this._more||(this.yytext="",this.match="");for(var k=this._currentRules(),s=0;s<k.length;s++)if(f=this._input.match(this.rules[k[s]]),f&&(!d||f[0].length>d[0].length)){if(d=f,u=s,this.options.backtrack_lexer){if(l=this.test_match(f,k[s]),l!==!1)return l;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(l=this.test_match(d,k[u]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:o(function(){var d=this.next();return d||this.lex()},"lex"),begin:o(function(d){this.conditionStack.push(d)},"begin"),popState:o(function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:o(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:o(function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},"topState"),pushState:o(function(d){this.begin(d)},"pushState"),stateStackSize:o(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:o(function(d,f,u,k){switch(u){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return b})();p.lexer=v;function g(){this.yy={}}return o(g,"Parser"),g.prototype=p,p.Parser=g,new g})();bt.parser=bt;var Fe=bt;L.extend(Ee);L.extend(Se);L.extend(Ie);var jt={friday:5,saturday:6},B="",Dt="",Ct=void 0,Et="",nt=[],ct=[],St=new Map,It=[],mt=[],J="",At="",Gt=["active","done","crit","milestone","vert"],Ft=[],ot=!1,Lt=!1,Mt="sunday",yt="saturday",xt=0,Le=o(function(){It=[],mt=[],J="",Ft=[],ft=0,_t=void 0,ht=void 0,I=[],B="",Dt="",At="",Ct=void 0,Et="",nt=[],ct=[],ot=!1,Lt=!1,xt=0,St=new Map,fe(),Mt="sunday",yt="saturday"},"clear"),Me=o(function(t){Dt=t},"setAxisFormat"),Ve=o(function(){return Dt},"getAxisFormat"),We=o(function(t){Ct=t},"setTickInterval"),Oe=o(function(){return Ct},"getTickInterval"),Pe=o(function(t){Et=t},"setTodayMarker"),Re=o(function(){return Et},"getTodayMarker"),Ye=o(function(t){B=t},"setDateFormat"),Ne=o(function(){ot=!0},"enableInclusiveEndDates"),Be=o(function(){return ot},"endDatesAreInclusive"),ze=o(function(){Lt=!0},"enableTopAxis"),qe=o(function(){return Lt},"topAxisEnabled"),je=o(function(t){At=t},"setDisplayMode"),Ue=o(function(){return At},"getDisplayMode"),Xe=o(function(){return B},"getDateFormat"),Ge=o(function(t){nt=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),He=o(function(){return nt},"getIncludes"),Ke=o(function(t){ct=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),Ze=o(function(){return ct},"getExcludes"),Je=o(function(){return St},"getLinks"),Qe=o(function(t){J=t,It.push(t)},"addSection"),$e=o(function(){return It},"getSections"),ts=o(function(){let t=Ut();const i=10;let r=0;for(;!t&&r<i;)t=Ut(),r++;return mt=I,mt},"getTasks"),Ht=o(function(t,i,r,n){const a=t.format(i.trim()),m=t.format("YYYY-MM-DD");return n.includes(a)||n.includes(m)?!1:r.includes("weekends")&&(t.isoWeekday()===jt[yt]||t.isoWeekday()===jt[yt]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(a)||r.includes(m)},"isInvalidDate"),es=o(function(t){Mt=t},"setWeekday"),ss=o(function(){return Mt},"getWeekday"),is=o(function(t){yt=t},"setWeekend"),Kt=o(function(t,i,r,n){if(!r.length||t.manualEndTime)return;let a;t.startTime instanceof Date?a=L(t.startTime):a=L(t.startTime,i,!0),a=a.add(1,"d");let m;t.endTime instanceof Date?m=L(t.endTime):m=L(t.endTime,i,!0);const[h,V]=rs(a,m,i,r,n);t.endTime=h.toDate(),t.renderEndTime=V},"checkTaskDates"),rs=o(function(t,i,r,n,a){let m=!1,h=null;for(;t<=i;)m||(h=i.toDate()),m=Ht(t,r,n,a),m&&(i=i.add(1,"d")),t=t.add(1,"d");return[i,h]},"fixTaskDates"),wt=o(function(t,i,r){if(r=r.trim(),(i.trim()==="x"||i.trim()==="X")&&/^\d+$/.test(r))return new Date(Number(r));const a=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(a!==null){let h=null;for(const Y of a.groups.ids.split(" ")){let N=G(Y);N!==void 0&&(!h||N.endTime>h.endTime)&&(h=N)}if(h)return h.endTime;const V=new Date;return V.setHours(0,0,0,0),V}let m=L(r,i.trim(),!0);if(m.isValid())return m.toDate();{kt.debug("Invalid date:"+r),kt.debug("With date format:"+i.trim());const h=new Date(r);if(h===void 0||isNaN(h.getTime())||h.getFullYear()<-1e4||h.getFullYear()>1e4)throw new Error("Invalid date:"+r);return h}},"getStartDate"),Zt=o(function(t){const i=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return i!==null?[Number.parseFloat(i[1]),i[2]]:[NaN,"ms"]},"parseDuration"),Jt=o(function(t,i,r,n=!1){r=r.trim();const m=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(m!==null){let E=null;for(const z of m.groups.ids.split(" ")){let O=G(z);O!==void 0&&(!E||O.startTime<E.startTime)&&(E=O)}if(E)return E.startTime;const F=new Date;return F.setHours(0,0,0,0),F}let h=L(r,i.trim(),!0);if(h.isValid())return n&&(h=h.add(1,"d")),h.toDate();let V=L(t);const[Y,N]=Zt(r);if(!Number.isNaN(Y)){const E=V.add(Y,N);E.isValid()&&(V=E)}return V.toDate()},"getEndDate"),ft=0,Z=o(function(t){return t===void 0?(ft=ft+1,"task"+ft):t},"parseId"),as=o(function(t,i){let r;i.substr(0,1)===":"?r=i.substr(1,i.length):r=i;const n=r.split(","),a={};Vt(n,a,Gt);for(let h=0;h<n.length;h++)n[h]=n[h].trim();let m="";switch(n.length){case 1:a.id=Z(),a.startTime=t.endTime,m=n[0];break;case 2:a.id=Z(),a.startTime=wt(void 0,B,n[0]),m=n[1];break;case 3:a.id=Z(n[0]),a.startTime=wt(void 0,B,n[1]),m=n[2];break}return m&&(a.endTime=Jt(a.startTime,B,m,ot),a.manualEndTime=L(m,"YYYY-MM-DD",!0).isValid(),Kt(a,B,ct,nt)),a},"compileData"),ns=o(function(t,i){let r;i.substr(0,1)===":"?r=i.substr(1,i.length):r=i;const n=r.split(","),a={};Vt(n,a,Gt);for(let m=0;m<n.length;m++)n[m]=n[m].trim();switch(n.length){case 1:a.id=Z(),a.startTime={type:"prevTaskEnd",id:t},a.endTime={data:n[0]};break;case 2:a.id=Z(),a.startTime={type:"getStartDate",startData:n[0]},a.endTime={data:n[1]};break;case 3:a.id=Z(n[0]),a.startTime={type:"getStartDate",startData:n[1]},a.endTime={data:n[2]};break}return a},"parseData"),_t,ht,I=[],Qt={},cs=o(function(t,i){const r={section:J,type:J,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:i},task:t,classes:[]},n=ns(ht,i);r.raw.startTime=n.startTime,r.raw.endTime=n.endTime,r.id=n.id,r.prevTaskId=ht,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.vert=n.vert,r.order=xt,xt++;const a=I.push(r);ht=r.id,Qt[r.id]=a-1},"addTask"),G=o(function(t){const i=Qt[t];return I[i]},"findTaskById"),os=o(function(t,i){const r={section:J,type:J,description:t,task:t,classes:[]},n=as(_t,i);r.startTime=n.startTime,r.endTime=n.endTime,r.id=n.id,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.vert=n.vert,_t=r,mt.push(r)},"addTaskOrg"),Ut=o(function(){const t=o(function(r){const n=I[r];let a="";switch(I[r].raw.startTime.type){case"prevTaskEnd":{const m=G(n.prevTaskId);n.startTime=m.endTime;break}case"getStartDate":a=wt(void 0,B,I[r].raw.startTime.startData),a&&(I[r].startTime=a);break}return I[r].startTime&&(I[r].endTime=Jt(I[r].startTime,B,I[r].raw.endTime.data,ot),I[r].endTime&&(I[r].processed=!0,I[r].manualEndTime=L(I[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),Kt(I[r],B,ct,nt))),I[r].processed},"compileTask");let i=!0;for(const[r,n]of I.entries())t(r),i=i&&n.processed;return i},"compileTasks"),ls=o(function(t,i){let r=i;K().securityLevel!=="loose"&&(r=de.sanitizeUrl(i)),t.split(",").forEach(function(n){G(n)!==void 0&&(te(n,()=>{window.open(r,"_self")}),St.set(n,r))}),$t(t,"clickable")},"setLink"),$t=o(function(t,i){t.split(",").forEach(function(r){let n=G(r);n!==void 0&&n.classes.push(i)})},"setClass"),us=o(function(t,i,r){if(K().securityLevel!=="loose"||i===void 0)return;let n=[];if(typeof r=="string"){n=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let m=0;m<n.length;m++){let h=n[m].trim();h.startsWith('"')&&h.endsWith('"')&&(h=h.substr(1,h.length-2)),n[m]=h}}n.length===0&&n.push(t),G(t)!==void 0&&te(t,()=>{he.runFunc(i,...n)})},"setClickFun"),te=o(function(t,i){Ft.push(function(){const r=document.querySelector(`[id="${t}"]`);r!==null&&r.addEventListener("click",function(){i()})},function(){const r=document.querySelector(`[id="${t}-text"]`);r!==null&&r.addEventListener("click",function(){i()})})},"pushFun"),ds=o(function(t,i,r){t.split(",").forEach(function(n){us(n,i,r)}),$t(t,"clickable")},"setClickEvent"),fs=o(function(t){Ft.forEach(function(i){i(t)})},"bindFunctions"),hs={getConfig:o(()=>K().gantt,"getConfig"),clear:Le,setDateFormat:Ye,getDateFormat:Xe,enableInclusiveEndDates:Ne,endDatesAreInclusive:Be,enableTopAxis:ze,topAxisEnabled:qe,setAxisFormat:Me,getAxisFormat:Ve,setTickInterval:We,getTickInterval:Oe,setTodayMarker:Pe,getTodayMarker:Re,setAccTitle:oe,getAccTitle:ce,setDiagramTitle:ne,getDiagramTitle:ae,setDisplayMode:je,getDisplayMode:Ue,setAccDescription:re,getAccDescription:ie,addSection:Qe,getSections:$e,getTasks:ts,addTask:cs,findTaskById:G,addTaskOrg:os,setIncludes:Ge,getIncludes:He,setExcludes:Ke,getExcludes:Ze,setClickEvent:ds,setLink:ls,getLinks:Je,bindFunctions:fs,parseDuration:Zt,isInvalidDate:Ht,setWeekday:es,getWeekday:ss,setWeekend:is};function Vt(t,i,r){let n=!0;for(;n;)n=!1,r.forEach(function(a){const m="^\\s*"+a+"\\s*$",h=new RegExp(m);t[0].match(h)&&(i[a]=!0,t.shift(1),n=!0)})}o(Vt,"getTaskTags");var ks=o(function(){kt.debug("Something is calling, setConf, remove the call")},"setConf"),Xt={monday:De,tuesday:_e,wednesday:we,thursday:xe,friday:be,saturday:Te,sunday:ve},ms=o((t,i)=>{let r=[...t].map(()=>-1/0),n=[...t].sort((m,h)=>m.startTime-h.startTime||m.order-h.order),a=0;for(const m of n)for(let h=0;h<r.length;h++)if(m.startTime>=r[h]){r[h]=m.endTime,m.order=h+i,h>a&&(a=h);break}return a},"getMaxIntersections"),U,ys=o(function(t,i,r,n){const a=K().gantt,m=K().securityLevel;let h;m==="sandbox"&&(h=dt("#i"+i));const V=m==="sandbox"?dt(h.nodes()[0].contentDocument.body):dt("body"),Y=m==="sandbox"?h.nodes()[0].contentDocument:document,N=Y.getElementById(i);U=N.parentElement.offsetWidth,U===void 0&&(U=1200),a.useWidth!==void 0&&(U=a.useWidth);const E=n.db.getTasks();let F=[];for(const y of E)F.push(y.type);F=at(F);const z={};let O=2*a.topPadding;if(n.db.getDisplayMode()==="compact"||a.displayMode==="compact"){const y={};for(const p of E)y[p.section]===void 0?y[p.section]=[p]:y[p.section].push(p);let T=0;for(const p of Object.keys(y)){const v=ms(y[p],T)+1;T+=v,O+=v*(a.barHeight+a.barGap),z[p]=v}}else{O+=E.length*(a.barHeight+a.barGap);for(const y of F)z[y]=E.filter(T=>T.type===y).length}N.setAttribute("viewBox","0 0 "+U+" "+O);const P=V.select(`[id="${i}"]`),w=ke().domain([me(E,function(y){return y.startTime}),ye(E,function(y){return y.endTime})]).rangeRound([0,U-a.leftPadding-a.rightPadding]);function Q(y,T){const p=y.startTime,v=T.startTime;let g=0;return p>v?g=1:p<v&&(g=-1),g}o(Q,"taskCompare"),E.sort(Q),$(E,U,O),le(P,O,U,a.useMaxWidth),P.append("text").text(n.db.getDiagramTitle()).attr("x",U/2).attr("y",a.titleTopMargin).attr("class","titleText");function $(y,T,p){const v=a.barHeight,g=v+a.barGap,b=a.topPadding,l=a.leftPadding,d=Ae().domain([0,F.length]).range(["#00B9FA","#F95002"]).interpolate(ge);et(g,b,l,T,p,y,n.db.getExcludes(),n.db.getIncludes()),st(l,b,T,p),tt(y,g,b,l,v,d,T),it(g,b),rt(l,b,T,p)}o($,"makeGantt");function tt(y,T,p,v,g,b,l){y.sort((c,e)=>c.vert===e.vert?0:c.vert?1:-1);const f=[...new Set(y.map(c=>c.order))].map(c=>y.find(e=>e.order===c));P.append("g").selectAll("rect").data(f).enter().append("rect").attr("x",0).attr("y",function(c,e){return e=c.order,e*T+p-2}).attr("width",function(){return l-a.rightPadding/2}).attr("height",T).attr("class",function(c){for(const[e,D]of F.entries())if(c.type===D)return"section section"+e%a.numberSectionStyles;return"section section0"}).enter();const u=P.append("g").selectAll("rect").data(y).enter(),k=n.db.getLinks();if(u.append("rect").attr("id",function(c){return c.id}).attr("rx",3).attr("ry",3).attr("x",function(c){return c.milestone?w(c.startTime)+v+.5*(w(c.endTime)-w(c.startTime))-.5*g:w(c.startTime)+v}).attr("y",function(c,e){return e=c.order,c.vert?a.gridLineStartPadding:e*T+p}).attr("width",function(c){return c.milestone?g:c.vert?.08*g:w(c.renderEndTime||c.endTime)-w(c.startTime)}).attr("height",function(c){return c.vert?E.length*(a.barHeight+a.barGap)+a.barHeight*2:g}).attr("transform-origin",function(c,e){return e=c.order,(w(c.startTime)+v+.5*(w(c.endTime)-w(c.startTime))).toString()+"px "+(e*T+p+.5*g).toString()+"px"}).attr("class",function(c){const e="task";let D="";c.classes.length>0&&(D=c.classes.join(" "));let x=0;for(const[A,C]of F.entries())c.type===C&&(x=A%a.numberSectionStyles);let _="";return c.active?c.crit?_+=" activeCrit":_=" active":c.done?c.crit?_=" doneCrit":_=" done":c.crit&&(_+=" crit"),_.length===0&&(_=" task"),c.milestone&&(_=" milestone "+_),c.vert&&(_=" vert "+_),_+=x,_+=" "+D,e+_}),u.append("text").attr("id",function(c){return c.id+"-text"}).text(function(c){return c.task}).attr("font-size",a.fontSize).attr("x",function(c){let e=w(c.startTime),D=w(c.renderEndTime||c.endTime);if(c.milestone&&(e+=.5*(w(c.endTime)-w(c.startTime))-.5*g,D=e+g),c.vert)return w(c.startTime)+v;const x=this.getBBox().width;return x>D-e?D+x+1.5*a.leftPadding>l?e+v-5:D+v+5:(D-e)/2+e+v}).attr("y",function(c,e){return c.vert?a.gridLineStartPadding+E.length*(a.barHeight+a.barGap)+60:(e=c.order,e*T+a.barHeight/2+(a.fontSize/2-2)+p)}).attr("text-height",g).attr("class",function(c){const e=w(c.startTime);let D=w(c.endTime);c.milestone&&(D=e+g);const x=this.getBBox().width;let _="";c.classes.length>0&&(_=c.classes.join(" "));let A=0;for(const[S,q]of F.entries())c.type===q&&(A=S%a.numberSectionStyles);let C="";return c.active&&(c.crit?C="activeCritText"+A:C="activeText"+A),c.done?c.crit?C=C+" doneCritText"+A:C=C+" doneText"+A:c.crit&&(C=C+" critText"+A),c.milestone&&(C+=" milestoneText"),c.vert&&(C+=" vertText"),x>D-e?D+x+1.5*a.leftPadding>l?_+" taskTextOutsideLeft taskTextOutside"+A+" "+C:_+" taskTextOutsideRight taskTextOutside"+A+" "+C+" width-"+x:_+" taskText taskText"+A+" "+C+" width-"+x}),K().securityLevel==="sandbox"){let c;c=dt("#i"+i);const e=c.nodes()[0].contentDocument;u.filter(function(D){return k.has(D.id)}).each(function(D){var x=e.querySelector("#"+D.id),_=e.querySelector("#"+D.id+"-text");const A=x.parentNode;var C=e.createElement("a");C.setAttribute("xlink:href",k.get(D.id)),C.setAttribute("target","_top"),A.appendChild(C),C.appendChild(x),C.appendChild(_)})}}o(tt,"drawRects");function et(y,T,p,v,g,b,l,d){if(l.length===0&&d.length===0)return;let f,u;for(const{startTime:x,endTime:_}of b)(f===void 0||x<f)&&(f=x),(u===void 0||_>u)&&(u=_);if(!f||!u)return;if(L(u).diff(L(f),"year")>5){kt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const k=n.db.getDateFormat(),s=[];let c=null,e=L(f);for(;e.valueOf()<=u;)n.db.isInvalidDate(e,k,l,d)?c?c.end=e:c={start:e,end:e}:c&&(s.push(c),c=null),e=e.add(1,"d");P.append("g").selectAll("rect").data(s).enter().append("rect").attr("id",x=>"exclude-"+x.start.format("YYYY-MM-DD")).attr("x",x=>w(x.start.startOf("day"))+p).attr("y",a.gridLineStartPadding).attr("width",x=>w(x.end.endOf("day"))-w(x.start.startOf("day"))).attr("height",g-T-a.gridLineStartPadding).attr("transform-origin",function(x,_){return(w(x.start)+p+.5*(w(x.end)-w(x.start))).toString()+"px "+(_*y+.5*g).toString()+"px"}).attr("class","exclude-range")}o(et,"drawExcludeDays");function st(y,T,p,v){const g=n.db.getDateFormat(),b=n.db.getAxisFormat();let l;b?l=b:g==="D"?l="%d":l=a.axisFormat??"%Y-%m-%d";let d=pe(w).tickSize(-v+T+a.gridLineStartPadding).tickFormat(Pt(l));const u=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(n.db.getTickInterval()||a.tickInterval);if(u!==null){const k=u[1],s=u[2],c=n.db.getWeekday()||a.weekday;switch(s){case"millisecond":d.ticks(qt.every(k));break;case"second":d.ticks(zt.every(k));break;case"minute":d.ticks(Bt.every(k));break;case"hour":d.ticks(Nt.every(k));break;case"day":d.ticks(Yt.every(k));break;case"week":d.ticks(Xt[c].every(k));break;case"month":d.ticks(Rt.every(k));break}}if(P.append("g").attr("class","grid").attr("transform","translate("+y+", "+(v-50)+")").call(d).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),n.db.topAxisEnabled()||a.topAxis){let k=Ce(w).tickSize(-v+T+a.gridLineStartPadding).tickFormat(Pt(l));if(u!==null){const s=u[1],c=u[2],e=n.db.getWeekday()||a.weekday;switch(c){case"millisecond":k.ticks(qt.every(s));break;case"second":k.ticks(zt.every(s));break;case"minute":k.ticks(Bt.every(s));break;case"hour":k.ticks(Nt.every(s));break;case"day":k.ticks(Yt.every(s));break;case"week":k.ticks(Xt[e].every(s));break;case"month":k.ticks(Rt.every(s));break}}P.append("g").attr("class","grid").attr("transform","translate("+y+", "+T+")").call(k).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}o(st,"makeGrid");function it(y,T){let p=0;const v=Object.keys(z).map(g=>[g,z[g]]);P.append("g").selectAll("text").data(v).enter().append(function(g){const b=g[0].split(ue.lineBreakRegex),l=-(b.length-1)/2,d=Y.createElementNS("http://www.w3.org/2000/svg","text");d.setAttribute("dy",l+"em");for(const[f,u]of b.entries()){const k=Y.createElementNS("http://www.w3.org/2000/svg","tspan");k.setAttribute("alignment-baseline","central"),k.setAttribute("x","10"),f>0&&k.setAttribute("dy","1em"),k.textContent=u,d.appendChild(k)}return d}).attr("x",10).attr("y",function(g,b){if(b>0)for(let l=0;l<b;l++)return p+=v[b-1][1],g[1]*y/2+p*y+T;else return g[1]*y/2+T}).attr("font-size",a.sectionFontSize).attr("class",function(g){for(const[b,l]of F.entries())if(g[0]===l)return"sectionTitle sectionTitle"+b%a.numberSectionStyles;return"sectionTitle"})}o(it,"vertLabels");function rt(y,T,p,v){const g=n.db.getTodayMarker();if(g==="off")return;const b=P.append("g").attr("class","today"),l=new Date,d=b.append("line");d.attr("x1",w(l)+y).attr("x2",w(l)+y).attr("y1",a.titleTopMargin).attr("y2",v-a.titleTopMargin).attr("class","today"),g!==""&&d.attr("style",g.replace(/,/g,";"))}o(rt,"drawToday");function at(y){const T={},p=[];for(let v=0,g=y.length;v<g;++v)Object.prototype.hasOwnProperty.call(T,y[v])||(T[y[v]]=!0,p.push(y[v]));return p}o(at,"checkUnique")},"draw"),gs={setConf:ks,draw:ys},ps=o(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),vs=ps,zs={parser:Fe,db:hs,renderer:gs,styles:vs};export{zs as diagram};
//# sourceMappingURL=ganttDiagram-LVOFAZNH-T77GIXxq.chunk.mjs.map
