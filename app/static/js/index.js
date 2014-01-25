var point = 1;

$(document).ready(function(){
    window.onload = function(){
        $(".arrowLeft")[0].style.width = (point*25) + "%";
        $(".arrowRight")[0].style.width = ((3-point)*25) + "%";
    };

    $(".hdL0").children(0).click(function(){
        if(point !== 0){
            arrowMove(30,point - 0);
            point = 0;
        };
    });

    $(".hdL1").children(0).click(function(){
        if(point !== 1){
            arrowMove(30,point - 1);
            point = 1;
        };
    });

    $(".hdL2").children(0).click(function(){
        if(point !== 2){
            arrowMove(30,point - 2);
            point = 2;        
        };
    });

    $(".hdL3").children(0).click(function(){
        if(point !== 3){
            arrowMove(30,point - 3);
            point = 3;        
        };
    });

    var arrowMove = function(T,point){
        var countTime = 1;
        const a1 = 500/(T*T);
        const a2 = 1000/(3*T*T);
        const t1 = 0.4*T;//加速时间
        const t2 = 0.6*T;//减速时间
        const v  = 200/T;
        const arrowLeftNow  = parseFloat($(".arrowLeft")[0].style.width);
        const arrowRightNow = parseFloat($(".arrowRight")[0].style.width);
        const length = point*25;
        var moveTime = setInterval(function(){  
            if(countTime <= t1){
                moveDistance = (0.5*a1*countTime*countTime)*length/100;
            }
            else{
                moveDistance = (40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1))*length/100;
            };
            $(".arrowLeft")[0].style.width  = (arrowLeftNow - moveDistance) +"%";
            $(".arrowRight")[0].style.width = (arrowRightNow + moveDistance) +"%";
            if(countTime < T){
                ++countTime;
            }
            else{
                clearInterval(moveTime);
            }
        },1);
    };
});