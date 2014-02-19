var point = 1;
var timestampNum = 1;
var likesNum = 1;
var contentIdLoadBefore = 1;
var contentLengthNow = 0;
var contentId = 1;
var ctLShowJudge = true;
var needToLoad = true;

var $ = function(className){
    return document.getElementsByClassName(className)[0];
};

var getCss = function(className){
    return window.getComputedStyle(document.getElementsByClassName(className)[0],false);
};

var selectFalse = function(){
    document.onselectstart = function(){return false;};
    if(navigator.userAgent.indexOf('Firefox') >= 0){
        var divElement = document.getElementsByTagName("div")
        var divlength = divElement.length;
        for (var i = 0; i < divlength; ++i) {
            divElement[i].style.mozUserSelect = "none";
        };
    };
};

var selectTrue = function(){
    document.onselectstart = function(){return true;};
    if(navigator.userAgent.indexOf('Firefox') >= 0){
        var divElement = document.getElementsByTagName("div")
        var divlength = divElement.length;
        for (var i = 0; i < divlength; ++i) {
            divElement[i].style.mozUserSelect = "text";
        };
    };
};

var ctLMainMove = function(T,thePoint){
    $("ctLMain"+point).style.left = "100%";

    var countTime = 1;
    var moveDistance;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;//加速时间
    const t2 = 0.6*T;//减速时间
    const v  = 200/T;
    var moveTime = setInterval(function(){  
        if(countTime <= t1){
            moveDistance = 0.5*a1*countTime*countTime;
        }
        else{
            moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
        };
        $("ctLMain"+thePoint).style.left = (100 - moveDistance)+"%";
        if(countTime < T){
            ++countTime;
        }
        else{
            clearInterval(moveTime);
        }
    },1);
};

var arrowMove = function(T,thePoint){
    var countTime = 1;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;//加速时间
    const t2 = 0.6*T;//减速时间
    const v  = 200/T;
    const arrowLeftNow  = parseFloat($("arrowLeft").style.width);
    const arrowRightNow = parseFloat($("arrowRight").style.width);
    const length = thePoint*25;
    var moveTime = setInterval(function(){  
        if(countTime <= t1){
            moveDistance = (0.5*a1*countTime*countTime)*length/100;
        }
        else{
            moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
        };
        $("arrowLeft").style.width = (arrowLeftNow - moveDistance) +"%";
        $("arrowRight").style.width = (arrowRightNow + moveDistance) +"%";
        console.log(arrowLeftNow);
        if(countTime < T){
            ++countTime;
        }
        else{
            clearInterval(moveTime);
        }
    },1);
};

var changeScrollBarTop = function(scrollHeight,contentHeight,marginTopNow){
    var contentHeight =  parseFloat(getCss("ctLMain").height);
    var scrollHeight  = parseFloat(getCss("ctLMain"+point).height) - contentHeight;
    var marginTopNow  = 0 - parseFloat(getCss("ctLMain"+point).marginTop);
    var scrollBarHeiht = parseFloat(getCss("ctLScrollBar").height);
    var scrollTop     = marginTopNow/scrollHeight*(contentHeight - scrollBarHeiht);
    $("ctLScrollBar").style.top = scrollTop +"px";
};

var changeScrollBarHeight = function(){
    var contentHeight = parseFloat(getCss("ctLMain").height);
    var mainNowHeight = parseFloat(getCss("ctLMain"+point).height);
    var hasMainNow    = mainNowHeight - contentHeight;
    if(hasMainNow <= 0 ){
        $("ctLScrollBar").style.height = 0 +"px";
    }
    else{
        $("ctLScrollBar").style.height = contentHeight*contentHeight/mainNowHeight +"px";
    }
    changeScrollBarTop();
};

var ctLMainScroll = function(theScroll){
    var marginTopNow  =  parseFloat(getCss("ctLMain"+point).marginTop);
    var contentHeight = parseFloat(getCss("ctLMain").height);
    var mainNowHeight = parseFloat(getCss("ctLMain"+point).height);
    if((mainNowHeight - contentHeight)>0){
        var hasOverBottom  = marginTopNow + mainNowHeight - contentHeight;
        if(theScroll < 0){//主体内容上滚
            if(hasOverBottom > 55){
                $("ctLMain"+point).style.marginTop = (marginTopNow-55) +"px";
                changeScrollBarTop();
            }
            else if(hasOverBottom > 0){
                $("ctLMain"+point).style.marginTop = (contentHeight - mainNowHeight) + "px";
                changeScrollBarTop();
            };
            if(parseFloat($("ctLMain"+point).style.marginTop) <= (contentHeight - mainNowHeight + 70)){
                linkContentLoad("timestamp");
            };            
        }
        else if(theScroll > 0){//主体内容下滚
            if(marginTopNow < -55){
                $("ctLMain"+point).style.marginTop = (marginTopNow+55) + "px";
                changeScrollBarTop();
            }
            else if(marginTopNow < 0){
                $("ctLMain"+point).style.marginTop = 0;
                changeScrollBarTop();
            };
            
        };
    };
};

var linkContentLoad = function(type){
    var json;
    var content;
    var contentJson;
    var xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
            var json  = JSON.parse(xmlhttp.responseText);
            if(json.status){
                if(type === "timestamp"){
                    ++timestampNum;
                }
                else if(type === "likes"){
                    ++likesNum;
                }
                for (var i = 0;i < json.length;++i){
                    content = json.result[i];
                    $("ctLMain1").innerHTML = $("ctLMain1").innerHTML 
                                        + "<a href='"+content.url
                                        +"' class='eachConnection' onclick='return ecCilck(this)' id='"+content.id
                                        +"'><div class='eachLeft'><div class='ELShareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                        +")'></div><div class='ELShareTitle'><div class='shareTitle'>"+content.title
                                        +"</div><span class='shareDetail'>赞("+content.likes
                                        +")  评论("+ content.comments
                                        +")  " + content.timestamp
                                        +"</span></div></div><div class='eachRight'><div class='ERSharemanImg' style='background:url("+content.author_image
                                        +")'></div><div class='ERShareReason'><span class='shareName'>"+content.author_name
                                        +"</span><span class='shareReason'>"+content.explain
                                        +"</span></div></div></a><hr/>";
                    changeScrollBarHeight();
                };
            };
        };
    };
    xmlhttp.open("POST","/share/list",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    if(type === "timestamp"){
        xmlhttp.send("start="+timestampNum+"&sortby=timestamp");
    }
    else if(type === "likes"){
        xmlhttp.send("start="+likesNum+"&sortby=likes");
    };
    
};

var shuffleLoad = function(){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
            var json  = JSON.parse(xmlhttp.responseText);
            if(json.status){
                $("ctRMain").src = json.url;
                contentId = json.id;
            }
        };
    };
    xmlhttp.open("POST","/share/shuffle",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send();
};

var ecCilck = function(obj){
    contentId = obj.id;
    $("ctRMain").src = obj.href;
    return false;
};

var ctLMainHide = function(T){
    var countTime = 1;
    var moveDistance;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;//加速时间
    const t2 = 0.6*T;//减速时间
    const v  = 200/T;
    const ctLMainWidth = parseFloat(getCss("headerLeft").width);
    const ctRMainWidth = parseFloat(getCss("headerRight").width);
    const length = ctLMainWidth;
    ctLShowJudge = false;
    var moveTime = setInterval(function(){  
        if(countTime <= t1){
            moveDistance = (0.5*a1*countTime*countTime)*length/100;
        }
        else{
            moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
        };
        $("headerLeft").style.marginLeft = (0 - moveDistance) +"px";
        $("headerRight").style.width  = (ctRMainWidth + moveDistance) +"px";
        $("contentLeft").style.marginLeft  = (0 - moveDistance) +"px";
        $("contentRight").style.width = (ctRMainWidth + moveDistance) +"px";
        if(countTime < T){
            ++countTime;
        }
        else{
            $("headerLeft").style.display = "none";
            $("contentLeft").style.display  ="none";
            $("headerRight").style.width  = "100%"
            $("contentRight").style.width = "100%"
            clearInterval(moveTime);
        }
    },1);
};

var ctLMainShow = function(T){
    var bodyWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width);
    var countTime = 1;
    var moveDistance;
    var ctLMainWidth;
    var length;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;//加速时间
    const t2 = 0.6*T;//减速时间
    const v  = 200/T;

    if(bodyWidth <= 1117){
        ctLMainWidth = 335;
        length = 335;
    }
    else{
        ctLMainWidth = bodyWidth*0.3;
        length = bodyWidth*0.3;
    }
    ctLShowJudge = true;
    $("headerLeft").style.marginLeft = (0 - ctLMainWidth) +"px";
    $("contentLeft").style.marginLeft  = (0 - ctLMainWidth) +"px";
    $("headerLeft").style.width = (ctLMainWidth) +"px";
    $("contentLeft").style.width  = (ctLMainWidth) +"px";
    $("headerLeft").style.minWidth = "0px";
    $("contentLeft").style.minWidth  = "0px";

    $("headerLeft").style.display = "inline-block";
    $("contentLeft").style.display  ="inline-block";

    var moveTime = setInterval(function(){  
        if(countTime <= t1){
            moveDistance = (0.5*a1*countTime*countTime)*length/100;
        }
        else{
            moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
        };
        $("headerLeft").style.marginLeft = (0 - ctLMainWidth + moveDistance) +"px";
        $("headerRight").style.width  = (bodyWidth - moveDistance) +"px";
        $("contentLeft").style.marginLeft  = (0 - ctLMainWidth + moveDistance) +"px";
        $("contentRight").style.width = (bodyWidth - moveDistance) +"px";
        if(countTime < T){
            ++countTime;
        }
        else{
            $("headerLeft").style.width = "30%";
            $("contentLeft").style.width  = "30%";
            $("headerLeft").style.minWidth = "335px";
            $("contentLeft").style.minWidth  = "335px";
            $("headerRight").style.width = (bodyWidth - ctLMainWidth) + "px";
            $("contentRight").style.width  = (bodyWidth - ctLMainWidth) + "px";
            clearInterval(moveTime);
        }
    },1);
};

window.onload = function(){
    var ctRMainWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) - parseFloat(getCss("headerLeft").width);
    $("arrowLeft").style.width = (point*25) + "%";
    $("arrowRight").style.width = (3-point)*25 + "%";
    $("ctLMain"+point).style.left = "0%";
    $("headerRight").style.width = ctRMainWidth + "px";
    $("contentRight").style.width = ctRMainWidth + "px";
    linkContentLoad("timestamp");
    shuffleLoad();
}; 

window.onresize = function(){
    var ctRMainWidth
    changeScrollBarHeight();
    if(ctLShowJudge){
        ctRMainWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) - parseFloat(getCss("headerLeft").width);  
        $("headerRight").style.width = ctRMainWidth + "px";
        $("contentRight").style.width = ctRMainWidth + "px";
    };
};

$("hdL0").children[0].onclick = function(){
    if(point !== 0){
        arrowMove(30,point - 0);
        ctLMainMove(50,0);
        point = 0;
        changeScrollBarHeight();
    };
};

$("hdL1").children[0].onclick = function(){
    if(point !== 1){
        arrowMove(30,point - 1);
        ctLMainMove(50,1);
        point = 1;
        changeScrollBarHeight();
    };
};

$("hdL2").children[0].onclick = function(){
    if(point !== 2){
        arrowMove(30,point - 2);
        ctLMainMove(50,2);
        point = 2;      
        changeScrollBarHeight();  
    };
};

$("hdL3").children[0].onclick = function(){
    if(point !== 3){
        arrowMove(30,point - 3);
        ctLMainMove(50,3);
        point = 3;     
        changeScrollBarHeight();   
    };
};

$("moreButton").onclick = function(){
    console.log(1);
    if(ctLShowJudge){
        ctLMainHide(20);
        console.log(2);
    }
    else{
        ctLMainShow(20);
        console.log(3);
    };
};

$("ctLMain").onmousewheel = function(event) {
    event = event || window.event; 
    ctLMainScroll(event.wheelDelta/120);
};
$("ctLMain").addEventListener("DOMMouseScroll", function(event) {
    ctLMainScroll(event.detail/-3);
});

$("ctLScrollBar").onmousedown =function(event){
    event               = event || window.event;
    var mouseStartY     = event.pageY; 
    var contentHeight   = parseFloat(getCss("ctLMain").height);
    var scrollBartopNow = parseFloat(getCss("ctLScrollBar").top);
    var mainNowHeight   = parseFloat(getCss("ctLMain"+point).height);
    var scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
    var scrollHeight    = contentHeight - mainNowHeight;
    var barMoveHeight   = contentHeight - scrollBarHeight;
    var ctLMainMarginTop;
    $("screen").style.display = "block";
    selectFalse();
    document.onmousemove = function(event){
        var moveY = event.pageY - mouseStartY + scrollBartopNow;
        
        if(moveY >= 0 && moveY <= barMoveHeight){
            $("ctLScrollBar").style.top = moveY + "px";
            ctLMainMarginTop = parseFloat(getCss("ctLScrollBar").top)/barMoveHeight*scrollHeight;
            $("ctLMain"+point).style.marginTop = ctLMainMarginTop +"px";
        }
        else if(moveY < 0){
                $("ctLScrollBar").style.top = 0;                    
                $("ctLMain"+point).style.marginTop = 0;
            }
            else if(moveY >= barMoveHeight){
                    $("ctLScrollBar").top = barMoveHeight + "px";                    
                    $("ctLMain"+point).marginTop = scrollHeight + "px";
                }
        if(parseFloat($("ctLMain"+point).style.marginTop) <= (contentHeight - mainNowHeight + 70)){
            if(needToLoad){
                needToLoad = false;
                scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
                barMoveHeight   = contentHeight - scrollBarHeight;
                linkContentLoad("timestamp");
            };            
        }
        else{
            needToLoad = true;
        }
    };
};

document.onmouseup = function(){
    needToLoad = true;
    $("screen").style.display = "none";
    selectTrue();
    document.onmousemove = function(){};
};

window.onbeforeunload = function(){
    return "确定离开当前页面吗？"
}



