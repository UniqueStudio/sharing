var urlPrefix = "http://localhost:5000/extension"
var loginButton = document.getElementById('loginButton');
var shareButton = document.getElementById('shareButton');
var logoutButton = document.getElementById('logout');
var showArea = document.getElementById('result');

var loginDiv = document.getElementById('login');
var loginError = document.getElementById('loginError');
var shareDiv = document.getElementById('share');

function initUI(){
    loginDiv.style.display = "none";
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
    }, 2000);
}

function login(email, password){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlPrefix + "/login", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("email="+email+"&pwd="+password);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            if(resp.success){
                loginDiv.style.display = "none";
                shareDiv.style.display = "block";
            }else if(resp.errorCode == 1){
                error = "no email found"
                var text = document.createTextNode(error);
                loginError.appendChild(text);
            }else if(resp.errorCode == 2){
                error = "wrong password"
                var text = document.createTextNode(error);
                loginError.appendChild(text);
            }
        }
    }
}

function share(parameters){
    var url = parameters.url;
    var title = parameters.title;
    var explain = parameters.explain;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlPrefix + "/share", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("title="+title+"&url="+url+"&explain="+explain);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
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
            }
        }
    }

}

initUI();

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
    xhr.open("GET", urlPrefix + "/logout", true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            if(resp.success){
                showInfo("logout ");
            }
        }
    }
};

