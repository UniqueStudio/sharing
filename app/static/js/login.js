document.getElementsByClassName("checkShow")[0].onclick = function(){
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
    console.log(1);
    var name     = false;
    var password = false;
    var reg      = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if(reg.test(document.getElementsByClassName("username")[0].value)){
         name = true;  
    };
    if(document.getElementsByClassName("password")[0].value.length >= 6){
        password = true;
    };

    if(name&&password){
        console.log(2);
        return true;
    }
    else{
         //document.getElementsByClassName("loginAlert")[0].style.opacity = 1;
        return false;
    };

};