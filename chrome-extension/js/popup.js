var urlPrefix = "http://localhost:5000"
// var urlPrefix = "http://share.hustunique.com"
//var urlPrefix = 'http://www.uniqueguoqi.com'
var loginButton = document.getElementById('loginButton');
var shareButton = document.getElementById('shareButton');
var logoutButton = document.getElementById('logout');
var showArea = document.getElementById('result');

var loginDiv = document.getElementById('login');
var loginError = document.getElementById('loginError');
var shareDiv = document.getElementById('share');

function init(){
    console.log('init');
    chrome.cookies.get({url: urlPrefix, name: 'ext_email'}, function(c_email){
        chrome.cookies.get({url: urlPrefix, name: 'ext_password'}, function(c_pwd){
            if(c_email && c_pwd){
                console.log(c_email.value, c_pwd.value);
                login(c_email.value, c_pwd.value);
            }else{
                shareDiv.style.display = "none";
                loginDiv.style.display = "block";
            }

        });
    });
    chrome.cookies.getAll({}, function(cookies){
        console.log(cookies);
    });
    /*
    loginDiv.style.display = "none";
    var email = getCookie("email");
    var pwd = getCookie("password");
    if(email && pwd){
        console.log(email, pwd);
        login(email, pwd);
    }else{
        console.log('heol');
        shareDiv.style.display = "none";
        loginDiv.style.display = "block";
    }
    */
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
    console.log('set cookie', c_name, value, expiredays);
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) +
        ";path=/;domain=www.uniqueguoqi.com";
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

function s_cookie(name, value){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 5);
    obj = {
        url: urlPrefix,
        //url: 'http://www.uniqueguoqi.com',
        name: name,
        value: value,
        expirationDate: exdate.getTime(),
    }
    chrome.cookies.set(obj, function(cookie){
        console.log(cookie);
    });
}

function login(email, pwdhash){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4  && xhr.status==200) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if(resp.success){
                loginDiv.style.display = "none";
                shareDiv.style.display = "block";
                s_cookie('ext_email', email);
                s_cookie('ext_password', pwdhash);
                /*
                c_email = {
                    url: 'http://www.uniqueguoqi.com/*',
                    name: 'email',
                    value: email
                }
                c_pwd = {
                    url: 'http://www.uniqueguoqi.com/*',
                    name: 'password',
                    value: pwdhash, 
                }
                chrome.cookies.set(c_pwd, function(pwd){
                    chrome.cookies.set(c_email, function(email){
                        if(pwd && email) console.log('ok');
                    });
                });
                chrome.cookies = chrome.cookies || chrome.experimental.cookies;
                chrome.cookies.set(c_email, function(Cookie cookie){
                    console.log cookie
                });
                */
                /*
                setCookie("email", email, 30);
                setCookie("password", pwdhash, 30);
                */
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
    xhr.open("POST",  urlPrefix+"/extension/add", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("url="+url+"&title="+title+"&explain="+explain);
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4 && xhr.status==200) {
            var resp = JSON.parse(xhr.responseText);
            if(resp.status){
                console.log("shared");
                showInfo("shared success");
            // }else if (resp.errorCode == 1){
                // shareDiv.style.display = "none";
                // loginDiv.style.display = "block";
                // error = "you need login"
                // var text = document.createTextNode(error);
                // loginError.appendChild(text);
            // }else if (resp.errorCode == 2){
            }
            else{
                error = resp.msg
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
    var pwdhash = hex_md5(password);
    login(email, pwdhash);
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
    /*
    setCookie("email", '', 0);
    setCookie("password", '', 0);
    */
    // remove cookies
    chrome.cookies.remove({url: urlPrefix, name: 'ext_email'}, function(c_email){
        chrome.cookies.remove({url: urlPrefix, name: 'ext_password'}, function(c_pwd){
            if(c_email && c_pwd){
                showInfo("logout ");
                console.log(c_email, c_pwd);
            }

        });
    });
    chrome.cookies.getAll({}, function(cookies){
        console.log(cookies);
    });
    // clear sessions
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlPrefix + "/extension/logout", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4 && xhr.status==200) {
            var resp = JSON.parse(xhr.responseText);
            if(resp.status){
                console.log('logout');
            }
        }
    }
    //showInfo('logout successful');
};

