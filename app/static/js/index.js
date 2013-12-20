var bannerMoveLeftButton  = document.getElementsByClassName("bannerMoveLeftButton")[0];
var bannerMoveRightButton = document.getElementsByClassName("bannerMoveRightButton")[0];
var bannerContentShow     = document.getElementsByClassName("bannerContentShow")[0];
var bannerContent         = document.getElementsByClassName("bannerContent")[0];
var bannerMoveJudge       = 1;
var bannerMoveAutoRestart = 1;
var bannerMoveAutoTime;

bannerMoveLeftButton.onclick = function(){
	if(bannerMoveJudge){
		moveRight(75);
		clearInterval(bannerMoveAutoTime);
		bannerMoveAuto();
	};
};

bannerMoveRightButton.onclick = function(){
	clearInterval(bannerMoveAutoTime);;
	if(bannerMoveJudge){
		moveLeft(75);
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
			moveLeft(50);
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
	if( whereBeforeMove>-400){
		var t = setInterval(function(){
			
			if(countTime <= t1){
				moveDistance = 0.5*a1*countTime*countTime;
				bannerContentShow.style.marginLeft = (whereBeforeMove - moveDistance)+"%";
			}
			else{
				moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
				bannerContentShow.style.marginLeft = (whereBeforeMove - moveDistance)+"%";
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
	else{
		var t = setInterval(function(){
			
			if(countTime <= t1){
				moveDistance = 0.5*a1*countTime*countTime;
				bannerContentShow.style.marginLeft = (whereBeforeMove + 4*moveDistance)+"%";
			}
			else{
				moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
				bannerContentShow.style.marginLeft = (whereBeforeMove + 4*moveDistance)+"%";
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
}

var moveRight = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	var whereBeforeMove = parseInt(bannerContentShow.style.marginLeft);
	var moveDistance = 0;
	bannerMoveJudge = 0;
	if( whereBeforeMove<0){
		var t = setInterval(function(){
			
			if(countTime <= t1){
				moveDistance = 0.5*a1*countTime*countTime;
				bannerContentShow.style.marginLeft = (whereBeforeMove + moveDistance)+"%";
			}
			else{
				moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
				bannerContentShow.style.marginLeft = (whereBeforeMove + moveDistance)+"%";
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
	else{
		var t = setInterval(function(){
			
			if(countTime <= t1){
				moveDistance = 0.5*a1*countTime*countTime;
				bannerContentShow.style.marginLeft = (whereBeforeMove - 4*moveDistance)+"%";
			}
			else{
				moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
				bannerContentShow.style.marginLeft = (whereBeforeMove - 4*moveDistance)+"%";
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
};