(function(){
    //等待效果类
    var waitingDot = function(waitBoxName){
        this.$ = function(className){
            return document.getElementsByClassName(className)[0];
        };

        this.getCss = function(obj){
            return window.getComputedStyle(obj,false);
        };
        this.waitingDot = this;
        this.waitingTime;
        this.eachTime = 4;
        this.waitBoxWidth = parseFloat(this.getCss(this.$(waitBoxName)).width);
        this.waitDotWidth = parseFloat(this.getCss(this.$(waitBoxName).children[0]).width);
        this.Vstart = 15;
        this.Vconst = 3;
        this.speedChangeDis = (this.waitBoxWidth + this.waitDotWidth*3 - 5*this.Vconst*this.eachTime)/2.0;
        this.a = (this.Vconst*this.Vconst - this.Vstart*this.Vstart)/(2.0*this.speedChangeDis);
        this.decTime = (this.Vconst - this.Vstart)/this.a;
        this.conTime = this.eachTime*5;
        this.accTime = this.decTime;
        this.constBegin = this.Vstart*this.decTime + 0.5*this.a*this.decTime*this.decTime;
        this.accBegin = this.constBegin + this.Vconst*this.conTime;
        this.status =  new Array(8);
        this.timeNow = new Array(8);
        this.waitDotColor = new Array("rgb(255, 0, 20)","rgb(255, 0, 122)","rgb(194, 0, 255)","rgb(0, 20, 255)","rgb(0, 214, 255)","rgb(0, 255, 31)","rgb(194, 255, 0)","rgb(255, 92, 0)")
        this.countColor = 0;
        this.Obj = this.$(waitBoxName).children;
        this.waitDotLength = this.Obj.length;

        this.waitingShow = function(){
            this.changeWaitBox();
            this.waitDotMove();
        };
        
        this.waitDotMove = function(){
            for(var i = 0;i < this.waitDotLength;++i){
                this.status[i] = 0;
                this.timeNow[i] = 0 - this.eachTime*i;
            };
            var loopObj = this.waitingDot;
            this.setWaitDotColor();
            this.waitingTime = setInterval(function(){
                    var waitDot = loopObj.$(waitBoxName).children;
                    for(var i = 0;i < loopObj.waitDotLength;++i){
                        switch(loopObj.status[i]){
                            case 0:
                                if(loopObj.timeNow[i] >= 0){
                                    if(loopObj.timeNow[i] < loopObj.decTime){
                                        waitDot[i].style.left = (0 - loopObj.waitDotWidth + loopObj.Vstart*loopObj.timeNow[i] + 0.5*loopObj.a*loopObj.timeNow[i]*loopObj.timeNow[i]) + "px";
                                        waitDot[i].style.opacity = loopObj.timeNow[i]/loopObj.decTime;
                                        loopObj.timeNow[i] += 1;
                                        break;
                                    }
                                    else{
                                        loopObj.timeNow[i] = 0;
                                        loopObj.status[i] = 1;
                                    };
                                }
                                else{
                                    ++loopObj.timeNow[i];
                                    break;
                                };
                            case 1:
                                if(loopObj.timeNow[i] < loopObj.conTime){
                                    waitDot[i].style.left = (0 - loopObj.waitDotWidth + loopObj.constBegin + loopObj.Vconst*loopObj.timeNow[i]) + "px";
                                    loopObj.timeNow[i] += 1;
                                    break;
                                }
                                else{
                                    loopObj.timeNow[i] = 0;
                                    loopObj.status[i] = 2;
                                };
                            case 2:
                                if(loopObj.timeNow[i] < loopObj.accTime){
                                    waitDot[i].style.left = (0 - loopObj.waitDotWidth + loopObj.accBegin + loopObj.Vconst*loopObj.timeNow[i] - 0.5*loopObj.a*loopObj.timeNow[i]*loopObj.timeNow[i]) + "px";
                                    waitDot[i].style.opacity = 1 - loopObj.timeNow[i]/loopObj.accTime;
                                    loopObj.timeNow[i] += 1;
                                    break;
                                }
                                else{
                                    if(i === (loopObj.waitDotLength - 1)){
                                        clearInterval(loopObj.waitingTime);
                                        setTimeout(loopObj.waitDotMove(),500);
                                    };
                                };
                        };
                    };
                },30);
        };

        this.setWaitDotLeft = function(){
            var obj = $(waitBoxName).children;
            for(var i = 0;i < this.waitDotLength;++i){
                obj[i].style.left = (0 - this.waitDotWidth) + "px";
            };
        };

        this.setWaitDotOpacity = function(){
            var obj = $(waitBoxName).children;
            for(var i = 0;i < this.waitDotLength;++i){
                obj[i].style.opacity = 0;
            };
        };

        this.setWaitDotColor = function(){
            var obj = $(waitBoxName).children;
            for(var i = 0;i < this.waitDotLength;++i){
                obj[i].style.backgroundColor = this.waitDotColor[this.countColor];
            };
            if(this.countColor < 7){
                ++this.countColor
            }
            else{
                this.countColor = 0;
            };
        };

        this.waitingStop = function(){
            var obj = $(waitBoxName).children;
            clearInterval(this.waitingTime);
            this.setWaitDotLeft();
            this.setWaitDotOpacity();
            for(var i = 0;i < this.waitDotLength;++i){
                obj[i].style.backgroundColor = this.waitDotColor[0];
            };
        };

        this.changeWaitBox = function(){
            this.waitBoxWidth = parseFloat(this.getCss(this.$(waitBoxName)).width);
            this.speedChangeDis = (this.waitBoxWidth + this.waitDotWidth*3 - 5*this.Vconst*this.eachTime)/2.0;
            this.a = (this.Vconst*this.Vconst - this.Vstart*this.Vstart)/(2.0*this.speedChangeDis);
            this.decTime = (this.Vconst - this.Vstart)/this.a;
            this.accTime = this.decTime;
            this.constBegin = this.Vstart*this.decTime + 0.5*this.a*this.decTime*this.decTime;
            this.accBegin = this.constBegin + this.Vconst*this.conTime;
        };
    };

    var ctLMain0Wait;
    var ctLMain1Wait;
    var ctLMain2Wait;
    var ifameWait;
    var point = 1;
    var timestampNum = 1;
    var likesNum = 1;
    var contentIdLoadBefore = 1;
    var contentLengthNow = 0;
    var contentId = 1;
    var ctLShowJudge = true;
    var needToLoad = new Array(true,true,true,true); 
    var canLoad = new Array(true,true,true,true)
    var canScroll = true;
    var canHeaderMove = true;
    var needToCleanComment = false;
    var username;
    var userImgUrl;

    function $(className){
        return document.getElementsByClassName(className)[0];
    };

    function getCss(className){
        return window.getComputedStyle(document.getElementsByClassName(className)[0],false);
    };

    function ctLMainMove(T,thePoint){
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
                canHeaderMove = true;
                clearInterval(moveTime);
            }
        },1);
    };

    function arrowMove(T,thePoint){
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
            if(countTime < T){
                ++countTime;
            }
            else{
                clearInterval(moveTime);
            }
        },1);
    };

    function changeScrollBarTop(){
        var ctLMainHeight        = parseFloat(getCss("ctLMain").height);
        var ctLMainShowDivHeight = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var scrollHeight         = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom) - ctLMainShowDivHeight;
        var marginTopNow         = 0 - parseFloat(getCss("ctLMain"+point+"Show").marginTop);
        var scrollBarHeiht       = parseFloat(getCss("ctLScrollBar").height);
        var scrollTop            = marginTopNow/scrollHeight*(ctLMainHeight - scrollBarHeiht);
        $("ctLScrollBar").style.top = scrollTop +"px";
    };

    function changeScrollBarHeight(){
        var ctLMainHeight        = parseFloat(getCss("ctLMain").height);
        var ctLMainShowDivHeight = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var mainNowHeight        = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        var hasMainNow           = mainNowHeight - ctLMainShowDivHeight;
        if(hasMainNow <= 0 ){
            $("ctLScrollBar").style.height = 0 +"px";
        }
        else{
            $("ctLScrollBar").style.height = (ctLMainHeight*ctLMainShowDivHeight/mainNowHeight + 13) +"px";
        }
        changeScrollBarTop();
    };

    function changeNewShare(result){
        var hdShreBoxObj = $("hdRSTDetailBox");
        $("ctRMain").src = result.url;
        $("hdR0").href = result.url;
        $("hdRShareTitle").children[0].innerHTML = result.title;

        hdShreBoxObj.getElementsByClassName("detailBoxTitle")[0].innerHTML = result.title;
        hdShreBoxObj.getElementsByClassName("SMBSharemanImg")[0].style.backgroundImage = "url(" + result.author_image + ")";
        hdShreBoxObj.getElementsByClassName("SMBShareReason")[0].innerHTML = result.explain;
        if(result.is_collection){
            hdShreBoxObj.getElementsByClassName("toggleCollection")[0].innerHTML = "已收藏";
        }
        else{
            hdShreBoxObj.getElementsByClassName("toggleCollection")[0].innerHTML = "收藏";
        };

        if(result.is_like){
            hdShreBoxObj.getElementsByClassName("toggleLike")[0].innerHTML = "取消赞(" + result.likes + ")";
        }
        else{
            hdShreBoxObj.getElementsByClassName("toggleLike")[0].innerHTML = "赞(" + result.likes + ")";
        };

        hdShreBoxObj.getElementsByClassName("SMBComment")[0].innerHTML = "评论(" + result.comments + ")"
        hdShreBoxObj.getElementsByClassName("SMBTime")[0].innerHTML = result.timestamp;
        
        needToCleanComment = true;
    };

    function setScrollBarHide(){
        $("ctLScrollBar").style.webkitTransitionDelay = "3s";
        $("ctLScrollBar").style.mozTransitionDelay = "3s";
        $("ctLScrollBar").style.transitionDelay = "3s";

        $("ctLScrollBar").style.webkitTransitionDuration = "1.2s";
        $("ctLScrollBar").style.mozTransitionDuration = "1.2s";
        $("ctLScrollBar").style.transitionDuration = "1.2s";

        $("ctLScrollBar").style.opacity = 0;
    };
    function setScrollBarShow(){
        $("ctLScrollBar").style.webkitTransitionDelay = "0s";
        $("ctLScrollBar").style.mozTransitionDelay = "0s";
        $("ctLScrollBar").style.transitionDelay = "0s";

        $("ctLScrollBar").style.webkitTransitionDuration = "0.01s";
        $("ctLScrollBar").style.mozTransitionDuration = "0.01s";
        $("ctLScrollBar").style.transitionDuration = "0.01s";

        $("ctLScrollBar").style.opacity = 1;
    };

    function ctLMainScroll(theScroll){
        setScrollBarShow();
        setTimeout(setScrollBarHide,50);
        canScroll = true;
        var marginTopNow         =  parseFloat(getCss("ctLMain"+point+"Show").marginTop);
        var ctLMainShowDivHeight = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var mainNowHeight        = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        if((mainNowHeight - ctLMainShowDivHeight)>0){
            var hasOverBottom  = marginTopNow + mainNowHeight - ctLMainShowDivHeight;
            if(theScroll < 0){//主体内容上滚
                if(hasOverBottom > 55){
                    $("ctLMain"+point+"Show").style.marginTop = (marginTopNow-55) +"px";
                    changeScrollBarTop();
                }
                else if(hasOverBottom > 0){
                    $("ctLMain"+point+"Show").style.marginTop = (ctLMainShowDivHeight - mainNowHeight) + "px";
                    changeScrollBarTop();
                };
                switch(point){
                    case 0:
                        if(needToLoad[0]&&parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (ctLMainShowDivHeight - mainNowHeight + 70)){
                            needToLoad[0] = false;
                            collectLoad("");
                        };
                        break;
                    case 1:
                        if(needToLoad[1]&&parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (ctLMainShowDivHeight - mainNowHeight + 70)){
                            needToLoad[1] = false;
                            linkContentLoad("timestamp");
                        };
                        break;
                    case 2:
                        if(needToLoad[2]&&parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (ctLMainShowDivHeight - mainNowHeight + 70)){
                            needToLoad[2] = false;
                            commentLoad();
                        };
                        break;
                };          
            }
            else if(theScroll > 0){//主体内容下滚
                if(marginTopNow < -55){
                    $("ctLMain"+point+"Show").style.marginTop = (marginTopNow+55) + "px";
                    changeScrollBarTop();
                }
                else if(marginTopNow < 0){
                    $("ctLMain"+point+"Show").style.marginTop = 0;
                    changeScrollBarTop();
                };
                
            };
        };
    };

    function controlByScrollBar(mouseStartY){
        var ctLMainHeight   = parseFloat(getCss("ctLMain").height);
        var showDivHeight   = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var scrollBartopNow = parseFloat(getCss("ctLScrollBar").top);
        var mainNowHeight   = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        var scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
        var scrollHeight    = showDivHeight - mainNowHeight;
        var barMoveHeight   = ctLMainHeight  - scrollBarHeight;
        var ctLMainMarginTop;
        $("screen").style.display = "block";
        document.onmousemove = function(event){
            setScrollBarShow()
            $("ctLScroll").onmouseout = function(){};
            var moveY = event.pageY - mouseStartY + scrollBartopNow;
            
            if(moveY >= 0 && moveY <= barMoveHeight){
                $("ctLScrollBar").style.top = moveY + "px";
                ctLMainMarginTop = parseFloat(getCss("ctLScrollBar").top)/barMoveHeight*scrollHeight;
                $("ctLMain"+point+"Show").style.marginTop = ctLMainMarginTop +"px";
            }
            else if(moveY < 0){
                    $("ctLScrollBar").style.top = 0;                    
                    $("ctLMain"+point+"Show").style.marginTop = 0;
                }
                else if(moveY >= barMoveHeight){
                        $("ctLScrollBar").style.top = barMoveHeight + "px";                    
                        $("ctLMain"+point+"Show").style.marginTop = scrollHeight + "px";
                    };
            //滚动条拉到底加载
            switch(point){
                case 0:
                    if(needToLoad[0]&&canLoad[0]&&(parseFloat(getCss("ctLMain0Show").marginTop) <= (showDivHeight - mainNowHeight + 70))){
                        if(needToLoad[0]){
                            needToLoad[0] = false;
                            canLoad[0] = false;
                            scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
                            barMoveHeight   = ctLMainHeight - scrollBarHeight;
                            collectLoad();
                        };            
                    }
                    else if((parseFloat(getCss("ctLMain1Show").marginTop) > (showDivHeight - mainNowHeight + 70))){
                        canLoad[1] = true;
                    };
                    break;
                case 1:
                    if(needToLoad[1]&&canLoad[1]&&(parseFloat(getCss("ctLMain1Show").marginTop) <= (showDivHeight - mainNowHeight + 70))){
                        if(needToLoad[1]){
                            needToLoad[1] = false;
                            canLoad[1] = false;
                            scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
                            barMoveHeight   = ctLMainHeight - scrollBarHeight;
                            linkContentLoad("timestamp");
                        };            
                    }
                    else if((parseFloat(getCss("ctLMain1Show").marginTop) > (showDivHeight - mainNowHeight + 70))){
                        canLoad[1] = true;
                    };
                    break;

                case 2:
                    if(needToLoad[2]&&canLoad[2]&&(parseFloat(getCss("ctLMain2Show").marginTop) <= (showDivHeight - mainNowHeight + 70))){
                        needToLoad[2] = false;
                        canLoad[2] = false;
                        scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
                        barMoveHeight   = ctLMainHeight - scrollBarHeight;
                        commentLoad();            
                    }
                    else if((parseFloat(getCss("ctLMain2Show").marginTop) > (showDivHeight - mainNowHeight + 70))){
                        canLoad[2] = true;
                    };
                    break;
            };
        };
    };

    function changeCtLMarginTop(){
        var showDivHeight   = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var mainNowHeight   = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        var showDivMarginTop = parseFloat(getCss("ctLMain"+point+"Show").marginTop);
        if(mainNowHeight > showDivHeight){
            if((mainNowHeight + showDivMarginTop) < showDivHeight){
                $("ctLMain"+point+"Show").style.marginTop = (showDivHeight -mainNowHeight) +"px";
            };
            changeScrollBarHeight();
        };
        
    };

    function addCommentNum(){
        var idElement1 = document.getElementById(contentId+"con");
        var idElement2 = document.getElementById(contentId+"col");
        if(idElement1){
            var addCommentNode = idElement1.parentNode.getElementsByClassName("ctCommentShow")[0];
            var commentNum = parseInt(addCommentNode.innerHTML.substring(3));
            addCommentNode.innerHTML = "评论("+ (commentNum + 1) + ")";
            idElement1.parentNode.getElementsByClassName("ctLSMBComment")[0].innerHTML = "评论("+ (commentNum + 1) + ") ";
            document.getElementsByClassName("SMBComment")[0].innerHTML = "评论("+ (commentNum + 1) + ")";  
        };  
        if(idElement2){
            var addCommentNode = idElement2.parentNode.getElementsByClassName("ctCommentShow")[0];
            var commentNum = parseInt(addCommentNode.innerHTML.substring(3));
            addCommentNode.innerHTML = "评论("+ (commentNum + 1) + ")";
            idElement2.parentNode.getElementsByClassName("ctLSMBComment")[0].innerHTML = "评论("+ (commentNum + 1) + ") ";
            document.getElementsByClassName("SMBComment")[0].innerHTML = "评论("+ (commentNum + 1) + ")";  
        };           
    };

    function ifameWaitStop(){
        $("ctRWaitBoxBg").style.display = "none";
        ifameWait.waitingStop();
    };

    function ifameWaitShow(){
        ifameWait.waitingStop();
        $("ctRWaitBoxBg").style.display = "inline-block";
        ifameWait.waitingShow();
        var ctRMain = $('ctRMain');
        ctRMain.onload = ctRMain.onreadystatechange = function(){
            if (!ctRMain.readyState || ctRMain.readyState == "complete") {  
                ifameWaitStop();
            };
        };
    };

    function collectLoad(){
        var json;
        var content;
        var addElement;
        var contentJson;
        var contentObj       = $("ctLMain0Show").children;
        var lengthLoadBefore = contentObj.length;
        var collectNum       = parseInt((lengthLoadBefore + 18)/20) + 1;

        var xmlhttp          =new XMLHttpRequest();
        ctLMain0Wait.waitingShow();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status&&json.length>0){
                    document.onmousemove = function(){};
                    for (var i = 0;i < json.length;++i){
                        content = json.result[i];
                        var newNode = document.createElement("div");
                        addElement = "<a href='"+content.url
                                +"' class='eachConnection' id='"+content.id
                                +"col'><div class='briefShow'><div class='shareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                +")'></div><div class='shareTitleBlock'><div class='shareTitle'><span>"+content.title
                                +"</span></div></div></div></a><span class='shareDetail'><a class='toggleCollection'>已收藏</a><a class='toggleLike'>";
                        if(content.is_like){
                            addElement += "取消";
                        };
                        addElement += "赞("+content.likes
                                    +")</a><span class='ctCommentShow'>评论("+ content.comments
                                    +")</span></span><div class='detailBox'><p class='detailBoxTitle'>" + content.title
                                    +"</p><div class='sharemanBox'><div class='SMBLeft'><div class='SMBSharemanImg' style='background-image:url(" + content.author_image
                                    +")'></div></div><div class='SMBRight'><p class='SMBShareReason'>" + content.author_name 
                                    +": " + content.explain
                                    +"</p><div class='SMBDetailBox'><span><span class='ctLSMBLike'>赞(" + content.likes
                                    +") </span><span class='ctLSMBComment'>评论(" + content.comments
                                    +") </span><span class='ctLSMBTime'>" + content.timestamp
                                    +"</span></span></div></div></div></div>";
                        newNode.innerHTML = addElement;
                        newNode.children[0].onclick = function(){
                            return ecClick(this);
                        };
                        newNode.children[0].onmouseover = function(){
                            shareBoxShow(this.parentNode.children[2]);
                        };
                        newNode.children[0].onmouseout = function(){
                            shareBoxHide(this.parentNode.children[2]);
                        };
                        newNode.getElementsByClassName("toggleCollection")[0].onclick = function(){
                            return colClickToAddCollect(this);
                        };
                        newNode.getElementsByClassName("toggleLike")[0].onclick = function(){
                            return clickToAddLike(parseInt(this.parentNode.parentNode.children[0].id),"col");
                        };
                        $("ctLMain0Show").appendChild(newNode);
                    };
                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            contentObj[i].style.display = "block";
                            var obj = contentObj[i];
                            setTimeout(function(){
                              obj.style.opacity = 1;  
                            },0);

                            changeScrollBarHeight();
                            ++i;
                        }
                        else{
                            setScrollBarHide();
                            needToLoad[0] = true;
                            canLoad[0] = true;
                            clearInterval(loopTime);
                        };  
                    },100);
                }
                else{
                    needToLoad[0] = true;
                }
            };
            ctLMain0Wait.waitingStop();
        };
        xmlhttp.open("POST","/collection/list",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("start="+collectNum+"&sortby=timestamp");
    };

    function linkContentLoad(type){
        var json;
        var content;
        var addElement;
        var contentJson;
        var contentObj       = $("ctLMain1Show").children;
        var lengthLoadBefore = contentObj.length;
        var xmlhttp          =new XMLHttpRequest();
        ctLMain1Wait.waitingShow();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status&&json.length>0){
                    document.onmousemove = function(){};
                    if(type === "timestamp"){
                        ++timestampNum;
                    }
                    else if(type === "likes"){
                        ++likesNum;
                    };
                    for (var i = 0;i < json.length;++i){
                        content = json.result[i];
                        var newNode = document.createElement("div");
                        addElement = "<a href='"+content.url
                                +"' class='eachConnection' id='"+content.id
                                +"con'><div class='briefShow'><div class='shareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                +")'></div><div class='shareTitleBlock'><div class='shareTitle'><span>"+content.title
                                +"</span></div></div></div></a><span class='shareDetail'><a href='javascript:void(0)' class='toggleCollection'>";
                        
                        if(content.is_collection){
                            addElement += "已";
                        };
                        addElement += "收藏</a><a href='javascript:void(0)' class='toggleLike'>"
                        
                        if(content.is_like){
                            addElement += "取消";
                        };
                        addElement += "赞("+content.likes
                                    +")</a><span class='ctCommentShow'>评论("+ content.comments
                                    +")</span></span><div class='detailBox'><p class='detailBoxTitle'>" + content.title
                                    +"</p><div class='sharemanBox'><div class='SMBLeft'><div class='SMBSharemanImg' style='background-image:url(" + content.author_image
                                    +")'></div></div><div class='SMBRight'><p class='SMBShareReason'>" + content.author_name 
                                    +": " + content.explain
                                    +"</p><div class='SMBDetailBox'><span><span class='ctLSMBLike'>赞(" + content.likes
                                    +") </span><span class='ctLSMBComment'>评论(" + content.comments
                                    +") </span><span class='ctLSMBTime'>" + content.timestamp
                                    +"</span></span></div></div></div></div>";

                        newNode.innerHTML = addElement;
                        newNode.children[0].onclick = function(){
                            return ecClick(this);
                        };
                        newNode.children[0].onmouseover = function(){
                            shareBoxShow(this.parentNode.children[2]);
                        };
                        newNode.children[0].onmouseout = function(){
                            shareBoxHide(this.parentNode.children[2]);
                        };
                        newNode.getElementsByClassName("toggleCollection")[0].onclick = function(){
                            return conClickToAddCollect(this);
                        };
                        newNode.getElementsByClassName("toggleLike")[0].onclick = function(){
                            return clickToAddLike(parseInt(this.parentNode.parentNode.children[0].id),"con");
                        };
                        $("ctLMain1Show").appendChild(newNode);

                    };
                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            var obj = contentObj[i];
                            obj.style.display = "block";
                            setTimeout(function(){
                              obj.style.opacity = 1;  
                            },0);

                            changeScrollBarHeight();

                            ++i;
                        }
                        else{
                            setScrollBarHide();
                            needToLoad[1] = true;
                            canLoad[1] = true;
                            clearInterval(loopTime);
                        };  
                    },100);
                }
                else{
                    needToLoad[1] = true;
                }
            };
            ctLMain1Wait.waitingStop();
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

    function shuffleLoad(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                canLoad[2] = true;
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    ifameWaitShow();
                    changeNewShare(json.result);
                    contentId = json.result.id;
                    if(point === 2){
                        $("ctLMain2Show").style.marginTop = "0px";
                        $("commentText").value = "";
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/shuffle",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send();
    };

    function commentLoad(){
        var contentObj       = $("ctLMain2Show").children;
        var lengthLoadBefore = contentObj.length;
        var commentID = parseInt((lengthLoadBefore + 18)/20) + 1;
        var xmlhttp          = new XMLHttpRequest();
        ctLMain2Wait.waitingShow();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status&&json.result.length>0){
                    document.onmousemove = function(){};
                    ++commentID;
                    var commentLength = json.result.length;
                    for(var i = 0;i < commentLength;++i){
                        var newCommentText = "<div class='eachComment'><div class='eCmShareImg' style='background-image:url(" + json.result[i].author_image
                                            +");'></div><div class='eCmCommentText'><span>"+ json.result[i].body
                                            +"</span><a href='javascript:void(0)' class='replyButton'><div></div></a></div></div>"
                        $("ctLMain2Show").innerHTML = $("ctLMain2Show").innerHTML + newCommentText;
                    };

                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            var addElement = contentObj[i];
                            addElement.style.display = "flex";
                            setTimeout(function(){
                                addElement.style.opacity = 1;
                            },0);
                            contentObj[i].getElementsByClassName("replyButton")[0].onclick = function(){
                                commentReply(this);
                            };
                            changeScrollBarHeight();
                            ++i;
                        }
                        else{
                            needToLoad[2] = true;
                            clearInterval(loopTime);
                        };  
                    },20);
                }
                else{
                    needToLoad[2] = true;
                }
            };
            ctLMain2Wait.waitingStop();
        };
        xmlhttp.open("POST","/comment/list",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("start="+commentID+"&share_id="+contentId);
    };

    function sendComment(){
        var xmlhttp = new XMLHttpRequest();
        var commentText;

        var objValue = $("commentText").value;
        var feature1Place = objValue.indexOf("回复@");
        var feature2Place = objValue.indexOf(":");
        if((feature1Place === 0) && (feature2Place > feature1Place)){
            commentText = username + objValue;
        }
        else{
            commentText = username + ": " + objValue;
        };

        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    addCommentNum();
                    var addElement = document.createElement("div");
                    addElement.className = "eachComment  commentShow";
                    addElement.innerHTML = "<div class='eCmShareImg' style='background-image:" + userImgUrl
                                        +";'></div><div class='eCmCommentText'><span>"+ commentText
                                        +"</span><a class='replyButton'><div></div></a></div>";
                    addElement.children[1].children[1].onclick = function(){
                        commentReply(this);
                    };
                    $('ctLMain2Show').insertBefore(addElement,$('ctLMain2Show').children[1]);
                    addElement.style.transitionDuration = "2s";
                    addElement.style.mozTransitionDuration = "2s";
                    addElement.style.webkitTransitionDuration = "2s";
                    addElement.style.display = "flex";
                    setTimeout(function(){
                        addElement.style.opacity = 1;
                    },0);

                    changeScrollBarHeight();
                    $("commentText").value = "";
                    $("commentSubmit").style.backgroundColor = "#E0E0E0";
                    $("commentSubmit").children[0].style.color = "#C5C5C5";
                };
            };
        };
        xmlhttp.open("POST","/comment/add",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("content="+commentText +"&share_id="+contentId);
    };

    function collectDelete(obj){
        const timeToDisappear = 50;
        const timeToShorten   = 20;
        var countDisappear    = 1;
        var countShorten      = 1;
        var eachOpacity       = 1.0/timeToDisappear;
        var eachHeight        = 70.0/timeToShorten;
        obj.style.transitionDuration = 0;
        obj.style.mozTransitionDuration = 0;
        obj.style.webkitTransitionDuration = 0;
        var time1 = setInterval(function(){
            if(countDisappear <= timeToDisappear){
                obj.style.opacity = 1 - countDisappear*eachOpacity;
                ++countDisappear; 
            }
            else{
                var time2 = setInterval(function(){
                    if(countShorten  <= timeToShorten ){
                        obj.style.height = (70 - countShorten*eachHeight) + "px";
                        ++countShorten ; 
                    }
                    else{
                        obj.parentNode.removeChild(obj);
                        clearInterval(time2);
                    };
                },1);
                clearInterval(time1);
            };
        },1); 
    };

    function commentReply(obj){
        var reg1 = /^回复@\S+\s?\S+:/;
        var reg2 = /回复@\S+\s?\S+:/;
        var reg3 = /^\S+\s?\S+回复@\S+\s?\S+:/;
        var reg4 = /:/;
        var name;
        var objValue = obj.parentNode.children[0].innerHTML;

        if(reg3.test(objValue)){
            name = objValue.substring(0,objValue.search(reg2));
        }
        else{
            name = objValue.substring(0,objValue.search(reg4));
        };

        $("commentText").focus();
        if(reg1.test($("commentText").value)){
            $("commentText").value = $("commentText").value.replace(reg1,"回复@"+ name +":");
        }
        else{
            $("commentText").value = "回复@" + name + ":" + $("commentText").value;
        };        
    };

    function ecClick(obj){
        var objParentNode = obj.parentNode;
        var hdShareBoxObj = $("hdRSTDetailBoxShow");
        contentId = parseInt(obj.id);
        ifameWaitShow();
        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
        $("ctRMain").src = obj.href;
        $("hdR0").href = obj.href;
        $("hdRShareTitle").children[0].innerHTML                                        = objParentNode.getElementsByClassName("shareTitle")[0].children[0].innerHTML
        hdShareBoxObj.getElementsByClassName("detailBoxTitle")[0].innerHTML             = objParentNode.getElementsByClassName("shareTitle")[0].children[0].innerHTML;
        hdShareBoxObj.getElementsByClassName("SMBSharemanImg")[0].style.backgroundImage = objParentNode.getElementsByClassName("SMBSharemanImg")[0].style.backgroundImage;
        hdShareBoxObj.getElementsByClassName("SMBShareReason")[0].innerHTML             = objParentNode.getElementsByClassName("SMBShareReason")[0].innerHTML;
        hdShareBoxObj.getElementsByClassName("toggleCollection")[0].innerHTML           = objParentNode.getElementsByClassName("toggleCollection")[0].innerHTML;
        hdShareBoxObj.getElementsByClassName("toggleLike")[0].innerHTML                 = objParentNode.getElementsByClassName("toggleLike")[0].innerHTML;
        hdShareBoxObj.getElementsByClassName("SMBComment")[0].innerHTML                 = objParentNode.getElementsByClassName("ctCommentShow")[0].innerHTML;
        hdShareBoxObj.getElementsByClassName("SMBTime")[0].innerHTML                    = objParentNode.getElementsByClassName("ctLSMBTime")[0].innerHTML;
        return false;
    };

    function clickToAddLike(id,objType){
        var xmlhttp = new XMLHttpRequest();
        var conObj = document.getElementById(id + "con");
        var colObj = document.getElementById(id + "col");
        var hdObj = $("hdRShareTitle");
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    if(json.result == "like"){
                        var value;
                        switch(objType){
                            case "col":value = parseInt(colObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(2));
                                        break;
                            case "con":value = parseInt(conObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(2));
                                        break;
                            case "hd":value = parseInt(hdObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(2));
                                        break;
                        };
                        var newValue = "取消赞(" + (value+1) + ")";
                        if(conObj){
                            conObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                            conObj.parentNode.getElementsByClassName("ctLSMBLike")[0].innerHTML = "赞(" + (value + 1) + ") ";
                        };
                        if(colObj){
                            colObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                            colObj.parentNode.getElementsByClassName("ctLSMBLike")[0].innerHTML = "赞(" + (value + 1) + ") ";
                        };
                        if(id === contentId){
                            $("hdRSTDetailBoxShow").getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                        };
                    }
                    else if(json.result == "notlike"){
                        var value;
                        switch(objType){
                            case "col":value = parseInt(colObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(4));
                                        break;
                            case "con":value = parseInt(conObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(4));
                                        break;
                            case "hd":value = parseInt(hdObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML.substring(4));
                                        break;
                        };
                        var newValue = "赞(" + (value-1) + ")";
                        if(conObj){
                            conObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                            conObj.parentNode.getElementsByClassName("ctLSMBLike")[0].innerHTML = newValue + " ";
                        };
                        if(colObj){
                            colObj.parentNode.getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                            colObj.parentNode.getElementsByClassName("ctLSMBLike")[0].innerHTML = newValue + " ";
                        };
                        if(id === contentId){
                            $("hdRSTDetailBoxShow").getElementsByClassName("toggleLike")[0].innerHTML = newValue;
                        };
                    };
                };
               
            };
        };
        xmlhttp.open("POST","/share/toggleLikes",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("share_id="+id);
        return true;
    };

    function conClickToAddCollect(obj){
        var xmlhttp = new XMLHttpRequest();
        var id = parseInt(obj.parentNode.parentNode.children[0].id);
        var colObj = document.getElementById(id + "col");
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    if(json.status){
                        if(obj.innerHTML == "收藏"){
                            obj.innerHTML = "已收藏";
                            var addElement = document.createElement("div");
                            addElement.innerHTML = obj.parentNode.parentNode.innerHTML;
                            addElement.children[0].id = id+"col";
                            addElement.children[0].onclick = function(){
                                return ecClick(this);
                            };
                            addElement.children[0].onmouseover = function(){
                                shareBoxShow(this.parentNode.children[2]);
                            };
                            addElement.children[0].onmouseout = function(){
                                shareBoxHide(this.parentNode.children[2]);
                            };
                            addElement.children[1].children[0].onclick = function(){
                                return colClickToAddCollect(this);
                            };
                            addElement.children[1].children[1].onclick = function(){
                                return clickToAddLike(parseInt(this.parentNode.parentNode.children[0].id),"col");
                            };
                            $('ctLMain0Show').insertBefore(addElement,$('ctLMain0Show').children[1]);
                            addElement.style.display = "block";
                            addElement.style.opacity = 1;

                            if(id == contentId){
                                $("hdRSTDetailBox").getElementsByClassName("toggleCollection")[0].innerHTML = "已收藏";
                            };

                        }
                        else if(obj.innerHTML == "已收藏"){
                               obj.innerHTML = "收藏";
                               if(colObj){
                                    $('ctLMain0Show').removeChild(colObj.parentNode);
                               };
                               if(id == contentId){
                                $("hdRSTDetailBox").getElementsByClassName("toggleCollection")[0].innerHTML = "收藏";
                            };
                        };
                    };
                };
            };
        };
        xmlhttp.open("POST","/collection/toggleCollection",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("share_id="+id);
    };

    function colClickToAddCollect(obj){
        var xmlhttp = new XMLHttpRequest();
        var id = parseInt(obj.parentNode.parentNode.children[0].id);
        var  conObj = document.getElementById(id + "con");
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    if(json.status){
                        if(conObj){
                            conObj.parentNode.getElementsByClassName("toggleCollection")[0].innerHTML = "收藏";
                        };
                        if(id == contentId){
                            $("hdRSTDetailBox").getElementsByClassName("toggleCollection")[0].innerHTML = "收藏";
                        };
                        collectDelete(obj.parentNode.parentNode);
                    };
                };
            };
        };
        xmlhttp.open("POST","/collection/toggleCollection",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("share_id="+id);
    };

    function hdClickToAddCollect(obj){
        var xmlhttp = new XMLHttpRequest();
        var id = contentId;
        var colObj = document.getElementById(id + "col");
        var conObj = document.getElementById(id + "con");
        var hdObj  = $("hdRSTDetailBox");
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    if(json.status){
                        if(obj.innerHTML == "收藏"){
                            obj.innerHTML = "已收藏";
                            var addElement = document.createElement("div");
                            addElement.innerHTML = "<a href='"
                                + $("ctRMain").src
                                + "' class='eachConnection' id='" 
                                + id
                                + "col'><div class='briefShow'><div class='shareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url=" 
                                + $("ctRMain").src
                                + ")'></div><div class='shareTitleBlock'><div class='shareTitle'><span>" 
                                + hdObj.getElementsByClassName("detailBoxTitle")[0].innerHTML
                                + "</span></div></div></div></a><span class='shareDetail'><a class='toggleCollection'>已收藏</a><a class='toggleLike'>"
                                + hdObj.getElementsByClassName("toggleLike")[0].innerHTML
                                + "</a><span class='ctCommentShow'>"
                                + hdObj.getElementsByClassName("SMBComment")[0].innerHTML
                                + "</span></span><div class='detailBox'><p class='detailBoxTitle'>" 
                                + hdObj.getElementsByClassName("detailBoxTitle")[0].innerHTML
                                + "</p><div class='sharemanBox'><div class='SMBLeft'><div class='SMBSharemanImg' style='background-image:" 
                                + hdObj.getElementsByClassName("SMBSharemanImg")[0].style.backgroundImage
                                + "'></div></div><div class='SMBRight'><p class='SMBShareReason'>"
                                + hdObj.getElementsByClassName("SMBShareReason")[0].innerHTML
                                + "</p><div class='SMBDetailBox'><span>" 
                                + hdObj.getElementsByClassName("toggleLike")[0].innerHTML + " "
                                + hdObj.getElementsByClassName("SMBComment")[0].innerHTML
                                + " <span class='ctLSMBTime'>" 
                                + hdObj.getElementsByClassName("SMBTime")[0].innerHTML
                                + "</span></span></div></div></div></div>";;
                            addElement.children[0].onclick = function(){
                                return ecClick(this);
                            };
                            addElement.children[0].onmouseover = function(){
                                shareBoxShow(this.parentNode.children[2]);
                            };
                            addElement.children[0].onmouseout = function(){
                                shareBoxHide(this.parentNode.children[2]);
                            };
                            addElement.children[1].children[0].onclick = function(){
                                return colClickToAddCollect(this);
                            };
                            addElement.children[1].children[1].onclick = function(){
                                return clickToAddLike(parseInt(this.parentNode.parentNode.children[0].id),"col");
                            };
                            $('ctLMain0Show').insertBefore(addElement,$('ctLMain0Show').children[1]);
                            addElement.style.display = "block";
                            addElement.style.opacity = 1;

                            if(conObj){
                                 conObj.parentNode.getElementsByClassName("toggleCollection")[0].innerHTML = "已收藏";
                            };

                        }
                        else if(obj.innerHTML == "已收藏"){
                               obj.innerHTML = "收藏";
                               if(conObj){
                                    conObj.parentNode.getElementsByClassName("toggleCollection")[0].innerHTML = "收藏";
                               };
                               if(colObj){
                                    $('ctLMain0Show').removeChild(colObj.parentNode);
                               };
                        };
                    };
                };
            };
        };
        xmlhttp.open("POST","/collection/toggleCollection",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("share_id="+id);
    };

    function contentLeftHide(T){
        var countTime = 1;
        var moveDistance;
        const a1 = 500/(T*T);
        const a2 = 1000/(3*T*T);
        const t1 = 0.4*T;//加速时间
        const t2 = 0.6*T;//减速时间
        const v  = 200/T;
        const ctLMainWidth = parseFloat(getCss("layoutLeft").width);
        const length = ctLMainWidth;
        ctLShowJudge = false;
        $("toLeft").style.display = "none";
        $("toRight").style.display = "inline-block";

        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $("contentLeft").style.marginLeft  = (0 - moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                $("contentLeft").style.display  ="none";
                clearInterval(moveTime);
            }
        },1);
    };

    function contentLeftShow(T){
        var bodyWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width);
        var countTime = 1;
        var moveDistance;
        const ctLMainWidth = parseFloat(getCss("layoutLeft").width);
        const length       = ctLMainWidth;
        const a1           = 500/(T*T);
        const a2           = 1000/(3*T*T);
        const t1           = 0.4*T;//加速时间
        const t2           = 0.6*T;//减速时间
        const v            = 200/T;

        $("moreButtomCover").onmouseout = function(){};

        $("toLeft").style.display         = "inline-block";
        $("toRight").style.display        = "none";
        $("contentLeft").style.marginLeft = (0 - ctLMainWidth) +"px";
        $("contentLeft").style.display    = "inline-block";

        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $("contentLeft").style.marginLeft  = (0 - ctLMainWidth + moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                ctLShowJudge = true;
                clearInterval(moveTime);
            }
        },1);
    };

    function headerLeftHide(T){
        var countTime = 1;
        var moveDistance;
        const a1 = 500/(T*T);
        const a2 = 1000/(3*T*T);
        const t1 = 0.4*T;//加速时间
        const t2 = 0.6*T;//减速时间
        const v  = 200/T;
        const ctLMainWidth = parseFloat(getCss("layoutLeft").width);
        const length = ctLMainWidth;

        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $("headerLeft").style.marginLeft = (0 - moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                $("headerLeft").style.display = "none";
                clearInterval(moveTime);
            }
        },1);
    };

    function ctLMainShow(T){
        var bodyWidth      = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width);
        var countTime      = 1;
        var moveDistance;
        const ctLMainWidth = parseFloat(getCss("layoutLeft").width);
        const length       = ctLMainWidth;
        const a1           = 500/(T*T);
        const a2           = 1000/(3*T*T);
        const t1           = 0.4*T;//加速时间
        const t2           = 0.6*T;//减速时间
        const v            = 200/T;

        $("toLeft").style.display = "inline-block";
        $("toRight").style.display = "none";

        $("headerLeft").style.marginLeft = (0 - ctLMainWidth) +"px";
        $("contentLeft").style.marginLeft  = (0 - ctLMainWidth) +"px";

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
            $("contentLeft").style.marginLeft  = (0 - ctLMainWidth + moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                ctLShowJudge = true;
                clearInterval(moveTime);
            }
        },1);
    };

    function shareBoxShow(obj){
        if(window.getComputedStyle(obj,false).display == "none"){
            obj.style.display = "inline-block";

            var bodyHeight = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).height);
            var shareBoxHeight = parseFloat(window.getComputedStyle(obj,false).height);
            var objParentnodeTop = obj.parentNode.getBoundingClientRect().top;
            var disBetweenBottom = bodyHeight - objParentnodeTop - 135;
            if(disBetweenBottom - shareBoxHeight < 0){
                var disBetweenTop = objParentnodeTop - 45;
                if(disBetweenTop > disBetweenBottom && obj.style.top != "auto"){
                    obj.style.top = "auto";
                    obj.style.bottom = "70px";
                }
                else if(disBetweenTop < disBetweenBottom && obj.style.top == "auto"){
                    obj.style.top = "70px";
                    obj.style.bottom = "auto";
                };
            };
            setTimeout(function(){obj.style.opacity = 1;},0);
        };   
    };

    function shareBoxHide(obj){
        if(window.getComputedStyle(obj,false).display == "block"||window.getComputedStyle(obj,false).display == "inline-block"){
            obj.style.display = "none";
            obj.style.opacity = 0;
        };
    };

    function hasHeaderLeftHide(){
        return (getCss("headerLeft").display === "none")
    };

    function hasContentLeftHide(){
        return (getCss("contentLeft").display === "none")
    };

    window.onload = function(){
        ctLMain0Wait     = new waitingDot("ctLMain0WaitBox");
        ctLMain1Wait     = new waitingDot("ctLMain1WaitBox");
        ctLMain2Wait     = new waitingDot("ctLMain2WaitBox");
        ifameWait        = new  waitingDot("ctRWaitBox");
        ifameWait.changeWaitBox();
        var ctRMainWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) - parseFloat(getCss("headerLeft").width);
        $("arrowLeft").style.width = (point*25) + "%";
        $("arrowRight").style.width = (3-point)*25 + "%";
        $("ctLMain"+point).style.left = "0%";
        $("hdL"+point).style.cursor = "default";
        linkContentLoad("timestamp");
        collectLoad();
        shuffleLoad();  
        username = $("username").innerHTML;
        userImgUrl = $("userImg").style.backgroundImage;
    }; 

    window.onresize = function(){
        changeCtLMarginTop();

        ctLMain0Wait.changeWaitBox();
        ctLMain1Wait.changeWaitBox();
        ctLMain2Wait.changeWaitBox();
        ifameWait.changeWaitBox();
    };

    document.onmouseup = function(){
        $("screen").style.display = "none";
        document.onmousemove = function(){};
        setScrollBarHide();
        $("ctLScroll").onmouseout = function(){
            setScrollBarHide();
        };
    };

    window.onbeforeunload = function(){
        return "确定离开当前页面吗？"
    }

    $("hdL0").onclick = function(){
        if(canHeaderMove){
            if(point !== 0){
                canHeaderMove = false;
                $("hdL"+point).style.cursor = "pointer";
                arrowMove(30,point - 0);
                ctLMainMove(30,0);
                point = 0;
                changeScrollBarHeight(); 
                $("hdL0").style.cursor = "default";
            };
        };
    };

    $("hdL1").onclick = function(){
        if(canHeaderMove){
            if(point !== 1){
                canHeaderMove = false;
                $("hdL"+point).style.cursor = "pointer";
                arrowMove(30,point - 1);
                ctLMainMove(30,1);
                point = 1;
                changeScrollBarHeight();
                $("hdL1").style.cursor = "default";
            };
        };
    };

    $("hdL2").onclick = function(){
        if(canHeaderMove){
            if(point !== 2){
                canHeaderMove = false;
                $("hdL"+point).style.cursor = "pointer";
                arrowMove(30,point - 2);
                ctLMainMove(30,2);
                point = 2;      
                changeScrollBarHeight(); 
                var commentID = parseInt(($("ctLMain2Show").children.length + 18)/20) + 1; 
                if(commentID === 1){
                    if(needToCleanComment){//在无评论时，根据是否第一次点开该分享的评论，true:清除，false:不执行
                        needToCleanComment = false;
                        $("commentText").value = "";
                    };
                    
                    $("ctLMain2Show").style.marginTop = "0px"
                    $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                    commentLoad();
                }
                $("hdL2").style.cursor = "default";
            };
        };
    };

    $("hdL3").onclick = function(){
        if(canHeaderMove){
            if(point !== 3){
                canHeaderMove = false;
                $("hdL"+point).style.cursor = "pointer";
                arrowMove(30,point - 3);
                ctLMainMove(30,3);
                point = 3;     
                changeScrollBarHeight();  
                $("hdL3").style.cursor = "default";
            };
        };
    };

    $("hdR1").onclick = function(){
        shuffleLoad();
    };

    $("hdR2").onclick = function(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                canLoad[2] = true;
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    ifameWaitShow();
                    changeNewShare(json.result);
                    --contentId;
                    needToCleanComment = true;
                    if(point === 2){
                        $("commentText").value = "";
                        $("ctLMain2Show").style.marginTop = "0px"
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/next",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("method=previous"+"&id="+contentId);
    };

    $("hdR3").onclick = function(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                canLoad[2] = true;
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    ifameWaitShow();
                    changeNewShare(json.result);
                    ++contentId;
                    needToCleanComment = true;
                    if(point === 2){
                        $("commentText").value = "";
                        $("ctLMain2Show").style.marginTop = "0px"
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";;
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/next",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("method=after"+"&id="+contentId);
    };

    $("moreButton").onclick = function(){
        if(ctLShowJudge&&!hasContentLeftHide()){
            contentLeftHide(20);
            $("moreButtomCover").onmouseout = function(){
                $("moreButtomCover").onmouseout = function(){};
                headerLeftHide(20);
            };
        }
        else if(!ctLShowJudge&&hasContentLeftHide()){
            $("moreButtomCover").onmouseout = function(){};
            if(hasHeaderLeftHide()){
                ctLMainShow(20);
            }
            else{
                contentLeftShow(20);
            }
        };
    };

    $("hdRSTDetailBox").getElementsByClassName("toggleCollection")[0].onclick = function(){
        return hdClickToAddCollect(this);
    };
    $("hdRSTDetailBox").getElementsByClassName("toggleLike")[0].onclick = function(){
        return clickToAddLike(contentId,"hd");
    };

    $("ctLMain").onmousewheel = function(event) {
        if(canScroll){
            canScroll = false;
            event = event || window.event; 
            ctLMainScroll(event.wheelDelta/120);
        };
    };
    $("ctLMain").addEventListener("DOMMouseScroll", function(event) {
        if(canScroll){
            canScroll = false;
            ctLMainScroll(event.detail/-3);
        };
    });

    $("ctLScroll").onmousewheel = function(event) {
        if(canScroll){
            canScroll = false;
            event = event || window.event; 
            ctLMainScroll(event.wheelDelta/120);
        };
    };
    $("ctLScroll").addEventListener("DOMMouseScroll", function(event) {
        if(canScroll){
            canScroll = false;
            ctLMainScroll(event.detail/-3);
        };
    });

    $("ctLScrollBar").onmousedown =function(event){
        event           = event || window.event;
        var mouseStartY = event.pageY; 
        controlByScrollBar(mouseStartY);
    };

    $("commentSubmit").onclick = function(){
        if($("commentText").value.length !== 0){
            sendComment();
        };
    };

    $("commentText").onkeyup = function(){
        var reg = /^回复@\S+:/;
        var valueLength;
        if(this.value.search(reg) === -1){
            valueLength = 0;
        }
        else{
            valueLength = (reg.exec(this.value))[0].length;
        };
        if(this.value.length > valueLength){
            $("commentSubmit").style.backgroundColor = "rgb(226, 226, 226)";
            $("commentSubmit").children[0].style.color = "rgb(119, 119, 119)";
        }
        else{
            $("commentSubmit").style.backgroundColor = "#DFDFDF";
            $("commentSubmit").children[0].style.color = "#BDBDBD";
        };
    };

    $("ctRWaitBoxBg").onclick = function(){
        ifameWaitStop();
    };

    $("ctLScroll").onmouseover = function(){
        setScrollBarShow();
    };

    $("ctLScroll").onmouseout = function(){
        setScrollBarHide();
    };
})()