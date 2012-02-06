/*
 * Description: operate events of segment manage
 * Author: william wei
 */
var monthAbbreviations = {'1':'Jan','2':'Feb','3':'Mar','4':'Apr','5':'May','6':'Jun','7':'Jul','8':'Aug','9':'Sep','10':'Oct','11':'Nov','12':'Dec'};
var globalPopups = {};
/*functions added by sophist start*/
function l(o){
	if(typeof(console)!='undefined'){
		console.log(o);
	}else{
		alert(o);
	}
}
function stringToTimeStamp(str) {
                date = str;
                var arr = date.split('-');
                var datestr = arr[1] + ' ' + arr[0] + ',' + arr[2];
                var dat=Date.parse(datestr);
                return dat;
}
/*functions added by sophist end*/


function suitContent(contentId){
	var cId = contentId?contentId:"content";
	var winWidth = document.documentElement.clientWidth;
	var winHeight = document.documentElement.clientHeight;
    var header = document.getElementById("header");
	if (!header) {
		header = document.getElementById("header2");
	}
    var content = document.getElementById(cId);
    var footer = document.getElementById("footer");
	var aHeight = winHeight - header.offsetHeight;
	if(footer) aHeight = aHeight - footer.offsetHeight;
	content.style.height = aHeight - 13 + "px";
}
function getElement(objInfo){
	var obj = typeof(objInfo)=='object'?objInfo:document.getElementById(objInfo);
	return obj;
}
function getWindowSize(){
	var pageObj = document.documentElement || document.body;
    var w = pageObj.clientWidth || pageObj.offsetWidth; 
    var h = pageObj.clientHeight || pageObj.offsetHeight;
    return {
		page : pageObj,
		width: w,
		height: h
	}; 
}
function getArea(objInfo,scrollObj){
	var obj = getElement(objInfo);
	if(!obj) return;
	var s = getWindowSize();
	var sTop = s.page.scrollTop;
	var sLeft = s.page.scrollLeft;
	var position;
	if(typeof(obj.getBoundingClientRect)=="object"){
		var area = obj.getBoundingClientRect();
		var _top = area.top + sTop;
		var _left = area.left + sLeft;
		var _right = _left + obj.offsetWidth;
		var _bottom = _top + obj.offsetHeight;
		position = {
		  object : obj,
		  top : _top,
		  left : _left,
		  right : _right,
		  bottom : _bottom,
		  getBy:"bound"
		}
	}else{
		var e = obj;
		var t = e.offsetTop;
		var l = e.offsetLeft;
		while(e=e.offsetParent){
			t += e.offsetTop;
			l += e.offsetLeft;
		}
		var p = obj.parentNode;
		while(p&&p.tagName!='BODY'&&p.tagName!='HTML'){
		    t -= p.scrollTop;
		    l -= p.scrollLeft;
			p = (p.parentNode||null);
		}
		var r = l + obj.offsetWidth;
		var b = t + obj.offsetHeight;
		position = {object:obj,left:l,top:t,right:r,bottom:b,getBy:"area"};
	}
	return position;
}
function escapeString(str,times){
	if(!str) return str;
	var str = encodeURIComponent(str);
	str = str.replace(/\!/g,'%21');
	str = str.replace(/\'/g,'%27');
	str = str.replace(/\(/g,'%28');
	str = str.replace(/\)/g,'%29');
	str = str.replace(/\*/g,'%2a');
	if(times){
		for(var i=1;i<times;i++){
			str = encodeURIComponent(str);
		}
	}
	return str;
}
function unescapeString(str){
	if(!str) return str;
	var str = decodeURIComponent(str);
	return str;
}
function overArea(positionInfo,aimObj){
	var areaObj;
	if(typeof(positionInfo)=="string"){
		areaObj = getArea(positionInfo);
	}else{
		areaObj = positionInfo;
	}
	if(!areaObj || !aimObj) return;
	var s = getWindowSize();
	var _x = aimObj.clientX + s.page.scrollLeft;
	var _y = aimObj.clientY + s.page.scrollTop;
    if(_x<areaObj.left || _x>areaObj.right || _y<areaObj.top || _y>areaObj.bottom){
		return false;
	}else{
		return true;
	}
}
function getNearByPosition(sourceObj,popObj,areaObj){
    var ps = getArea(sourceObj);
	var pW = popObj.offsetWidth;
	var pH = popObj.offsetHeight;
	var area;
	if(areaObj){
	    area = getArea(areaObj);
	}else{
	    var windowSize = getWindowSize();
	    area = {
		   top : 0,
		   left : 0,
		   right : windowSize.width,
		   bottom : windowSize.height
		};
	}
	var _l = ps.right - pW;
	var _t = ps.top - pH;
	if((_l + pW)>area.right){
		_l = area.left + (pW/2);
	}
	if((_t + pH)>area.bottom){
		_t = area.bottom - pH - 10;
	}
	if(_l<0){_l = 10;}
	if(_t<0){_t = 10;}
	var position = {
	    top : _t,
		left : _l
	};
	return position;
}
function getIframeObjArea(iframeId,objId){
	var obj = typeof(objId)=="string"?document.getElementById("objId"):objId;
	var fm = document.getElementById(iframeId);
	var bPs = fm.contentWindow.getArea(obj);
	var fPs = getArea(fm);
	var _l = fPs.left + bPs.left;
	var _t = fPs.top + bPs.top;
	var _r = fPs.left + bPs.right;
	var _b = _t + (bPs.bottom-bPs.top);
	var ps = {
		"left":_l,
		"top":_t,
		"right":_r,
		"bottom":_b
	}
	return ps;
}
function hasChild(objInfo,t){
    var children = getChild(objInfo,t);
    //IE will return NodeList in HTML 
    if (children.length==1 && children.tagName==null){
        return 0;
    }
    return children.length;
}
function getChild(objInfo,t){
	this.getChildNode = function(oInfo,w){
        var obj = typeof(oInfo)=="string"?document.getElementById(oInfo):oInfo;
		if(!obj) return;
		var children = obj.children;
		if(!children){
			var cns = obj.childNodes;
			if(navigator.userAgent.match(/Firefox/)){//just go for firefox.
				children = [];
				for(var i=0; i<cns.length; i++){
					if(!cns[i].tagName) continue;
					children[children.length] = cns[i];
				}
			}else{
			   children = cns;
			}
		}
		if(w!=null){
			var n = parseInt(w);
			if(Math.abs(n)>children.length){
				n = n>0?children.length:0;
			}
			if(n<0) n = children.length + n;
			return children[n];
		}else{
			return children;
		}
	}
	if(typeof(t)=="object"){
		var aimObj = typeof(objInfo)=="string"?document.getElementById(objInfo):objInfo;
	    for(var f=0; f<t.length; f++){
			aimObj = this.getChildNode(aimObj,t[f]);
		}
		return aimObj;
	}else{
		return this.getChildNode(objInfo,t);
	}
}
function showLoading(obj,code){
		var box = typeof(obj)=="object"?obj:document.getElementById(obj);
	    box.innerHTML = code?code:"<img src='images/loadingIcon.gif' style='margin:5px;' border='0'>";
}
//notice: this function will return an array.
function getChildByTagName(oInfo,tagName,filter){
    var obj = typeof(oInfo)=="string"?document.getElementById(oInfo):oInfo;
	if(!obj || typeof(obj.getElementsByTagName)=='undefined') return [];
	var cs = obj.getElementsByTagName(tagName);
	if(typeof(filter)=='function'){
	    var getItems = [];
		for(var i=0;i<cs.length;i++){
			if(filter(cs[i])) getItems[getItems.length] = cs[i];
		}
		return getItems;
	}else{
		return cs;
	}
}
//disable all
function coverAll(level){
    discoverAll();
	var coverId = "coverObject";
	var coverObj = document.createElement("div");
	var wSize = getWindowSize();
	coverObj.style.position = "absolute";
	coverObj.id = coverId;
	coverObj.style.background = "#cccccc";
	coverObj.style.zIndex = level;
	coverObj.style.display = "";
	coverObj.style.top = "0px";
	coverObj.style.left = "0px";
	coverObj.style.width = wSize.page.scrollWidth + "px";
	coverObj.style.height = wSize.page.scrollHeight + "px";
	coverObj.onclick = function(){return false};
	coverObj.style.filter = "alpha(opacity=40)";
	coverObj.style.opacity = "0.4";
	document.body.appendChild(coverObj);
}
//enable all
function discoverAll(){
    var coverObj = document.getElementById("coverObject");
	if(coverObj) document.body.removeChild(coverObj);
}
function attendEvent(obj,eventName,functionName){
    var fun;
	var objs = obj.length>0?obj:[obj];
	for(var i=0; i<objs.length; i++){
	    fun = typeof(functionName)=="string"?new Function(functionName):functionName;
	    objs[i]['on' + eventName] = fun;
	}
}
function addEvent(oTarget,sEventType,funName){
    if(oTarget.addEventListener){
        oTarget.addEventListener(sEventType, funName, false);
    }else if(oTarget.attachEvent){
        oTarget.attachEvent("on" + sEventType, funName);
    }else{
        oTarget["on" + sEventType] = funName;
    }
};
function removeEvent(oTarget,sEventType,funName){
    if(oTarget.removeEventListener){
        oTarget.removeEventListener(sEventType, funName, false);
    }else if(oTarget.detachEvent){
        oTarget.detachEvent("on" + sEventType, funName);
    }else{
        oTarget["on" + sEventType] = null;
    }
};
function cloneObject(obj){
	var cObj = {};
	for(var key in obj){
		cObj[key] = obj[key];
	}
	return cObj;
}
var cacheManager = {
	cachePage : function(url){
		this.onload(function(){
		   var f = document.createElement('iframe');
		   f.style.visible = 'hidden';
		   f.style.position = 'absolute';
		   f.style.top = '0px';
		   f.style.left = '0px';
		   f.style.width = '0px';
		   f.style.height = '0px';
		   f.src = url + "#cache";;
		   document.body.appendChild(f);
	   });
	},
	onload : function(fun){
		var u = document.location.href;
		if(u.match(/\#cache$/)) return;
		addEvent(window,'load',fun);
	}
}
/* ajax managements based on YAHOO.util.Connect */
var ajaxManager = {
    connections : {},
	defaultMethod : "GET",
	getConncetionObject : function(id){
	    var o = typeof(id)=="string"?this.connections[id]:id;
		return o;
	},
	request : function(requestId,sUrl,callback,method,postData){
	    if(typeof(YAHOO.util.Connect)=="undefined") return;
	    var cObj = this.getConncetionObject(requestId);
		if(cObj && sUrl==cObj['uri'] && YAHOO.util.Connect.isCallInProgress(cObj['connection'])){
		    return;
		}else{
		    method = method?method:this.defaultMethod;
			if(cObj && cObj['connection']){
			    YAHOO.util.Connect.abort(cObj['connection']);
			}
			if (sUrl.indexOf('?') > -1) {
				sUrl = sUrl + '&t=' + new Date().getTime();
			} else {
				sUrl = sUrl + '?t=' + new Date().getTime();
			}
		    var connectObj = YAHOO.util.Connect.asyncRequest(method,sUrl,callback,postData);
			cObj = {
			    uri : sUrl,
				connection : connectObj
			};
		    this.connections[requestId] = cObj; 
		}
		return cObj;
	},
	isCalling : function(requestId){
	    var cObj = this.getConncetionObject(requestId);
		if(cObj){
		    return YAHOO.util.Connect.isCallInProgress(cObj['connection']);
		}else{
		    return false;
		}
	},
	abort : function(requestIds,callback,isTimeout){
		var ids = typeof(requestId)=="string"?[requestIds]:requestIds;
	    var cObj;
		for(var i=0; i<ids.length; i++){
			cObj = this.getConncetionObject(ids[i]);
			if(cObj && cObj['connection']){
				YAHOO.util.Connect.abort(cObj['connection'],callback,isTimeout);
				ajaxManager.connections[ids[i]] = null;
			}
		}
	},
    abortAllConnections : function(){
	    for(var key in this.connections){
		    this.connections[key]['connection'].abort();
		}
		this.connections = {};
	}
};
function display(objInfo,v){
	var obj = typeof(objInfo)=="string"?document.getElementById(objInfo):objInfo;
	if(obj) obj.style.display = v?"":"none";
}
function isDisplay(objInfo){
	var obj = typeof(objInfo)=="string"?document.getElementById(objInfo):objInfo;
	if(obj && obj.style.display != "none"){return true}; return false;
}
function getPreviousNode(objInfo){
	var obj = typeof(objInfo)=="string"?document.getElementById(objInfo):objInfo;
	var p = obj.previousSibling;
	if(!p) return null;
	if(p.nodeType != 1){
		p = getPreviousNode(p);
	}
	return p;
}
function getNextNode(objInfo){
	var obj = typeof(objInfo)=="string"?document.getElementById(objInfo):objInfo;
	var n = obj.nextSibling;
	if(!n) return null;
	if(n.nodeType != 1){
		n = getNextNode(n);
	}
	return n;
}
function appendNodeAfter(newNode,obj){
	var aimObj = getNextNode(obj)
	obj.parentNode.insertBefore(newNode,aimObj);
}
function highlightKeyword(string,key,endWith,className,parm){
    if(string==='' || key==='') return string;
	var _k = escape(key);
	if (endWith) {
		_k += "$";
	}
	var _p = parm?parm:"i";
	var reg = new RegExp(_k,_p);
	var mc = string.match(reg);
	if(mc){
	    var _c = className?className:"highlight";
		if (endWith) {
			return string.replace(new RegExp(mc[0] + "$",_p),"<span class='" + _c + "'>" + mc[0] + "</span>");
		} else {
			return string.replace(mc[0],"<span class='" + _c + "'>" + mc[0] + "</span>");
		}
	}else{
	    return string;	
	}
}
function redirectToPage(url){
	document.location.href = url;
}
function getStyle(objInfo,attribute){
	var obj = typeof(objInfo)=="object"?objInfo:document.getElementById(objInfo);
	var v = null;
	if(obj.currentStyle){
		v = obj.currentStyle[attribute];
	}else{
		v = window.getComputedStyle(obj, null).getPropertyValue(attribute);
	}
	return v;
}
function openNewWindow(url){
	window.open(url);
}
function changeView(obj, url){
	var className = (obj.className != null) ? obj.className : '';
	if (className == 'selectedItem') {
		return;
	}
	document.location.href = url;
}
function getTopLayer() {
	var topLayer = 0, zIndex;
	for (var key in globalPopups) {
		zIndex = globalPopups[key];
		if (typeof(zIndex) == "function") {
			continue;
		}
		if (zIndex > topLayer) {
			topLayer = zIndex;
		}
	}
	return topLayer;
}
function getTopZIndex(getObject){
	var divObjs = document.getElementsByTagName("div");
	if(!divObjs.length) return 0;
	var n = 0, zIndex = 0, topObject;
	for(var i=0; i<divObjs.length; i++){
		if(getStyle(divObjs[i],"position")=="absolute"){
			zIndex = getStyle(divObjs[i],"z-index") || getStyle(divObjs[i],"zIndex") || 0;
			zIndex = parseInt(zIndex);
			if(zIndex>n){
				topObject = divObjs[i];
				n = zIndex;
			}else{
				n++;
			}
		}
	}
	return getObject?{object:topObject, zIndex:n}:n;
}
function setToTop(object){
	var topObj = getTopZIndex(1);
	if(topObj.object!=object){
		object.style.zIndex = topObj.zIndex + 1;
	}
}
function showDialogWindow(obj_id){
    if (former) former.dropdown.hideOptions();
	var winWidth = document.documentElement.clientWidth;
	var winHeight = document.documentElement.clientHeight;
	var dialogWinObj = document.getElementById(obj_id);
    if (dialogWinObj==null) {
		return false;
	}
	var zIndex = dialogWinObj.style.zIndex;
	if (!zIndex) {
		zIndex = 1;
	}
	globalPopups[obj_id] = zIndex;
	if (dialogWinObj.style.display=="none"){
		//create overlay
		var topLayer = getTopLayer();
		if (topLayer > 0) {
			coverAll(topLayer - 1);
		}
	}
	var ddObj = new YAHOO.util.DD(obj_id); 
	ddObj.scroll = false;
	ddObj.setHandleElId(dialogWinObj.children[0]);

	dialogWinObj.style.display = "";
    var top = (winHeight - dialogWinObj.offsetHeight)/2;
    var left = (winWidth - dialogWinObj.offsetWidth)/2;
    top = (top<0)?0:top;
    left = (left<0)?0:left;
	dialogWinObj.style.top = top + "px";
	dialogWinObj.style.left = left + "px";
    return true;
}
function hideDialogWindow(obj_id){
	var dialogWinObj = document.getElementById(obj_id);
    if (dialogWinObj==null) {
		return false;
	}
	dialogWinObj.style.display = "none";
	var waitingLayer = globalPopups[obj_id];
	if (typeof(globalPopups[obj_id]) != "undefined") {
		delete globalPopups[obj_id];
	}
	var topLayer = getTopLayer();
	var iframe = document.getElementById('popPickerIframe');
	var valuePicker = document.getElementById('valuePicker');
	if (iframe && valuePicker.style.visibility != "hidden" && obj_id == "waitingBox") {
		if (!waitingLayer) {
			if (topLayer > 0) {
				waitingLayer = 1999;
			} else {
				waitingLayer = 2;
			}
		}
		topLayer = waitingLayer - 1;
	}
	if (topLayer > 0) {
		coverAll(topLayer - 1);
	} else {
		discoverAll();
	}
    return true;
}
function showWaiting(status,htmlText,nextEvent){
	var waitingImg = document.getElementById("waiting_img");
	var successImg = document.getElementById("success_img");
	var failureImg = document.getElementById("failure_img");
	var waitingText = document.getElementById("waiting_text");
	var waitingOkContainer = document.getElementById("waiting_ok_container");
	var waitingOk = document.getElementById("waiting_ok");	
	
	waitingImg.style.display = "none";
	successImg.style.display = "none";
	failureImg.style.display = "none";
	if (status && status=="waiting"){
		waitingImg.style.display = "";
		waitingText.innerHTML = " Please wait... ";
		waitingOkContainer.style.display = "none";
	}else if (status && status=="success"){
		successImg.style.display = "";
		waitingText.innerHTML = " Successfully! ";
		waitingOkContainer.style.display = "";
	}else {
		failureImg.style.display = "";
		waitingText.innerHTML = " Failure! ";
		waitingOkContainer.style.display = "";
	}
	if (htmlText && htmlText!="") {
		waitingText.innerHTML = htmlText;
		waitingText.className = "word_blue_bold";
	} else {
		waitingText.className = "";
	}
    
    if (nextEvent && (typeof(nextEvent)=="function")){
        waitingOk.onclick = nextEvent;
    }else{
        waitingOk.onclick = null;
    }
    
    return showDialogWindow("waitingBox");
}
function hideWaiting(){
	return hideDialogWindow("waitingBox");
}
/* drag drop */
var dragger = {
	_w : 0,
	_h : 0,
	proxy : null,
	fish : null,
	config : {},
	seize : function(objInfo,config){
		var obj = getElement(objInfo);
		if(!obj) return;
		obj.style.position = 'absolute';
		var cfObj = config?config:{};
		var dragBar = cfObj.dragBar?getElement(cfObj.dragBar):obj;
		dragBar.style.cursor = 'move';
		addEvent(dragBar,'mousedown',function(e){dragger.hook(e,obj,cfObj);});
	},
	hook : function (e,objInfo,config){
		var config = typeof(config)=='object'?config:{};
		dragger.config = config;
		var e = e || window.event;
		var obj = objInfo?objInfo:(e.target||e.srcElement);
		dragger.fish = obj;
		var areaBox = typeof(config.area)!='undefined'?config.area:null;
		var ps = getArea(obj,areaBox);
		dragger._w = e.clientX - ps.left;
		dragger._h = e.clientY - ps.top;
		this.createProxy = function(){
		    var _px = document.createElement("div");
		    _px.style.position = "absolute";
		    _px.style.display = "none";
		    document.body.appendChild(_px);
		    return _px;
		}
		if(typeof(config.hasProxy)!='undefined'&&config.hasProxy){
			var pc = this.createProxy();
			var code = typeof(config.fishnet)!='undefined'?config.fishnet.replace('#fish#',obj.innerHTML):obj.innerHTML;
			pc.innerHTML = "<div id='dragContent'>" + code + "</div>";
			pc.style.top = ps.top + "px";
			pc.style.left = ps.left + "px";
			pc.style.width = obj.offsetWidth + "px";
			pc.style.height = obj.offsetHeight + "px";
			pc.style.zIndex = 1111;
			pc.className = typeof(config.proxyClass)!='undefined'?config.proxyClass:"dragProxy";
			dragger.proxy = pc;
		}
		addEvent(document,'mousemove',dragger.going);
		addEvent(document,'mouseup',dragger.stopDrag);
	},
	going : function(e){
		var e = e || window.event;
		var obj = dragger.proxy?dragger.proxy:dragger.fish;
		obj.style.display = "";
		obj.style.top = (e.clientY - dragger._h) + "px";
		obj.style.left = (e.clientX - dragger._w) + "px";
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		if(typeof(dragger.config.onDragging)=="function") dragger.config.onDragging(e);
	},
	stopDrag : function (e){
		var e = e || window.event;
		removeEvent(document,'mousemove',dragger.going);
		removeEvent(document,'mouseup',dragger.stopDrag);
		if(dragger.proxy){
			document.body.removeChild(dragger.proxy);
			dragger.proxy = null;
		}
		if(typeof(dragger.config.onStopDrag)=="function"){
			dragger.config.onStopDrag(e);
		}
	}
}
/**
 * get inner text of element control
 */
function getInnerText(element) {
	if (element == null) {
		return '';
	}
	return (document.all) ? element.innerText : element.textContent;
}
function setInnerText(element, value) {
	if (element == null) {
		return;
	}
	if (typeof(element) == "string") {
		element = document.getElementById(element);
	}
	if (document.all) {
		element.innerText = value;
	} else {
		element.textContent = value;
	}
}
Array.prototype.inArray = function (value) 
// Returns true if the passed value is found in the 
// array.  Returns false if it is not. 
{ 
    var i; 
    for (i=0; i < this.length; i++) { 
        // Matches identical (===), not just similar (==). 
        if (this[i] === value) { 
            return true; 
        } 
    } 
    return false; 
}; 
Array.prototype.allEq = function (value) 
// Returns true if the passed value is found in the 
// array.  Returns false if it is not. 
{ 
    var i; 
    for (i=0; i < this.length; i++) { 
        // Matches identical (===), not just similar (==). 
        if (this[i] != value) { 
            return false; 
        } 
    } 
    return true; 
};