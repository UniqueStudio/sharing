var urlPrefix = "http://localhost:5000"
var loginButton = document.getElementById('loginButton');
var shareButton = document.getElementById('shareButton');
var logoutButton = document.getElementById('logout');
var showArea = document.getElementById('result');

var loginDiv = document.getElementById('login');
var loginError = document.getElementById('loginError');
var shareDiv = document.getElementById('share');

function init(){
    loginDiv.style.display = "none";
    var email = getCookie("email");
    var pwd = getCookie("password");
    if(email && pwd){
        login(email, pwd);
    }else{
        shareDiv.style.display = "none";
        loginDiv.style.display = "block";
    }
}

function showInfo(content){
    loginDiv.style.display = "none";
    shareDiv.style.display = "none";
    var text = document.createTextNode(content);
    var node = document.createElement("p");

    showArea.appendChild(node);
    node.appendChild(text);
// show result then close the window
    setTimeout(function(){
        window.close();
    }, 1500);
}

function setCookie(c_name, value, expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    console.log(exdate.toGMTString());
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getCookie(c_name){
    if (document.cookie.length > 0){
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1){
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return ""
}

function login(email, password){
    var pwdhash = hex_md5(password);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4  && xhr.status==200) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if(resp.success){
                loginDiv.style.display = "none";
                shareDiv.style.display = "block";
                setCookie("email", email, 30);
                setCookie("password", pwdhash, 30);
            }else if(resp.errorCode == 1){
                error = "no email found"
                loginError.innerHTML = error
            }else if(resp.errorCode == 2){
                error = "wrong password"
                loginError.innerHTML = error
            }
        }
    }
    xhr.open("POST",urlPrefix+"/extension/login", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("email="+email+"&password="+pwdhash);
}

function share(parameters){
    var url = parameters.url;
    var title = parameters.title;
    var explain = parameters.explain;
    var xhr = new XMLHttpRequest();
    xhr.open("POST",  urlPrefix+"/add", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("url="+url+"&title="+title+"&explain="+explain);
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4 && xhr.status==200) {
            var resp = JSON.parse(xhr.responseText);
            if(resp.success){
                console.log("shared");
                showInfo("shared success");
            }else if (resp.errorCode == 1){
                shareDiv.style.display = "none";
                loginDiv.style.display = "block";
                error = "you need login"
                var text = document.createTextNode(error);
                loginError.appendChild(text);
            }else if (resp.errorCode == 2){
                error = "this web has been shared";
                showInfo(error);
            }
        }
        console.log("ok");
    }

};

init();

//event listen
loginButton.onclick = function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    login(email, password);
};

shareButton.onclick = function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
        var tab = tabs[0];
        var parameters = {};
        parameters.url = tab.url;
        parameters.title = tab.title;
        parameters.explain = document.getElementById('explain').value;
        share(parameters);
    });
};

logoutButton.onclick = function() {
    console.log('a');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/logout", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            if(resp.success){
                showInfo("logout ");
                setCookie("email", email, 0);
                setCookie("pwd", pwdhash, 0);
            }
        }
    }
};

