document.getElementsByClassName("checkShow")[0].onclick = function(){
    checkboxClick();
};

document.getElementsByClassName("remenberMe")[0].onclick = function(){
    checkboxClick();
};

document.getElementsByClassName("signInButton")[0].onclick = function(){
    formAnimate("registerDiv","loginDiv")
};

document.getElementsByClassName("signUpButton")[0].onclick = function(){
    formAnimate("loginDiv","registerDiv")
};

var formAnimate = function(form1Name,form2Name){
    const T1       =  60;
    const T2       = 100;
    var countTime1 = 1;
    var a11        = 500/(T1*T1);
    var a21        = 1000/(3*T1*T1);
    var t11        = 0.4*T1;//加速时间
    var t21        = 0.6*T1;//减速时间
    var v1         = 200/T1;
    
    countTime2     = 1;
    var a12        = 500/(T2*T2);
    var a22        = 1000/(3*T2*T2);
    var t12        = 0.4*T2;//加速时间
    var t22        = 0.6*T2;//减速时间
    var v2         = 200/T2;
    var moveDistance;
    var form1 = document.getElementsByClassName(form1Name)[0];
    var form2 = document.getElementsByClassName(form2Name)[0];
    
    var moveTime1 = setInterval(function(){  
        if(countTime1 <= t11){

            moveDistance = 0.5*a11*countTime1*countTime1;
        }
        else{
            moveDistance = 40+v1*(countTime1-t11)-0.5*a21*(countTime1-t11)*(countTime1-t11);
        };
        form1.style.left = (0 - moveDistance) + "%";
         
        form1.style.opacity = 1 - moveDistance/100.0
        if(countTime1 < T1){
            ++countTime1;
        }
        else{
            form1.style.left = 0;
            form1.style.top = "100%";
            clearInterval(moveTime1);

            var moveTime2 = setInterval(function(){  
                if(countTime2 <= t12){
                    moveDistance = 0.5*a12*countTime2*countTime2;
                }
                else{
                    moveDistance = 40+v2*(countTime2-t12)-0.5*a22*(countTime2-t12)*(countTime2-t12);
                };
                form2.style.top = (100 - moveDistance) + "%"; 
                form2.style.opacity = moveDistance/100;
                if(countTime2 < T2){
                    ++countTime2;
                }
                else{
                    form1.style.left = 0;
                    form1.style.top = "100%";
                    clearInterval(moveTime2);
                }
            },1);
        }
    },1);
};

var checkboxClick = function(){
    if(document.getElementsByClassName("remenberBox")[0].checked){
        document.getElementsByClassName("remenberBox")[0].checked = false;
        document.getElementsByClassName("checkShow")[0].style.backgroundColor = "rgba(0,0,0,0)";
        document.getElementsByClassName("checkShow")[0].style.borderColor = "rgba(153, 153, 153, 0.76)";

    }
    else{
        document.getElementsByClassName("remenberBox")[0].checked = true;
        document.getElementsByClassName("checkShow")[0].style.backgroundColor = "rgba(0,0,0,0.5)";
        document.getElementsByClassName("checkShow")[0].style.borderColor = "rgba(201, 199, 199, 0.76)";
    };
};

var loginJudge = function(){
    var name     = false;
    var password = false;
    var reg      = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if(reg.test(document.getElementsByClassName("loginEmail")[0].value)){
         name = true;  
    };
    if(document.getElementsByClassName("loginPassword")[0].value.length > 0){
        password = true;
    };
    console.log(name,password);
    if(name&&password){
        return true;
    }
    else{
        document.getElementsByClassName("loginAlert")[0].innerHTML = "用户名或密码错误，请重新输入"
        document.getElementsByClassName("loginAlert")[0].style.opacity = 1;
        return false;
    };

};

var registerJudge = function(){
    var email    = false;
    var name     = false;
    var password = false;
    var reg      = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if(reg.test(document.getElementsByClassName("registerEmail")[0].value)){
         email = true;  
    };
    if(document.getElementsByClassName("registerPassword")[0].value.length > 0){
        password = true;
    };
    if(document.getElementsByClassName("registerUserName")[0].value.length > 0){
        name = true;
    };
    console.log(name,password);
    if(name&&password&&email){
        return true;
    }
    else{
        document.getElementsByClassName("registerAlert")[0].innerHTML = "请正确填写相关信息"
        document.getElementsByClassName("registerAlert")[0].style.opacity = 1;
        return false;
    };
};