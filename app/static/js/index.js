window.onresize = function(){
    if(parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) >= 1120){
        var contentDivMarginWidth = parseFloat(window.getComputedStyle(document.getElementsByClassName("contentDiv")[0],false).marginLeft);
        document.getElementsByClassName("groupDiv")[0].style.left = (contentDivMarginWidth -110)+"px";
        document.getElementsByClassName("slideRightButton")[0].style.display = "none";
    }
    else{
        document.getElementsByClassName("groupDiv")[0].style.left = "-100px";
        document.getElementsByClassName("slideRightButton")[0].style.display = "inline-block";
    }
    
};

window.onmousewheel = function(){
    var groupDiv = document.getElementsByClassName("groupDiv")[0];
    if(groupDiv.getBoundingClientRect().top<55){
        groupDiv.style.position = "fixed";
        groupDivSlide (25);
    }
    else if(document.getElementsByTagName("html")[0].getBoundingClientRect().top == 0 ){
        groupDiv.style.position = "absolute";
    }
};

document.getElementsByClassName("slideRightButton")[0].onclick = function(){
    document.getElementsByClassName("slideRightButton")[0].style.display = "none";

    var countTime = 1;
    const T  = 30;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;
    const t2 = 0.6*T;
    const v  = 200/T;

    var moveTime = setInterval(function(){   
        if(countTime <= t1){
            moveDistance = 0.5*a1*countTime*countTime;
        }
        else{
            moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
        };
        document.getElementsByClassName("groupDiv")[0].style.left = (-100 + moveDistance)+"px";
        if(countTime < T){
            ++countTime;
        }
        else{
            clearInterval(moveTime);
        }
    },1);
};

document.getElementsByClassName("groupMain")[0].onmouseout = function(){
    if(parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0],false).width) < 1120){
        var countTime = 1;
        const T  = 30;
        const a1 = 500/(T*T);
        const a2 = 1000/(3*T*T);
        const t1 = 0.4*T;
        const t2 = 0.6*T;
        const v  = 200/T;

        var moveTime = setInterval(function(){   
            if(countTime <= t1){
                moveDistance = 0.5*a1*countTime*countTime;
            }
            else{
                moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
            };
            document.getElementsByClassName("groupDiv")[0].style.left = (0 - moveDistance)+"px";
            if(countTime < T){
                ++countTime;
            }
            else{
                clearInterval(moveTime);
                document.getElementsByClassName("slideRightButton")[0].style.display = "inline-block";
            }
        },1);
    };
};

var groupDivSlide = function(T){
    var countTime = 1;
    const a1 = 500/(T*T);
    const a2 = 1000/(3*T*T);
    const t1 = 0.4*T;
    const t2 = 0.6*T;
    const v  = 200/T;
    var groupDiv =  document.getElementsByClassName("groupDiv")[0];
    var scrollTop = groupDiv.scrollTop;
    var length = (295 - scrollTop)/100;

    groupDiv.style.position = "fixed";
    groupDiv.style.top = scrollTop + "px";

    var moveTime = setInterval(function(){   
        if(countTime <= t1){
            moveDistance = 0.5*a1*countTime*countTime;
        }
        else{
            moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
        };
        groupDiv.style.top = (scrollTop + length*moveDistance)+"px";
        if(countTime < T){
            ++countTime;
        }
        else{
            clearInterval(moveTime);
        }
    },1);
};

window.onload = function(){
    queryGroup();
};


var queryGroup = function(){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp=new XMLHttpRequest();
     }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    };
    //将点赞动作发送到服务器中
    xmlhttp.open("POST","/query_group",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("");
    xmlhttp.onreadystatechange=function(){
       if (xmlhttp.readyState==4 && xmlhttp.status==200){//发送成功显示当前是否为“喜欢“
            var groupJSON  = JSON.parse(xmlhttp.responseText);
            console.log(groupJSON);
        };
    };
};

/*
$(function(){
    $('.groupDiv .remove').click(function(){
        var group_id = $(this).attr("data");
        var req = {
            group_id: group_id
        };

        $.post('/remove_attention_from_group/', req)
            .done(function(result){
                alert(result);
            })
            .fail(function(){
                console.log('failed');
            });
    });

    $('.groupDiv .add').click(function(){
        var group_id = $(this).attr("data");
        var req = {
            group_id: group_id
        };

        $.post('/add_attention_to_group/', req)
            .done(function(result){
                alert(result);
            })
            .fail(function(){
                console.log('failed');
            });
    });
});
*/