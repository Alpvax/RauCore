(function(e){function t(t){for(var n,u,i=t[0],c=t[1],s=t[2],f=0,l=[];f<i.length;f++)u=i[f],Object.prototype.hasOwnProperty.call(o,u)&&o[u]&&l.push(o[u][0]),o[u]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);p&&p(t);while(l.length)l.shift()();return a.push.apply(a,s||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,i=1;i<r.length;i++){var c=r[i];0!==o[c]&&(n=!1)}n&&(a.splice(t--,1),e=u(u.s=r[0]))}return e}var n={},o={app:0},a=[];function u(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,u),r.l=!0,r.exports}u.m=e,u.c=n,u.d=function(e,t,r){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(u.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)u.d(r,n,function(t){return e[t]}.bind(null,n));return r},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var p=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"034f":function(e,t,r){"use strict";var n=r("64a9"),o=r.n(n);o.a},"2d0e":function(e,t,r){"use strict";var n=r("e764"),o=r.n(n);o.a},"64a9":function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-link",{attrs:{to:"runes"}},[e._v("Runes")]),r("router-view")],1)},a=[],u=n["a"].extend({name:"app"}),i=u,c=(r("034f"),r("2877")),s=Object(c["a"])(i,o,a,!1,null,null,null),p=s.exports,f=(r("8e6e"),r("456d"),r("768b")),l=(r("ac6a"),r("ffc1"),r("bd86")),d=r("2f62"),b=r("8aa5"),v=r.n(b),h=r("3317");function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function g(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(r,!0).forEach(function(t){Object(l["a"])(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var O={apiKey:"AIzaSyBBpBbncl_mEM2NwZIBKL3Fe11CPOULT58",authDomain:"rau.firebaseapp.com",databaseURL:"https://rau.firebaseio.com",projectId:"firebase-rau",storageBucket:"firebase-rau.appspot.com",messagingSenderId:"248482438873",appId:"1:248482438873:web:1f9f4ea54343c8d7"};v.a.initializeApp(O);var m=v.a.database();n["a"].use(d["a"]);var _=new d["a"].Store({state:{runes:{}},mutations:g({},h["b"]),getters:{runes:function(e){return Object.entries(e.runes).map(function(e){var t=Object(f["a"])(e,2),r=t[0],n=t[1],o={name:r,codepoint:n.codePoint,category:n.category,pillared:!!n.pillared,index:n.index};return n.latin&&(o.latinInput=n.latin),o})},db:function(e){return m}},actions:{setRunesRef:Object(h["a"])(function(e,t){var r=e.bindFirebaseRef;r("runes",m.ref(t))})}}),j=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("table",{attrs:{id:"runeTable"}},[e._m(0),e._l(e.runes,function(t){return r("tr",{key:t.name},[r("td",[e._v(e._s(String.fromCharCode(t.codepoint)))]),r("td",[e._v(e._s(t.name))]),r("td",[e._v(e._s(t.codepoint.toString(16).toUpperCase()))]),r("td",[e._v(e._s(t.latinInput))]),r("td",[e._v(e._s(t.category))])])})],2)},w=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("tr",[r("th",[e._v("Rune")]),r("th",[e._v("Name")]),r("th",[e._v("Unicode code point")]),r("th",[e._v("Latin input character")]),r("th",[e._v("Category")])])}],P=n["a"].extend({name:"RunesPage",computed:{runes:function(){return console.log(this.$store.getters.runes),this.$store.getters.runes}},mounted:function(){this.$store.dispatch("setRunesRef","runes")}}),x=P,S=(r("2d0e"),Object(c["a"])(x,j,w,!1,null,null,null)),R=S.exports,k=r("8c4f");n["a"].config.productionTip=!1,n["a"].use(k["a"]);var I=[{path:"/runes",component:R}],$=new k["a"]({routes:I});new n["a"]({store:_,router:$,render:function(e){return e(p)}}).$mount("#app")},e764:function(e,t,r){}});
//# sourceMappingURL=app.dd59e24c.js.map