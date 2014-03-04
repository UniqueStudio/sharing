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

    var ctLMain1Wait;
    var ctLMain2Wait;
    var ifameWait;
    var point = 1;
    var timestampNum = 1;
    var likesNum = 1;
    var collectNum = 1;
    var contentIdLoadBefore = 1;
    var contentLengthNow = 0;
    var contentId = 1;
    var commentID = 1;
    var ctLShowJudge = true;
    var needToLoad = new Array(true,true,true,true); 
    var canLoad = new Array(true,true,true,true)
    var canScroll = true;
    var username;
    var userImgUrl;

    var $ = function(className){
        return document.getElementsByClassName(className)[0];
    };

    var getCss = function(className){
        return window.getComputedStyle(document.getElementsByClassName(className)[0],false);
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
            if(countTime < T){
                ++countTime;
            }
            else{
                clearInterval(moveTime);
            }
        },1);
    };

    var changeScrollBarTop = function(scrollHeight,contentHeight,marginTopNow){
        var ctLMainHeight        = parseFloat(getCss("ctLMain").height);
        var ctLMainShowDivHeight = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var scrollHeight         = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom) - ctLMainShowDivHeight;
        var marginTopNow         = 0 - parseFloat(getCss("ctLMain"+point+"Show").marginTop);
        var scrollBarHeiht       = parseFloat(getCss("ctLScrollBar").height);
        var scrollTop            = marginTopNow/scrollHeight*(ctLMainHeight - scrollBarHeiht);
        $("ctLScrollBar").style.top = scrollTop +"px";
    };

    var changeScrollBarHeight = function(){
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

    var setScrollBarHide = function(){
        $("ctLScrollBar").style.webkitTransitionDelay = "3s";
        $("ctLScrollBar").style.mozTransitionDelay = "3s";
        $("ctLScrollBar").style.transitionDelay = "3s";

        $("ctLScrollBar").style.webkitTransitionDuration = "1.2s";
        $("ctLScrollBar").style.mozTransitionDuration = "1.2s";
        $("ctLScrollBar").style.transitionDuration = "1.2s"

        $("ctLScrollBar").style.opacity = 0;
    };
    var setScrollBarShow = function(){
        $("ctLScrollBar").style.webkitTransitionDelay = "0s";
        $("ctLScrollBar").style.mozTransitionDelay = "0s";
        $("ctLScrollBar").style.transitionDelay = "0s";

        $("ctLScrollBar").style.webkitTransitionDuration = "0.01s";
        $("ctLScrollBar").style.mozTransitionDuration = "0.01s";
        $("ctLScrollBar").style.transitionDuration = "0.01s";

        $("ctLScrollBar").style.opacity = 1;
    };

    var ctLMainScroll = function(theScroll){
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

    var controlByScrollBar = function(mouseStartY){
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

    var changeCtLMarginTop = function(){
        var showDivHeight   = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var mainNowHeight   = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        var showDivMarginTop = parseFloat(getCss("ctLMain"+point+"Show").marginTop);
        if((mainNowHeight + showDivMarginTop) < showDivHeight){
            $("ctLMain"+point+"Show").style.marginTop = (showDivHeight -mainNowHeight) +"px";
        };
        changeScrollBarHeight();
    };

    var ifameWaitStop = function(){
        $("ctRWaitBoxBg").style.display = "none";
        ifameWait.waitingStop();
    };

    var ifameWaitShow = function(){
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

    var collectLoad = function(){
        var json;
        var content;
        var contentJson;
        var contentObj       = $("ctLMain0Show").children;
        var lengthLoadBefore = contentObj.length;
        var xmlhttp          =new XMLHttpRequest();
        ctLMain1Wait.waitingShow();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status&&json.length>0){
                    document.onmousemove = function(){};
                    ++colllectNum;
                    for (var i = 0;i < json.length;++i){
                        content = json.result[i];
                        $("ctLMain0Show").innerHTML = $("ctLMain0Show").innerHTML 
                                            + "<a href='"+content.url
                                            +"' class='eachConnection' onclick='return ecCilck(this)' id='"+content.id
                                            +"'><div class='briefShow'><div class='shareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                            +")'></div><div class='shareTitleBlock'><div class='shareTitle'><span>"+content.title
                                            +"</span></div><span class='shareDetail'>赞("+content.likes
                                            +")  评论("+ content.comments
                                            +")  " + content.timestamp
                                            +"</span></div></div></a>";
                    };
                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            contentObj[i].className += " contentShow";
                            changeScrollBarHeight();

                            ++i;
                        }
                        else{
                            needToLoad[0] = true;
                            clearInterval(loopTime);
                        };  
                    },20);
                }
                else{
                    needToLoad[0] = true;
                }
            };
            ctLMain1Wait.waitingStop();
        };
        xmlhttp.open("POST","/collection/list",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("start="+collectNum+"&sortby=timestamp");
    };

    var linkContentLoad = function(type){
        var json;
        var content;
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
                    }
                    for (var i = 0;i < json.length;++i){
                        content = json.result[i];
                        $("ctLMain1Show").innerHTML = $("ctLMain1Show").innerHTML 
                                            + "<a href='"+content.url
                                            +"' class='eachConnection' onclick='return ecCilck(this)' id='"+content.id
                                            +"'><div class='briefShow'><div class='shareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                            +")'></div><div class='shareTitleBlock'><div class='shareTitle'><span>"+content.title
                                            +"</span></div><span class='shareDetail'>赞("+content.likes
                                            +")  评论("+ content.comments
                                            +")  " + content.timestamp
                                            +"</span></div></div></a>";
                    };
                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            contentObj[i].className += " contentShow";
                            changeScrollBarHeight();

                            ++i;
                        }
                        else{
                            setScrollBarHide();
                            needToLoad[1] = true;
                            clearInterval(loopTime);
                        };  
                    },20);
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

    var shuffleLoad = function(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                canLoad[2] = true;
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    ifameWaitShow();
                    $("ctRMain").src = json.result.url;
                    $("hdR0").href = json.result.url;
                    $("hdRShareTitle").children[0].innerHTML = json.result.title;
                    contentId = json.result.id;
                    commentID = 1;
                    if(point === 2){
                        $("ctLMain2Show").style.marginTop = "0px"
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";;
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/shuffle",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send();
    };

    var commentLoad = function(){
        var contentObj       = $("ctLMain2Show").children;
        var lengthLoadBefore = contentObj.length;
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
                                            +"</span><div class='replyButton' onclick='commentReply(this)'><div></div></div></div></div>"
                        $("ctLMain2Show").innerHTML = $("ctLMain2Show").innerHTML + newCommentText;
                    };

                    var lengthNow = contentObj.length;
                    var i = lengthLoadBefore;
                    var loopTime = setInterval(function(){
                        if(i < lengthNow){
                            contentObj[i].className += " commentShow";
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

    var sendComment = function(){
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
                    var newCommentText = "<div class='eachComment commentShow'><div class='eCmShareImg' style='background-image:" + userImgUrl
                                        +";'></div><div class='eCmCommentText'><span>"+ commentText
                                        +"</span><div class='replyButton' onclick='commentReply(this)'><div></div></div></div></div>"
                    $("ctLMain2Show").innerHTML = newCommentText + $("ctLMain2Show").innerHTML;
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

    window.commentReply = function(obj){
        var reg1 = /^回复@\S+:/;
        var reg2 = /回复@\S+:/;
        var reg3 = /^\S+回复@\S+:/;
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
        console.log(reg1.test($("commentText").value),name);
        if(reg1.test($("commentText").value)){
            $("commentText").value = $("commentText").value.replace(reg1,"回复@"+ name +":");
        }
        else{
            $("commentText").value = "回复@" + name + ":" + $("commentText").value;
        };        
    };

    window.ecCilck = function(obj){
        contentId = obj.id;
        commentID = 1;
        ifameWaitShow();
        $("ctRMain").src = obj.href;
        $("hdR0").href = obj.href;
        $("hdRShareTitle").children[0].innerHTML = obj.children[0].children[1].children[0].children[0].innerHTML
        return false;
    };

    var contentLeftHide = function(T){
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
            $("contentRight").style.width = (ctRMainWidth + moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                $("contentLeft").style.display  ="none";
                $("contentRight").style.width = "100%"
                clearInterval(moveTime);
            }
        },1);
    };

    var contentLeftShow = function(T){
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

        $("moreButtomCover").onmouseout = function(){};

        $("toLeft").style.display = "inline-block";
        $("toRight").style.display = "none";

        if(bodyWidth <= 1117){
            ctLMainWidth = 335;
            length = 335;
        }
        else{
            ctLMainWidth = bodyWidth*0.3;
            length = bodyWidth*0.3;
        };

        $("contentLeft").style.marginLeft  = (0 - ctLMainWidth) +"px";
        $("contentLeft").style.width  = (ctLMainWidth) +"px";
        $("contentLeft").style.minWidth  = "0px";
        $("contentLeft").style.display  ="inline-block";

        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $("contentLeft").style.marginLeft  = (0 - ctLMainWidth + moveDistance) +"px";
            $("contentRight").style.width = (bodyWidth - moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                ctLShowJudge = true;
                $("contentLeft").style.width  = "30%";
                $("contentLeft").style.minWidth  = "335px";
                $("contentRight").style.width  = (bodyWidth - ctLMainWidth) + "px";
                clearInterval(moveTime);
            }
        },1);
    };

    var headerLeftHide = function(T){
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

        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $("headerLeft").style.marginLeft = (0 - moveDistance) +"px";
            $("headerRight").style.width  = (ctRMainWidth + moveDistance) +"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                $("headerLeft").style.display = "none";
                $("headerRight").style.width  = "100%"
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

        $("toLeft").style.display = "inline-block";
        $("toRight").style.display = "none";

        if(bodyWidth <= 1117){
            ctLMainWidth = 335;
            length = 335;
        }
        else{
            ctLMainWidth = bodyWidth*0.3;
            length = bodyWidth*0.3;
        }
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
                ctLShowJudge = true;
                $("headerLeft").style.width = "30%";
                $("contentLeft").style.width  = "30%";
                $("headerLeft").style.minWidth = "335px";
                $("contentLeft").style.minWidth  = "335px";
                //$("headerRight").style.width = (bodyWidth - ctLMainWidth) + "px";
                //$("contentRight").style.width  = (bodyWidth - ctLMainWidth) + "px";
                $("headerRight").style.width = "70%";
                $("contentRight").style.width  = "70%";
                clearInterval(moveTime);
            }
        },1);
    };

    var hasHeaderLeftHide = function(){
        return (getCss("headerLeft").display === "none")
    };

    var hasContentLeftHide = function(){
        return (getCss("contentLeft").display === "none")
    };

    window.onload = function(){
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
        var ctRMainWidth;
        changeCtLMarginTop();

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
        if(point !== 0){
            $("hdL"+point).style.cursor = "pointer";
            arrowMove(30,point - 0);
            ctLMainMove(30,0);
            point = 0;
            changeScrollBarHeight(); 
            $("hdL0").style.cursor = "default";
        };
    };

    $("hdL1").onclick = function(){
        if(point !== 1){
            $("hdL"+point).style.cursor = "pointer";
            arrowMove(30,point - 1);
            ctLMainMove(30,1);
            point = 1;
            changeScrollBarHeight();
            $("hdL1").style.cursor = "default";
        };
    };

    $("hdL2").onclick = function(){
        if(point !== 2){
            $("hdL"+point).style.cursor = "pointer";
            arrowMove(30,point - 2);
            ctLMainMove(30,2);
            point = 2;      
            changeScrollBarHeight();  
            if(commentID === 1){
                $("ctLMain2Show").style.marginTop = "0px"
                $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                commentLoad();
            }
            $("hdL2").style.cursor = "default";
        };
    };

    $("hdL3").onclick = function(){
        if(point !== 3){
            $("hdL"+point).style.cursor = "pointer";
            arrowMove(30,point - 3);
            ctLMainMove(30,3);
            point = 3;     
            changeScrollBarHeight();  
            $("hdL3").style.cursor = "default";
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
                    $("ctRMain").src = json.result.url;
                    $("hdR0").href = json.result.url;
                    $("hdRShareTitle").children[0].innerHTML = json.result.title;
                    --contentId;
                    commentID = 1;
                    if(point === 2){
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
                    $("ctRMain").src = json.result.url;
                    $("hdR0").href = json.result.url;
                    $("hdRShareTitle").children[0].innerHTML = json.result.title;
                    ++contentId;
                    commentID = 1;
                    if(point === 2){
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
        }
        console.log(valueLength)
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