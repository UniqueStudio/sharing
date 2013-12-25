var loginButton         = document.getElementsByClassName("loginButton")[0];
var registerButton      = document.getElementsByClassName("registerButton")[0];
var loginAndRegisterDiv = document.getElementsByClassName("loginAndRegisterDiv")[0];
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
				loginAndRegisterDiv.style.marginLeft = (-100 + moveDistance)+"%";
			}
			else{
				moveDistance = 0.5*a2*(100-countTime)*(100-countTime);
				loginAndRegisterDiv.style.marginLeft = (0-moveDistance)+"%";
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
				loginAndRegisterDiv.style.marginLeft = (0 - moveDistance)+"%";;
			}
			else{
				moveDistance = 0.5*a2*(100-countTime)*(100-countTime);
				loginAndRegisterDiv.style.marginLeft = (-100+moveDistance)+"%";
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
};
