/*! bawarchi 2015-05-26 */
!function(window,document,undefined){function setClasses(classes){var className=docElement.className,classPrefix=Modernizr._config.classPrefix||"";if(Modernizr._config.enableJSClass){var reJS=new RegExp("(^|\\s)"+classPrefix+"no-js(\\s|$)");className=className.replace(reJS,"$1"+classPrefix+"js$2")}Modernizr._config.enableClasses&&(className+=" "+classPrefix+classes.join(" "+classPrefix),docElement.className=className)}function is(obj,type){return typeof obj===type}function testRunner(){var featureNames,feature,aliasIdx,result,nameIdx,featureName,featureNameSplit;for(var featureIdx in tests){if(featureNames=[],feature=tests[featureIdx],feature.name&&(featureNames.push(feature.name.toLowerCase()),feature.options&&feature.options.aliases&&feature.options.aliases.length))for(aliasIdx=0;aliasIdx<feature.options.aliases.length;aliasIdx++)featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());for(result=is(feature.fn,"function")?feature.fn():feature.fn,nameIdx=0;nameIdx<featureNames.length;nameIdx++)featureName=featureNames[nameIdx],featureNameSplit=featureName.split("."),1===featureNameSplit.length?Modernizr[featureNameSplit[0]]=result:(!Modernizr[featureNameSplit[0]]||Modernizr[featureNameSplit[0]]instanceof Boolean||(Modernizr[featureNameSplit[0]]=new Boolean(Modernizr[featureNameSplit[0]])),Modernizr[featureNameSplit[0]][featureNameSplit[1]]=result),classes.push((result?"":"no-")+featureNameSplit.join("-"))}}function getBody(){var body=document.body;return body||(body=createElement("body"),body.fake=!0),body}function injectElementWithStyles(rule,callback,nodes,testnames){var style,ret,node,docOverflow,mod="modernizr",div=createElement("div"),body=getBody();if(parseInt(nodes,10))for(;nodes--;)node=createElement("div"),node.id=testnames?testnames[nodes]:mod+(nodes+1),div.appendChild(node);return style=["&#173;",'<style id="s',mod,'">',rule,"</style>"].join(""),div.id=mod,(body.fake?body:div).innerHTML+=style,body.appendChild(div),body.fake&&(body.style.background="",body.style.overflow="hidden",docOverflow=docElement.style.overflow,docElement.style.overflow="hidden",docElement.appendChild(body)),ret=callback(div,rule),body.fake?(body.parentNode.removeChild(body),docElement.style.overflow=docOverflow,docElement.offsetHeight):div.parentNode.removeChild(div),!!ret}function fnBind(fn,that){return function(){return fn.apply(that,arguments)}}function testDOMProps(props,obj,elem){var item;for(var i in props)if(props[i]in obj)return elem===!1?props[i]:(item=obj[props[i]],is(item,"function")?fnBind(item,elem||obj):item);return!1}function cssToDOM(name){return name.replace(/([a-z])-([a-z])/g,function(str,m1,m2){return m1+m2.toUpperCase()}).replace(/^-/,"")}function contains(str,substr){return!!~(""+str).indexOf(substr)}function domToCSS(name){return name.replace(/([A-Z])/g,function(str,m1){return"-"+m1.toLowerCase()}).replace(/^ms-/,"-ms-")}function nativeTestProps(props,value){var i=props.length;if("CSS"in window&&"supports"in window.CSS){for(;i--;)if(window.CSS.supports(domToCSS(props[i]),value))return!0;return!1}if("CSSSupportsRule"in window){for(var conditionText=[];i--;)conditionText.push("("+domToCSS(props[i])+":"+value+")");return conditionText=conditionText.join(" or "),injectElementWithStyles("@supports ("+conditionText+") { #modernizr { position: absolute; } }",function(node){return"absolute"==getComputedStyle(node,null).position})}return undefined}function testProps(props,prefixed,value,skipValueTest){function cleanElems(){afterInit&&(delete mStyle.style,delete mStyle.modElem)}if(skipValueTest=is(skipValueTest,"undefined")?!1:skipValueTest,!is(value,"undefined")){var result=nativeTestProps(props,value);if(!is(result,"undefined"))return result}var afterInit,i,propsLength,prop,before;for(mStyle.style||(afterInit=!0,mStyle.modElem=createElement("modernizr"),mStyle.style=mStyle.modElem.style),propsLength=props.length,i=0;propsLength>i;i++)if(prop=props[i],before=mStyle.style[prop],contains(prop,"-")&&(prop=cssToDOM(prop)),mStyle.style[prop]!==undefined){if(skipValueTest||is(value,"undefined"))return cleanElems(),"pfx"==prefixed?prop:!0;try{mStyle.style[prop]=value}catch(e){}if(mStyle.style[prop]!=before)return cleanElems(),"pfx"==prefixed?prop:!0}return cleanElems(),!1}function testPropsAll(prop,prefixed,elem,value,skipValueTest){var ucProp=prop.charAt(0).toUpperCase()+prop.slice(1),props=(prop+" "+cssomPrefixes.join(ucProp+" ")+ucProp).split(" ");return is(prefixed,"string")||is(prefixed,"undefined")?testProps(props,prefixed,value,skipValueTest):(props=(prop+" "+domPrefixes.join(ucProp+" ")+ucProp).split(" "),testDOMProps(props,prefixed,elem))}function testAllProps(prop,value,skipValueTest){return testPropsAll(prop,undefined,undefined,value,skipValueTest)}!function(window,document){function addStyleSheet(ownerDocument,cssText){var p=ownerDocument.createElement("p"),parent=ownerDocument.getElementsByTagName("head")[0]||ownerDocument.documentElement;return p.innerHTML="x<style>"+cssText+"</style>",parent.insertBefore(p.lastChild,parent.firstChild)}function getElements(){var elements=html5.elements;return"string"==typeof elements?elements.split(" "):elements}function addElements(newElements,ownerDocument){var elements=html5.elements;"string"!=typeof elements&&(elements=elements.join(" ")),"string"!=typeof newElements&&(newElements=newElements.join(" ")),html5.elements=elements+" "+newElements,shivDocument(ownerDocument)}function getExpandoData(ownerDocument){var data=expandoData[ownerDocument[expando]];return data||(data={},expanID++,ownerDocument[expando]=expanID,expandoData[expanID]=data),data}function createElement(nodeName,ownerDocument,data){if(ownerDocument||(ownerDocument=document),supportsUnknownElements)return ownerDocument.createElement(nodeName);data||(data=getExpandoData(ownerDocument));var node;return node=data.cache[nodeName]?data.cache[nodeName].cloneNode():saveClones.test(nodeName)?(data.cache[nodeName]=data.createElem(nodeName)).cloneNode():data.createElem(nodeName),!node.canHaveChildren||reSkip.test(nodeName)||node.tagUrn?node:data.frag.appendChild(node)}function createDocumentFragment(ownerDocument,data){if(ownerDocument||(ownerDocument=document),supportsUnknownElements)return ownerDocument.createDocumentFragment();data=data||getExpandoData(ownerDocument);for(var clone=data.frag.cloneNode(),i=0,elems=getElements(),l=elems.length;l>i;i++)clone.createElement(elems[i]);return clone}function shivMethods(ownerDocument,data){data.cache||(data.cache={},data.createElem=ownerDocument.createElement,data.createFrag=ownerDocument.createDocumentFragment,data.frag=data.createFrag()),ownerDocument.createElement=function(nodeName){return html5.shivMethods?createElement(nodeName,ownerDocument,data):data.createElem(nodeName)},ownerDocument.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+getElements().join().replace(/[\w\-:]+/g,function(nodeName){return data.createElem(nodeName),data.frag.createElement(nodeName),'c("'+nodeName+'")'})+");return n}")(html5,data.frag)}function shivDocument(ownerDocument){ownerDocument||(ownerDocument=document);var data=getExpandoData(ownerDocument);return!html5.shivCSS||supportsHtml5Styles||data.hasCSS||(data.hasCSS=!!addStyleSheet(ownerDocument,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),supportsUnknownElements||shivMethods(ownerDocument,data),ownerDocument}var supportsHtml5Styles,supportsUnknownElements,version="3.7.2",options=window.html5||{},reSkip=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,saveClones=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,expando="_html5shiv",expanID=0,expandoData={};!function(){try{var a=document.createElement("a");a.innerHTML="<xyz></xyz>",supportsHtml5Styles="hidden"in a,supportsUnknownElements=1==a.childNodes.length||function(){document.createElement("a");var frag=document.createDocumentFragment();return"undefined"==typeof frag.cloneNode||"undefined"==typeof frag.createDocumentFragment||"undefined"==typeof frag.createElement}()}catch(e){supportsHtml5Styles=!0,supportsUnknownElements=!0}}();var html5={elements:options.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:version,shivCSS:options.shivCSS!==!1,supportsUnknownElements:supportsUnknownElements,shivMethods:options.shivMethods!==!1,type:"default",shivDocument:shivDocument,createElement:createElement,createDocumentFragment:createDocumentFragment,addElements:addElements};window.html5=html5,shivDocument(document)}(this,document);var classes=[],docElement=document.documentElement,tests=[],ModernizrProto={_version:"3.0.0-alpha.3",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(test,cb){var self=this;setTimeout(function(){cb(self[test])},0)},addTest:function(name,fn,options){tests.push({name:name,fn:fn,options:options})},addAsyncTest:function(fn){tests.push({name:null,fn:fn})}},Modernizr=function(){};Modernizr.prototype=ModernizrProto,Modernizr=new Modernizr,Modernizr.addTest("svg",!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var createElement=function(){return"function"!=typeof document.createElement?document.createElement(arguments[0]):document.createElement.apply(document,arguments)};Modernizr.addTest("placeholder","placeholder"in createElement("input")&&"placeholder"in createElement("textarea"));var testStyles=ModernizrProto.testStyles=injectElementWithStyles;Modernizr.addTest("siblinggeneral",function(){return testStyles("#modernizr div {width:100px} #modernizr div ~ div {width:200px;display:block}",function(elem){return 200==elem.lastChild.offsetWidth},2)}),testStyles("#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}",function(elem){Modernizr.addTest("nthchild",function(){for(var elems=elem.getElementsByTagName("div"),test=!0,i=0;5>i;i++)test=test&&elems[i].offsetWidth===i%2+1;return test})},5);var blacklist=function(){var ua=navigator.userAgent,wkvers=ua.match(/applewebkit\/([0-9]+)/gi)&&parseFloat(RegExp.$1),webos=ua.match(/w(eb)?osbrowser/gi),wppre8=ua.match(/windows phone/gi)&&ua.match(/iemobile\/([0-9])+/gi)&&parseFloat(RegExp.$1)>=9,oldandroid=533>wkvers&&ua.match(/android/gi);return webos||oldandroid||wppre8}();blacklist?Modernizr.addTest("fontface",!1):testStyles('@font-face {font-family:"font";src:url("https://")}',function(node,rule){var style=document.getElementById("smodernizr"),sheet=style.sheet||style.styleSheet,cssText=sheet?sheet.cssRules&&sheet.cssRules[0]?sheet.cssRules[0].cssText:sheet.cssText||"":"",bool=/src/i.test(cssText)&&0===cssText.indexOf(rule.split(" ")[0]);Modernizr.addTest("fontface",bool)}),testStyles("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}",function(elem){Modernizr.addTest("lastchild",elem.lastChild.offsetWidth>elem.firstChild.offsetWidth)},2);var testMediaQuery=function(){var matchMedia=window.matchMedia||window.msMatchMedia;return matchMedia?function(mq){var mql=matchMedia(mq);return mql&&mql.matches||!1}:function(mq){var bool=!1;return injectElementWithStyles("@media "+mq+" { #modernizr { position: absolute; } }",function(node){bool="absolute"==(window.getComputedStyle?window.getComputedStyle(node,null):node.currentStyle).position}),bool}}(),mq=ModernizrProto.mq=testMediaQuery;Modernizr.addTest("mediaqueries",mq("only all"));var omPrefixes="Moz O ms Webkit",cssomPrefixes=ModernizrProto._config.usePrefixes?omPrefixes.split(" "):[];ModernizrProto._cssomPrefixes=cssomPrefixes;var domPrefixes=ModernizrProto._config.usePrefixes?omPrefixes.toLowerCase().split(" "):[];ModernizrProto._domPrefixes=domPrefixes;var modElem={elem:createElement("modernizr")};Modernizr._q.push(function(){delete modElem.elem});var mStyle={style:modElem.elem.style};Modernizr._q.unshift(function(){delete mStyle.style}),ModernizrProto.testAllProps=testPropsAll,ModernizrProto.testAllProps=testAllProps,Modernizr.addTest("bgsizecover",testAllProps("backgroundSize","cover")),Modernizr.addTest("csstransitions",testAllProps("transition","all",!0)),testRunner(),setClasses(classes),delete ModernizrProto.addTest,delete ModernizrProto.addAsyncTest;for(var i=0;i<Modernizr._q.length;i++)Modernizr._q[i]();window.Modernizr=Modernizr}(window,document);