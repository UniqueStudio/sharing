var point = 1;
var timestampNum = 1;
var contentIdLoadBefore = 1;
var contentLengthNow = 0;

var $ = function(className){
    return document.getElementsByClassName(className)[0];
};

var getCss = function(className){
    return window.getComputedStyle(document.getElementsByClassName(className)[0],false);
};

var selectFalse = function(){
    document.onselectstart = function(){return false;};
    if(navigator.userAgent.indexOf('Firefox') >= 0){
        var divElement = document.getElementsBytagName("div")
        var divlength = divElement.length;
        for (var i = 0; i < divlength; ++i) {
            divElement[i].style.mozUserSelect = "none";
        };
    };
};

var selectTrue = function(){
    document.onselectstart = function(){return true;};
    if(navigator.userAgent.indexOf('Firefox') >= 0){
        var divElement = document.getElementsBytagName("div")
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

var changeScrollBarHeight = function(){
    var contentHeight = parseFloat(getCss("ctLMain").height);
    var mainNowHeight = parseFloat(getCss("ctLMain"+point).height);
    var hasMainNow    = mainNowHeight - contentHeight;
    if(hasMainNow <= 0 ){
        $("ctLScrollBar").style.height = 0 +"px";
    }
    else{
        $("ctLScrollBar").style.height = 50 +"px";
    }
    changeScrollBarTop();
};

var changeScrollBarTop = function(scrollHeight,contentHeight,marginTopNow){
    var contentHeight =  parseFloat(getCss("ctLMain").height);
    var scrollHeight  = parseFloat(getCss("ctLMain"+point).height) - contentHeight;
    var marginTopNow  = 0 - parseFloat(getCss("ctLMain"+point).marginTop);
    var scrollTop     = marginTopNow/scrollHeight*(contentHeight - 50);
    $("ctLScrollBar").style.top = scrollTop +"px";
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

var linkContentLoad = function(id){
    var lengthBefore = $("ctLMain1").children.length;
    var json;
    var xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
            var json  = JSON.parse(xmlhttp.responseText);
            if(json.status){
                changeScrollBarHeight();
                $("ctLMain1").innerHTML = $("ctLMain1").innerHTML + json.result;
            };
        };
    };
    //将评论内容发送到服务器中
    xmlhttp.open("POST","/share/list",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("start="+id+"&sortby=timestamp");

    console.log(xmlhttp.responseText);
};

var ecCilck = function(obj){
    return false;
};

var addEachConnection = function(json){

};

window.onload = function(){
    $("arrowLeft").style.width = (point*25) + "%";
    $("arrowRight").style.width = (3-point)*25 + "%";
    $("ctLMain"+point).style.left = "0%";
    linkContentLoad(timestampNum);
}; 

$("hdL0").children[0].onclick = function(){
    if(point !== 0){
        arrowMove(30,point - 0);
        ctLMainMove(200,0);
        point = 0;
        changeScrollBarHeight();
    };
};

$("hdL1").children[0].onclick = function(){
    if(point !== 1){
        arrowMove(30,point - 1);
        ctLMainMove(200,1);
        point = 1;
        changeScrollBarHeight();
    };
};

$("hdL2").children[0].onclick = function(){
    if(point !== 2){
        arrowMove(30,point - 2);
        ctLMainMove(200,2);
        point = 2;      
        changeScrollBarHeight();  
    };
};

$("hdL3").children[0].onclick = function(){
    if(point !== 3){
        arrowMove(30,point - 3);
        ctLMainMove(200,3);
        point = 3;     
        changeScrollBarHeight();   
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
    var scrollHeight    = contentHeight - mainNowHeight;
    var barMoveHeight   = contentHeight - 50;
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
            else if(moveY > barMoveHeight){
                    $("ctLScrollBar").top = barMoveHeight + "px";                    
                    $("ctLMain"+point).marginTop = scrollHeight + "px";
                }
    };
};

document.onmouseup = function(){
    $("screen").style.display = "none";
    selectTrue();
    document.onmousemove = function(){};
};



