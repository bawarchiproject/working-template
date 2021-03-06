/*! bawarchi 2015-05-26 */
!function(win){function patchStyleSheet(cssText){return cssText.replace(RE_PSEUDO_ELEMENTS,PLACEHOLDER_STRING).replace(RE_SELECTOR_GROUP,function(m,prefix,selectorText){for(var selectorGroups=selectorText.split(","),c=0,cs=selectorGroups.length;cs>c;c++){var selector=normalizeSelectorWhitespace(selectorGroups[c])+SPACE_STRING,patches=[];selectorGroups[c]=selector.replace(RE_SELECTOR_PARSE,function(match,combinator,pseudo,attribute,index){if(combinator)return patches.length>0&&(domPatches.push({selector:selector.substring(0,index),patches:patches}),patches=[]),combinator;var patch=pseudo?patchPseudoClass(pseudo):patchAttribute(attribute);return patch?(patches.push(patch),"."+patch.className):match})}return prefix+selectorGroups.join(",")})}function patchAttribute(attr){return!BROKEN_ATTR_IMPLEMENTATIONS||BROKEN_ATTR_IMPLEMENTATIONS.test(attr)?{className:createClassName(attr),applyClass:!0}:null}function patchPseudoClass(pseudo){var activateEventName,deactivateEventName,applyClass=!0,className=createClassName(pseudo.slice(1)),isNegated=":not("==pseudo.substring(0,5);isNegated&&(pseudo=pseudo.slice(5,-1));var bracketIndex=pseudo.indexOf("(");if(bracketIndex>-1&&(pseudo=pseudo.substring(0,bracketIndex)),":"==pseudo.charAt(0))switch(pseudo.slice(1)){case"root":applyClass=function(e){return isNegated?e!=root:e==root};break;case"target":if(8==ieVersion){applyClass=function(e){var handler=function(){var hash=location.hash,hashID=hash.slice(1);return isNegated?hash==EMPTY_STRING||e.id!=hashID:hash!=EMPTY_STRING&&e.id==hashID};return addEvent(win,"hashchange",function(){toggleElementClass(e,className,handler())}),handler()};break}return!1;case"checked":applyClass=function(e){return RE_INPUT_CHECKABLE_TYPES.test(e.type)&&addEvent(e,"propertychange",function(){"checked"==event.propertyName&&toggleElementClass(e,className,e.checked!==isNegated)}),e.checked!==isNegated};break;case"disabled":isNegated=!isNegated;case"enabled":applyClass=function(e){return RE_INPUT_ELEMENTS.test(e.tagName)?(addEvent(e,"propertychange",function(){"$disabled"==event.propertyName&&toggleElementClass(e,className,e.$disabled===isNegated)}),enabledWatchers.push(e),e.$disabled=e.disabled,e.disabled===isNegated):":enabled"==pseudo?isNegated:!isNegated};break;case"focus":activateEventName="focus",deactivateEventName="blur";case"hover":activateEventName||(activateEventName="mouseenter",deactivateEventName="mouseleave"),applyClass=function(e){return addEvent(e,isNegated?deactivateEventName:activateEventName,function(){toggleElementClass(e,className,!0)}),addEvent(e,isNegated?activateEventName:deactivateEventName,function(){toggleElementClass(e,className,!1)}),isNegated};break;default:if(!RE_PSEUDO_STRUCTURAL.test(pseudo))return!1}return{className:className,applyClass:applyClass}}function applyPatches(){for(var elms,selectorText,patches,domSelectorText,c=0;c<domPatches.length;c++){selectorText=domPatches[c].selector,patches=domPatches[c].patches,domSelectorText=selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS,EMPTY_STRING),(domSelectorText==EMPTY_STRING||domSelectorText.charAt(domSelectorText.length-1)==SPACE_STRING)&&(domSelectorText+="*");try{elms=selectorMethod(domSelectorText)}catch(ex){log("Selector '"+selectorText+"' threw exception '"+ex+"'")}if(elms)for(var d=0,dl=elms.length;dl>d;d++){for(var elm=elms[d],cssClasses=elm.className,f=0,fl=patches.length;fl>f;f++){var patch=patches[f];hasPatch(elm,patch)||!patch.applyClass||patch.applyClass!==!0&&patch.applyClass(elm)!==!0||(cssClasses=toggleClass(cssClasses,patch.className,!0))}elm.className=cssClasses}}}function hasPatch(elm,patch){return new RegExp("(^|\\s)"+patch.className+"(\\s|$)").test(elm.className)}function createClassName(className){return namespace+"-"+(6==ieVersion&&patchIE6MultipleClasses?ie6PatchID++:className.replace(RE_PATCH_CLASS_NAME_REPLACE,function(a){return a.charCodeAt(0)}))}function log(message){win.console&&win.console.log(message)}function trim(text){return text.replace(RE_TIDY_TRIM_WHITESPACE,PLACEHOLDER_STRING)}function normalizeWhitespace(text){return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE,SPACE_STRING)}function normalizeSelectorWhitespace(selectorText){return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE,PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE,PLACEHOLDER_STRING))}function toggleElementClass(elm,className,on){var oldClassName=elm.className,newClassName=toggleClass(oldClassName,className,on);newClassName!=oldClassName&&(elm.className=newClassName,elm.parentNode.className+=EMPTY_STRING)}function toggleClass(classList,className,on){var re=RegExp("(^|\\s)"+className+"(\\s|$)"),classExists=re.test(classList);return on?classExists?classList:classList+SPACE_STRING+className:classExists?trim(classList.replace(re,PLACEHOLDER_STRING)):classList}function addEvent(elm,eventName,eventHandler){elm.attachEvent("on"+eventName,eventHandler)}function getXHRObject(){if(win.XMLHttpRequest)return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){return null}}function loadStyleSheet(url){return xhr.open("GET",url,!1),xhr.send(),200==xhr.status?xhr.responseText:EMPTY_STRING}function resolveUrl(url,contextUrl,ignoreSameOriginPolicy){function getProtocol(url){return url.substring(0,url.indexOf("//"))}function getProtocolAndHost(url){return url.substring(0,url.indexOf("/",8))}if(contextUrl||(contextUrl=baseUrl),"//"==url.substring(0,2)&&(url=getProtocol(contextUrl)+url),/^https?:\/\//i.test(url))return ignoreSameOriginPolicy||getProtocolAndHost(contextUrl)==getProtocolAndHost(url)?url:null;if("/"==url.charAt(0))return getProtocolAndHost(contextUrl)+url;var contextUrlPath=contextUrl.split(/[?#]/)[0];return"?"!=url.charAt(0)&&"/"!=contextUrlPath.charAt(contextUrlPath.length-1)&&(contextUrlPath=contextUrlPath.substring(0,contextUrlPath.lastIndexOf("/")+1)),contextUrlPath+url}function parseStyleSheet(url){return url?loadStyleSheet(url).replace(RE_COMMENT,EMPTY_STRING).replace(RE_IMPORT,function(match,quoteChar,importUrl,quoteChar2,importUrl2,media){var cssText=parseStyleSheet(resolveUrl(importUrl||importUrl2,url));return media?"@media "+media+" {"+cssText+"}":cssText}).replace(RE_ASSET_URL,function(match,isBehavior,quoteChar,assetUrl){return quoteChar=quoteChar||EMPTY_STRING,isBehavior?match:" url("+quoteChar+resolveUrl(assetUrl,url,!0)+quoteChar+") "}):EMPTY_STRING}function getStyleSheets(){for(var url,stylesheet,c=0;c<doc.styleSheets.length;c++)stylesheet=doc.styleSheets[c],stylesheet.href!=EMPTY_STRING&&(url=resolveUrl(stylesheet.href),url&&(stylesheet.cssText=stylesheet.rawCssText=patchStyleSheet(parseStyleSheet(url))))}function init(){applyPatches(),enabledWatchers.length>0&&setInterval(function(){for(var c=0,cl=enabledWatchers.length;cl>c;c++){var e=enabledWatchers[c];e.disabled!==e.$disabled&&(e.disabled?(e.disabled=!1,e.$disabled=!0,e.disabled=!0):e.$disabled=e.disabled)}},250)}function ContentLoaded(win,fn){var done=!1,top=!0,init=function(e){("readystatechange"!=e.type||"complete"==doc.readyState)&&(("load"==e.type?win:doc).detachEvent("on"+e.type,init,!1),!done&&(done=!0)&&fn.call(win,e.type||e))},poll=function(){try{root.doScroll("left")}catch(e){return void setTimeout(poll,50)}init("poll")};if("complete"==doc.readyState)fn.call(win,EMPTY_STRING);else{if(doc.createEventObject&&root.doScroll){try{top=!win.frameElement}catch(e){}top&&poll()}addEvent(doc,"readystatechange",init),addEvent(win,"load",init)}}var ieUserAgent=navigator.userAgent.match(/MSIE (\d+)/);if(!ieUserAgent)return!1;var doc=document,root=doc.documentElement,xhr=getXHRObject(),ieVersion=ieUserAgent[1];if(!("CSS1Compat"!=doc.compatMode||6>ieVersion||ieVersion>8)&&xhr){var selectorMethod,selectorEngines={NW:"*.Dom.select",MooTools:"$$",DOMAssistant:"*.$",Prototype:"$$",YAHOO:"*.util.Selector.query",Sizzle:"*",jQuery:"*",dojo:"*.query"},enabledWatchers=[],domPatches=[],ie6PatchID=0,patchIE6MultipleClasses=!0,namespace="slvzr",RE_COMMENT=/(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g,RE_IMPORT=/@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g,RE_ASSET_URL=/(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g,RE_PSEUDO_STRUCTURAL=/^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/,RE_PSEUDO_ELEMENTS=/:(:first-(?:line|letter))/g,RE_SELECTOR_GROUP=/((?:^|(?:\s*})+)(?:\s*@media[^{]+{)?)\s*([^\{]*?[\[:][^{]+)/g,RE_SELECTOR_PARSE=/([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g,RE_LIBRARY_INCOMPATIBLE_PSEUDOS=/(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g,RE_PATCH_CLASS_NAME_REPLACE=/[^\w-]/g,RE_INPUT_ELEMENTS=/^(INPUT|SELECT|TEXTAREA|BUTTON)$/,RE_INPUT_CHECKABLE_TYPES=/^(checkbox|radio)$/,BROKEN_ATTR_IMPLEMENTATIONS=ieVersion>6?/[\$\^*]=(['"])\1/:null,RE_TIDY_TRAILING_WHITESPACE=/([(\[+~])\s+/g,RE_TIDY_LEADING_WHITESPACE=/\s+([)\]+~])/g,RE_TIDY_CONSECUTIVE_WHITESPACE=/\s+/g,RE_TIDY_TRIM_WHITESPACE=/^\s*((?:[\S\s]*\S)?)\s*$/,EMPTY_STRING="",SPACE_STRING=" ",PLACEHOLDER_STRING="$1",baseTags=doc.getElementsByTagName("BASE"),baseUrl=baseTags.length>0?baseTags[0].href:doc.location.href;getStyleSheets(),ContentLoaded(win,function(){for(var engine in selectorEngines){var members,member,context=win;if(win[engine]){for(members=selectorEngines[engine].replace("*",engine).split(".");(member=members.shift())&&(context=context[member]););if("function"==typeof context)return selectorMethod=context,void init()}}})}}(this);