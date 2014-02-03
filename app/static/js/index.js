var point = 1;

$(document).ready(function(){
    window.onload = function(){
        $(".arrowLeft").css("width",(point*25) + "%");
        $(".arrowRight").css("width",((3-point)*25) + "%");
        $(".ctLMain"+point).css("left","0%");
        changeScrollBarHeight();
    }; 

    $(".hdL0").children(0).click(function(){
        if(point !== 0){
            arrowMove(30,point - 0);
            ctLMainMove(200,0);
            point = 0;
            changeScrollBarHeight();
        };
    });

    $(".hdL1").children(0).click(function(){
        if(point !== 1){
            arrowMove(30,point - 1);
            ctLMainMove(200,1);
            point = 1;
            changeScrollBarHeight();
        };
    });

    $(".hdL2").children(0).click(function(){
        if(point !== 2){
            arrowMove(30,point - 2);
            ctLMainMove(200,2);
            point = 2;      
            changeScrollBarHeight();  
        };
    });

    $(".hdL3").children(0).click(function(){
        if(point !== 3){
            arrowMove(30,point - 3);
            ctLMainMove(200,3);
            point = 3;     
            changeScrollBarHeight();   
        };
    });

    $(".ctLMain")[0].onmousewheel = function(event) {
        var event = event || window.event; 
        ctLMainScroll(event.wheelDelta/120);
    };
    $(".ctLMain")[0].addEventListener("DOMMouseScroll", function(event) {
        ctLMainScroll(event.detail/-3);
    });

    $(".ctLScrollBar").mousedown(function(event){
        event               = event || window.event;
        var mouseStartY     = event.pageY; 
        var contentHeight   = parseFloat($(".ctLMain").css("height"))
        var scrollBartopNow = parseFloat($(".ctLScrollBar").css("top"));
        var mainNowHeight   = parseFloat($(".ctLMain"+point).css("height"));
        var scrollHeight    = contentHeight - mainNowHeight;
        var barMoveHeight   = contentHeight - 50;
        var ctLMainMarginTop;
        $(".screen").css("display","block");
        selectFalse();
        $(document).bind("mousemove",function(event){
            var moveY = event.pageY - mouseStartY + scrollBartopNow;
            
            if(moveY >= 0 && moveY <= barMoveHeight){
                $(".ctLScrollBar").css("top",moveY);
                ctLMainMarginTop = parseFloat($(".ctLScrollBar").css("top"))/barMoveHeight*scrollHeight;
                $(".ctLMain"+point).css("margin-top",ctLMainMarginTop);
            }
            else if(moveY < 0){
                    $(".ctLScrollBar").css("top",0);                    
                    $(".ctLMain"+point).css("margin-top",0);
                }
                else if(moveY > barMoveHeight){
                        $(".ctLScrollBar").css("top",barMoveHeight);                    
                        $(".ctLMain"+point).css("margin-top",scrollHeight);
                    }
        });
    });

    $(document).mouseup(function(){
        $(".screen").css("display","none");
        selectTrue();
        $(document).unbind("mousemove");
    });

    var selectFalse = function(){
        $(document).bind("selectstart",function(){return false;});
        $("div").css("-moz-user-select","none");
    };

    var selectTrue = function(){
        $(document).bind("selectstart",function(){return true;});
        $("div").css("-moz-user-select","text");
    };

    var ctLMainMove = function(T,thePoint){
        $(".ctLMain"+point).css("left","100%");
        $(".ctLMain"+thePoint).animate({left:"0%"},T);
    };

    var arrowMove = function(T,thePoint){
        var countTime = 1;
        const a1 = 500/(T*T);
        const a2 = 1000/(3*T*T);
        const t1 = 0.4*T;//加速时间
        const t2 = 0.6*T;//减速时间
        const v  = 200/T;
        const arrowLeftNow  = parseFloat($(".arrowLeft")[0].style.width);
        const arrowRightNow = parseFloat($(".arrowRight")[0].style.width);
        const length = thePoint*25;
        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $(".arrowLeft").css("width",(arrowLeftNow - moveDistance) +"%");
            $(".arrowRight").css("width",(arrowRightNow + moveDistance) +"%");
            if(countTime < T){
                ++countTime;
            }
            else{
                clearInterval(moveTime);
            }
        },1);
    };

    var changeScrollBarHeight = function(){
        var contentHeight = parseFloat($(".ctLMain").css("height"));
        var mainNowHeight = parseFloat($(".ctLMain"+point).css("height"));
        var hasMainNow    = mainNowHeight - contentHeight;
        if(hasMainNow <= 0 ){
            $(".ctLScrollBar").css("height",0);
        }
        else{
            $(".ctLScrollBar").css("height",50);
        }
    };

    var changeScrollBarTop = function(scrollHeight,contentHeight,marginTopNow){
        var contentHeight =  parseFloat($(".ctLMain").css("height"));
        var scrollHeight  = parseFloat($(".ctLMain"+point).css("height")) - contentHeight;
        var marginTopNow  = 0 - parseFloat($(".ctLMain"+point).css("margin-top"));
        var scrollTop     = marginTopNow/scrollHeight*(contentHeight - 50);
        $(".ctLScrollBar").css("top",scrollTop);
    };

    var ctLMainScroll = function(theScroll){
        var marginTopNow  = parseFloat($(".ctLMain"+point).css("margin-top"));
        var contentHeight = parseFloat($(".ctLMain").css("height"));
        var mainNowHeight = parseFloat($(".ctLMain"+point).css("height"));
        if((mainNowHeight - contentHeight)>0){
            var hasOverBottom  = marginTopNow + mainNowHeight - contentHeight;
            if(theScroll < 0){//主体内容上滚
                if(hasOverBottom > 55){
                    $(".ctLMain"+point).css("margin-top",marginTopNow-55);
                    changeScrollBarTop();
                }
                else if(hasOverBottom > 0){
                    $(".ctLMain"+point).css("margin-top",contentHeight - mainNowHeight);
                    changeScrollBarTop();
                };
                
            }
            else if(theScroll > 0){//主体内容下滚
                if(marginTopNow < -55){
                    $(".ctLMain"+point).css("margin-top",marginTopNow+55);
                    changeScrollBarTop();
                }
                else if(marginTopNow < 0){
                    $(".ctLMain"+point).css("margin-top",0);
                    changeScrollBarTop();
                };
                
            };
        };
    };
});