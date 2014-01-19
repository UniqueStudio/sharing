var loginButton         = document.getElementsByClassName("loginButton")[0];
var registerButton      = document.getElementsByClassName("registerButton")[0];
var loginAndRegisterMoveDiv = document.getElementsByClassName("loginAndRegisterMoveDiv")[0];
var loginForm           = document.getElementsByClassName("loginForm")[0];
var registerForm        = document.getElementsByClassName("registerForm")[0];

loginButton.onclick = function () {
        if(loginButton.style.cursor != "default"){
                registerButton.style.cursor = "pointer";
                loginButton.style.cursor = "default";

                var countTime = 1;
                const a1 = 1/20;
                const a2 = 1/30;
                var moveDistance = 0;

                var t = setInterval(function(){
                        if(countTime <= 40){
                                moveDistance = 0.5*a1*countTime*countTime;
                                loginAndRegisterMoveDiv.style.marginLeft = (-100 + moveDistance)+"%";
                        }
                        else{
                                moveDistance = 0.5*a2*(100-countTime)*(100-countTime);
                                loginAndRegisterMoveDiv.style.marginLeft = (0-moveDistance)+"%";
                        };
                        registerForm.style.opacity = 1 - 0.01*countTime;
                        loginForm.style.opacity = 0.01*countTime;

                        if(countTime < 100){
                                ++countTime;
                        }
                        else{
                                clearInterval(t);
                        }
                },1);
        }
};

registerButton.onclick = function () {
        if(loginButton.style.cursor != "pointer"){
                registerButton.style.cursor = "default";
                loginButton.style.cursor = "pointer";
                
                var countTime = 1;
                const a1 = 1/20;
                const a2 = 1/30;
                var moveDistance = 0;

                var t = setInterval(function(){
                        if(countTime <= 40){
                                moveDistance = 0.5*a1*countTime*countTime;
                                loginAndRegisterMoveDiv.style.marginLeft = (0 - moveDistance)+"%";;
                        }
                        else{
                                moveDistance = 0.5*a2*(100-countTime)*(100-countTime);
                                loginAndRegisterMoveDiv.style.marginLeft = (-100+moveDistance)+"%";
                        };

                        registerForm.style.opacity = 0.01*countTime;
                        loginForm.style.opacity = 1-0.01*countTime;

                        if(countTime < 100){
                                ++countTime;
                        }
                        else{
                                clearInterval(t);
                        }
                },1);
        }
        
}
//表单验证
document.getElementsByClassName("loginName")[0].onfocus = function(){
        document.getElementsByClassName("loginNameOk")[0].style.display = "none";
        document.getElementsByClassName("loginNameFalse")[0].style.display = "none";
}

document.getElementsByClassName("loginName")[0].onblur = function(){
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(reg.test(document.getElementsByClassName("loginName")[0].value)){
             document.getElementsByClassName("loginNameOk")[0].style.display = "inline-block";   
        }
        else{
             document.getElementsByClassName("loginNameFalse")[0].style.display = "inline-block";   
        }     
}


document.getElementsByClassName("loginPassword")[0].onfocus = function(){
        document.getElementsByClassName("loginPasswordOk")[0].style.display = "none";
        document.getElementsByClassName("loginPasswordFalse")[0].style.display = "none";
}

document.getElementsByClassName("loginPassword")[0].onblur = function(){
        if(document.getElementsByClassName("loginPassword")[0].value.length < 6){
             document.getElementsByClassName("loginPasswordFalse")[0].style.display = "inline-block";   
        }
        else{
             document.getElementsByClassName("loginPasswordOk")[0].style.display = "inline-block";   
        }   
}


document.getElementsByClassName("registerName")[0].onfocus = function(){
        document.getElementsByClassName("registerNameOk")[0].style.display = "none";
        document.getElementsByClassName("registerNameFalse")[0].style.display = "none";
}

document.getElementsByClassName("registerName")[0].onblur = function(){
        if(document.getElementsByClassName("registerName")[0].value.length === 0){
             document.getElementsByClassName("registerNameFalse")[0].style.display = "inline-block";   
        }
        else{
             document.getElementsByClassName("registerNameOk")[0].style.display = "inline-block";   
        }    
}


document.getElementsByClassName("registerEmail")[0].onfocus = function(){
        document.getElementsByClassName("registerEmailOk")[0].style.display = "none";
        document.getElementsByClassName("registerEmailFalse")[0].style.display = "none";
}

document.getElementsByClassName("registerEmail")[0].onblur = function(){
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(reg.test(document.getElementsByClassName("registerEmail")[0].value)){
             document.getElementsByClassName("registerEmailOk")[0].style.display = "inline-block";   
        }
        else{
             document.getElementsByClassName("registerEmailFalse")[0].style.display = "inline-block";   
        }    
}


document.getElementsByClassName("registerPassword1")[0].onfocus = function(){
        document.getElementsByClassName("registerPassword1Ok")[0].style.display = "none";
        document.getElementsByClassName("registerPassword1False")[0].style.display = "none";
}

document.getElementsByClassName("registerPassword1")[0].onblur = function(){
        if(document.getElementsByClassName("registerPassword1")[0].value.length < 6){
             document.getElementsByClassName("registerPassword1False")[0].style.display = "inline-block";   
        }
        else{
             document.getElementsByClassName("registerPassword1Ok")[0].style.display = "inline-block";   
        }    
}

document.getElementsByClassName("registerPassword1")[0].onkeyup = function(){
        if(document.getElementsByClassName("registerPassword2")[0].value.length >= 6){
             if(document.getElementsByClassName("registerPassword2")[0].value === document.getElementsByClassName("registerPassword1")[0].value){
                  document.getElementsByClassName("registerPassword2Ok")[0].style.display = "inline-block";
                  document.getElementsByClassName("registerPassword2False")[0].style.display = "none";
             }
             else{
                  document.getElementsByClassName("registerPassword2False")[0].style.display = "inline-block";
                  document.getElementsByClassName("registerPassword2Ok")[0].style.display = "none";   
             }    
        }   
}

document.getElementsByClassName("registerPassword2")[0].onfocus = function(){
        var registerPassword2 = document.getElementsByClassName("registerPassword2")[0];
        if(registerPassword2.value.length < 6){
                document.getElementsByClassName("registerPassword2False")[0].style.display = "none";
                document.getElementsByClassName("registerPassword2Ok")[0].style.display = "none";
        }
        else{
                if(registerPassword2.value === document.getElementsByClassName("registerPassword1")[0].value){
                     document.getElementsByClassName("registerPassword2Ok")[0].style.display = "inline-block";
                     document.getElementsByClassName("registerPassword2False")[0].style.display = "none";
                }
                else{
                     document.getElementsByClassName("registerPassword2False")[0].style.display = "inline-block";
                     document.getElementsByClassName("registerPassword2Ok")[0].style.display = "none";   
                }       
        }
          
}

document.getElementsByClassName("registerPassword2")[0].onkeyup = function(){
        if(document.getElementsByClassName("registerPassword2")[0].value.length >= 6
                &&document.getElementsByClassName("registerPassword2")[0].value === document.getElementsByClassName("registerPassword1")[0].value){
             document.getElementsByClassName("registerPassword2Ok")[0].style.display = "inline-block";
             document.getElementsByClassName("registerPassword2False")[0].style.display = "none";
        }
        else{
             document.getElementsByClassName("registerPassword2False")[0].style.display = "inline-block";
             document.getElementsByClassName("registerPassword2Ok")[0].style.display = "none";   
        }     
}

document.getElementsByClassName("registerPassword2")[0].onblur = function(){
        if(document.getElementsByClassName("registerPassword2")[0].value.length >= 6
                &&document.getElementsByClassName("registerPassword2")[0].value === document.getElementsByClassName("registerPassword1")[0].value){
             document.getElementsByClassName("registerPassword2Ok")[0].style.display = "inline-block";
             document.getElementsByClassName("registerPassword2False")[0].style.display = "none";
        }
        else{
             document.getElementsByClassName("registerPassword2False")[0].style.display = "inline-block";
             document.getElementsByClassName("registerPassword2Ok")[0].style.display = "none";   
        }    
}

var loginJudge = function(){
        var name     = false;
        var password = false;
        var reg      = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(reg.test(document.getElementsByClassName("loginName")[0].value)){
             name = true;  
        };
        if(document.getElementsByClassName("loginPassword")[0].value.length >= 6){
                password = true;
        };

        if(name&&password){
                return true;
        }
        else{
                document.getElementsByClassName("loginAlert")[0].style.opacity = 1;
                return false;
        };

}

var registerJudge = function(){
        var name     = false;
        var mail     = false;
        var password = false;

        if(document.getElementsByClassName("registerName")[0].value.length > 0){
                name = true;
        };

        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(reg.test(document.getElementsByClassName("registerEmail")[0].value)){
                mail = true;   
        };

        if(document.getElementsByClassName("registerPassword1")[0].value.length >= 6
                &&document.getElementsByClassName("registerPassword2")[0].value === document.getElementsByClassName("registerPassword1")[0].value){
                password = true;
        };

        if(name&&mail&&password){
                return true;
        }
        else{
                document.getElementsByClassName("registerAlert")[0].style.opacity = 1;
                return false;
        }

}
