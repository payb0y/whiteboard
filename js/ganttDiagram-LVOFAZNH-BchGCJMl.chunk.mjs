/*! third party licenses: js/vendor.LICENSE.txt */
import{w as le,a9 as de,B as ue,ac as he,x as fe,aa as ke,a as l,z as rt,n as me,p as H,V as bt,l as ye,t as pe,g as ge,aj as be}from"./NcSelect-Bz9Ii8rD.chunk.mjs";import{g as Mt}from"./vendor-D2kKKjiY.chunk.mjs";import{aG as yt}from"./isEmpty-nAvd3QfV.chunk.mjs";import{t as ve,d as xe,m as Te,i as we,a as _e,f as Vt,l as jt,o as De,n as $e,g as Se,p as Ce,r as Ee,q as Me,k as Ae,e as Ht,h as zt,j as Rt,s as Qt,c as Ut,b as Ye}from"./time-FYNKiD33.chunk.mjs";import{l as Le}from"./linear-DtbnwXc7.chunk.mjs";import"./whiteboard-main.mjs";import"./index-CG2lkMPF.chunk.mjs";import"./index-BB2Ykc4b.chunk.mjs";import"./index-BswEilqa.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./_plugin-vue2_normalizer-BXM20joE.chunk.mjs";import"./translation-DoG5ZELJ-BXUR7i66.chunk.mjs";import"./en-Y6Q6P44L-BJZKJ-lu.chunk.mjs";import"./useJwtStore-C5acJuD8.chunk.mjs";import"./NcTextField-DZHP0Dfw-B5z_Piv4.chunk.mjs";import"./NcCheckboxRadioSwitch-DJmw98x9-2_FYfQf1.chunk.mjs";import"./client-DIEYmXnD.chunk.mjs";import"./line-CEmbmVmL.chunk.mjs";import"./array-Cg_lHFoG.chunk.mjs";import"./path-i7Zvihw6.chunk.mjs";import"./init-q33yAy1W.chunk.mjs";import"./defaultLocale-Dcum9Md9.chunk.mjs";var wt={exports:{}},Ie=wt.exports,Xt;function We(){return Xt||(Xt=1,(function(e,n){(function(s,r){e.exports=r()})(Ie,(function(){var s="day";return function(r,i,u){var k=function($){return $.add(4-$.isoWeekday(),s)},D=i.prototype;D.isoWeekYear=function(){return k(this).year()},D.isoWeek=function($){if(!this.$utils().u($))return this.add(7*($-this.isoWeek()),s);var T,E,W,G,N=k(this),C=(T=this.isoWeekYear(),E=this.$u,W=(E?u.utc:u)().year(T).startOf("year"),G=4-W.isoWeekday(),W.isoWeekday()>4&&(G+=7),W.add(G,s));return N.diff(C,"week")+1},D.isoWeekday=function($){return this.$utils().u($)?this.day()||7:this.day(this.day()%7?$:$-7)};var Y=D.startOf;D.startOf=function($,T){var E=this.$utils(),W=!!E.u(T)||T;return E.p($)==="isoweek"?W?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):Y.bind(this)($,T)}}}))})(wt)),wt.exports}var Oe=We();const Fe=Mt(Oe);var _t={exports:{}},Pe=_t.exports,Zt;function Be(){return Zt||(Zt=1,(function(e,n){(function(s,r){e.exports=r()})(Pe,(function(){var s={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},r=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d/,u=/\d\d/,k=/\d\d?/,D=/\d*[^-_:/,()\s\d]+/,Y={},$=function(p){return(p=+p)+(p>68?1900:2e3)},T=function(p){return function(S){this[p]=+S}},E=[/[+-]\d\d:?(\d\d)?|Z/,function(p){(this.zone||(this.zone={})).offset=(function(S){if(!S||S==="Z")return 0;var M=S.match(/([+-]|\d\d)/g),A=60*M[1]+(+M[2]||0);return A===0?0:M[0]==="+"?-A:A})(p)}],W=function(p){var S=Y[p];return S&&(S.indexOf?S:S.s.concat(S.f))},G=function(p,S){var M,A=Y.meridiem;if(A){for(var V=1;V<=24;V+=1)if(p.indexOf(A(V,0,S))>-1){M=V>12;break}}else M=p===(S?"pm":"PM");return M},N={A:[D,function(p){this.afternoon=G(p,!1)}],a:[D,function(p){this.afternoon=G(p,!0)}],Q:[i,function(p){this.month=3*(p-1)+1}],S:[i,function(p){this.milliseconds=100*+p}],SS:[u,function(p){this.milliseconds=10*+p}],SSS:[/\d{3}/,function(p){this.milliseconds=+p}],s:[k,T("seconds")],ss:[k,T("seconds")],m:[k,T("minutes")],mm:[k,T("minutes")],H:[k,T("hours")],h:[k,T("hours")],HH:[k,T("hours")],hh:[k,T("hours")],D:[k,T("day")],DD:[u,T("day")],Do:[D,function(p){var S=Y.ordinal,M=p.match(/\d+/);if(this.day=M[0],S)for(var A=1;A<=31;A+=1)S(A).replace(/\[|\]/g,"")===p&&(this.day=A)}],w:[k,T("week")],ww:[u,T("week")],M:[k,T("month")],MM:[u,T("month")],MMM:[D,function(p){var S=W("months"),M=(W("monthsShort")||S.map((function(A){return A.slice(0,3)}))).indexOf(p)+1;if(M<1)throw new Error;this.month=M%12||M}],MMMM:[D,function(p){var S=W("months").indexOf(p)+1;if(S<1)throw new Error;this.month=S%12||S}],Y:[/[+-]?\d+/,T("year")],YY:[u,function(p){this.year=$(p)}],YYYY:[/\d{4}/,T("year")],Z:E,ZZ:E};function C(p){var S,M;S=p,M=Y&&Y.formats;for(var A=(p=S.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(x,b,y){var g=y&&y.toUpperCase();return b||M[y]||s[y]||M[g].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(o,d,c){return d||c.slice(1)}))}))).match(r),V=A.length,j=0;j<V;j+=1){var X=A[j],z=N[X],m=z&&z[0],v=z&&z[1];A[j]=v?{regex:m,parser:v}:X.replace(/^\[|\]$/g,"")}return function(x){for(var b={},y=0,g=0;y<V;y+=1){var o=A[y];if(typeof o=="string")g+=o.length;else{var d=o.regex,c=o.parser,f=x.slice(g),t=d.exec(f)[0];c.call(b,t),x=x.replace(t,"")}}return(function(h){var a=h.afternoon;if(a!==void 0){var _=h.hours;a?_<12&&(h.hours+=12):_===12&&(h.hours=0),delete h.afternoon}})(b),b}}return function(p,S,M){M.p.customParseFormat=!0,p&&p.parseTwoDigitYear&&($=p.parseTwoDigitYear);var A=S.prototype,V=A.parse;A.parse=function(j){var X=j.date,z=j.utc,m=j.args;this.$u=z;var v=m[1];if(typeof v=="string"){var x=m[2]===!0,b=m[3]===!0,y=x||b,g=m[2];b&&(g=m[2]),Y=this.$locale(),!x&&g&&(Y=M.Ls[g]),this.$d=(function(f,t,h,a){try{if(["x","X"].indexOf(t)>-1)return new Date((t==="X"?1e3:1)*f);var _=C(t)(f),w=_.year,I=_.month,L=_.day,ct=_.hours,O=_.minutes,K=_.seconds,lt=_.milliseconds,st=_.zone,kt=_.week,dt=new Date,nt=L||(w||I?1:dt.getDate()),P=w||dt.getFullYear(),U=0;w&&!I||(U=I>0?I-1:dt.getMonth());var B,et=ct||0,Z=O||0,tt=K||0,R=lt||0;return st?new Date(Date.UTC(P,U,nt,et,Z,tt,R+60*st.offset*1e3)):h?new Date(Date.UTC(P,U,nt,et,Z,tt,R)):(B=new Date(P,U,nt,et,Z,tt,R),kt&&(B=a(B).week(kt).toDate()),B)}catch{return new Date("")}})(X,v,z,M),this.init(),g&&g!==!0&&(this.$L=this.locale(g).$L),y&&X!=this.format(v)&&(this.$d=new Date("")),Y={}}else if(v instanceof Array)for(var o=v.length,d=1;d<=o;d+=1){m[1]=v[d-1];var c=M.apply(this,m);if(c.isValid()){this.$d=c.$d,this.$L=c.$L,this.init();break}d===o&&(this.$d=new Date(""))}else V.call(this,j)}}}))})(_t)),_t.exports}var Ne=Be();const Ge=Mt(Ne);var Dt={exports:{}},Ve=Dt.exports,qt;function je(){return qt||(qt=1,(function(e,n){(function(s,r){e.exports=r()})(Ve,(function(){return function(s,r){var i=r.prototype,u=i.format;i.format=function(k){var D=this,Y=this.$locale();if(!this.isValid())return u.bind(this)(k);var $=this.$utils(),T=(k||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(E){switch(E){case"Q":return Math.ceil((D.$M+1)/3);case"Do":return Y.ordinal(D.$D);case"gggg":return D.weekYear();case"GGGG":return D.isoWeekYear();case"wo":return Y.ordinal(D.week(),"W");case"w":case"ww":return $.s(D.week(),E==="w"?1:2,"0");case"W":case"WW":return $.s(D.isoWeek(),E==="W"?1:2,"0");case"k":case"kk":return $.s(String(D.$H===0?24:D.$H),E==="k"?1:2,"0");case"X":return Math.floor(D.$d.getTime()/1e3);case"x":return D.$d.getTime();case"z":return"["+D.offsetName()+"]";case"zzz":return"["+D.offsetName("long")+"]";default:return E}}));return u.bind(this)(T)}}}))})(Dt)),Dt.exports}var He=je();const ze=Mt(He);var $t=(function(){var e=l(function(g,o,d,c){for(d=d||{},c=g.length;c--;d[g[c]]=o);return d},"o"),n=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],s=[1,26],r=[1,27],i=[1,28],u=[1,29],k=[1,30],D=[1,31],Y=[1,32],$=[1,33],T=[1,34],E=[1,9],W=[1,10],G=[1,11],N=[1,12],C=[1,13],p=[1,14],S=[1,15],M=[1,16],A=[1,19],V=[1,20],j=[1,21],X=[1,22],z=[1,23],m=[1,25],v=[1,35],x={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:l(function(g,o,d,c,f,t,h){var a=t.length-1;switch(f){case 1:return t[a-1];case 2:this.$=[];break;case 3:t[a-1].push(t[a]),this.$=t[a-1];break;case 4:case 5:this.$=t[a];break;case 6:case 7:this.$=[];break;case 8:c.setWeekday("monday");break;case 9:c.setWeekday("tuesday");break;case 10:c.setWeekday("wednesday");break;case 11:c.setWeekday("thursday");break;case 12:c.setWeekday("friday");break;case 13:c.setWeekday("saturday");break;case 14:c.setWeekday("sunday");break;case 15:c.setWeekend("friday");break;case 16:c.setWeekend("saturday");break;case 17:c.setDateFormat(t[a].substr(11)),this.$=t[a].substr(11);break;case 18:c.enableInclusiveEndDates(),this.$=t[a].substr(18);break;case 19:c.TopAxis(),this.$=t[a].substr(8);break;case 20:c.setAxisFormat(t[a].substr(11)),this.$=t[a].substr(11);break;case 21:c.setTickInterval(t[a].substr(13)),this.$=t[a].substr(13);break;case 22:c.setExcludes(t[a].substr(9)),this.$=t[a].substr(9);break;case 23:c.setIncludes(t[a].substr(9)),this.$=t[a].substr(9);break;case 24:c.setTodayMarker(t[a].substr(12)),this.$=t[a].substr(12);break;case 27:c.setDiagramTitle(t[a].substr(6)),this.$=t[a].substr(6);break;case 28:this.$=t[a].trim(),c.setAccTitle(this.$);break;case 29:case 30:this.$=t[a].trim(),c.setAccDescription(this.$);break;case 31:c.addSection(t[a].substr(8)),this.$=t[a].substr(8);break;case 33:c.addTask(t[a-1],t[a]),this.$="task";break;case 34:this.$=t[a-1],c.setClickEvent(t[a-1],t[a],null);break;case 35:this.$=t[a-2],c.setClickEvent(t[a-2],t[a-1],t[a]);break;case 36:this.$=t[a-2],c.setClickEvent(t[a-2],t[a-1],null),c.setLink(t[a-2],t[a]);break;case 37:this.$=t[a-3],c.setClickEvent(t[a-3],t[a-2],t[a-1]),c.setLink(t[a-3],t[a]);break;case 38:this.$=t[a-2],c.setClickEvent(t[a-2],t[a],null),c.setLink(t[a-2],t[a-1]);break;case 39:this.$=t[a-3],c.setClickEvent(t[a-3],t[a-1],t[a]),c.setLink(t[a-3],t[a-2]);break;case 40:this.$=t[a-1],c.setLink(t[a-1],t[a]);break;case 41:case 47:this.$=t[a-1]+" "+t[a];break;case 42:case 43:case 45:this.$=t[a-2]+" "+t[a-1]+" "+t[a];break;case 44:case 46:this.$=t[a-3]+" "+t[a-2]+" "+t[a-1]+" "+t[a];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},e(n,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:s,13:r,14:i,15:u,16:k,17:D,18:Y,19:18,20:$,21:T,22:E,23:W,24:G,25:N,26:C,27:p,28:S,29:M,30:A,31:V,33:j,35:X,36:z,37:24,38:m,40:v},e(n,[2,7],{1:[2,1]}),e(n,[2,3]),{9:36,11:17,12:s,13:r,14:i,15:u,16:k,17:D,18:Y,19:18,20:$,21:T,22:E,23:W,24:G,25:N,26:C,27:p,28:S,29:M,30:A,31:V,33:j,35:X,36:z,37:24,38:m,40:v},e(n,[2,5]),e(n,[2,6]),e(n,[2,17]),e(n,[2,18]),e(n,[2,19]),e(n,[2,20]),e(n,[2,21]),e(n,[2,22]),e(n,[2,23]),e(n,[2,24]),e(n,[2,25]),e(n,[2,26]),e(n,[2,27]),{32:[1,37]},{34:[1,38]},e(n,[2,30]),e(n,[2,31]),e(n,[2,32]),{39:[1,39]},e(n,[2,8]),e(n,[2,9]),e(n,[2,10]),e(n,[2,11]),e(n,[2,12]),e(n,[2,13]),e(n,[2,14]),e(n,[2,15]),e(n,[2,16]),{41:[1,40],43:[1,41]},e(n,[2,4]),e(n,[2,28]),e(n,[2,29]),e(n,[2,33]),e(n,[2,34],{42:[1,42],43:[1,43]}),e(n,[2,40],{41:[1,44]}),e(n,[2,35],{43:[1,45]}),e(n,[2,36]),e(n,[2,38],{42:[1,46]}),e(n,[2,37]),e(n,[2,39])],defaultActions:{},parseError:l(function(g,o){if(o.recoverable)this.trace(g);else{var d=new Error(g);throw d.hash=o,d}},"parseError"),parse:l(function(g){var o=this,d=[0],c=[],f=[null],t=[],h=this.table,a="",_=0,w=0,I=2,L=1,ct=t.slice.call(arguments,1),O=Object.create(this.lexer),K={yy:{}};for(var lt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,lt)&&(K.yy[lt]=this.yy[lt]);O.setInput(g,K.yy),K.yy.lexer=O,K.yy.parser=this,typeof O.yylloc>"u"&&(O.yylloc={});var st=O.yylloc;t.push(st);var kt=O.options&&O.options.ranges;typeof K.yy.parseError=="function"?this.parseError=K.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function dt(Q){d.length=d.length-2*Q,f.length=f.length-Q,t.length=t.length-Q}l(dt,"popStack");function nt(){var Q;return Q=c.pop()||O.lex()||L,typeof Q!="number"&&(Q instanceof Array&&(c=Q,Q=c.pop()),Q=o.symbols_[Q]||Q),Q}l(nt,"lex");for(var P,U,B,et,Z={},tt,R,Gt,mt;;){if(U=d[d.length-1],this.defaultActions[U]?B=this.defaultActions[U]:((P===null||typeof P>"u")&&(P=nt()),B=h[U]&&h[U][P]),typeof B>"u"||!B.length||!B[0]){var Tt="";mt=[];for(tt in h[U])this.terminals_[tt]&&tt>I&&mt.push("'"+this.terminals_[tt]+"'");O.showPosition?Tt="Parse error on line "+(_+1)+`:
`+O.showPosition()+`
Expecting `+mt.join(", ")+", got '"+(this.terminals_[P]||P)+"'":Tt="Parse error on line "+(_+1)+": Unexpected "+(P==L?"end of input":"'"+(this.terminals_[P]||P)+"'"),this.parseError(Tt,{text:O.match,token:this.terminals_[P]||P,line:O.yylineno,loc:st,expected:mt})}if(B[0]instanceof Array&&B.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+P);switch(B[0]){case 1:d.push(P),f.push(O.yytext),t.push(O.yylloc),d.push(B[1]),P=null,w=O.yyleng,a=O.yytext,_=O.yylineno,st=O.yylloc;break;case 2:if(R=this.productions_[B[1]][1],Z.$=f[f.length-R],Z._$={first_line:t[t.length-(R||1)].first_line,last_line:t[t.length-1].last_line,first_column:t[t.length-(R||1)].first_column,last_column:t[t.length-1].last_column},kt&&(Z._$.range=[t[t.length-(R||1)].range[0],t[t.length-1].range[1]]),et=this.performAction.apply(Z,[a,w,_,K.yy,B[1],f,t].concat(ct)),typeof et<"u")return et;R&&(d=d.slice(0,-1*R*2),f=f.slice(0,-1*R),t=t.slice(0,-1*R)),d.push(this.productions_[B[1]][0]),f.push(Z.$),t.push(Z._$),Gt=h[d[d.length-2]][d[d.length-1]],d.push(Gt);break;case 3:return!0}}return!0},"parse")},b=(function(){var g={EOF:1,parseError:l(function(o,d){if(this.yy.parser)this.yy.parser.parseError(o,d);else throw new Error(o)},"parseError"),setInput:l(function(o,d){return this.yy=d||this.yy||{},this._input=o,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var o=this._input[0];this.yytext+=o,this.yyleng++,this.offset++,this.match+=o,this.matched+=o;var d=o.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),o},"input"),unput:l(function(o){var d=o.length,c=o.split(/(?:\r\n?|\n)/g);this._input=o+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var t=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===f.length?this.yylloc.first_column:0)+f[f.length-c.length].length-c[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[t[0],t[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(o){this.unput(this.match.slice(o))},"less"),pastInput:l(function(){var o=this.matched.substr(0,this.matched.length-this.match.length);return(o.length>20?"...":"")+o.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var o=this.match;return o.length<20&&(o+=this._input.substr(0,20-o.length)),(o.substr(0,20)+(o.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var o=this.pastInput(),d=new Array(o.length+1).join("-");return o+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:l(function(o,d){var c,f,t;if(this.options.backtrack_lexer&&(t={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(t.yylloc.range=this.yylloc.range.slice(0))),f=o[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+o[0].length},this.yytext+=o[0],this.match+=o[0],this.matches=o,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(o[0].length),this.matched+=o[0],c=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),c)return c;if(this._backtrack){for(var h in t)this[h]=t[h];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var o,d,c,f;this._more||(this.yytext="",this.match="");for(var t=this._currentRules(),h=0;h<t.length;h++)if(c=this._input.match(this.rules[t[h]]),c&&(!d||c[0].length>d[0].length)){if(d=c,f=h,this.options.backtrack_lexer){if(o=this.test_match(c,t[h]),o!==!1)return o;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(o=this.test_match(d,t[f]),o!==!1?o:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var o=this.next();return o||this.lex()},"lex"),begin:l(function(o){this.conditionStack.push(o)},"begin"),popState:l(function(){var o=this.conditionStack.length-1;return o>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(o){return o=this.conditionStack.length-1-Math.abs(o||0),o>=0?this.conditionStack[o]:"INITIAL"},"topState"),pushState:l(function(o){this.begin(o)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(o,d,c,f){switch(c){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return g})();x.lexer=b;function y(){this.yy={}}return l(y,"Parser"),y.prototype=x,x.Parser=y,new y})();$t.parser=$t;var Re=$t;H.extend(Fe),H.extend(Ge),H.extend(ze);var Kt={friday:5,saturday:6},q="",At="",Yt=void 0,Lt="",ut=[],ht=[],It=new Map,Wt=[],vt=[],ot="",Ot="",ee=["active","done","crit","milestone","vert"],Ft=[],ft=!1,Pt=!1,Bt="sunday",xt="saturday",St=0,Qe=l(function(){Wt=[],vt=[],ot="",Ft=[],pt=0,Et=void 0,gt=void 0,F=[],q="",At="",Ot="",Yt=void 0,Lt="",ut=[],ht=[],ft=!1,Pt=!1,St=0,It=new Map,ge(),Bt="sunday",xt="saturday"},"clear"),Ue=l(function(e){At=e},"setAxisFormat"),Xe=l(function(){return At},"getAxisFormat"),Ze=l(function(e){Yt=e},"setTickInterval"),qe=l(function(){return Yt},"getTickInterval"),Ke=l(function(e){Lt=e},"setTodayMarker"),Je=l(function(){return Lt},"getTodayMarker"),ti=l(function(e){q=e},"setDateFormat"),ei=l(function(){ft=!0},"enableInclusiveEndDates"),ii=l(function(){return ft},"endDatesAreInclusive"),si=l(function(){Pt=!0},"enableTopAxis"),ni=l(function(){return Pt},"topAxisEnabled"),ri=l(function(e){Ot=e},"setDisplayMode"),ai=l(function(){return Ot},"getDisplayMode"),oi=l(function(){return q},"getDateFormat"),ci=l(function(e){ut=e.toLowerCase().split(/[\s,]+/)},"setIncludes"),li=l(function(){return ut},"getIncludes"),di=l(function(e){ht=e.toLowerCase().split(/[\s,]+/)},"setExcludes"),ui=l(function(){return ht},"getExcludes"),hi=l(function(){return It},"getLinks"),fi=l(function(e){ot=e,Wt.push(e)},"addSection"),ki=l(function(){return Wt},"getSections"),mi=l(function(){let e=Jt();const n=10;let s=0;for(;!e&&s<n;)e=Jt(),s++;return vt=F,vt},"getTasks"),ie=l(function(e,n,s,r){const i=e.format(n.trim()),u=e.format("YYYY-MM-DD");return r.includes(i)||r.includes(u)?!1:s.includes("weekends")&&(e.isoWeekday()===Kt[xt]||e.isoWeekday()===Kt[xt]+1)||s.includes(e.format("dddd").toLowerCase())?!0:s.includes(i)||s.includes(u)},"isInvalidDate"),yi=l(function(e){Bt=e},"setWeekday"),pi=l(function(){return Bt},"getWeekday"),gi=l(function(e){xt=e},"setWeekend"),se=l(function(e,n,s,r){if(!s.length||e.manualEndTime)return;let i;e.startTime instanceof Date?i=H(e.startTime):i=H(e.startTime,n,!0),i=i.add(1,"d");let u;e.endTime instanceof Date?u=H(e.endTime):u=H(e.endTime,n,!0);const[k,D]=bi(i,u,n,s,r);e.endTime=k.toDate(),e.renderEndTime=D},"checkTaskDates"),bi=l(function(e,n,s,r,i){let u=!1,k=null;for(;e<=n;)u||(k=n.toDate()),u=ie(e,s,r,i),u&&(n=n.add(1,"d")),e=e.add(1,"d");return[n,k]},"fixTaskDates"),Ct=l(function(e,n,s){if(s=s.trim(),(n.trim()==="x"||n.trim()==="X")&&/^\d+$/.test(s))return new Date(Number(s));const r=/^after\s+(?<ids>[\d\w- ]+)/.exec(s);if(r!==null){let u=null;for(const D of r.groups.ids.split(" ")){let Y=it(D);Y!==void 0&&(!u||Y.endTime>u.endTime)&&(u=Y)}if(u)return u.endTime;const k=new Date;return k.setHours(0,0,0,0),k}let i=H(s,n.trim(),!0);if(i.isValid())return i.toDate();{bt.debug("Invalid date:"+s),bt.debug("With date format:"+n.trim());const u=new Date(s);if(u===void 0||isNaN(u.getTime())||u.getFullYear()<-1e4||u.getFullYear()>1e4)throw new Error("Invalid date:"+s);return u}},"getStartDate"),ne=l(function(e){const n=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(e.trim());return n!==null?[Number.parseFloat(n[1]),n[2]]:[NaN,"ms"]},"parseDuration"),re=l(function(e,n,s,r=!1){s=s.trim();const i=/^until\s+(?<ids>[\d\w- ]+)/.exec(s);if(i!==null){let $=null;for(const E of i.groups.ids.split(" ")){let W=it(E);W!==void 0&&(!$||W.startTime<$.startTime)&&($=W)}if($)return $.startTime;const T=new Date;return T.setHours(0,0,0,0),T}let u=H(s,n.trim(),!0);if(u.isValid())return r&&(u=u.add(1,"d")),u.toDate();let k=H(e);const[D,Y]=ne(s);if(!Number.isNaN(D)){const $=k.add(D,Y);$.isValid()&&(k=$)}return k.toDate()},"getEndDate"),pt=0,at=l(function(e){return e===void 0?(pt=pt+1,"task"+pt):e},"parseId"),vi=l(function(e,n){let s;n.substr(0,1)===":"?s=n.substr(1,n.length):s=n;const r=s.split(","),i={};Nt(r,i,ee);for(let k=0;k<r.length;k++)r[k]=r[k].trim();let u="";switch(r.length){case 1:i.id=at(),i.startTime=e.endTime,u=r[0];break;case 2:i.id=at(),i.startTime=Ct(void 0,q,r[0]),u=r[1];break;case 3:i.id=at(r[0]),i.startTime=Ct(void 0,q,r[1]),u=r[2];break}return u&&(i.endTime=re(i.startTime,q,u,ft),i.manualEndTime=H(u,"YYYY-MM-DD",!0).isValid(),se(i,q,ht,ut)),i},"compileData"),xi=l(function(e,n){let s;n.substr(0,1)===":"?s=n.substr(1,n.length):s=n;const r=s.split(","),i={};Nt(r,i,ee);for(let u=0;u<r.length;u++)r[u]=r[u].trim();switch(r.length){case 1:i.id=at(),i.startTime={type:"prevTaskEnd",id:e},i.endTime={data:r[0]};break;case 2:i.id=at(),i.startTime={type:"getStartDate",startData:r[0]},i.endTime={data:r[1]};break;case 3:i.id=at(r[0]),i.startTime={type:"getStartDate",startData:r[1]},i.endTime={data:r[2]};break}return i},"parseData"),Et,gt,F=[],ae={},Ti=l(function(e,n){const s={section:ot,type:ot,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:n},task:e,classes:[]},r=xi(gt,n);s.raw.startTime=r.startTime,s.raw.endTime=r.endTime,s.id=r.id,s.prevTaskId=gt,s.active=r.active,s.done=r.done,s.crit=r.crit,s.milestone=r.milestone,s.vert=r.vert,s.order=St,St++;const i=F.push(s);gt=s.id,ae[s.id]=i-1},"addTask"),it=l(function(e){const n=ae[e];return F[n]},"findTaskById"),wi=l(function(e,n){const s={section:ot,type:ot,description:e,task:e,classes:[]},r=vi(Et,n);s.startTime=r.startTime,s.endTime=r.endTime,s.id=r.id,s.active=r.active,s.done=r.done,s.crit=r.crit,s.milestone=r.milestone,s.vert=r.vert,Et=s,vt.push(s)},"addTaskOrg"),Jt=l(function(){const e=l(function(s){const r=F[s];let i="";switch(F[s].raw.startTime.type){case"prevTaskEnd":{const u=it(r.prevTaskId);r.startTime=u.endTime;break}case"getStartDate":i=Ct(void 0,q,F[s].raw.startTime.startData),i&&(F[s].startTime=i);break}return F[s].startTime&&(F[s].endTime=re(F[s].startTime,q,F[s].raw.endTime.data,ft),F[s].endTime&&(F[s].processed=!0,F[s].manualEndTime=H(F[s].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),se(F[s],q,ht,ut))),F[s].processed},"compileTask");let n=!0;for(const[s,r]of F.entries())e(s),n=n&&r.processed;return n},"compileTasks"),_i=l(function(e,n){let s=n;rt().securityLevel!=="loose"&&(s=pe.sanitizeUrl(n)),e.split(",").forEach(function(r){it(r)!==void 0&&(ce(r,()=>{window.open(s,"_self")}),It.set(r,s))}),oe(e,"clickable")},"setLink"),oe=l(function(e,n){e.split(",").forEach(function(s){let r=it(s);r!==void 0&&r.classes.push(n)})},"setClass"),Di=l(function(e,n,s){if(rt().securityLevel!=="loose"||n===void 0)return;let r=[];if(typeof s=="string"){r=s.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let i=0;i<r.length;i++){let u=r[i].trim();u.startsWith('"')&&u.endsWith('"')&&(u=u.substr(1,u.length-2)),r[i]=u}}r.length===0&&r.push(e),it(e)!==void 0&&ce(e,()=>{be.runFunc(n,...r)})},"setClickFun"),ce=l(function(e,n){Ft.push(function(){const s=document.querySelector(`[id="${e}"]`);s!==null&&s.addEventListener("click",function(){n()})},function(){const s=document.querySelector(`[id="${e}-text"]`);s!==null&&s.addEventListener("click",function(){n()})})},"pushFun"),$i=l(function(e,n,s){e.split(",").forEach(function(r){Di(r,n,s)}),oe(e,"clickable")},"setClickEvent"),Si=l(function(e){Ft.forEach(function(n){n(e)})},"bindFunctions"),Ci={getConfig:l(()=>rt().gantt,"getConfig"),clear:Qe,setDateFormat:ti,getDateFormat:oi,enableInclusiveEndDates:ei,endDatesAreInclusive:ii,enableTopAxis:si,topAxisEnabled:ni,setAxisFormat:Ue,getAxisFormat:Xe,setTickInterval:Ze,getTickInterval:qe,setTodayMarker:Ke,getTodayMarker:Je,setAccTitle:ke,getAccTitle:fe,setDiagramTitle:he,getDiagramTitle:ue,setDisplayMode:ri,getDisplayMode:ai,setAccDescription:de,getAccDescription:le,addSection:fi,getSections:ki,getTasks:mi,addTask:Ti,findTaskById:it,addTaskOrg:wi,setIncludes:ci,getIncludes:li,setExcludes:di,getExcludes:ui,setClickEvent:$i,setLink:_i,getLinks:hi,bindFunctions:Si,parseDuration:ne,isInvalidDate:ie,setWeekday:yi,getWeekday:pi,setWeekend:gi};function Nt(e,n,s){let r=!0;for(;r;)r=!1,s.forEach(function(i){const u="^\\s*"+i+"\\s*$",k=new RegExp(u);e[0].match(k)&&(n[i]=!0,e.shift(1),r=!0)})}l(Nt,"getTaskTags");var Ei=l(function(){bt.debug("Something is calling, setConf, remove the call")},"setConf"),te={monday:Ae,tuesday:Me,wednesday:Ee,thursday:Ce,friday:Se,saturday:$e,sunday:De},Mi=l((e,n)=>{let s=[...e].map(()=>-1/0),r=[...e].sort((u,k)=>u.startTime-k.startTime||u.order-k.order),i=0;for(const u of r)for(let k=0;k<s.length;k++)if(u.startTime>=s[k]){s[k]=u.endTime,u.order=k+n,k>i&&(i=k);break}return i},"getMaxIntersections"),J,Ai=l(function(e,n,s,r){const i=rt().gantt,u=rt().securityLevel;let k;u==="sandbox"&&(k=yt("#i"+n));const D=u==="sandbox"?yt(k.nodes()[0].contentDocument.body):yt("body"),Y=u==="sandbox"?k.nodes()[0].contentDocument:document,$=Y.getElementById(n);J=$.parentElement.offsetWidth,J===void 0&&(J=1200),i.useWidth!==void 0&&(J=i.useWidth);const T=r.db.getTasks();let E=[];for(const m of T)E.push(m.type);E=z(E);const W={};let G=2*i.topPadding;if(r.db.getDisplayMode()==="compact"||i.displayMode==="compact"){const m={};for(const x of T)m[x.section]===void 0?m[x.section]=[x]:m[x.section].push(x);let v=0;for(const x of Object.keys(m)){const b=Mi(m[x],v)+1;v+=b,G+=b*(i.barHeight+i.barGap),W[x]=b}}else{G+=T.length*(i.barHeight+i.barGap);for(const m of E)W[m]=T.filter(v=>v.type===m).length}$.setAttribute("viewBox","0 0 "+J+" "+G);const N=D.select(`[id="${n}"]`),C=ve().domain([xe(T,function(m){return m.startTime}),Te(T,function(m){return m.endTime})]).rangeRound([0,J-i.leftPadding-i.rightPadding]);function p(m,v){const x=m.startTime,b=v.startTime;let y=0;return x>b?y=1:x<b&&(y=-1),y}l(p,"taskCompare"),T.sort(p),S(T,J,G),me(N,G,J,i.useMaxWidth),N.append("text").text(r.db.getDiagramTitle()).attr("x",J/2).attr("y",i.titleTopMargin).attr("class","titleText");function S(m,v,x){const b=i.barHeight,y=b+i.barGap,g=i.topPadding,o=i.leftPadding,d=Le().domain([0,E.length]).range(["#00B9FA","#F95002"]).interpolate(we);A(y,g,o,v,x,m,r.db.getExcludes(),r.db.getIncludes()),V(o,g,v,x),M(m,y,g,o,b,d,v),j(y,g),X(o,g,v,x)}l(S,"makeGantt");function M(m,v,x,b,y,g,o){m.sort((t,h)=>t.vert===h.vert?0:t.vert?1:-1);const d=[...new Set(m.map(t=>t.order))].map(t=>m.find(h=>h.order===t));N.append("g").selectAll("rect").data(d).enter().append("rect").attr("x",0).attr("y",function(t,h){return h=t.order,h*v+x-2}).attr("width",function(){return o-i.rightPadding/2}).attr("height",v).attr("class",function(t){for(const[h,a]of E.entries())if(t.type===a)return"section section"+h%i.numberSectionStyles;return"section section0"}).enter();const c=N.append("g").selectAll("rect").data(m).enter(),f=r.db.getLinks();if(c.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?C(t.startTime)+b+.5*(C(t.endTime)-C(t.startTime))-.5*y:C(t.startTime)+b}).attr("y",function(t,h){return h=t.order,t.vert?i.gridLineStartPadding:h*v+x}).attr("width",function(t){return t.milestone?y:t.vert?.08*y:C(t.renderEndTime||t.endTime)-C(t.startTime)}).attr("height",function(t){return t.vert?T.length*(i.barHeight+i.barGap)+i.barHeight*2:y}).attr("transform-origin",function(t,h){return h=t.order,(C(t.startTime)+b+.5*(C(t.endTime)-C(t.startTime))).toString()+"px "+(h*v+x+.5*y).toString()+"px"}).attr("class",function(t){const h="task";let a="";t.classes.length>0&&(a=t.classes.join(" "));let _=0;for(const[I,L]of E.entries())t.type===L&&(_=I%i.numberSectionStyles);let w="";return t.active?t.crit?w+=" activeCrit":w=" active":t.done?t.crit?w=" doneCrit":w=" done":t.crit&&(w+=" crit"),w.length===0&&(w=" task"),t.milestone&&(w=" milestone "+w),t.vert&&(w=" vert "+w),w+=_,w+=" "+a,h+w}),c.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",i.fontSize).attr("x",function(t){let h=C(t.startTime),a=C(t.renderEndTime||t.endTime);if(t.milestone&&(h+=.5*(C(t.endTime)-C(t.startTime))-.5*y,a=h+y),t.vert)return C(t.startTime)+b;const _=this.getBBox().width;return _>a-h?a+_+1.5*i.leftPadding>o?h+b-5:a+b+5:(a-h)/2+h+b}).attr("y",function(t,h){return t.vert?i.gridLineStartPadding+T.length*(i.barHeight+i.barGap)+60:(h=t.order,h*v+i.barHeight/2+(i.fontSize/2-2)+x)}).attr("text-height",y).attr("class",function(t){const h=C(t.startTime);let a=C(t.endTime);t.milestone&&(a=h+y);const _=this.getBBox().width;let w="";t.classes.length>0&&(w=t.classes.join(" "));let I=0;for(const[ct,O]of E.entries())t.type===O&&(I=ct%i.numberSectionStyles);let L="";return t.active&&(t.crit?L="activeCritText"+I:L="activeText"+I),t.done?t.crit?L=L+" doneCritText"+I:L=L+" doneText"+I:t.crit&&(L=L+" critText"+I),t.milestone&&(L+=" milestoneText"),t.vert&&(L+=" vertText"),_>a-h?a+_+1.5*i.leftPadding>o?w+" taskTextOutsideLeft taskTextOutside"+I+" "+L:w+" taskTextOutsideRight taskTextOutside"+I+" "+L+" width-"+_:w+" taskText taskText"+I+" "+L+" width-"+_}),rt().securityLevel==="sandbox"){let t;t=yt("#i"+n);const h=t.nodes()[0].contentDocument;c.filter(function(a){return f.has(a.id)}).each(function(a){var _=h.querySelector("#"+a.id),w=h.querySelector("#"+a.id+"-text");const I=_.parentNode;var L=h.createElement("a");L.setAttribute("xlink:href",f.get(a.id)),L.setAttribute("target","_top"),I.appendChild(L),L.appendChild(_),L.appendChild(w)})}}l(M,"drawRects");function A(m,v,x,b,y,g,o,d){if(o.length===0&&d.length===0)return;let c,f;for(const{startTime:w,endTime:I}of g)(c===void 0||w<c)&&(c=w),(f===void 0||I>f)&&(f=I);if(!c||!f)return;if(H(f).diff(H(c),"year")>5){bt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const t=r.db.getDateFormat(),h=[];let a=null,_=H(c);for(;_.valueOf()<=f;)r.db.isInvalidDate(_,t,o,d)?a?a.end=_:a={start:_,end:_}:a&&(h.push(a),a=null),_=_.add(1,"d");N.append("g").selectAll("rect").data(h).enter().append("rect").attr("id",w=>"exclude-"+w.start.format("YYYY-MM-DD")).attr("x",w=>C(w.start.startOf("day"))+x).attr("y",i.gridLineStartPadding).attr("width",w=>C(w.end.endOf("day"))-C(w.start.startOf("day"))).attr("height",y-v-i.gridLineStartPadding).attr("transform-origin",function(w,I){return(C(w.start)+x+.5*(C(w.end)-C(w.start))).toString()+"px "+(I*m+.5*y).toString()+"px"}).attr("class","exclude-range")}l(A,"drawExcludeDays");function V(m,v,x,b){const y=r.db.getDateFormat(),g=r.db.getAxisFormat();let o;g?o=g:y==="D"?o="%d":o=i.axisFormat??"%Y-%m-%d";let d=_e(C).tickSize(-b+v+i.gridLineStartPadding).tickFormat(Vt(o));const c=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||i.tickInterval);if(c!==null){const f=c[1],t=c[2],h=r.db.getWeekday()||i.weekday;switch(t){case"millisecond":d.ticks(Ut.every(f));break;case"second":d.ticks(Qt.every(f));break;case"minute":d.ticks(Rt.every(f));break;case"hour":d.ticks(zt.every(f));break;case"day":d.ticks(Ht.every(f));break;case"week":d.ticks(te[h].every(f));break;case"month":d.ticks(jt.every(f));break}}if(N.append("g").attr("class","grid").attr("transform","translate("+m+", "+(b-50)+")").call(d).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||i.topAxis){let f=Ye(C).tickSize(-b+v+i.gridLineStartPadding).tickFormat(Vt(o));if(c!==null){const t=c[1],h=c[2],a=r.db.getWeekday()||i.weekday;switch(h){case"millisecond":f.ticks(Ut.every(t));break;case"second":f.ticks(Qt.every(t));break;case"minute":f.ticks(Rt.every(t));break;case"hour":f.ticks(zt.every(t));break;case"day":f.ticks(Ht.every(t));break;case"week":f.ticks(te[a].every(t));break;case"month":f.ticks(jt.every(t));break}}N.append("g").attr("class","grid").attr("transform","translate("+m+", "+v+")").call(f).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(V,"makeGrid");function j(m,v){let x=0;const b=Object.keys(W).map(y=>[y,W[y]]);N.append("g").selectAll("text").data(b).enter().append(function(y){const g=y[0].split(ye.lineBreakRegex),o=-(g.length-1)/2,d=Y.createElementNS("http://www.w3.org/2000/svg","text");d.setAttribute("dy",o+"em");for(const[c,f]of g.entries()){const t=Y.createElementNS("http://www.w3.org/2000/svg","tspan");t.setAttribute("alignment-baseline","central"),t.setAttribute("x","10"),c>0&&t.setAttribute("dy","1em"),t.textContent=f,d.appendChild(t)}return d}).attr("x",10).attr("y",function(y,g){if(g>0)for(let o=0;o<g;o++)return x+=b[g-1][1],y[1]*m/2+x*m+v;else return y[1]*m/2+v}).attr("font-size",i.sectionFontSize).attr("class",function(y){for(const[g,o]of E.entries())if(y[0]===o)return"sectionTitle sectionTitle"+g%i.numberSectionStyles;return"sectionTitle"})}l(j,"vertLabels");function X(m,v,x,b){const y=r.db.getTodayMarker();if(y==="off")return;const g=N.append("g").attr("class","today"),o=new Date,d=g.append("line");d.attr("x1",C(o)+m).attr("x2",C(o)+m).attr("y1",i.titleTopMargin).attr("y2",b-i.titleTopMargin).attr("class","today"),y!==""&&d.attr("style",y.replace(/,/g,";"))}l(X,"drawToday");function z(m){const v={},x=[];for(let b=0,y=m.length;b<y;++b)Object.prototype.hasOwnProperty.call(v,m[b])||(v[m[b]]=!0,x.push(m[b]));return x}l(z,"checkUnique")},"draw"),Yi={setConf:Ei,draw:Ai},Li=l(e=>`
  .mermaid-main-font {
        font-family: ${e.fontFamily};
  }

  .exclude-range {
    fill: ${e.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${e.sectionBkgColor};
  }

  .section2 {
    fill: ${e.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${e.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${e.titleColor};
  }

  .sectionTitle1 {
    fill: ${e.titleColor};
  }

  .sectionTitle2 {
    fill: ${e.titleColor};
  }

  .sectionTitle3 {
    fill: ${e.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${e.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${e.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${e.fontFamily};
    fill: ${e.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${e.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${e.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${e.taskTextDarkColor};
    text-anchor: start;
    font-family: ${e.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${e.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${e.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${e.taskBkgColor};
    stroke: ${e.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${e.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${e.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${e.activeTaskBkgColor};
    stroke: ${e.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${e.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${e.doneTaskBorderColor};
    fill: ${e.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${e.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.doneTaskBkgColor};
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
    fill: ${e.taskTextDarkColor} !important;
  }

  .vert {
    stroke: ${e.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${e.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${e.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.titleColor||e.textColor};
    font-family: ${e.fontFamily};
  }
`,"getStyles"),Ii=Li,ss={parser:Re,db:Ci,renderer:Yi,styles:Ii};export{ss as diagram};
//# sourceMappingURL=ganttDiagram-LVOFAZNH-BchGCJMl.chunk.mjs.map
