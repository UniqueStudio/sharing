var bannerMoveLeftButton  = document.getElementsByClassName("bannerMoveLeftButton")[0];
var bannerMoveRightButton = document.getElementsByClassName("bannerMoveRightButton")[0];
var bannerContentShow     = document.getElementsByClassName("bannerContentShow")[0];
var bannerContent         = document.getElementsByClassName("bannerContent")[0];
var bannerOrder = document.getElementsByClassName("bannerOrder")[0];
var bannerMoveJudge       = 1;
var bannerMoveAutoRestart = 1;
var bannerMoveAutoTime;


bannerOrder.children[0].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(bannerContentShow.style.marginLeft)||0)/-100;
		console.log("test0:"+(0 - bannerOrderNow));
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

bannerOrder.children[1].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(bannerContentShow.style.marginLeft)||0)/-100;
		console.log("test1:"+(1 - bannerOrderNow));
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

bannerOrder.children[2].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(bannerContentShow.style.marginLeft)||0)/-100;
		console.log("test2:"+(2 - bannerOrderNow));
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

bannerOrder.children[3].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(bannerContentShow.style.marginLeft)||0)/-100;
		console.log("test3:"+(3 - bannerOrderNow));
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

bannerOrder.children[4].onclick = function(){
	if(bannerMoveJudge){
		var bannerOrderNow = (parseInt(bannerContentShow.style.marginLeft)||0)/-100;
		console.log("test4:"+(4 - bannerOrderNow));
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

bannerMoveLeftButton.onclick = function(){
	if(bannerMoveJudge){
		var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft)||0;
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

bannerMoveRightButton.onclick = function(){
	clearInterval(bannerMoveAutoTime);
	if(bannerMoveJudge){
		var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft)||0;
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

bannerContent.onmouseover = function(){
	bannerMoveRightButton.style.opacity = 0.2;
	bannerMoveLeftButton.style.opacity  = 0.2;
};

bannerContent.onmouseout = function(){
	bannerMoveRightButton.style.opacity = 0;
	bannerMoveLeftButton.style.opacity  = 0;
};
	
window.onload = function(){
	bannerMoveAuto();
};

var bannerMoveAuto = function(){
	bannerMoveAutoTime = setInterval(function(){
		if(bannerMoveJudge){
			var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft)||0;
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
		bannerOrder.children[bannerOrderNum].style.cssText = "";
		bannerOrder.children[bannerOrderNum+moveLength].style.cssText = "background-color:white !important";
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
	var bannerOrderNum;
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
		bannerOrder.children[bannerOrderNum].style.cssText = "";
		bannerOrder.children[bannerOrderNum-moveLength].style.cssText = "background-color:rgb(213,213,213) !important";
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