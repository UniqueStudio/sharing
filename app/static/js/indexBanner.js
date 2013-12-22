var bannerMoveJudge       = 1;
var bannerMoveAutoRestart = 1;
var bannerMoveAutoTime;


document.getElementsByClassName("bannerOrder0")[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0)/-100;		
		if((0 - bannerOrderNow)>0){
			moveLeft(75,0 - bannerOrderNow);
		}
		else if((0 - bannerOrderNow)<0){
				moveRight(75,bannerOrderNow - 0);
			};
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerOrder1")[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0)/-100;		
		if((1 - bannerOrderNow)>0){
			moveLeft(75,1 - bannerOrderNow);
		}
		else if((1 - bannerOrderNow)<0){
				moveRight(75,bannerOrderNow - 1);
			};
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerOrder2")[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0)/-100;		
		if((2 - bannerOrderNow)>0){
			moveLeft(75,2 - bannerOrderNow);
		}
		else if((2 - bannerOrderNow)<0){
				moveRight(75,bannerOrderNow - 2);
			};
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerOrder3")[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0)/-100;		
		if((3 - bannerOrderNow)>0){
			moveLeft(75,3 - bannerOrderNow);
		}
		else if((3 - bannerOrderNow)<0){
				moveRight(75,bannerOrderNow - 3);
			};
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerOrder4")[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0)/-100;		
		if((4 - bannerOrderNow)>0){
			moveLeft(75,4 - bannerOrderNow);
		}
		else if((4 - bannerOrderNow)<0){
				moveRight(75,bannerOrderNow - 4);
			};
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerMoveLeftButton")[0].onclick = function(){
	if(bannerMoveJudge){
		var whereBeforeMove = parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0;
		if( whereBeforeMove<0){
			moveRight(75);
		}
		else{
			moveLeft(75,4);
		}
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerMoveRightButton")[0].onclick = function(){
	clearInterval(bannerMoveAutoTime);
	if(bannerMoveJudge){
		var whereBeforeMove = parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0;
		if( whereBeforeMove>-400){
			moveLeft(75);
		}
		else{
			moveRight(75,4)
		}
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

document.getElementsByClassName("bannerContent")[0].onmouseover = function(){
	document.getElementsByClassName("bannerMoveRightButton")[0].style.opacity = 0.2;
	document.getElementsByClassName("bannerMoveLeftButton")[0].style.opacity  = 0.2;
};

document.getElementsByClassName("bannerContent")[0].onmouseout = function(){
	document.getElementsByClassName("bannerMoveRightButton")[0].style.opacity = 0;
	document.getElementsByClassName("bannerMoveLeftButton")[0].style.opacity  = 0;
};
	
window.onload = function(){
	bannerMoveAuto();
};

var bannerMoveAuto = function(){
	bannerMoveAutoTime = setInterval(function(){
		if(bannerMoveJudge){
			var whereBeforeMove = parseInt(document.getElementsByClassName("bannerContentShow")[0].style.marginLeft)||0;
			if( whereBeforeMove>-400){
				moveLeft(50);
			}
			else{
				moveRight(50,4)
			}
		};
	},3000);
};

var moveLeft = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	var bannerContentShow = document.getElementsByClassName("bannerContentShow")[0];
	var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft)||0;
	var moveDistance = 0;
	bannerMoveJudge = 0;
	var moveLength;
	if(arguments.length == 2){
		moveLength = arguments[1]
	}
	else{
		moveLength = 1;
	};
	var bannerOrderNum = whereBeforeMove/(-100);
	console.log(bannerOrderNum);
	document.getElementsByClassName("bannerOrder")[0].children[bannerOrderNum].style.cssText = "";
	document.getElementsByClassName("bannerOrder")[0].children[bannerOrderNum+moveLength].style.cssText = "background-color:white !important";
	var t = setInterval(function(){
		
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
			bannerContentShow.style.marginLeft = (whereBeforeMove - moveLength*moveDistance)+"%";
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
			bannerContentShow.style.marginLeft = (whereBeforeMove - moveLength*moveDistance)+"%";
		};
		//console.log(countTime+":"+moveDistance);
		if(countTime < T){
			++countTime;
		}
		else{
			clearInterval(t);
			bannerMoveJudge = 1;
		}
	},1);
}

var moveRight = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	var bannerContentShow = document.getElementsByClassName("bannerContentShow")[0];
	var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft)||0;
	var moveDistance = 0;
	bannerMoveJudge = 0;
	var moveLength;
	if(arguments.length == 2){
		moveLength = arguments[1]
	}
	else{
		moveLength = 1;
	};
	var bannerOrderNum = whereBeforeMove/(-100);
	document.getElementsByClassName("bannerOrder")[0].children[bannerOrderNum].style.cssText = "";
	document.getElementsByClassName("bannerOrder")[0].children[bannerOrderNum-moveLength].style.cssText = "background-color:rgb(213,213,213) !important";
	var t = setInterval(function(){
		
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
			bannerContentShow.style.marginLeft = (whereBeforeMove + moveLength*moveDistance)+"%";
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
			bannerContentShow.style.marginLeft = (whereBeforeMove + moveLength*moveDistance)+"%";
		};
		//console.log(countTime+":"+moveDistance);
		if(countTime < T){
			++countTime;
		}
		else{
			clearInterval(t);
			bannerMoveJudge = 1;
		}
	},1);
};