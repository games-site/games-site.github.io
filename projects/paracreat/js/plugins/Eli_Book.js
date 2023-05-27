//============================================================================
// Eli_Book.js
//============================================================================

/* ------------------------------ HELP ENGLISH ------------------------------ */
{
/*:
@plugindesc ♦5.0.3♦ Essential plugin for all Eli plugins.
@author Hakuen Studio

@help 
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
If you like my work, please consider supporting me on Patreon!
Patreon      → https://www.patreon.com/hakuenstudio
Terms of Use → https://www.hakuenstudio.com/terms-of-use-5-0-0
Facebook     → https://www.facebook.com/hakuenstudio
Instagram    → https://www.instagram.com/hakuenstudio
Twitter      → https://twitter.com/hakuen_studio
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
==============================================================================
Plugin Requirements
==============================================================================

Order After DotMoveSystem
Order After DotMoveSystem_FunctionEx

==============================================================================
Features
==============================================================================

● Core Plugin for Eli Plugins.
● Provide methods and code that add a better performance on all Eli 
plugins.
● Optionally set Pixel Perfect to your game.
● Optionally remove scroll bars for games with low resolution.
● Add playtest settings to automatically open Dev Tools.
● Set dev tools and game window positions.
● Quickly debug your game with the Dev Tools Focus option.
● [MZ] Optionally Disable Effekseer.
● [MZ] A quick restart of your playtest using F5.

==============================================================================
How to use
==============================================================================

Put above all other Eli plugins.

♦ Pixel Perfect ♦

Setting this to true will make your game pixel perfect.

♦ Window Scroll Bars ♦

If you ever used low resolutions on your game, you may have encountered 
an issue that the game window was showing the system scroll bars on the 
side.
Setting this to true will remove the scroll bars.

♦ Dev Tools Focus ♦

If you use the Dev tools(F12), you will notice that when it is open, 
your game stops running. With this setting on, your game will still run 
even with the Dev Tools opened.

♦ Quick F5 ♦

Press F5 to restart the game application no longer closes the game window 
and opens again. I just restart your game without closing it.

============================================================================
Update Log
============================================================================

https://tinyurl.com/eliBookPluginLog

============================================================================

@param engine
@text Engine Settings
@type struct<engineSt>
@desc Main settings about the engine.
@default {"pixelPerfect":"false","styleOverflow":"true"}

@param playtest
@text Playtest Settings
@type struct<developerSt>
@desc Play test settings.
@default {"openDevTools":"false","nwWindowPos":"-1"}

*/

/* ----------------------------- ENGINE SETTINGS ---------------------------- */
{
/*~struct~engineSt:

@param pixelPerfect
@text Pixel Perfect
@type boolean
@desc Set to true to enable Pixel Perfect feature to your game.
@default false

@param styleOverflow
@text Window Scroll Bars
@type boolean
@desc Remove the scroll bars of the game window that can appear when resolution is low.
@default true

*/

}

/* -------------------------------- PLAY TEST ------------------------------- */
{
/*~struct~developerSt:

@param openDevTools
@text Open Dev Tools
@type boolean
@desc If true, it will open the Dev Tools automatically.
@default false

@param nwWindowPos
@text Game Window Position
@type text
@desc Change the game window position when open Dev Tools. Separate X, Y with a comma. Set -1 to not change.
@default -1

*/
}

}

"use strict"

var Imported = Imported || {}
var Eli = Eli || {}
Imported.Eli_Book = true

/* ---------------------------------- ANIME --------------------------------- */
/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

{

!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.anime=e()}(this,function(){"use strict";var n={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},e={duration:1e3,delay:0,endDelay:0,easing:"linear",round:0},t=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],r={CSS:{},springs:{}};function a(n,e,t){return Math.min(Math.max(n,e),t)}function o(n,e){return n.indexOf(e)>-1}function u(n,e){return n.apply(null,e)}var i={arr:function(n){return Array.isArray(n)},obj:function(n){return o(Object.prototype.toString.call(n),"Object")},pth:function(n){return i.obj(n)&&n.hasOwnProperty("totalLength")},svg:function(n){return n instanceof SVGElement},inp:function(n){return n instanceof HTMLInputElement},dom:function(n){return n.nodeType||i.svg(n)},str:function(n){return"string"==typeof n},fnc:function(n){return"function"==typeof n},und:function(n){return void 0===n},nil:function(n){return i.und(n)||null===n},hex:function(n){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n)},rgb:function(n){return/^rgb/.test(n)},hsl:function(n){return/^hsl/.test(n)},col:function(n){return i.hex(n)||i.rgb(n)||i.hsl(n)},key:function(t){return!n.hasOwnProperty(t)&&!e.hasOwnProperty(t)&&"targets"!==t&&"keyframes"!==t}};function c(n){var e=/\(([^)]+)\)/.exec(n);return e?e[1].split(",").map(function(n){return parseFloat(n)}):[]}function s(n,e){var t=c(n),o=a(i.und(t[0])?1:t[0],.1,100),u=a(i.und(t[1])?100:t[1],.1,100),s=a(i.und(t[2])?10:t[2],.1,100),f=a(i.und(t[3])?0:t[3],.1,100),l=Math.sqrt(u/o),d=s/(2*Math.sqrt(u*o)),p=d<1?l*Math.sqrt(1-d*d):0,v=1,h=d<1?(d*l-f)/p:-f+l;function g(n){var t=e?e*n/1e3:n;return t=d<1?Math.exp(-t*d*l)*(v*Math.cos(p*t)+h*Math.sin(p*t)):(v+h*t)*Math.exp(-t*l),0===n||1===n?n:1-t}return e?g:function(){var e=r.springs[n];if(e)return e;for(var t=0,a=0;;)if(1===g(t+=1/6)){if(++a>=16)break}else a=0;var o=t*(1/6)*1e3;return r.springs[n]=o,o}}function f(n){return void 0===n&&(n=10),function(e){return Math.ceil(a(e,1e-6,1)*n)*(1/n)}}var l,d,p=function(){var n=11,e=1/(n-1);function t(n,e){return 1-3*e+3*n}function r(n,e){return 3*e-6*n}function a(n){return 3*n}function o(n,e,o){return((t(e,o)*n+r(e,o))*n+a(e))*n}function u(n,e,o){return 3*t(e,o)*n*n+2*r(e,o)*n+a(e)}return function(t,r,a,i){if(0<=t&&t<=1&&0<=a&&a<=1){var c=new Float32Array(n);if(t!==r||a!==i)for(var s=0;s<n;++s)c[s]=o(s*e,t,a);return function(n){return t===r&&a===i?n:0===n||1===n?n:o(f(n),r,i)}}function f(r){for(var i=0,s=1,f=n-1;s!==f&&c[s]<=r;++s)i+=e;var l=i+(r-c[--s])/(c[s+1]-c[s])*e,d=u(l,t,a);return d>=.001?function(n,e,t,r){for(var a=0;a<4;++a){var i=u(e,t,r);if(0===i)return e;e-=(o(e,t,r)-n)/i}return e}(r,l,t,a):0===d?l:function(n,e,t,r,a){for(var u,i,c=0;(u=o(i=e+(t-e)/2,r,a)-n)>0?t=i:e=i,Math.abs(u)>1e-7&&++c<10;);return i}(r,i,i+e,t,a)}}}(),v=(l={linear:function(){return function(n){return n}}},d={Sine:function(){return function(n){return 1-Math.cos(n*Math.PI/2)}},Circ:function(){return function(n){return 1-Math.sqrt(1-n*n)}},Back:function(){return function(n){return n*n*(3*n-2)}},Bounce:function(){return function(n){for(var e,t=4;n<((e=Math.pow(2,--t))-1)/11;);return 1/Math.pow(4,3-t)-7.5625*Math.pow((3*e-2)/22-n,2)}},Elastic:function(n,e){void 0===n&&(n=1),void 0===e&&(e=.5);var t=a(n,1,10),r=a(e,.1,2);return function(n){return 0===n||1===n?n:-t*Math.pow(2,10*(n-1))*Math.sin((n-1-r/(2*Math.PI)*Math.asin(1/t))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach(function(n,e){d[n]=function(){return function(n){return Math.pow(n,e+2)}}}),Object.keys(d).forEach(function(n){var e=d[n];l["easeIn"+n]=e,l["easeOut"+n]=function(n,t){return function(r){return 1-e(n,t)(1-r)}},l["easeInOut"+n]=function(n,t){return function(r){return r<.5?e(n,t)(2*r)/2:1-e(n,t)(-2*r+2)/2}},l["easeOutIn"+n]=function(n,t){return function(r){return r<.5?(1-e(n,t)(1-2*r))/2:(e(n,t)(2*r-1)+1)/2}}}),l);function h(n,e){if(i.fnc(n))return n;var t=n.split("(")[0],r=v[t],a=c(n);switch(t){case"spring":return s(n,e);case"cubicBezier":return u(p,a);case"steps":return u(f,a);default:return u(r,a)}}function g(n){try{return document.querySelectorAll(n)}catch(n){return}}function m(n,e){for(var t=n.length,r=arguments.length>=2?arguments[1]:void 0,a=[],o=0;o<t;o++)if(o in n){var u=n[o];e.call(r,u,o,n)&&a.push(u)}return a}function y(n){return n.reduce(function(n,e){return n.concat(i.arr(e)?y(e):e)},[])}function b(n){return i.arr(n)?n:(i.str(n)&&(n=g(n)||n),n instanceof NodeList||n instanceof HTMLCollection?[].slice.call(n):[n])}function M(n,e){return n.some(function(n){return n===e})}function x(n){var e={};for(var t in n)e[t]=n[t];return e}function w(n,e){var t=x(n);for(var r in n)t[r]=e.hasOwnProperty(r)?e[r]:n[r];return t}function k(n,e){var t=x(n);for(var r in e)t[r]=i.und(n[r])?e[r]:n[r];return t}function O(n){return i.rgb(n)?(t=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e=n))?"rgba("+t[1]+",1)":e:i.hex(n)?(r=n.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(n,e,t,r){return e+e+t+t+r+r}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r),"rgba("+parseInt(a[1],16)+","+parseInt(a[2],16)+","+parseInt(a[3],16)+",1)"):i.hsl(n)?function(n){var e,t,r,a=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(n)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(n),o=parseInt(a[1],10)/360,u=parseInt(a[2],10)/100,i=parseInt(a[3],10)/100,c=a[4]||1;function s(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+6*(e-n)*t:t<.5?e:t<2/3?n+(e-n)*(2/3-t)*6:n}if(0==u)e=t=r=i;else{var f=i<.5?i*(1+u):i+u-i*u,l=2*i-f;e=s(l,f,o+1/3),t=s(l,f,o),r=s(l,f,o-1/3)}return"rgba("+255*e+","+255*t+","+255*r+","+c+")"}(n):void 0;var e,t,r,a}function C(n){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(n);if(e)return e[1]}function P(n,e){return i.fnc(n)?n(e.target,e.id,e.total):n}function I(n,e){return n.getAttribute(e)}function D(n,e,t){if(M([t,"deg","rad","turn"],C(e)))return e;var a=r.CSS[e+t];if(!i.und(a))return a;var o=document.createElement(n.tagName),u=n.parentNode&&n.parentNode!==document?n.parentNode:document.body;u.appendChild(o),o.style.position="absolute",o.style.width=100+t;var c=100/o.offsetWidth;u.removeChild(o);var s=c*parseFloat(e);return r.CSS[e+t]=s,s}function B(n,e,t){if(e in n.style){var r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=n.style[e]||getComputedStyle(n).getPropertyValue(r)||"0";return t?D(n,a,t):a}}function T(n,e){return i.dom(n)&&!i.inp(n)&&(!i.nil(I(n,e))||i.svg(n)&&n[e])?"attribute":i.dom(n)&&M(t,e)?"transform":i.dom(n)&&"transform"!==e&&B(n,e)?"css":null!=n[e]?"object":void 0}function E(n){if(i.dom(n)){for(var e,t=n.style.transform||"",r=/(\w+)\(([^)]*)\)/g,a=new Map;e=r.exec(t);)a.set(e[1],e[2]);return a}}function F(n,e,t,r){var a,u=o(e,"scale")?1:0+(o(a=e,"translate")||"perspective"===a?"px":o(a,"rotate")||o(a,"skew")?"deg":void 0),i=E(n).get(e)||u;return t&&(t.transforms.list.set(e,i),t.transforms.last=e),r?D(n,i,r):i}function A(n,e,t,r){switch(T(n,e)){case"transform":return F(n,e,r,t);case"css":return B(n,e,t);case"attribute":return I(n,e);default:return n[e]||0}}function N(n,e){var t=/^(\*=|\+=|-=)/.exec(n);if(!t)return n;var r=C(n)||0,a=parseFloat(e),o=parseFloat(n.replace(t[0],""));switch(t[0][0]){case"+":return a+o+r;case"-":return a-o+r;case"*":return a*o+r}}function S(n,e){if(i.col(n))return O(n);if(/\s/g.test(n))return n;var t=C(n),r=t?n.substr(0,n.length-t.length):n;return e?r+e:r}function L(n,e){return Math.sqrt(Math.pow(e.x-n.x,2)+Math.pow(e.y-n.y,2))}function j(n){for(var e,t=n.points,r=0,a=0;a<t.numberOfItems;a++){var o=t.getItem(a);a>0&&(r+=L(e,o)),e=o}return r}function q(n){if(n.getTotalLength)return n.getTotalLength();switch(n.tagName.toLowerCase()){case"circle":return o=n,2*Math.PI*I(o,"r");case"rect":return 2*I(a=n,"width")+2*I(a,"height");case"line":return L({x:I(r=n,"x1"),y:I(r,"y1")},{x:I(r,"x2"),y:I(r,"y2")});case"polyline":return j(n);case"polygon":return t=(e=n).points,j(e)+L(t.getItem(t.numberOfItems-1),t.getItem(0))}var e,t,r,a,o}function H(n,e){var t=e||{},r=t.el||function(n){for(var e=n.parentNode;i.svg(e)&&i.svg(e.parentNode);)e=e.parentNode;return e}(n),a=r.getBoundingClientRect(),o=I(r,"viewBox"),u=a.width,c=a.height,s=t.viewBox||(o?o.split(" "):[0,0,u,c]);return{el:r,viewBox:s,x:s[0]/1,y:s[1]/1,w:u,h:c,vW:s[2],vH:s[3]}}function V(n,e,t){function r(t){void 0===t&&(t=0);var r=e+t>=1?e+t:0;return n.el.getPointAtLength(r)}var a=H(n.el,n.svg),o=r(),u=r(-1),i=r(1),c=t?1:a.w/a.vW,s=t?1:a.h/a.vH;switch(n.property){case"x":return(o.x-a.x)*c;case"y":return(o.y-a.y)*s;case"angle":return 180*Math.atan2(i.y-u.y,i.x-u.x)/Math.PI}}function $(n,e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=S(i.pth(n)?n.totalLength:n,e)+"";return{original:r,numbers:r.match(t)?r.match(t).map(Number):[0],strings:i.str(n)||e?r.split(t):[]}}function W(n){return m(n?y(i.arr(n)?n.map(b):b(n)):[],function(n,e,t){return t.indexOf(n)===e})}function X(n){var e=W(n);return e.map(function(n,t){return{target:n,id:t,total:e.length,transforms:{list:E(n)}}})}function Y(n,e){var t=x(e);if(/^spring/.test(t.easing)&&(t.duration=s(t.easing)),i.arr(n)){var r=n.length;2===r&&!i.obj(n[0])?n={value:n}:i.fnc(e.duration)||(t.duration=e.duration/r)}var a=i.arr(n)?n:[n];return a.map(function(n,t){var r=i.obj(n)&&!i.pth(n)?n:{value:n};return i.und(r.delay)&&(r.delay=t?0:e.delay),i.und(r.endDelay)&&(r.endDelay=t===a.length-1?e.endDelay:0),r}).map(function(n){return k(n,t)})}function Z(n,e){var t=[],r=e.keyframes;for(var a in r&&(e=k(function(n){for(var e=m(y(n.map(function(n){return Object.keys(n)})),function(n){return i.key(n)}).reduce(function(n,e){return n.indexOf(e)<0&&n.push(e),n},[]),t={},r=function(r){var a=e[r];t[a]=n.map(function(n){var e={};for(var t in n)i.key(t)?t==a&&(e.value=n[t]):e[t]=n[t];return e})},a=0;a<e.length;a++)r(a);return t}(r),e)),e)i.key(a)&&t.push({name:a,tweens:Y(e[a],n)});return t}function G(n,e){var t;return n.tweens.map(function(r){var a=function(n,e){var t={};for(var r in n){var a=P(n[r],e);i.arr(a)&&1===(a=a.map(function(n){return P(n,e)})).length&&(a=a[0]),t[r]=a}return t.duration=parseFloat(t.duration),t.delay=parseFloat(t.delay),t}(r,e),o=a.value,u=i.arr(o)?o[1]:o,c=C(u),s=A(e.target,n.name,c,e),f=t?t.to.original:s,l=i.arr(o)?o[0]:f,d=C(l)||C(s),p=c||d;return i.und(u)&&(u=f),a.from=$(l,p),a.to=$(N(u,l),p),a.start=t?t.end:0,a.end=a.start+a.delay+a.duration+a.endDelay,a.easing=h(a.easing,a.duration),a.isPath=i.pth(o),a.isPathTargetInsideSVG=a.isPath&&i.svg(e.target),a.isColor=i.col(a.from.original),a.isColor&&(a.round=1),t=a,a})}var Q={css:function(n,e,t){return n.style[e]=t},attribute:function(n,e,t){return n.setAttribute(e,t)},object:function(n,e,t){return n[e]=t},transform:function(n,e,t,r,a){if(r.list.set(e,t),e===r.last||a){var o="";r.list.forEach(function(n,e){o+=e+"("+n+") "}),n.style.transform=o}}};function z(n,e){X(n).forEach(function(n){for(var t in e){var r=P(e[t],n),a=n.target,o=C(r),u=A(a,t,o,n),i=N(S(r,o||C(u)),u),c=T(a,t);Q[c](a,t,i,n.transforms,!0)}})}function _(n,e){return m(y(n.map(function(n){return e.map(function(e){return function(n,e){var t=T(n.target,e.name);if(t){var r=G(e,n),a=r[r.length-1];return{type:t,property:e.name,animatable:n,tweens:r,duration:a.end,delay:r[0].delay,endDelay:a.endDelay}}}(n,e)})})),function(n){return!i.und(n)})}function R(n,e){var t=n.length,r=function(n){return n.timelineOffset?n.timelineOffset:0},a={};return a.duration=t?Math.max.apply(Math,n.map(function(n){return r(n)+n.duration})):e.duration,a.delay=t?Math.min.apply(Math,n.map(function(n){return r(n)+n.delay})):e.delay,a.endDelay=t?a.duration-Math.max.apply(Math,n.map(function(n){return r(n)+n.duration-n.endDelay})):e.endDelay,a}var J=0;var K=[],U=function(){var n;function e(t){for(var r=K.length,a=0;a<r;){var o=K[a];o.paused?(K.splice(a,1),r--):(o.tick(t),a++)}n=a>0?requestAnimationFrame(e):void 0}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",function(){en.suspendWhenDocumentHidden&&(nn()?n=cancelAnimationFrame(n):(K.forEach(function(n){return n._onDocumentVisibility()}),U()))}),function(){n||nn()&&en.suspendWhenDocumentHidden||!(K.length>0)||(n=requestAnimationFrame(e))}}();function nn(){return!!document&&document.hidden}function en(t){void 0===t&&(t={});var r,o=0,u=0,i=0,c=0,s=null;function f(n){var e=window.Promise&&new Promise(function(n){return s=n});return n.finished=e,e}var l,d,p,v,h,g,y,b,M=(d=w(n,l=t),p=w(e,l),v=Z(p,l),h=X(l.targets),g=_(h,v),y=R(g,p),b=J,J++,k(d,{id:b,children:[],animatables:h,animations:g,duration:y.duration,delay:y.delay,endDelay:y.endDelay}));f(M);function x(){var n=M.direction;"alternate"!==n&&(M.direction="normal"!==n?"normal":"reverse"),M.reversed=!M.reversed,r.forEach(function(n){return n.reversed=M.reversed})}function O(n){return M.reversed?M.duration-n:n}function C(){o=0,u=O(M.currentTime)*(1/en.speed)}function P(n,e){e&&e.seek(n-e.timelineOffset)}function I(n){for(var e=0,t=M.animations,r=t.length;e<r;){var o=t[e],u=o.animatable,i=o.tweens,c=i.length-1,s=i[c];c&&(s=m(i,function(e){return n<e.end})[0]||s);for(var f=a(n-s.start-s.delay,0,s.duration)/s.duration,l=isNaN(f)?1:s.easing(f),d=s.to.strings,p=s.round,v=[],h=s.to.numbers.length,g=void 0,y=0;y<h;y++){var b=void 0,x=s.to.numbers[y],w=s.from.numbers[y]||0;b=s.isPath?V(s.value,l*x,s.isPathTargetInsideSVG):w+l*(x-w),p&&(s.isColor&&y>2||(b=Math.round(b*p)/p)),v.push(b)}var k=d.length;if(k){g=d[0];for(var O=0;O<k;O++){d[O];var C=d[O+1],P=v[O];isNaN(P)||(g+=C?P+C:P+" ")}}else g=v[0];Q[o.type](u.target,o.property,g,u.transforms),o.currentValue=g,e++}}function D(n){M[n]&&!M.passThrough&&M[n](M)}function B(n){var e=M.duration,t=M.delay,l=e-M.endDelay,d=O(n);M.progress=a(d/e*100,0,100),M.reversePlayback=d<M.currentTime,r&&function(n){if(M.reversePlayback)for(var e=c;e--;)P(n,r[e]);else for(var t=0;t<c;t++)P(n,r[t])}(d),!M.began&&M.currentTime>0&&(M.began=!0,D("begin")),!M.loopBegan&&M.currentTime>0&&(M.loopBegan=!0,D("loopBegin")),d<=t&&0!==M.currentTime&&I(0),(d>=l&&M.currentTime!==e||!e)&&I(e),d>t&&d<l?(M.changeBegan||(M.changeBegan=!0,M.changeCompleted=!1,D("changeBegin")),D("change"),I(d)):M.changeBegan&&(M.changeCompleted=!0,M.changeBegan=!1,D("changeComplete")),M.currentTime=a(d,0,e),M.began&&D("update"),n>=e&&(u=0,M.remaining&&!0!==M.remaining&&M.remaining--,M.remaining?(o=i,D("loopComplete"),M.loopBegan=!1,"alternate"===M.direction&&x()):(M.paused=!0,M.completed||(M.completed=!0,D("loopComplete"),D("complete"),!M.passThrough&&"Promise"in window&&(s(),f(M)))))}return M.reset=function(){var n=M.direction;M.passThrough=!1,M.currentTime=0,M.progress=0,M.paused=!0,M.began=!1,M.loopBegan=!1,M.changeBegan=!1,M.completed=!1,M.changeCompleted=!1,M.reversePlayback=!1,M.reversed="reverse"===n,M.remaining=M.loop,r=M.children;for(var e=c=r.length;e--;)M.children[e].reset();(M.reversed&&!0!==M.loop||"alternate"===n&&1===M.loop)&&M.remaining++,I(M.reversed?M.duration:0)},M._onDocumentVisibility=C,M.set=function(n,e){return z(n,e),M},M.tick=function(n){i=n,o||(o=i),B((i+(u-o))*en.speed)},M.seek=function(n){B(O(n))},M.pause=function(){M.paused=!0,C()},M.play=function(){M.paused&&(M.completed&&M.reset(),M.paused=!1,K.push(M),C(),U())},M.reverse=function(){x(),M.completed=!M.reversed,C()},M.restart=function(){M.reset(),M.play()},M.remove=function(n){rn(W(n),M)},M.reset(),M.autoplay&&M.play(),M}function tn(n,e){for(var t=e.length;t--;)M(n,e[t].animatable.target)&&e.splice(t,1)}function rn(n,e){var t=e.animations,r=e.children;tn(n,t);for(var a=r.length;a--;){var o=r[a],u=o.animations;tn(n,u),u.length||o.children.length||r.splice(a,1)}t.length||r.length||e.pause()}return en.version="3.2.1",en.speed=1,en.suspendWhenDocumentHidden=!0,en.running=K,en.remove=function(n){for(var e=W(n),t=K.length;t--;)rn(e,K[t])},en.get=A,en.set=z,en.convertPx=D,en.path=function(n,e){var t=i.str(n)?g(n)[0]:n,r=e||100;return function(n){return{property:n,el:t,svg:H(t),totalLength:q(t)*(r/100)}}},en.setDashoffset=function(n){var e=q(n);return n.setAttribute("stroke-dasharray",e),e},en.stagger=function(n,e){void 0===e&&(e={});var t=e.direction||"normal",r=e.easing?h(e.easing):null,a=e.grid,o=e.axis,u=e.from||0,c="first"===u,s="center"===u,f="last"===u,l=i.arr(n),d=l?parseFloat(n[0]):parseFloat(n),p=l?parseFloat(n[1]):0,v=C(l?n[1]:n)||0,g=e.start||0+(l?d:0),m=[],y=0;return function(n,e,i){if(c&&(u=0),s&&(u=(i-1)/2),f&&(u=i-1),!m.length){for(var h=0;h<i;h++){if(a){var b=s?(a[0]-1)/2:u%a[0],M=s?(a[1]-1)/2:Math.floor(u/a[0]),x=b-h%a[0],w=M-Math.floor(h/a[0]),k=Math.sqrt(x*x+w*w);"x"===o&&(k=-x),"y"===o&&(k=-w),m.push(k)}else m.push(Math.abs(u-h));y=Math.max.apply(Math,m)}r&&(m=m.map(function(n){return r(n/y)*y})),"reverse"===t&&(m=m.map(function(n){return o?n<0?-1*n:-n:Math.abs(y-n)}))}return g+(l?(p-d)/y:d)*(Math.round(100*m[e])/100)+v}},en.timeline=function(n){void 0===n&&(n={});var t=en(n);return t.duration=0,t.add=function(r,a){var o=K.indexOf(t),u=t.children;function c(n){n.passThrough=!0}o>-1&&K.splice(o,1);for(var s=0;s<u.length;s++)c(u[s]);var f=k(r,w(e,n));f.targets=f.targets||n.targets;var l=t.duration;f.autoplay=!1,f.direction=t.direction,f.timelineOffset=i.und(a)?l:N(a,l),c(t),t.seek(f.timelineOffset);var d=en(f);c(d),u.push(d);var p=R(u,n);return t.delay=p.delay,t.endDelay=p.endDelay,t.duration=p.duration,t.seek(0),t.reset(),t.autoplay&&t.play(),t},t},en.easing=h,en.penner=v,en.random=function(n,e){return Math.floor(Math.random()*(e-n+1))+n},en});

}

/* ---------------------------------- BUMB ---------------------------------- */
class Bump {
    constructor(t=PIXI){if(void 0===t)throw new Error("Please assign a rendering engine in the constructor before using bump.js");this.renderer="pixi"}addCollisionProperties(t){"pixi"===this.renderer&&(void 0===t.gx&&Object.defineProperty(t,"gx",{get:()=>t.getGlobalPosition().x,enumerable:!0,configurable:!0}),void 0===t.gy&&Object.defineProperty(t,"gy",{get:()=>t.getGlobalPosition().y,enumerable:!0,configurable:!0}),void 0===t.centerX&&Object.defineProperty(t,"centerX",{get:()=>t.x+t.width/2,enumerable:!0,configurable:!0}),void 0===t.centerY&&Object.defineProperty(t,"centerY",{get:()=>t.y+t.height/2,enumerable:!0,configurable:!0}),void 0===t.halfWidth&&Object.defineProperty(t,"halfWidth",{get:()=>t.width/2,enumerable:!0,configurable:!0}),void 0===t.halfHeight&&Object.defineProperty(t,"halfHeight",{get:()=>t.height/2,enumerable:!0,configurable:!0}),void 0===t.xAnchorOffset&&Object.defineProperty(t,"xAnchorOffset",{get:()=>void 0!==t.anchor?t.width*t.anchor.x:0,enumerable:!0,configurable:!0}),void 0===t.yAnchorOffset&&Object.defineProperty(t,"yAnchorOffset",{get:()=>void 0!==t.anchor?t.height*t.anchor.y:0,enumerable:!0,configurable:!0}),t.circular&&void 0===t.radius&&Object.defineProperty(t,"radius",{get:()=>t.width/2,enumerable:!0,configurable:!0})),t._bumpPropertiesAdded=!0}hitTestPoint(t,e){let i,r,h,s,o,f;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),"rectangle"===(i=e.radius?"circle":"rectangle")&&(r=e.x-e.xAnchorOffset,h=e.x+e.width-e.xAnchorOffset,s=e.y-e.yAnchorOffset,o=e.y+e.height-e.yAnchorOffset,f=t.x>r&&t.x<h&&t.y>s&&t.y<o),"circle"===i){let i=t.x-e.x-e.width/2+e.xAnchorOffset,r=t.y-e.y-e.height/2+e.yAnchorOffset;f=Math.sqrt(i*i+r*r)<e.radius}return f}hitTestCircle(t,e,i=!1){let r,h,s,o,f;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),i?(r=e.gx+e.width/2-e.xAnchorOffset-(t.gx+t.width/2-t.xAnchorOffset),h=e.gy+e.width/2-e.yAnchorOffset-(t.gy+t.width/2-t.yAnchorOffset)):(r=e.x+e.width/2-e.xAnchorOffset-(t.x+t.width/2-t.xAnchorOffset),h=e.y+e.width/2-e.yAnchorOffset-(t.y+t.width/2-t.yAnchorOffset)),f=(s=Math.sqrt(r*r+h*h))<(o=t.radius+e.radius)}circleCollision(t,e,i=!1,r=!1){t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e);let h,s,o,f,n,d,a,l={},c=!1;if(r?(f=e.gx+e.width/2-e.xAnchorOffset-(t.gx+t.width/2-t.xAnchorOffset),n=e.gy+e.width/2-e.yAnchorOffset-(t.gy+t.width/2-t.yAnchorOffset)):(f=e.x+e.width/2-e.xAnchorOffset-(t.x+t.width/2-t.xAnchorOffset),n=e.y+e.width/2-e.yAnchorOffset-(t.y+t.width/2-t.yAnchorOffset)),(h=Math.sqrt(f*f+n*n))<(s=t.radius+e.radius)){c=!0,o=s-h,o+=.3,d=f/h,a=n/h,t.x-=o*d,t.y-=o*a,i&&(l.x=n,l.y=-f,this.bounceOffSurface(t,l))}return c}movingCircleCollision(t,e,i=!1){t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e);let r,h,s,o,f={},n={},d={},a={},l={},c=!1;if(t.mass=t.mass||1,e.mass=e.mass||1,i?(f.vx=e.gx+e.radius-e.xAnchorOffset-(t.gx+t.radius-t.xAnchorOffset),f.vy=e.gy+e.radius-e.yAnchorOffset-(t.gy+t.radius-t.yAnchorOffset)):(f.vx=e.x+e.radius-e.xAnchorOffset-(t.x+t.radius-t.xAnchorOffset),f.vy=e.y+e.radius-e.yAnchorOffset-(t.y+t.radius-t.yAnchorOffset)),f.magnitude=Math.sqrt(f.vx*f.vx+f.vy*f.vy),r=t.radius+e.radius,f.magnitude<r){c=!0,h=r-f.magnitude,h+=.3,f.dx=f.vx/f.magnitude,f.dy=f.vy/f.magnitude,f.vxHalf=Math.abs(f.dx*h/2),f.vyHalf=Math.abs(f.dy*h/2),s=t.x>e.x?1:-1,o=t.y>e.y?1:-1,t.x=t.x+f.vxHalf*s,t.y=t.y+f.vyHalf*o,e.x=e.x+f.vxHalf*-s,e.y=e.y+f.vyHalf*-o,f.lx=f.vy,f.ly=-f.vx;let i=t.vx*f.dx+t.vy*f.dy;n.x=i*f.dx,n.y=i*f.dy;let x=t.vx*(f.lx/f.magnitude)+t.vy*(f.ly/f.magnitude);d.x=x*(f.lx/f.magnitude),d.y=x*(f.ly/f.magnitude);let y=e.vx*f.dx+e.vy*f.dy;a.x=y*f.dx,a.y=y*f.dy;let g=e.vx*(f.lx/f.magnitude)+e.vy*(f.ly/f.magnitude);l.x=g*(f.lx/f.magnitude),l.y=g*(f.ly/f.magnitude),t.bounce={},t.bounce.x=d.x+a.x,t.bounce.y=d.y+a.y,e.bounce={},e.bounce.x=n.x+l.x,e.bounce.y=n.y+l.y,t.vx=t.bounce.x/t.mass,t.vy=t.bounce.y/t.mass,e.vx=e.bounce.x/e.mass,e.vy=e.bounce.y/e.mass}return c}multipleCircleCollision(t,e=!1){for(let r=0;r<t.length;r++){var i=t[r];for(let h=r+1;h<t.length;h++){let r=t[h];this.movingCircleCollision(i,r,e)}}}rectangleCollision(t,e,i=!1,r=!0){let h,s,o,f,n,d,a;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),r?(d=t.gx+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.gx+Math.abs(e.halfWidth)-e.xAnchorOffset),a=t.gy+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.gy+Math.abs(e.halfHeight)-e.yAnchorOffset)):(d=t.x+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.x+Math.abs(e.halfWidth)-e.xAnchorOffset),a=t.y+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.y+Math.abs(e.halfHeight)-e.yAnchorOffset)),s=Math.abs(t.halfWidth)+Math.abs(e.halfWidth),o=Math.abs(t.halfHeight)+Math.abs(e.halfHeight),Math.abs(d)<s&&Math.abs(a)<o&&((f=s-Math.abs(d))>=(n=o-Math.abs(a))?(a>0?(h="top",t.y=t.y+n):(h="bottom",t.y=t.y-n),i&&(t.vy*=-1)):(d>0?(h="left",t.x=t.x+f):(h="right",t.x=t.x-f),i&&(t.vx*=-1))),h}hitTestRectangle(t,e,i=!1){let r,h,s,o,f;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),r=!1,i?(o=t.gx+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.gx+Math.abs(e.halfWidth)-e.xAnchorOffset),f=t.gy+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.gy+Math.abs(e.halfHeight)-e.yAnchorOffset)):(o=t.x+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.x+Math.abs(e.halfWidth)-e.xAnchorOffset),f=t.y+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.y+Math.abs(e.halfHeight)-e.yAnchorOffset)),h=Math.abs(t.halfWidth)+Math.abs(e.halfWidth),s=Math.abs(t.halfHeight)+Math.abs(e.halfHeight),r=Math.abs(o)<h&&Math.abs(f)<s}hitTestCircleRectangle(t,e,i=!1){let r,h,s,o,f,n;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),t._bumpPropertiesAdded||this.addCollisionProperties(t),i?(s=t.gx,o=t.gy,f=e.gx,n=e.gy):(s=t.x,o=t.y,f=e.x,n=e.y),"topMiddle"===(r=o-t.yAnchorOffset<n-Math.abs(e.halfHeight)-e.yAnchorOffset?s-t.xAnchorOffset<f-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"topLeft":s-t.xAnchorOffset>f+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"topRight":"topMiddle":o-t.yAnchorOffset>n+Math.abs(e.halfHeight)-e.yAnchorOffset?s-t.xAnchorOffset<f-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomLeft":s-t.xAnchorOffset>f+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomRight":"bottomMiddle":s-t.xAnchorOffset<f-Math.abs(e.halfWidth)-e.xAnchorOffset?"leftMiddle":"rightMiddle")||"bottomMiddle"===r||"leftMiddle"===r||"rightMiddle"===r)h=this.hitTestRectangle(t,e,i);else{let s={};switch(r){case"topLeft":s.x=f-e.xAnchorOffset,s.y=n-e.yAnchorOffset;break;case"topRight":s.x=f+e.width-e.xAnchorOffset,s.y=n-e.yAnchorOffset;break;case"bottomLeft":s.x=f-e.xAnchorOffset,s.y=n+e.height-e.yAnchorOffset;break;case"bottomRight":s.x=f+e.width-e.xAnchorOffset,s.y=n+e.height-e.yAnchorOffset}h=this.hitTestCirclePoint(t,s,i)}return h?r:h}hitTestCirclePoint(t,e,i=!1){return t._bumpPropertiesAdded||this.addCollisionProperties(t),e.diameter=1,e.width=e.diameter,e.radius=.5,e.centerX=e.x,e.centerY=e.y,e.gx=e.x,e.gy=e.y,e.xAnchorOffset=0,e.yAnchorOffset=0,e._bumpPropertiesAdded=!0,this.hitTestCircle(t,e,i)}circleRectangleCollision(t,e,i=!1,r=!1){let h,s,o,f,n,d;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),t._bumpPropertiesAdded||this.addCollisionProperties(t),r?(o=t.gx,f=t.gy,n=e.gx,d=e.gy):(o=t.x,f=t.y,n=e.x,d=e.y),"topMiddle"===(h=f-t.yAnchorOffset<d-Math.abs(e.halfHeight)-e.yAnchorOffset?o-t.xAnchorOffset<n-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"topLeft":o-t.xAnchorOffset>n+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"topRight":"topMiddle":f-t.yAnchorOffset>d+Math.abs(e.halfHeight)-e.yAnchorOffset?o-t.xAnchorOffset<n-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomLeft":o-t.xAnchorOffset>n+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomRight":"bottomMiddle":o-t.xAnchorOffset<n-Math.abs(e.halfWidth)-e.xAnchorOffset?"leftMiddle":"rightMiddle")||"bottomMiddle"===h||"leftMiddle"===h||"rightMiddle"===h)s=this.rectangleCollision(t,e,i,r);else{let o={};switch(h){case"topLeft":o.x=n-e.xAnchorOffset,o.y=d-e.yAnchorOffset;break;case"topRight":o.x=n+e.width-e.xAnchorOffset,o.y=d-e.yAnchorOffset;break;case"bottomLeft":o.x=n-e.xAnchorOffset,o.y=d+e.height-e.yAnchorOffset;break;case"bottomRight":o.x=n+e.width-e.xAnchorOffset,o.y=d+e.height-e.yAnchorOffset}s=this.circlePointCollision(t,o,i,r)}return s?h:s}circlePointCollision(t,e,i=!1,r=!1){return t._bumpPropertiesAdded||this.addCollisionProperties(t),e.diameter=1,e.width=e.diameter,e.radius=.5,e.centerX=e.x,e.centerY=e.y,e.gx=e.x,e.gy=e.y,e.xAnchorOffset=0,e.yAnchorOffset=0,e._bumpPropertiesAdded=!0,this.circleCollision(t,e,i,r)}bounceOffSurface(t,e){t._bumpPropertiesAdded||this.addCollisionProperties(t);let i,r,h={},s={},o={},f=t.mass||1;e.lx=e.y,e.ly=-e.x,e.magnitude=Math.sqrt(e.x*e.x+e.y*e.y),e.dx=e.x/e.magnitude,e.dy=e.y/e.magnitude,i=t.vx*e.dx+t.vy*e.dy,h.vx=i*e.dx,h.vy=i*e.dy,r=t.vx*(e.lx/e.magnitude)+t.vy*(e.ly/e.magnitude),s.vx=r*(e.lx/e.magnitude),s.vy=r*(e.ly/e.magnitude),s.vx*=-1,s.vy*=-1,o.x=h.vx+s.vx,o.y=h.vy+s.vy,t.vx=o.x/f,t.vy=o.y/f}contain(t,e,i=!1,r){t._bumpPropertiesAdded||this.addCollisionProperties(t),void 0===e.xAnchorOffset&&(e.xAnchorOffset=0),void 0===e.yAnchorOffset&&(e.yAnchorOffset=0),void 0===t.parent.gx&&(t.parent.gx=0),void 0===t.parent.gy&&(t.parent.gy=0);let h=new Set;return t.x-t.xAnchorOffset<e.x-t.parent.gx-e.xAnchorOffset&&(i&&(t.vx*=-1),t.mass&&(t.vx/=t.mass),t.x=e.x-t.parent.gx-e.xAnchorOffset+t.xAnchorOffset,h.add("left")),t.y-t.yAnchorOffset<e.y-t.parent.gy-e.yAnchorOffset&&(i&&(t.vy*=-1),t.mass&&(t.vy/=t.mass),t.y=e.y-t.parent.gy-e.yAnchorOffset+t.yAnchorOffset,h.add("top")),t.x-t.xAnchorOffset+t.width>e.width-e.xAnchorOffset&&(i&&(t.vx*=-1),t.mass&&(t.vx/=t.mass),t.x=e.width-t.width-e.xAnchorOffset+t.xAnchorOffset,h.add("right")),t.y-t.yAnchorOffset+t.height>e.height-e.yAnchorOffset&&(i&&(t.vy*=-1),t.mass&&(t.vy/=t.mass),t.y=e.height-t.height-e.yAnchorOffset+t.yAnchorOffset,h.add("bottom")),0===h.size&&(h=void 0),h&&r&&r(h),h}outsideBounds(t,e,i){let r=e.x,h=e.y,s=e.width,o=e.height,f=new Set;return t.x<r-t.width&&f.add("left"),t.y<h-t.height&&f.add("top"),t.x>s+t.width&&f.add("right"),t.y>o+t.height&&f.add("bottom"),0===f.size&&(f=void 0),f&&i&&i(f),f}_getCenter(t,e,i){return void 0!==t.anchor?0!==t.anchor[i]?0:e/2:e}hit(t,e,i=!1,r=!1,h,s){let o,f=this.hitTestPoint.bind(this),n=this.hitTestRectangle.bind(this),d=this.hitTestCircle.bind(this),a=this.movingCircleCollision.bind(this),l=this.circleCollision.bind(this),c=this.hitTestCircleRectangle.bind(this),x=this.rectangleCollision.bind(this),y=this.circleRectangleCollision.bind(this),g=void 0!==t.parent,A=void 0!==e.parent;return g&&e instanceof Array||A&&t instanceof Array?function(){if(t instanceof Array){let[t,e]=[e,t]}for(let i=e.length-1;i>=0;i--){let r=e[i];(o=b(t,r))&&s&&s(o,r)}}():(o=b(t,e))&&s&&s(o),o;function b(t,e){let s=void 0!==t.parent,o=void 0!==e.parent;if(s&&o)return t.diameter&&e.diameter?function(t,e){return i?t.vx+t.vy!==0&&e.vx+e.vy!==0?a(t,e,h):l(t,e,r,h):d(t,e)}(t,e):t.diameter&&!e.diameter?function(t,e){return i?y(t,e,r,h):c(t,e,h)}(t,e):function(t,e){return i?x(t,e,r,h):n(t,e,h)}(t,e);if(o&&void 0!==t.x&&void 0!==t.y)return f(t,e);throw new Error(`I'm sorry, ${t} and ${e} cannot be use together in a collision test.'`)}}

}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
{

Eli.String = {

    regRemoveSpace: /\s/g,

    removeSpaces(str){
        return str.replace(this.regRemoveSpace, "")
    },

    replaceAll(str, replacer){
        return str.replace(new RegExp(str, "g"), replacer)
    },
}

Eli.Array = {

    shuffle(array){
        const shuffleArray = []
            
        while(array.length > 0){
            const randomIndex = Math.floor(Math.random() * array.length)
            const randomElement = array.splice(randomIndex, 1)

            shuffleArray.push(randomElement[0])
        }
        
        return shuffleArray
    },

    createProgressiveNumbers(min, max){
        return Array.from({length: max+1 - min}, (_, i) => i + min)
    },

}

Eli.Number = {

    isBetween(number, min, max){
        return number > min && number < max
    },

    isBetweenOrEqual(number, min, max){
        return number >= min && number <= max
    },
}

// Date Eli. Nice to meet me. ;)
Eli.Date = {

    miliSecondsToFrames(ms){
        return Math.floor( ms / 1000 * 60)
    },

    secondsToFrames(seconds){
        return Math.floor(seconds * 60)
    },

    minutesToFrames(minutes){
        return Math.floor(minutes * Math.pow(60, 2) )
    },

    hoursToFrames(hours){
        return Math.floor( hours * Math.pow(60, 3) )
    },

    framesToMiliSeconds(frames){
        return Math.floor( frames * 1000 / 60)
    },

    framesToSeconds(frames){
        return Math.floor(frames / 60)
    },

    framesToMinutes(frames){
        return Math.floor( frames / Math.pow(60, 2))
    },

    framesToHours(frames){
        return Math.floor( frames / Math.pow(60, 3) )
    },
}

Eli.Utils = {

    regExtractMeta: /<([^<>:]+)(:?)([^>]*)>/g,
    regRemoveEscapeCodes: /(\\.\[[^]])/gi,
    regVariable1: /\x1b\x1b/g,
    regVariable2: /\x1bV\[(\d+)\]/gi,
    windowMargin: 4,
    bump: new Bump(PIXI),

    processEval(str, scope = window){
        scope["funcName"] = new Function(`return ${str}`)

        return scope["funcName"](str)
    },

    getFolderAndFileName(string){
        const lastIndex = string.lastIndexOf("/") + 1
        const filename = string.substr(lastIndex)
        const folder = string.substring(0, lastIndex)

        return [folder, filename]
    },

    makeDeepCopy(object){ // Thanks to LTN games!
        const parseObject = function(string)  {
            try {
                return JSON.parse(string, (key, value) => {
                    try {
                        return parseObject(value)
                    } catch (e) {
                        return value
                    }
                })
            } catch (e) {
                return string
                }
        }

        return parseObject(JSON.stringify(object))
    },

    getIdByName(searchName, data){
        return searchName
    },

    calculateScreenPosition(align, offset, size, coordinate = "x", isOnWindowLayer = false){
        if(isOnWindowLayer){
            var screenSize = {
                x: Graphics.boxWidth,
                y: Graphics.boxHeight,
            }[coordinate]
            
        }else{
            var screenSize = {
                x: Graphics.width,
                y: Graphics.height,
            }[coordinate]
        }
        const mainSize = screenSize - size

        switch(align){
            case "center":  
                return (mainSize / 2) + offset
            case "right":
            case "bottom":  
                return (mainSize + offset)
            case "left":
            case "top":
                return 0 + offset
        }

        return offset
    },
    
    centerXPos(objWidth, baseWidth = Graphics.width){
        return Math.abs(objWidth - baseWidth) / 2
    },

    centerYPos(objHeight, baseHeight = Graphics.height){
        return Math.abs(objHeight - baseHeight) / 2
    },

    centerPos(objWidth, objHeight, baseWidth, baseHeight){
        return {
            x:  this.centerXPos(objWidth, baseWidth),
            y:  this.centerYPos(objHeight, baseHeight),
        }
    },

    divideByTheLargest(num1, num2){
        const max = Math.max(num1, num2)
        const min = Math.min(num1, num2)

        return max / min
    },

    isMVAnimation(animation) {
        return !!animation.frames
    },

    isDataActor(data) {
        return data.hasOwnProperty("nickname")
    },
    
    isDataArmor(data) {
        return data.hasOwnProperty("atypeId")
    },
    
    isDataClass(data) {
        return data.hasOwnProperty("learnings")
    },
    
    isDataEnemy(data) {
        return data.hasOwnProperty("dropItems")
    },
    
    isDataItem(data) {
        return data.hasOwnProperty("itypeId")
    },
    
    isDataMapInfo(data) {
        return data.hasOwnProperty("expanded")
    },
    
    isDataSkills(data) {
        return data.hasOwnProperty("stypeId")
    },
    
    isDataStates(data) {
        return data.hasOwnProperty("stepsToRemove")
    },
    
    isDataSystem(data) {
        return data.hasOwnProperty("locale")
    },
    
    isDataTroops(data) {
        return data.hasOwnProperty("members")
    },
    
    isDataWeapon(data) {
        return data.hasOwnProperty("wtypeId")
    },

    isEvent(character){
        return character instanceof Game_Event
    },
    
    isPlayer(character){
        return character instanceof Game_Player
    },
    
    isFollower(character){
        return character instanceof Game_Follower
    },

    isVehicle(character){
        return character instanceof Game_Vehicle
    },

    scene(){
        return SceneManager._scene
    },

    isScene(scene){
        return this.scene().constructor.name === scene.prototype.constructor.name
    },

    convertEscapeVariablesOnly(text){
        text = text.replace(/\\/g, '\x1b')
        text = text.replace(this.regVariable1, '\\')
        text = text.replace(this.regVariable2, function() {
            return $gameVariables.value(Number(arguments[1]))
        }.bind(this))

        return text
    },

    convertEscapeCharacters(text){
        const tempWin = new Window_Base(0,0,0,0)
        text = tempWin.convertEscapeCharacters(text)

        return text
    },

    needEval(param) {
        if(isNaN(param)){

            try{
                return eval(param)
            }catch(err){
                return param
            }

        }else{
            return param
        }
    },

    processEscapeVarOrFormula(arg){
        if(typeof arg !== 'string') return arg
        
        const rawArg = arguments[0]
        arg = this.convertEscapeVariablesOnly(rawArg)
        if(rawArg === arg){
            return this.needEval(arg)
        }else{
            return arg
        }
    },

    getDataMap(mapId) {
        const xhr = new XMLHttpRequest()
        const fileName = "Map%1.json".format(mapId.padZero(3))
        const url = "data/" + fileName

        xhr.open("GET", url, false)
        xhr.send()

        return JSON.parse(xhr.responseText)
    },

    getTextWidth(rawText, allLines, winClass = Window_Base){
        const tempWin = new winClass(0, 0, 1000, 1000)
        const tempText = rawText.substring(0)

        if(allLines){
            var width = Math.max(...tempText.split("\n").map(text => tempWin.drawTextEx(text, 0, 0)))
        }else{
            var width = tempWin.drawTextEx(tempText, 0, 0)
        }

        return width
    },

    getTextHeight(text, allLines){
        const tempWin = new Window_Base(0, 0, 1000, 1000)
        const textState = {text: text.substr(0), index: 0}

        return tempWin.calcTextHeight(textState, allLines)
    },

    getTextSettings(text, allLines){
        return {
            width: this.getTextWidth(text, allLines),
            height: this.getTextHeight(text, allLines),
        }
    },

    getMapCharacter(id){
        if(id >= 0){
            return $gameMap.event(Number(id)) || $gameMap.event(Eli.PluginManager.currentEventId)

        } else if(id == -1){
            return $gamePlayer

        }else if(id < -1){
            return $gamePlayer.followers()._data[Math.abs(Number(id) + 2)]

        }else{
            return $gameMap.vehicles().find(item => 
                Eli.String.removeSpaces(item._type).toLowerCase() === Eli.String.removeSpaces(id).toLowerCase()
            )
        }
    },

    getCharacterId(id){
        const rawCharId = this.needEval(id)
        const charId = isNaN(rawCharId) ? rawCharId : Number(rawCharId)

        return charId
    },

    addInnerChildOnWindow(win, child){
        win._windowContentsSprite.addChild(child)
    },

    addToDecrypterIgnoreList(folder, file){
        const image = `img/${folder}/${file}.png`
        if(!Decrypter._ignoreList.includes(image)) {
            Decrypter._ignoreList.push(image)
        }
    }


}

Eli.KeyCodes = {

    keyboard: {
        backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, pausebreak:19, capslock:20, 
        esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, 
        leftarrow:37, uparrow:38, rightarrow:39, downarrow:40, insert:45, delete:46, 
        0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, 
        a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, 
        o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, 
        leftwindowkey:91, rightwindowkey:92, selectkey:93, 
        numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, 
        numpad6:102, numpad7:103, numpad8:104, numpad9:105, 
        multiply:106, add:107, subtract:109, decimalpoint:110, divide:111, 
        f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,
        numlock:144, scrolllock:145, semicolon:186, equalsign:187, comma:188, dash:189, period:190,
        forwardslash:191, graveaccent:192, openbracket:219, backslash:220, closebracket:221, singlequote:222
    },

    gamepad: {
        a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, select: 8,
        start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15
    },

    defaultKeyboard: [
        9, 13, 16, 17, 18, 27, 32, 33, 34, 37, 38, 39, 
        40, 45, 81, 87, 88, 90, 96, 98, 100, 102, 104, 120
    ],

    defaultGamepad: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15],

    isDefaultKeyboard(keyCode){
        return this.defaultKeyboard.includes(keyCode)
    },

    isDefaultGamepad(keyCode){
        return this.defaultGamepad.includes(keyCode)
    },
}

Eli.PluginManager = {

    currentEventId: 0,
    currentInterpreter: null,

    getPluginName(){
        const srcScript = document.currentScript.src
        const start = srcScript.lastIndexOf("/") + 1
        const end = srcScript.lastIndexOf(".js")
        const pluginName = srcScript.substring(start, end)

        return pluginName
    },

    getPluginVersion(){
        const pluginName = this.getPluginName()
        const desc = $plugins.find(plugin => plugin.name === pluginName).description
        const start = desc.indexOf("♦") + 1
        const end = desc.lastIndexOf("♦")
        const version = desc.substring(start, end)
        const lastPoint = version.lastIndexOf(".")

        return version.substring(0, lastPoint) + version.slice(lastPoint+1)
    },

    convertParameters(parameters){ // Thanks to LTN games!
        const parseParameters = function(string)  {
            try {
                return JSON.parse(string, (key, value) => {
                    try {
                        return parseParameters(value)
                    } catch (e) {
                        return value
                    }
                })
            } catch (e) {
                return string
                }
        }

        return parseParameters(JSON.stringify(parameters));
    },

    createParameters(){
        const pluginName = this.getPluginName()
        const rawParameters = PluginManager.parameters(pluginName)
        const param = this.convertParameters(rawParameters)

        return param
    },

    registerCommands(plugin, commands){
        // if(Eli.Utils.isRpgMakerMV()) return
        // const pluginName = this.getPluginName()

        // for(const command of commands){
        //     const callBack = command
        //     PluginManager.registerCommand(pluginName, command, plugin[callBack].bind(plugin))
        // }
    },

    createRangeOfNumbers(str){
        const ids = Eli.String.removeSpaces(Eli.Utils.convertEscapeVariablesOnly(str)).split(",")
        const rangeIds = []

        for(let i = 0; i < ids.length; i++){
            const id = ids[i]
            if(id.includes("--")){
                const [min, max] = id.split("--").map(item => Number(item))
                const rangeOfIds = Eli.Array.createProgressiveNumbers(min, max)
                rangeIds.push(...rangeOfIds)
            }else{
                rangeIds.push(Number(id))
            }
        }

        return rangeIds
    },

    processEval(str, scope = window){
        scope["funcName"] = new Function(`return ${str}`)

        return scope["funcName"](str)
    },
}

Eli.ColorManager = {

    names: [
        "ALICEBLUE", "ANTIQUEWHITE", "AQUA", "AQUAMARINE", "AZURE", "BEIGE", "BISQUE", "BLACK", "BLANCHEDALMOND", "BLUE", "BLUEVIOLET", "BROWN", 
        "BURLYWOOD", "CADETBLUE", "CHARTREUSE", "CHOCOLATE", "CORAL", "CORNFLOWERBLUE", "CORNSILK", "CRIMSON", "CYAN", "DARKBLUE", "DARKCYAN", 
        "DARKGOLDENROD", "DARKGRAY", "DARKGREY", "DARKGREEN", "DARKKHAKI", "DARKMAGENTA", "DARKOLIVEGREEN", "DARKORANGE", "DARKORCHID", "DARKRED", 
        "DARKSALMON", "DARKSEAGREEN", "DARKSLATEBLUE", "DARKSLATEGRAY", "DARKSLATEGREY", "DARKTURQUOISE", "DARKVIOLET", "DEEPPINK", "DEEPSKYBLUE", 
        "DIMGRAY", "DIMGREY", "DODGERBLUE", "FIREBRICK", "FLORALWHITE", "FORESTGREEN", "FUCHSIA", "GAINSBORO", "GHOSTWHITE", "GOLD", "GOLDENROD", 
        "GRAY", "GREY", "GREEN", "GREENYELLOW", "HONEYDEW", "HOTPINK", "INDIANRED", "INDIGO", "IVORY", "KHAKI", "LAVENDER", "LAVENDERBLUSH", 
        "LAWNGREEN", "LEMONCHIFFON", "LIGHTBLUE", "LIGHTCORAL", "LIGHTCYAN", "LIGHTGOLDENRODYELLOW", "LIGHTGRAY", "LIGHTGREY", "LIGHTGREEN", 
        "LIGHTPINK", "LIGHTSALMON", "LIGHTSEAGREEN", "LIGHTSKYBLUE", "LIGHTSLATEGRAY", "LIGHTSLATEGREY", "LIGHTSTEELBLUE", "LIGHTYELLOW", 
        "LIME", "LIMEGREEN", "LINEN", "MAGENTA", "MAROON", "MEDIUMAQUAMARINE", "MEDIUMBLUE", "MEDIUMORCHID", "MEDIUMPURPLE", "MEDIUMSEAGREEN", 
        "MEDIUMSLATEBLUE", "MEDIUMSPRINGGREEN", "MEDIUMTURQUOISE", "MEDIUMVIOLETRED", "MIDNIGHTBLUE", "MINTCREAM", "MISTYROSE", "MOCCASIN", 
        "NAVAJOWHITE", "NAVY", "OLDLACE", "OLIVE", "OLIVEDRAB", "ORANGE", "ORANGERED", "ORCHID", "PALEGOLDENROD", "PALEGREEN", "PALETURQUOISE", 
        "PALEVIOLETRED", "PAPAYAWHIP", "PEACHPUFF", "PERU", "PINK", "PLUM", "POWDERBLUE", "PURPLE", "REBECCAPURPLE", "RED", "ROSYBROWN", "ROYALBLUE", 
        "SADDLEBROWN", "SALMON", "SANDYBROWN", "SEAGREEN", "SEASHELL", "SIENNA", "SILVER", "SKYBLUE", "SLATEBLUE", "SLATEGRAY", "SLATEGREY", "SNOW", 
        "SPRINGGREEN", "STEELBLUE", "TAN", "TEAL", "THISTLE", "TOMATO", "TURQUOISE", "VIOLET", "WHEAT", "WHITE", "WHITESMOKE", "YELLOW", "YELLOWGREEN",
    ],

    getHexValue(hex, start, end){
        return parseInt(hex.slice(start, end), 16)
    },

    isHexColor(color){
        return color && color[0] === '#'
    },

    isRgb(color){
        return color && color instanceof Array || color.includes(",")
    },

    isHtmlColor(color){
        return color && color[0] !== "#" && isNaN(color[0])
    },

    // Thanks! - https://css-tricks.com/converting-color-spaces-in-javascript/
    nameToRgb(name, alphaGray = 255) {
        // Create fake div
        const fakeDiv = document.createElement("div")
        fakeDiv.style.color = name
        document.body.appendChild(fakeDiv)
        // Get color of div
        const cs = window.getComputedStyle(fakeDiv)
        const rgbString = cs.getPropertyValue("color")
        // Remove div after obtaining desired color value
        document.body.removeChild(fakeDiv)
        const start = rgbString.indexOf("(") + 1
        const end = rgbString.indexOf(")")
        const rawString = rgbString.substring(start, end)
        const rgbArray = rawString.split(",").map(item => Number(item))

        rgbArray.push(alphaGray)

        return rgbArray
    },

    hexToRgb(hex, alphaGray = 255) {
        if(hex.length === 7){
            hex += alphaGray === 255 ? "ff" : "00"
        }
        const r = this.getHexValue(hex, 1, 3)
        const g = this.getHexValue(hex, 3, 5)
        const b = this.getHexValue(hex, 5, 7)
        const a = this.getHexValue(hex, 7, 9)
        const color = [r, g, b, a]
    
        return color
    },

    rgbToHex(color, alphaGray = 255){
        if(typeof color === 'string'){
            color = color.split(",")
        }
        let [r, g, b, a] = color.map(item => Number(item))
        a = a || alphaGray

        r = r.toString(16)
        g = g.toString(16)
        b = b.toString(16)
        a = a.toString(16)
        
        if (r.length === 1) r = "0" + r
        if (g.length === 1) g = "0" + g
        if (b.length === 1) b = "0" + b
        if (a.length === 1) a = "0" + a

        return "#" + r + g + b + a
    },

    formatRgbToArray(color, alphaGray = 255){
        if(typeof color === "string"){
            color = color.split(",")
        }

        if(color.length === 3) color.push(alphaGray)

        return color.map(item => Number(item))
    },

    getHexOrName(color){
        if(this.isRgb(color)){
            color = this.rgbToHex(color)
        }

        return color
    },

    getRgb(color, alphaGray = 255){
        if(this.isHtmlColor(color)){
            return this.nameToRgb(color, alphaGray)

        }else if(this.isHexColor(color)){
            return this.hexToRgb(color, alphaGray)

        } else if(this.isRgb(color)){
            return this.formatRgbToArray(color, alphaGray)

        }else {
            //console.log(`The string ${color} is not a valid color format`)
            return [0, 0, 0, alphaGray]
        }
    },

    getRgbForBlend(color){
        // If ommited, the Alpha value will be 255
        return this.getRgb(color, 255)
    },

    getRgbForTone(color){
        // If ommited, the Gray value will be 0
        return this.getRgb(color, 0)
    },

}

Eli.PixiEventManager = {

    App: null,

    setApp(){
        this.App = Graphics._renderer
    }
}

Eli.Book = {

    version: 5.03,
    url: "https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz",
    parameters: {
        engine: {
            pixelPerfect: false,
            styleOverflow: false,
        },
        playtest: {openDevTools: false, nwWindowPos: -1},
    },
    alias: {},

    initialize(){
        this.initParameters()
        this.setDocumentStyle()
        window.addEventListener("load", this.onWindowLoad.bind(this))
    },

    initParameters(){
        const parameters = Eli.PluginManager.createParameters()
        this.parameters = parameters
    },

    setDocumentStyle(){
        document.body.style.overflow = this.engine().styleOverflow ? "hidden" : ""
    },

    param(){
        return this.parameters
    },

    engine(){
        return this.parameters.engine
    },

    playtest(){
        return this.parameters.playtest
    },

    isPixelPerfect(){
        return this.parameters.engine.pixelPerfect
    },

    onWindowLoad(){
        if(Utils.isNwjs() && Utils.isOptionValid("test")){

            if(this.playtest().openDevTools){
                nw.Window.get().showDevTools()
                
                const [x, y] =  this.playtest().nwWindowPos.split(",").map(item => Number(item))
                if(x > -1){
                    nw.Window.get().x = x
                    nw.Window.get().y = y
                }
                setTimeout(() => {nw.Window.get().focus()}, 1500)

            }
        }
    },

    cmd_callScene(args){
        const sceneClass = args.name

        if(sceneClass === "Scene_Status"){
            const index = Number(args.actorId)
            const partyMember = this.members()[index]

            $gameParty.setMenuActor(partyMember)
            SceneManager.push(window[sceneClass])
            
        }else if(sceneClass === "Scene_Name"){
            const actorId = Number(args.actorId)
            const maxCharacters = args.maxCharacters

            Eli.PluginManager.currentInterpreter._params = [actorId, maxCharacters]
            Eli.PluginManager.currentInterpreter.command303()

        }else{
            SceneManager.push(window[sceneClass])
        }
    },

}

Eli.Book.initialize()
const Alias = Eli.Book.alias

/* ========================================================================== */
/*                                  SAVE DATA                                 */
/* ========================================================================== */

function Eli_SavedContents() {
    this.initialize.apply(this, arguments)
}

Eli_SavedContents.prototype.initialize = function(){
    this.contents = {}
}

Eli_SavedContents.prototype.createNewContent = function(pluginName){
    this.contents[pluginName] = {}
}

Eli_SavedContents.prototype.createContentWithPluginParameters = function(pluginName, pluginParameters){
    this.contents[pluginName] = Utils.makeDeepCopy(pluginParameters)
}

Eli_SavedContents.prototype.addNewDataToContent = function(pluginName, newData, value){
    this.contents[pluginName][newData] = value
}

window.$eliData = null

/* ========================================================================== */
/*                                    CORE                                    */
/* ========================================================================== */

/* -------------------------------- GRAPHICS -------------------------------- */
{

Alias.Graphics_createCanvas = Graphics._createCanvas
Graphics._createCanvas = function() {
    Alias.Graphics_createCanvas.call(this)
    if(Eli.Book.isPixelPerfect()){
        document.body.style.imageRendering = "pixelated"
        document.getElementById("GameCanvas").style.imageRendering = "pixelated"
    }
}

Alias.Graphics_setupPixi = Graphics._setupPixi
Graphics._setupPixi = function() {
    Alias.Graphics_setupPixi.call(this)
    if(Eli.Book.isPixelPerfect()){
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    }
}

}

/* --------------------------------- BITMAP --------------------------------- */
{

Alias.Bitmap_initialize = Bitmap.prototype.initialize
Bitmap.prototype.initialize = function(width, height) {
    Alias.Bitmap_initialize.call(this, width, height)
    this.fontBold = false
}

// Only Alias on MZ
//Alias.Bitmap_updateScaleMode = Bitmap.prototype._updateScaleMode
Bitmap.prototype._updateScaleMode = function() {
    if(this._baseTexture){

        if(Eli.Book.isPixelPerfect() || !this._smooth){
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        }else{
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR
        }
    }
}

Alias.Bitmap_createBaseTexture = Bitmap.prototype._createBaseTexture
Bitmap.prototype._createBaseTexture = function(source) {
    Alias.Bitmap_createBaseTexture.call(this, source)
    if(this.context && Eli.Book.isPixelPerfect()) {
        this.context.imageSmoothingEnabled = false
        this.context.lineCap = "square"
        this.context.lineJoin = "miter"
    }
    this._updateScaleMode()
}

// Overwrite
Bitmap.prototype._makeFontNameText = function() {
    const italic = this.fontItalic ? 'Italic ' : ''
    const bold = this.fontBold ? 'Bold ' : ''
    const size = this.fontSize
    const face = this.fontFace

    return  `${italic}${bold}${size}px ${face}`
}

}

/* --------------------------------- WINDOW --------------------------------- */
{

Object.defineProperty(Window.prototype, "innerWidth", {
    get: function() {
        return Math.max(0, this._width - this._padding * 2)
    },
    configurable: true
})


Object.defineProperty(Window.prototype, "innerHeight", {
    get: function() {
        return Math.max(0, this._height - this._padding * 2)
    },
    configurable: true
})

Alias.Window_initialize = Window.prototype.initialize
Window.prototype.initialize = function() {
    Alias.Window_initialize.call(this)
    Eli.Utils.windowMargin = this._margin
}

}

/* --------------------------------- SPRITE --------------------------------- */
{

Alias.Sprite_initialize = Sprite.prototype.initialize
Sprite.prototype.initialize = function(bitmap) {
    Alias.Sprite_initialize.call(this, bitmap)
    this._pressed = false
    this._hovered = false
    this.createMainRect()
}

// TOUCH START

Alias.Sprite_update = Sprite.prototype.update
Sprite.prototype.update = function(){
    Alias.Sprite_update.call(this)
    this.processTouchEx()
}

Sprite.prototype.processTouchEx = function() {
    if (this.isClickEnabled()) {
        if (this.isBeingTouched()) {
            if (!this._hovered) { // && TouchInput.isHovered()
                this._hovered = true
                this.onMouseEnter()
            }
            if (TouchInput.isTriggered()) {
                this._pressed = true
                this.onPress()
            }
        } else {
            if (this._hovered) {
                this.onMouseExit()
            }
            this._pressed = false
            this._hovered = false
        }
        if (this._pressed && TouchInput.isReleased()) {
            this._pressed = false
            this.onClick()
        }
    } else {
        this._pressed = false
        this._hovered = false
    }
}

Sprite.prototype.isPressed = function() {
    return this._pressed
}

Sprite.prototype.isClickEnabled = function() {
    return this.worldVisible
}

Sprite.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y)
    const localPos = this.worldTransform.applyInverse(touchPos)
    return this.hitTest(localPos.x, localPos.y)
}

Sprite.prototype.hitTest = function(x, y) {
    const rect = new Rectangle(
        -this.anchor.x * this.width,
        -this.anchor.y * this.height,
        this.width,
        this.height
    );
    return rect.contains(x, y)
}

Sprite.prototype.onMouseEnter = function() {
    //
}

Sprite.prototype.onMouseExit = function() {
    //
}

Sprite.prototype.onPress = function() {
    //
}

Sprite.prototype.onClick = function() {
    //
}

// TOUCH END

Sprite.prototype.createMainRect = function(){
    this.mainRect = new Rectangle(this.x, this.y, this.width, this.height)
}

Sprite.prototype.refreshMainRect = function(skipUpdate){
    const global = this.getGlobalPosition(new Point(), skipUpdate)
    this.mainRect = new Rectangle(global.x, global.y, this.width, this.height)
}

Sprite.prototype.scaledWidth = function(){
    return this.scale.x * this.width
}

Sprite.prototype.scaledHeight = function(){
    return this.scale.y * this.height
}

Sprite.prototype.scaledFrameWidth = function(){
    return this.scale.x * this._frame.width
}

Sprite.prototype.scaledFrameHeight = function(){
    return this.scale.y * this._frame.height
}

Sprite.prototype.centerPositionX = function(baseWidth){
    const x = Eli.Utils.centerXPos(this.scaledWidth(), baseWidth)
    this.x = x
}

Sprite.prototype.centerPositionY = function(baseHeight){
    const y = Eli.Utils.centerYPos(this.scaledHeight(), baseHeight)
    this.y = y
}

Sprite.prototype.centerPositionTo = function(baseWidth, baseHeight){
    const x = Eli.Utils.centerXPos(this.scaledWidth(), baseWidth)
    const y = Eli.Utils.centerYPos(this.scaledHeight(), baseHeight)
    this.move(x, y)
}

Sprite.prototype.stretchScaleTo = function(keepRatio, baseWidth = Graphics.width, baseHeight = Graphics.height){
    const bitmapWidth = this.width
    const bitmapHeight = this.height
    const upScale = baseWidth > bitmapWidth || baseHeight > bitmapHeight

    if(keepRatio){
        const widthRatio = baseWidth / bitmapWidth
        const heightRatio = baseHeight / bitmapHeight
        const finalScale = Math.min(widthRatio, heightRatio)

        this.scale.set(finalScale, finalScale)

    }else{
        const widthRatio = Eli.Utils.divideByTheLargest(bitmapWidth, baseWidth)
        const heightRatio = Eli.Utils.divideByTheLargest(bitmapHeight, baseHeight)
        const scaleX = Math.abs(1 - widthRatio)
        const scaleY = Math.abs(1 - heightRatio)

        if(upScale){
            this.scale.set(1 + scaleX, 1 + scaleY)
        }else{
            this.scale.set(1 - scaleX, 1 - scaleY)
        }
    }
}

Sprite.prototype.isMainRectClicked = function(){
    return TouchInput.isTriggered() && this.mainRect.contains(TouchInput._x, TouchInput._y)
}

Sprite.prototype.isMainRectHovered = function(){
    return this.mainRect.contains(TouchInput._movingX, TouchInput._movingY)
}

}

/* ------------------------------- TOUCH INPUT ------------------------------ */
{

Object.defineProperty(TouchInput, 'movingX', {
    get: function() {
        return this._movingX
    },
    configurable: true
})

Object.defineProperty(TouchInput, 'movingY', {
    get: function() {
        return this._movingY
    },
    configurable: true
})

Alias.TouchInput_onMouseMove = TouchInput._onMouseMove
TouchInput._onMouseMove = function(event) {
    this._movingX = Graphics.pageToCanvasX(event.pageX)
    this._movingY = Graphics.pageToCanvasY(event.pageY)
    Alias.TouchInput_onMouseMove.call(this, event)
}

}

/* ========================================================================== */
/*                                    SCENE                                   */
/* ========================================================================== */

/* ------------------------------- SCENE BOOT ------------------------------- */
{

Alias.Scene_Boot_initialize = Scene_Boot.prototype.initialize
Scene_Boot.prototype.initialize = function(){
    Alias.Scene_Boot_initialize.call(this)
    Eli.PixiEventManager.setApp()
}

}

/* -------------------------------- SCENE MAP ------------------------------- */
{

Alias.Scene_Map_start = Scene_Map.prototype.start
Scene_Map.prototype.start = function() {
    if(this._transfer){
        this.beforeStartAndTransferIsOn()
    }
    Alias.Scene_Map_start.call(this)
}

Alias.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects
Scene_Map.prototype.createDisplayObjects = function() {
    Alias.Scene_Map_createDisplayObjects.call(this)
    this.createButtons()
}

Scene_Map.prototype.createButtons = function() {}

Scene_Map.prototype.beforeStartAndTransferIsOn = function() {}


}

/* ========================================================================== */
/*                                   MANAGER                                  */
/* ========================================================================== */

/* ------------------------------ DATA MANAGER ------------------------------ */
{

Alias.DataManager_createGameObjects = DataManager.createGameObjects
DataManager.createGameObjects = function() {
    Alias.DataManager_createGameObjects.call(this)
    $eliData = new Eli_SavedContents()
}

Alias.DataManager_makeSaveContents = DataManager.makeSaveContents
DataManager.makeSaveContents = function() {
    const alias = Alias.DataManager_makeSaveContents.call(this)
    alias.eli = $eliData

    return alias
}

Alias.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Alias.DataManager_extractSaveContents.call(this, contents)
    $eliData = contents.eli
}

}

/* ------------------------------ SCENE MANAGER ----------------------------- */
{
// MZ ONLY
// Alias.SceneManager_isGameActive = SceneManager.isGameActive
// SceneManager.isGameActive = function() {
//     return  Alias.SceneManager_isGameActive.call(this) || 
//             (Eli.Book.playtest().gameFocus && Utils.isOptionValid("test"))
// }

// Alias.SceneManager_reloadGame = SceneManager.reloadGame
// SceneManager.reloadGame = function() {
//     if(Eli.Book.playtest().quickRestart && Utils.isNwjs()){
//         location.reload()
//     }else{
//         Alias.SceneManager_reloadGame.call(this)
//     }
// }

}

/* ========================================================================== */
/*                                   OBJECTS                                  */
/* ========================================================================== */

/* ---------------------------- GAME INTERPRETER ---------------------------- */
{

Alias.Game_Interpreter_clear = Game_Interpreter.prototype.clear
Game_Interpreter.prototype.clear = function() {
    this._commonEventId = 0
    Alias.Game_Interpreter_clear.call(this)
}

Alias.Game_Interpreter_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) {
    Alias.Game_Interpreter_setup.call(this, list, eventId)
    if(eventId === 0){
        this._commonEventId = $gameTemp._commonEventId
    }
    // this.clear();
    // this._mapId = $gameMap.mapId();
    // this._eventId = eventId || 0;
    // this._list = list;
    // Game_Interpreter.requestImages(list);
}

Alias.Game_Interpreter_character = Game_Interpreter.prototype.character
Game_Interpreter.prototype.character = function(param) {
    if(typeof param === "string"){
        return this.getVehicleCharacter(param)

    }else if(param < -1){
        return this.getFollowerCharacter(param)

    }else{
        return Alias.Game_Interpreter_character.call(this, param)
    }
}

// Plugin Command
Alias.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Eli.PluginManager.currentInterpreter = this
    if(this._eventId > 0){
        Eli.PluginManager.currentEventId = this._eventId
    }
    Alias.Game_Interpreter_pluginCommand.call(this, command, args)
}

// Script call
Alias.Game_Interpreter_command355 = Game_Interpreter.prototype.command355
Game_Interpreter.prototype.command355 = function() {
    Eli.PluginManager.currentInterpreter = this
    if(this._eventId > 0){
        Eli.PluginManager.currentEventId = this._eventId
    }
    return Alias.Game_Interpreter_command355.call(this)
}

Game_Interpreter.prototype.getVehicleCharacter = function(vehicleType){
    return  $gameMap.vehicles().find(vehicle => 
            Eli.String.removeSpaces(vehicle._type).toLowerCase() === Eli.String.removeSpaces(vehicleType).toLowerCase())
}

Game_Interpreter.prototype.getFollowerCharacter = function(followerId){
    const index = followerId < 0 ? Math.abs(followerId) - 2 : followerId
    return $gamePlayer.followers().data()[index]
}

}

/* ========================================================================== */
/*                                     END                                    */
/* ========================================================================== */

/*
© ® » «  ∆ ™ ≠ ≤ ≥ ▫ ♫
• ■ ▪ ● ▬ ♦
► ▲ ▼ ◄
→ ← ↑ ↔ ↨
*/



}