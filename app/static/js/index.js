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
        this.speedChangeDis = (this.waitBoxWidth + this.waitDotWidth*2 - 5*this.Vconst*this.eachTime)/2.0;
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
    };

    var ctLMain1Wait;
    var ctLMain2Wait;
    var point = 1;
    var timestampNum = 1;
    var likesNum = 1;
    var contentIdLoadBefore = 1;
    var contentLengthNow = 0;
    var contentId = 1;
    var commentID = 1;
    var ctLShowJudge = true;
    var needToLoad = true;
    var canScroll = true;
    var username;
    var userImgUrl;

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
            $("ctLScrollBar").style.height = ctLMainHeight*ctLMainShowDivHeight/mainNowHeight +"px";
        }
        changeScrollBarTop();
    };

    var ctLMainScroll = function(theScroll){
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
                        if(needToLoad&&parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (ctLMainShowDivHeight - mainNowHeight + 70)){
                            needToLoad = false;
                            linkContentLoad("timestamp");
                        };
                        break;
                    case 2:
                        if(parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (ctLMainShowDivHeight - mainNowHeight + 70)){
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
                if(json.status){
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
                                            +"'><div class='eachLeft'><div class='ELShareShot' style='background:url(http://img.bitpixels.com/getthumbnail?code=38052&size=200&url="+content.url
                                            +")'></div><div class='ELShareTitle'><div class='shareTitle'>"+content.title
                                            +"</div><span class='shareDetail'>赞("+content.likes
                                            +")  评论("+ content.comments
                                            +")  " + content.timestamp
                                            +"</span></div></div><div class='eachRight'><div class='ERSharemanImg' style='background:url("+content.author_image
                                            +")'></div><div class='ERShareReason'><span class='shareName'>"+content.author_name
                                            +"</span><span class='shareReason'>"+content.explain
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
                            needToLoad = true;
                            clearInterval(loopTime);
                        };  
                    },20);
                };
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
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    $("ctRMain").src = json.result.url;
                    contentId = json.result.id;
                    commentID = 1;
                    if(point === 2){
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
                if(json.status){
                    ++commentID;
                    var commentLength = json.result.length;
                    for(var i = 0;i < commentLength;++i){
                        var newCommentText = "<div class='eachComment'><div class='eCmShareImg' style='background-image:url(" + json.result[i].author_image
                                            +");'></div><div class='eCmCommentText'><span>"+ json.result[i].body
                                            +"</span></div></div>"
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
                            clearInterval(loopTime);
                        };  
                    },20);
                };
            };
            ctLMain2Wait.waitingStop();
        };
        xmlhttp.open("POST","/comment/list",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("start="+commentID+"&share_id="+contentId);
    };

    var sendComment = function(){
        var xmlhttp = new XMLHttpRequest();
        var commentText = username + ": " + $("commentText").value;
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    var newCommentText = "<div class='eachComment'><div class='eCmShareImg' style='background-image:" + userImgUrl
                                        +";'></div><div class='eCmCommentText'><span>"+ commentText
                                        +"</span></div></div><hr>"
                    $("ctLMain2Show").innerHTML = newCommentText + $("ctLMain2Show").innerHTML;
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

    window.ecCilck = function(obj){
        contentId = obj.id;
        commentID = 1;
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
        ctLMain1Wait = new waitingDot("ctLMain1WaitBox");
        ctLMain2Wait = new waitingDot("ctLMain2WaitBox");
        var ctRMainWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) - parseFloat(getCss("headerLeft").width);
        $("arrowLeft").style.width = (point*25) + "%";
        $("arrowRight").style.width = (3-point)*25 + "%";
        $("ctLMain"+point).style.left = "0%";
        $("headerRight").style.width = ctRMainWidth + "px";
        $("contentRight").style.width = ctRMainWidth + "px";
        linkContentLoad("timestamp");
        shuffleLoad();  
        username = $("username").innerHTML;
        userImgUrl = $("userImg").style.backgroundImage;
    }; 

    window.onresize = function(){
        var ctRMainWidth;
        changeScrollBarHeight();
        if(ctLShowJudge){
            ctRMainWidth = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) - parseFloat(getCss("headerLeft").width);  
            $("headerRight").style.width = ctRMainWidth + "px";
            $("contentRight").style.width = ctRMainWidth + "px";
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

    $("hdL0").children[0].onclick = function(){
        if(point !== 0){
            arrowMove(30,point - 0);
            ctLMainMove(30,0);
            point = 0;
            changeScrollBarHeight();
        };
    };

    $("hdL1").children[0].onclick = function(){
        if(point !== 1){
            arrowMove(30,point - 1);
            ctLMainMove(30,1);
            point = 1;
            changeScrollBarHeight();
        };
    };

    $("hdL2").children[0].onclick = function(){
        if(point !== 2){
            arrowMove(30,point - 2);
            ctLMainMove(30,2);
            point = 2;      
            changeScrollBarHeight();  
            if(commentID === 1){
                $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
                commentLoad();
            }
        };
    };

    $("hdL3").children[0].onclick = function(){
        if(point !== 3){
            arrowMove(30,point - 3);
            ctLMainMove(30,3);
            point = 3;     
            changeScrollBarHeight();   
        };
    };

    $("hdR1").onclick = function(){
        shuffleLoad();
    };

    $("hdR2").onclick = function(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    $("ctRMain").src = json.url;
                    contentId = json.result.id;
                    commentID = 1;
                    if(point === 2){
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";;
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/next",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("method=previous");
    };

    $("hdR3").onclick = function(){
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
                var json  = JSON.parse(xmlhttp.responseText);
                if(json.status){
                    $("ctRMain").src = json.url;
                    contentId = json.result.id;
                    commentID = 1;
                    if(point === 2){
                        $("ctLMain2Show").innerHTML = "<div class='ctLMain2WaitBox'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";;
                        commentLoad();
                    };
                }
            };
        };
        xmlhttp.open("POST","/share/next",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("method=after");
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
        event               = event || window.event;
        var mouseStartY     = event.pageY; 
        var ctLMainHeight   = parseFloat(getCss("ctLMain").height);
        var showDivHeight   = parseFloat(getCss("ctLMain"+point+"ShowDiv").height);
        var scrollBartopNow = parseFloat(getCss("ctLScrollBar").top);
        var mainNowHeight   = parseFloat(getCss("ctLMain"+point+"Show").height) + parseFloat(getCss("ctLMain"+point+"Show").paddingBottom);
        var scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
        var scrollHeight    = showDivHeight - mainNowHeight;
        var barMoveHeight   = ctLMainHeight  - scrollBarHeight;
        var ctLMainMarginTop;
        $("screen").style.display = "block";
        selectFalse();
        document.onmousemove = function(event){
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
                        $("ctLScrollBar").top = barMoveHeight + "px";                    
                        $("ctLMain"+point+"Show").marginTop = scrollHeight + "px";
                    };
            if(point === 1){
                if(parseFloat($("ctLMain"+point+"Show").style.marginTop) <= (showDivHeight - mainNowHeight + 70)){
                    if(needToLoad){
                        needToLoad = false;
                        scrollBarHeight = parseFloat(getCss("ctLScrollBar").height);
                        barMoveHeight   = ctLMainHeight - scrollBarHeight;
                        linkContentLoad("timestamp");
                    };            
                }
                else{
                    needToLoad = true;
                };
            };
        };
    };

    $("commentSubmit").onclick = function(){
        if($("commentText").value.length !== 0){
            sendComment();
        };
    };

    $("commentText").onkeydown = function(){
        if(this.value.length !== 0){
            $("commentSubmit").style.backgroundColor = "#fff";
            $("commentSubmit").children[0].style.color = "#727272";
        }
        else{
            $("commentSubmit").style.backgroundColor = "#E0E0E0";
            $("commentSubmit").children[0].style.color = "#C5C5C5";
        };
    };
})()