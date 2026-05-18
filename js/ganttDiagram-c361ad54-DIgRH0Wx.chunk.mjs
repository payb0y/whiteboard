/*! third party licenses: js/vendor.LICENSE.txt */
import{q as se,I as ne,u as re,L as ae,r as oe,J as ce,s as rt,i as le,j as V,B as kt,g as de,n as ue,f as he,O as fe}from"./index-DEkWJmOz.chunk.mjs";import{g as $t}from"./vendor-D2kKKjiY.chunk.mjs";import{aG as ft}from"./isEmpty-nAvd3QfV.chunk.mjs";import{t as ye,d as me,m as ke,i as pe,a as ge,f as Ft,l as Wt,o as be,n as xe,g as ve,p as Te,r as we,q as _e,k as De,e as Pt,h as Bt,j as Vt,s as Rt,c as zt,b as $e}from"./time-FYNKiD33.chunk.mjs";import{l as Ce}from"./linear-DtbnwXc7.chunk.mjs";import"./whiteboard-main.mjs";import"./index-CG2lkMPF.chunk.mjs";import"./index-vg7q3Iku.chunk.mjs";import"./init-q33yAy1W.chunk.mjs";import"./defaultLocale-Dcum9Md9.chunk.mjs";var bt={exports:{}},Se=bt.exports,Zt;function Ee(){return Zt||(Zt=1,(function(t,r){(function(n,a){t.exports=a()})(Se,(function(){var n="day";return function(a,o,d){var h=function(D){return D.add(4-D.isoWeekday(),n)},T=o.prototype;T.isoWeekYear=function(){return h(this).year()},T.isoWeek=function(D){if(!this.$utils().u(D))return this.add(7*(D-this.isoWeek()),n);var x,E,I,B,W=h(this),S=(x=this.isoWeekYear(),E=this.$u,I=(E?d.utc:d)().year(x).startOf("year"),B=4-I.isoWeekday(),I.isoWeekday()>4&&(B+=7),I.add(B,n));return W.diff(S,"week")+1},T.isoWeekday=function(D){return this.$utils().u(D)?this.day()||7:this.day(this.day()%7?D:D-7)};var Y=T.startOf;T.startOf=function(D,x){var E=this.$utils(),I=!!E.u(x)||x;return E.p(D)==="isoweek"?I?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):Y.bind(this)(D,x)}}}))})(bt)),bt.exports}var Me=Ee();const Ae=$t(Me);var xt={exports:{}},Ye=xt.exports,Gt;function Le(){return Gt||(Gt=1,(function(t,r){(function(n,a){t.exports=a()})(Ye,(function(){var n={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},a=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,o=/\d/,d=/\d\d/,h=/\d\d?/,T=/\d*[^-_:/,()\s\d]+/,Y={},D=function(k){return(k=+k)+(k>68?1900:2e3)},x=function(k){return function($){this[k]=+$}},E=[/[+-]\d\d:?(\d\d)?|Z/,function(k){(this.zone||(this.zone={})).offset=(function($){if(!$||$==="Z")return 0;var M=$.match(/([+-]|\d\d)/g),L=60*M[1]+(+M[2]||0);return L===0?0:M[0]==="+"?-L:L})(k)}],I=function(k){var $=Y[k];return $&&($.indexOf?$:$.s.concat($.f))},B=function(k,$){var M,L=Y.meridiem;if(L){for(var R=1;R<=24;R+=1)if(k.indexOf(L(R,0,$))>-1){M=R>12;break}}else M=k===($?"pm":"PM");return M},W={A:[T,function(k){this.afternoon=B(k,!1)}],a:[T,function(k){this.afternoon=B(k,!0)}],Q:[o,function(k){this.month=3*(k-1)+1}],S:[o,function(k){this.milliseconds=100*+k}],SS:[d,function(k){this.milliseconds=10*+k}],SSS:[/\d{3}/,function(k){this.milliseconds=+k}],s:[h,x("seconds")],ss:[h,x("seconds")],m:[h,x("minutes")],mm:[h,x("minutes")],H:[h,x("hours")],h:[h,x("hours")],HH:[h,x("hours")],hh:[h,x("hours")],D:[h,x("day")],DD:[d,x("day")],Do:[T,function(k){var $=Y.ordinal,M=k.match(/\d+/);if(this.day=M[0],$)for(var L=1;L<=31;L+=1)$(L).replace(/\[|\]/g,"")===k&&(this.day=L)}],w:[h,x("week")],ww:[d,x("week")],M:[h,x("month")],MM:[d,x("month")],MMM:[T,function(k){var $=I("months"),M=(I("monthsShort")||$.map((function(L){return L.slice(0,3)}))).indexOf(k)+1;if(M<1)throw new Error;this.month=M%12||M}],MMMM:[T,function(k){var $=I("months").indexOf(k)+1;if($<1)throw new Error;this.month=$%12||$}],Y:[/[+-]?\d+/,x("year")],YY:[d,function(k){this.year=D(k)}],YYYY:[/\d{4}/,x("year")],Z:E,ZZ:E};function S(k){var $,M;$=k,M=Y&&Y.formats;for(var L=(k=$.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(p,y,s){var l=s&&s.toUpperCase();return y||M[s]||n[s]||M[l].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(c,u,i){return u||i.slice(1)}))}))).match(a),R=L.length,z=0;z<R;z+=1){var H=L[z],G=W[H],f=G&&G[0],g=G&&G[1];L[z]=g?{regex:f,parser:g}:H.replace(/^\[|\]$/g,"")}return function(p){for(var y={},s=0,l=0;s<R;s+=1){var c=L[s];if(typeof c=="string")l+=c.length;else{var u=c.regex,i=c.parser,C=p.slice(l),e=u.exec(C)[0];i.call(y,e),p=p.replace(e,"")}}return(function(m){var _=m.afternoon;if(_!==void 0){var w=m.hours;_?w<12&&(m.hours+=12):w===12&&(m.hours=0),delete m.afternoon}})(y),y}}return function(k,$,M){M.p.customParseFormat=!0,k&&k.parseTwoDigitYear&&(D=k.parseTwoDigitYear);var L=$.prototype,R=L.parse;L.parse=function(z){var H=z.date,G=z.utc,f=z.args;this.$u=G;var g=f[1];if(typeof g=="string"){var p=f[2]===!0,y=f[3]===!0,s=p||y,l=f[2];y&&(l=f[2]),Y=this.$locale(),!p&&l&&(Y=M.Ls[l]),this.$d=(function(C,e,m,_){try{if(["x","X"].indexOf(e)>-1)return new Date((e==="X"?1e3:1)*C);var w=S(e)(C),v=w.year,A=w.month,b=w.day,N=w.hours,tt=w.minutes,ct=w.seconds,gt=w.milliseconds,ht=w.zone,F=w.week,j=new Date,P=b||(v||A?1:j.getDate()),et=v||j.getFullYear(),q=0;v&&!A||(q=A>0?A-1:j.getMonth());var X,Z=N||0,nt=tt||0,U=ct||0,it=gt||0;return ht?new Date(Date.UTC(et,q,P,Z,nt,U,it+60*ht.offset*1e3)):m?new Date(Date.UTC(et,q,P,Z,nt,U,it)):(X=new Date(et,q,P,Z,nt,U,it),F&&(X=_(X).week(F).toDate()),X)}catch{return new Date("")}})(H,g,G,M),this.init(),l&&l!==!0&&(this.$L=this.locale(l).$L),s&&H!=this.format(g)&&(this.$d=new Date("")),Y={}}else if(g instanceof Array)for(var c=g.length,u=1;u<=c;u+=1){f[1]=g[u-1];var i=M.apply(this,f);if(i.isValid()){this.$d=i.$d,this.$L=i.$L,this.init();break}u===c&&(this.$d=new Date(""))}else R.call(this,z)}}}))})(xt)),xt.exports}var Ie=Le();const Oe=$t(Ie);var vt={exports:{}},Fe=vt.exports,Nt;function We(){return Nt||(Nt=1,(function(t,r){(function(n,a){t.exports=a()})(Fe,(function(){return function(n,a){var o=a.prototype,d=o.format;o.format=function(h){var T=this,Y=this.$locale();if(!this.isValid())return d.bind(this)(h);var D=this.$utils(),x=(h||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(E){switch(E){case"Q":return Math.ceil((T.$M+1)/3);case"Do":return Y.ordinal(T.$D);case"gggg":return T.weekYear();case"GGGG":return T.isoWeekYear();case"wo":return Y.ordinal(T.week(),"W");case"w":case"ww":return D.s(T.week(),E==="w"?1:2,"0");case"W":case"WW":return D.s(T.isoWeek(),E==="W"?1:2,"0");case"k":case"kk":return D.s(String(T.$H===0?24:T.$H),E==="k"?1:2,"0");case"X":return Math.floor(T.$d.getTime()/1e3);case"x":return T.$d.getTime();case"z":return"["+T.offsetName()+"]";case"zzz":return"["+T.offsetName("long")+"]";default:return E}}));return d.bind(this)(x)}}}))})(vt)),vt.exports}var Pe=We();const Be=$t(Pe);var Tt=(function(){var t=function(y,s,l,c){for(l=l||{},c=y.length;c--;l[y[c]]=s);return l},r=[6,8,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,32,33,35,37],n=[1,25],a=[1,26],o=[1,27],d=[1,28],h=[1,29],T=[1,30],Y=[1,31],D=[1,9],x=[1,10],E=[1,11],I=[1,12],B=[1,13],W=[1,14],S=[1,15],k=[1,16],$=[1,18],M=[1,19],L=[1,20],R=[1,21],z=[1,22],H=[1,24],G=[1,32],f={trace:function(){},yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,dateFormat:19,inclusiveEndDates:20,topAxis:21,axisFormat:22,tickInterval:23,excludes:24,includes:25,todayMarker:26,title:27,acc_title:28,acc_title_value:29,acc_descr:30,acc_descr_value:31,acc_descr_multiline_value:32,section:33,clickStatement:34,taskTxt:35,taskData:36,click:37,callbackname:38,callbackargs:39,href:40,clickStatementDebug:41,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",19:"dateFormat",20:"inclusiveEndDates",21:"topAxis",22:"axisFormat",23:"tickInterval",24:"excludes",25:"includes",26:"todayMarker",27:"title",28:"acc_title",29:"acc_title_value",30:"acc_descr",31:"acc_descr_value",32:"acc_descr_multiline_value",33:"section",35:"taskTxt",36:"taskData",37:"click",38:"callbackname",39:"callbackargs",40:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[34,2],[34,3],[34,3],[34,4],[34,3],[34,4],[34,2],[41,2],[41,3],[41,3],[41,4],[41,3],[41,4],[41,2]],performAction:function(y,s,l,c,u,i,C){var e=i.length-1;switch(u){case 1:return i[e-1];case 2:this.$=[];break;case 3:i[e-1].push(i[e]),this.$=i[e-1];break;case 4:case 5:this.$=i[e];break;case 6:case 7:this.$=[];break;case 8:c.setWeekday("monday");break;case 9:c.setWeekday("tuesday");break;case 10:c.setWeekday("wednesday");break;case 11:c.setWeekday("thursday");break;case 12:c.setWeekday("friday");break;case 13:c.setWeekday("saturday");break;case 14:c.setWeekday("sunday");break;case 15:c.setDateFormat(i[e].substr(11)),this.$=i[e].substr(11);break;case 16:c.enableInclusiveEndDates(),this.$=i[e].substr(18);break;case 17:c.TopAxis(),this.$=i[e].substr(8);break;case 18:c.setAxisFormat(i[e].substr(11)),this.$=i[e].substr(11);break;case 19:c.setTickInterval(i[e].substr(13)),this.$=i[e].substr(13);break;case 20:c.setExcludes(i[e].substr(9)),this.$=i[e].substr(9);break;case 21:c.setIncludes(i[e].substr(9)),this.$=i[e].substr(9);break;case 22:c.setTodayMarker(i[e].substr(12)),this.$=i[e].substr(12);break;case 24:c.setDiagramTitle(i[e].substr(6)),this.$=i[e].substr(6);break;case 25:this.$=i[e].trim(),c.setAccTitle(this.$);break;case 26:case 27:this.$=i[e].trim(),c.setAccDescription(this.$);break;case 28:c.addSection(i[e].substr(8)),this.$=i[e].substr(8);break;case 30:c.addTask(i[e-1],i[e]),this.$="task";break;case 31:this.$=i[e-1],c.setClickEvent(i[e-1],i[e],null);break;case 32:this.$=i[e-2],c.setClickEvent(i[e-2],i[e-1],i[e]);break;case 33:this.$=i[e-2],c.setClickEvent(i[e-2],i[e-1],null),c.setLink(i[e-2],i[e]);break;case 34:this.$=i[e-3],c.setClickEvent(i[e-3],i[e-2],i[e-1]),c.setLink(i[e-3],i[e]);break;case 35:this.$=i[e-2],c.setClickEvent(i[e-2],i[e],null),c.setLink(i[e-2],i[e-1]);break;case 36:this.$=i[e-3],c.setClickEvent(i[e-3],i[e-1],i[e]),c.setLink(i[e-3],i[e-2]);break;case 37:this.$=i[e-1],c.setLink(i[e-1],i[e]);break;case 38:case 44:this.$=i[e-1]+" "+i[e];break;case 39:case 40:case 42:this.$=i[e-2]+" "+i[e-1]+" "+i[e];break;case 41:case 43:this.$=i[e-3]+" "+i[e-2]+" "+i[e-1]+" "+i[e];break}},table:[{3:1,4:[1,2]},{1:[3]},t(r,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:n,13:a,14:o,15:d,16:h,17:T,18:Y,19:D,20:x,21:E,22:I,23:B,24:W,25:S,26:k,27:$,28:M,30:L,32:R,33:z,34:23,35:H,37:G},t(r,[2,7],{1:[2,1]}),t(r,[2,3]),{9:33,11:17,12:n,13:a,14:o,15:d,16:h,17:T,18:Y,19:D,20:x,21:E,22:I,23:B,24:W,25:S,26:k,27:$,28:M,30:L,32:R,33:z,34:23,35:H,37:G},t(r,[2,5]),t(r,[2,6]),t(r,[2,15]),t(r,[2,16]),t(r,[2,17]),t(r,[2,18]),t(r,[2,19]),t(r,[2,20]),t(r,[2,21]),t(r,[2,22]),t(r,[2,23]),t(r,[2,24]),{29:[1,34]},{31:[1,35]},t(r,[2,27]),t(r,[2,28]),t(r,[2,29]),{36:[1,36]},t(r,[2,8]),t(r,[2,9]),t(r,[2,10]),t(r,[2,11]),t(r,[2,12]),t(r,[2,13]),t(r,[2,14]),{38:[1,37],40:[1,38]},t(r,[2,4]),t(r,[2,25]),t(r,[2,26]),t(r,[2,30]),t(r,[2,31],{39:[1,39],40:[1,40]}),t(r,[2,37],{38:[1,41]}),t(r,[2,32],{40:[1,42]}),t(r,[2,33]),t(r,[2,35],{39:[1,43]}),t(r,[2,34]),t(r,[2,36])],defaultActions:{},parseError:function(y,s){if(s.recoverable)this.trace(y);else{var l=new Error(y);throw l.hash=s,l}},parse:function(y){var s=this,l=[0],c=[],u=[null],i=[],C=this.table,e="",m=0,_=0,w=2,v=1,A=i.slice.call(arguments,1),b=Object.create(this.lexer),N={yy:{}};for(var tt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,tt)&&(N.yy[tt]=this.yy[tt]);b.setInput(y,N.yy),N.yy.lexer=b,N.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var ct=b.yylloc;i.push(ct);var gt=b.options&&b.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ht(){var J;return J=c.pop()||b.lex()||v,typeof J!="number"&&(J instanceof Array&&(c=J,J=c.pop()),J=s.symbols_[J]||J),J}for(var F,j,P,et,q={},X,Z,nt,U;;){if(j=l[l.length-1],this.defaultActions[j]?P=this.defaultActions[j]:((F===null||typeof F>"u")&&(F=ht()),P=C[j]&&C[j][F]),typeof P>"u"||!P.length||!P[0]){var it="";U=[];for(X in C[j])this.terminals_[X]&&X>w&&U.push("'"+this.terminals_[X]+"'");b.showPosition?it="Parse error on line "+(m+1)+`:
`+b.showPosition()+`
Expecting `+U.join(", ")+", got '"+(this.terminals_[F]||F)+"'":it="Parse error on line "+(m+1)+": Unexpected "+(F==v?"end of input":"'"+(this.terminals_[F]||F)+"'"),this.parseError(it,{text:b.match,token:this.terminals_[F]||F,line:b.yylineno,loc:ct,expected:U})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+j+", token: "+F);switch(P[0]){case 1:l.push(F),u.push(b.yytext),i.push(b.yylloc),l.push(P[1]),F=null,_=b.yyleng,e=b.yytext,m=b.yylineno,ct=b.yylloc;break;case 2:if(Z=this.productions_[P[1]][1],q.$=u[u.length-Z],q._$={first_line:i[i.length-(Z||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(Z||1)].first_column,last_column:i[i.length-1].last_column},gt&&(q._$.range=[i[i.length-(Z||1)].range[0],i[i.length-1].range[1]]),et=this.performAction.apply(q,[e,_,m,N.yy,P[1],u,i].concat(A)),typeof et<"u")return et;Z&&(l=l.slice(0,-1*Z*2),u=u.slice(0,-1*Z),i=i.slice(0,-1*Z)),l.push(this.productions_[P[1]][0]),u.push(q.$),i.push(q._$),nt=C[l[l.length-2]][l[l.length-1]],l.push(nt);break;case 3:return!0}}return!0}},g=(function(){var y={EOF:1,parseError:function(s,l){if(this.yy.parser)this.yy.parser.parseError(s,l);else throw new Error(s)},setInput:function(s,l){return this.yy=l||this.yy||{},this._input=s,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var s=this._input[0];this.yytext+=s,this.yyleng++,this.offset++,this.match+=s,this.matched+=s;var l=s.match(/(?:\r\n?|\n).*/g);return l?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),s},unput:function(s){var l=s.length,c=s.split(/(?:\r\n?|\n)/g);this._input=s+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-l),this.offset-=l;var u=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===u.length?this.yylloc.first_column:0)+u[u.length-c.length].length-c[0].length:this.yylloc.first_column-l},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-l]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(s){this.unput(this.match.slice(s))},pastInput:function(){var s=this.matched.substr(0,this.matched.length-this.match.length);return(s.length>20?"...":"")+s.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var s=this.match;return s.length<20&&(s+=this._input.substr(0,20-s.length)),(s.substr(0,20)+(s.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var s=this.pastInput(),l=new Array(s.length+1).join("-");return s+this.upcomingInput()+`
`+l+"^"},test_match:function(s,l){var c,u,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),u=s[0].match(/(?:\r\n?|\n).*/g),u&&(this.yylineno+=u.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:u?u[u.length-1].length-u[u.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+s[0].length},this.yytext+=s[0],this.match+=s[0],this.matches=s,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(s[0].length),this.matched+=s[0],c=this.performAction.call(this,this.yy,this,l,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),c)return c;if(this._backtrack){for(var C in i)this[C]=i[C];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var s,l,c,u;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),C=0;C<i.length;C++)if(c=this._input.match(this.rules[i[C]]),c&&(!l||c[0].length>l[0].length)){if(l=c,u=C,this.options.backtrack_lexer){if(s=this.test_match(c,i[C]),s!==!1)return s;if(this._backtrack){l=!1;continue}else return!1}else if(!this.options.flex)break}return l?(s=this.test_match(l,i[u]),s!==!1?s:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var s=this.next();return s||this.lex()},begin:function(s){this.conditionStack.push(s)},popState:function(){var s=this.conditionStack.length-1;return s>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(s){return s=this.conditionStack.length-1-Math.abs(s||0),s>=0?this.conditionStack[s]:"INITIAL"},pushState:function(s){this.begin(s)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(s,l,c,u){switch(c){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),28;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),30;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 40;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 38;case 21:this.popState();break;case 22:return 39;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 37;case 26:return 4;case 27:return 19;case 28:return 20;case 29:return 21;case 30:return 22;case 31:return 23;case 32:return 25;case 33:return 24;case 34:return 26;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return"date";case 43:return 27;case 44:return"accDescription";case 45:return 33;case 46:return 35;case 47:return 36;case 48:return":";case 49:return 6;case 50:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],inclusive:!0}}};return y})();f.lexer=g;function p(){this.yy={}}return p.prototype=f,f.Parser=p,new p})();Tt.parser=Tt;const Ve=Tt;V.extend(Ae),V.extend(Oe),V.extend(Be);let Q="",Ct="",St,Et="",lt=[],dt=[],Mt={},At=[],pt=[],ot="",Yt="";const Ht=["active","done","crit","milestone"];let Lt=[],ut=!1,It=!1,Ot="sunday",wt=0;const Re=function(){At=[],pt=[],ot="",Lt=[],yt=0,Dt=void 0,mt=void 0,O=[],Q="",Ct="",Yt="",St=void 0,Et="",lt=[],dt=[],ut=!1,It=!1,wt=0,Mt={},he(),Ot="sunday"},ze=function(t){Ct=t},Ze=function(){return Ct},Ge=function(t){St=t},Ne=function(){return St},je=function(t){Et=t},qe=function(){return Et},He=function(t){Q=t},Qe=function(){ut=!0},Xe=function(){return ut},Je=function(){It=!0},Ke=function(){return It},Ue=function(t){Yt=t},ti=function(){return Yt},ei=function(){return Q},ii=function(t){lt=t.toLowerCase().split(/[\s,]+/)},si=function(){return lt},ni=function(t){dt=t.toLowerCase().split(/[\s,]+/)},ri=function(){return dt},ai=function(){return Mt},oi=function(t){ot=t,At.push(t)},ci=function(){return At},li=function(){let t=jt();const r=10;let n=0;for(;!t&&n<r;)t=jt(),n++;return pt=O,pt},Qt=function(t,r,n,a){return a.includes(t.format(r.trim()))?!1:t.isoWeekday()>=6&&n.includes("weekends")||n.includes(t.format("dddd").toLowerCase())?!0:n.includes(t.format(r.trim()))},di=function(t){Ot=t},ui=function(){return Ot},Xt=function(t,r,n,a){if(!n.length||t.manualEndTime)return;let o;t.startTime instanceof Date?o=V(t.startTime):o=V(t.startTime,r,!0),o=o.add(1,"d");let d;t.endTime instanceof Date?d=V(t.endTime):d=V(t.endTime,r,!0);const[h,T]=hi(o,d,r,n,a);t.endTime=h.toDate(),t.renderEndTime=T},hi=function(t,r,n,a,o){let d=!1,h=null;for(;t<=r;)d||(h=r.toDate()),d=Qt(t,n,a,o),d&&(r=r.add(1,"d")),t=t.add(1,"d");return[r,h]},_t=function(t,r,n){n=n.trim();const a=/^after\s+(?<ids>[\d\w- ]+)/.exec(n);if(a!==null){let d=null;for(const T of a.groups.ids.split(" ")){let Y=st(T);Y!==void 0&&(!d||Y.endTime>d.endTime)&&(d=Y)}if(d)return d.endTime;const h=new Date;return h.setHours(0,0,0,0),h}let o=V(n,r.trim(),!0);if(o.isValid())return o.toDate();{kt.debug("Invalid date:"+n),kt.debug("With date format:"+r.trim());const d=new Date(n);if(d===void 0||isNaN(d.getTime())||d.getFullYear()<-1e4||d.getFullYear()>1e4)throw new Error("Invalid date:"+n);return d}},Jt=function(t){const r=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return r!==null?[Number.parseFloat(r[1]),r[2]]:[NaN,"ms"]},Kt=function(t,r,n,a=!1){n=n.trim();const o=/^until\s+(?<ids>[\d\w- ]+)/.exec(n);if(o!==null){let D=null;for(const E of o.groups.ids.split(" ")){let I=st(E);I!==void 0&&(!D||I.startTime<D.startTime)&&(D=I)}if(D)return D.startTime;const x=new Date;return x.setHours(0,0,0,0),x}let d=V(n,r.trim(),!0);if(d.isValid())return a&&(d=d.add(1,"d")),d.toDate();let h=V(t);const[T,Y]=Jt(n);if(!Number.isNaN(T)){const D=h.add(T,Y);D.isValid()&&(h=D)}return h.toDate()};let yt=0;const at=function(t){return t===void 0?(yt=yt+1,"task"+yt):t},fi=function(t,r){let n;r.substr(0,1)===":"?n=r.substr(1,r.length):n=r;const a=n.split(","),o={};ie(a,o,Ht);for(let h=0;h<a.length;h++)a[h]=a[h].trim();let d="";switch(a.length){case 1:o.id=at(),o.startTime=t.endTime,d=a[0];break;case 2:o.id=at(),o.startTime=_t(void 0,Q,a[0]),d=a[1];break;case 3:o.id=at(a[0]),o.startTime=_t(void 0,Q,a[1]),d=a[2];break}return d&&(o.endTime=Kt(o.startTime,Q,d,ut),o.manualEndTime=V(d,"YYYY-MM-DD",!0).isValid(),Xt(o,Q,dt,lt)),o},yi=function(t,r){let n;r.substr(0,1)===":"?n=r.substr(1,r.length):n=r;const a=n.split(","),o={};ie(a,o,Ht);for(let d=0;d<a.length;d++)a[d]=a[d].trim();switch(a.length){case 1:o.id=at(),o.startTime={type:"prevTaskEnd",id:t},o.endTime={data:a[0]};break;case 2:o.id=at(),o.startTime={type:"getStartDate",startData:a[0]},o.endTime={data:a[1]};break;case 3:o.id=at(a[0]),o.startTime={type:"getStartDate",startData:a[1]},o.endTime={data:a[2]};break}return o};let Dt,mt,O=[];const Ut={},mi=function(t,r){const n={section:ot,type:ot,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:r},task:t,classes:[]},a=yi(mt,r);n.raw.startTime=a.startTime,n.raw.endTime=a.endTime,n.id=a.id,n.prevTaskId=mt,n.active=a.active,n.done=a.done,n.crit=a.crit,n.milestone=a.milestone,n.order=wt,wt++;const o=O.push(n);mt=n.id,Ut[n.id]=o-1},st=function(t){const r=Ut[t];return O[r]},ki=function(t,r){const n={section:ot,type:ot,description:t,task:t,classes:[]},a=fi(Dt,r);n.startTime=a.startTime,n.endTime=a.endTime,n.id=a.id,n.active=a.active,n.done=a.done,n.crit=a.crit,n.milestone=a.milestone,Dt=n,pt.push(n)},jt=function(){const t=function(n){const a=O[n];let o="";switch(O[n].raw.startTime.type){case"prevTaskEnd":{const d=st(a.prevTaskId);a.startTime=d.endTime;break}case"getStartDate":o=_t(void 0,Q,O[n].raw.startTime.startData),o&&(O[n].startTime=o);break}return O[n].startTime&&(O[n].endTime=Kt(O[n].startTime,Q,O[n].raw.endTime.data,ut),O[n].endTime&&(O[n].processed=!0,O[n].manualEndTime=V(O[n].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),Xt(O[n],Q,dt,lt))),O[n].processed};let r=!0;for(const[n,a]of O.entries())t(n),r=r&&a.processed;return r},pi=function(t,r){let n=r;rt().securityLevel!=="loose"&&(n=ue.sanitizeUrl(r)),t.split(",").forEach(function(a){st(a)!==void 0&&(ee(a,()=>{window.open(n,"_self")}),Mt[a]=n)}),te(t,"clickable")},te=function(t,r){t.split(",").forEach(function(n){let a=st(n);a!==void 0&&a.classes.push(r)})},gi=function(t,r,n){if(rt().securityLevel!=="loose"||r===void 0)return;let a=[];if(typeof n=="string"){a=n.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<a.length;o++){let d=a[o].trim();d.charAt(0)==='"'&&d.charAt(d.length-1)==='"'&&(d=d.substr(1,d.length-2)),a[o]=d}}a.length===0&&a.push(t),st(t)!==void 0&&ee(t,()=>{fe.runFunc(r,...a)})},ee=function(t,r){Lt.push(function(){const n=document.querySelector(`[id="${t}"]`);n!==null&&n.addEventListener("click",function(){r()})},function(){const n=document.querySelector(`[id="${t}-text"]`);n!==null&&n.addEventListener("click",function(){r()})})},bi=function(t,r,n){t.split(",").forEach(function(a){gi(a,r,n)}),te(t,"clickable")},xi=function(t){Lt.forEach(function(r){r(t)})},vi={getConfig:()=>rt().gantt,clear:Re,setDateFormat:He,getDateFormat:ei,enableInclusiveEndDates:Qe,endDatesAreInclusive:Xe,enableTopAxis:Je,topAxisEnabled:Ke,setAxisFormat:ze,getAxisFormat:Ze,setTickInterval:Ge,getTickInterval:Ne,setTodayMarker:je,getTodayMarker:qe,setAccTitle:ce,getAccTitle:oe,setDiagramTitle:ae,getDiagramTitle:re,setDisplayMode:Ue,getDisplayMode:ti,setAccDescription:ne,getAccDescription:se,addSection:oi,getSections:ci,getTasks:li,addTask:mi,findTaskById:st,addTaskOrg:ki,setIncludes:ii,getIncludes:si,setExcludes:ni,getExcludes:ri,setClickEvent:bi,setLink:pi,getLinks:ai,bindFunctions:xi,parseDuration:Jt,isInvalidDate:Qt,setWeekday:di,getWeekday:ui};function ie(t,r,n){let a=!0;for(;a;)a=!1,n.forEach(function(o){const d="^\\s*"+o+"\\s*$",h=new RegExp(d);t[0].match(h)&&(r[o]=!0,t.shift(1),a=!0)})}const Ti=function(){kt.debug("Something is calling, setConf, remove the call")},qt={monday:De,tuesday:_e,wednesday:we,thursday:Te,friday:ve,saturday:xe,sunday:be},wi=(t,r)=>{let n=[...t].map(()=>-1/0),a=[...t].sort((d,h)=>d.startTime-h.startTime||d.order-h.order),o=0;for(const d of a)for(let h=0;h<n.length;h++)if(d.startTime>=n[h]){n[h]=d.endTime,d.order=h+r,h>o&&(o=h);break}return o};let K;const _i=function(t,r,n,a){const o=rt().gantt,d=rt().securityLevel;let h;d==="sandbox"&&(h=ft("#i"+r));const T=d==="sandbox"?ft(h.nodes()[0].contentDocument.body):ft("body"),Y=d==="sandbox"?h.nodes()[0].contentDocument:document,D=Y.getElementById(r);K=D.parentElement.offsetWidth,K===void 0&&(K=1200),o.useWidth!==void 0&&(K=o.useWidth);const x=a.db.getTasks();let E=[];for(const f of x)E.push(f.type);E=G(E);const I={};let B=2*o.topPadding;if(a.db.getDisplayMode()==="compact"||o.displayMode==="compact"){const f={};for(const p of x)f[p.section]===void 0?f[p.section]=[p]:f[p.section].push(p);let g=0;for(const p of Object.keys(f)){const y=wi(f[p],g)+1;g+=y,B+=y*(o.barHeight+o.barGap),I[p]=y}}else{B+=x.length*(o.barHeight+o.barGap);for(const f of E)I[f]=x.filter(g=>g.type===f).length}D.setAttribute("viewBox","0 0 "+K+" "+B);const W=T.select(`[id="${r}"]`),S=ye().domain([me(x,function(f){return f.startTime}),ke(x,function(f){return f.endTime})]).rangeRound([0,K-o.leftPadding-o.rightPadding]);function k(f,g){const p=f.startTime,y=g.startTime;let s=0;return p>y?s=1:p<y&&(s=-1),s}x.sort(k),$(x,K,B),le(W,B,K,o.useMaxWidth),W.append("text").text(a.db.getDiagramTitle()).attr("x",K/2).attr("y",o.titleTopMargin).attr("class","titleText");function $(f,g,p){const y=o.barHeight,s=y+o.barGap,l=o.topPadding,c=o.leftPadding,u=Ce().domain([0,E.length]).range(["#00B9FA","#F95002"]).interpolate(pe);L(s,l,c,g,p,f,a.db.getExcludes(),a.db.getIncludes()),R(c,l,g,p),M(f,s,l,c,y,u,g),z(s,l),H(c,l,g,p)}function M(f,g,p,y,s,l,c){const u=[...new Set(f.map(e=>e.order))].map(e=>f.find(m=>m.order===e));W.append("g").selectAll("rect").data(u).enter().append("rect").attr("x",0).attr("y",function(e,m){return m=e.order,m*g+p-2}).attr("width",function(){return c-o.rightPadding/2}).attr("height",g).attr("class",function(e){for(const[m,_]of E.entries())if(e.type===_)return"section section"+m%o.numberSectionStyles;return"section section0"});const i=W.append("g").selectAll("rect").data(f).enter(),C=a.db.getLinks();if(i.append("rect").attr("id",function(e){return e.id}).attr("rx",3).attr("ry",3).attr("x",function(e){return e.milestone?S(e.startTime)+y+.5*(S(e.endTime)-S(e.startTime))-.5*s:S(e.startTime)+y}).attr("y",function(e,m){return m=e.order,m*g+p}).attr("width",function(e){return e.milestone?s:S(e.renderEndTime||e.endTime)-S(e.startTime)}).attr("height",s).attr("transform-origin",function(e,m){return m=e.order,(S(e.startTime)+y+.5*(S(e.endTime)-S(e.startTime))).toString()+"px "+(m*g+p+.5*s).toString()+"px"}).attr("class",function(e){const m="task";let _="";e.classes.length>0&&(_=e.classes.join(" "));let w=0;for(const[A,b]of E.entries())e.type===b&&(w=A%o.numberSectionStyles);let v="";return e.active?e.crit?v+=" activeCrit":v=" active":e.done?e.crit?v=" doneCrit":v=" done":e.crit&&(v+=" crit"),v.length===0&&(v=" task"),e.milestone&&(v=" milestone "+v),v+=w,v+=" "+_,m+v}),i.append("text").attr("id",function(e){return e.id+"-text"}).text(function(e){return e.task}).attr("font-size",o.fontSize).attr("x",function(e){let m=S(e.startTime),_=S(e.renderEndTime||e.endTime);e.milestone&&(m+=.5*(S(e.endTime)-S(e.startTime))-.5*s),e.milestone&&(_=m+s);const w=this.getBBox().width;return w>_-m?_+w+1.5*o.leftPadding>c?m+y-5:_+y+5:(_-m)/2+m+y}).attr("y",function(e,m){return m=e.order,m*g+o.barHeight/2+(o.fontSize/2-2)+p}).attr("text-height",s).attr("class",function(e){const m=S(e.startTime);let _=S(e.endTime);e.milestone&&(_=m+s);const w=this.getBBox().width;let v="";e.classes.length>0&&(v=e.classes.join(" "));let A=0;for(const[N,tt]of E.entries())e.type===tt&&(A=N%o.numberSectionStyles);let b="";return e.active&&(e.crit?b="activeCritText"+A:b="activeText"+A),e.done?e.crit?b=b+" doneCritText"+A:b=b+" doneText"+A:e.crit&&(b=b+" critText"+A),e.milestone&&(b+=" milestoneText"),w>_-m?_+w+1.5*o.leftPadding>c?v+" taskTextOutsideLeft taskTextOutside"+A+" "+b:v+" taskTextOutsideRight taskTextOutside"+A+" "+b+" width-"+w:v+" taskText taskText"+A+" "+b+" width-"+w}),rt().securityLevel==="sandbox"){let e;e=ft("#i"+r);const m=e.nodes()[0].contentDocument;i.filter(function(_){return C[_.id]!==void 0}).each(function(_){var w=m.querySelector("#"+_.id),v=m.querySelector("#"+_.id+"-text");const A=w.parentNode;var b=m.createElement("a");b.setAttribute("xlink:href",C[_.id]),b.setAttribute("target","_top"),A.appendChild(b),b.appendChild(w),b.appendChild(v)})}}function L(f,g,p,y,s,l,c,u){if(c.length===0&&u.length===0)return;let i,C;for(const{startTime:v,endTime:A}of l)(i===void 0||v<i)&&(i=v),(C===void 0||A>C)&&(C=A);if(!i||!C)return;if(V(C).diff(V(i),"year")>5){kt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const e=a.db.getDateFormat(),m=[];let _=null,w=V(i);for(;w.valueOf()<=C;)a.db.isInvalidDate(w,e,c,u)?_?_.end=w:_={start:w,end:w}:_&&(m.push(_),_=null),w=w.add(1,"d");W.append("g").selectAll("rect").data(m).enter().append("rect").attr("id",function(v){return"exclude-"+v.start.format("YYYY-MM-DD")}).attr("x",function(v){return S(v.start)+p}).attr("y",o.gridLineStartPadding).attr("width",function(v){const A=v.end.add(1,"day");return S(A)-S(v.start)}).attr("height",s-g-o.gridLineStartPadding).attr("transform-origin",function(v,A){return(S(v.start)+p+.5*(S(v.end)-S(v.start))).toString()+"px "+(A*f+.5*s).toString()+"px"}).attr("class","exclude-range")}function R(f,g,p,y){let s=ge(S).tickSize(-y+g+o.gridLineStartPadding).tickFormat(Ft(a.db.getAxisFormat()||o.axisFormat||"%Y-%m-%d"));const l=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(a.db.getTickInterval()||o.tickInterval);if(l!==null){const c=l[1],u=l[2],i=a.db.getWeekday()||o.weekday;switch(u){case"millisecond":s.ticks(zt.every(c));break;case"second":s.ticks(Rt.every(c));break;case"minute":s.ticks(Vt.every(c));break;case"hour":s.ticks(Bt.every(c));break;case"day":s.ticks(Pt.every(c));break;case"week":s.ticks(qt[i].every(c));break;case"month":s.ticks(Wt.every(c));break}}if(W.append("g").attr("class","grid").attr("transform","translate("+f+", "+(y-50)+")").call(s).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),a.db.topAxisEnabled()||o.topAxis){let c=$e(S).tickSize(-y+g+o.gridLineStartPadding).tickFormat(Ft(a.db.getAxisFormat()||o.axisFormat||"%Y-%m-%d"));if(l!==null){const u=l[1],i=l[2],C=a.db.getWeekday()||o.weekday;switch(i){case"millisecond":c.ticks(zt.every(u));break;case"second":c.ticks(Rt.every(u));break;case"minute":c.ticks(Vt.every(u));break;case"hour":c.ticks(Bt.every(u));break;case"day":c.ticks(Pt.every(u));break;case"week":c.ticks(qt[C].every(u));break;case"month":c.ticks(Wt.every(u));break}}W.append("g").attr("class","grid").attr("transform","translate("+f+", "+g+")").call(c).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function z(f,g){let p=0;const y=Object.keys(I).map(s=>[s,I[s]]);W.append("g").selectAll("text").data(y).enter().append(function(s){const l=s[0].split(de.lineBreakRegex),c=-(l.length-1)/2,u=Y.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("dy",c+"em");for(const[i,C]of l.entries()){const e=Y.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),i>0&&e.setAttribute("dy","1em"),e.textContent=C,u.appendChild(e)}return u}).attr("x",10).attr("y",function(s,l){if(l>0)for(let c=0;c<l;c++)return p+=y[l-1][1],s[1]*f/2+p*f+g;else return s[1]*f/2+g}).attr("font-size",o.sectionFontSize).attr("class",function(s){for(const[l,c]of E.entries())if(s[0]===c)return"sectionTitle sectionTitle"+l%o.numberSectionStyles;return"sectionTitle"})}function H(f,g,p,y){const s=a.db.getTodayMarker();if(s==="off")return;const l=W.append("g").attr("class","today"),c=new Date,u=l.append("line");u.attr("x1",S(c)+f).attr("x2",S(c)+f).attr("y1",o.titleTopMargin).attr("y2",y-o.titleTopMargin).attr("class","today"),s!==""&&u.attr("style",s.replace(/,/g,";"))}function G(f){const g={},p=[];for(let y=0,s=f.length;y<s;++y)Object.prototype.hasOwnProperty.call(g,f[y])||(g[f[y]]=!0,p.push(f[y]));return p}},Di={setConf:Ti,draw:_i},$i=t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
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
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
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
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
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
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,Ci=$i,Pi={parser:Ve,db:vi,renderer:Di,styles:Ci};export{Pi as diagram};
//# sourceMappingURL=ganttDiagram-c361ad54-DIgRH0Wx.chunk.mjs.map
