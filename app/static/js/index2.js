var catalogSwitchShowJudge = 1;
var moveTime;
var commentMoveTime;
var commentMoveJudge = 1;

document.getElementsByClassName("catalogNowShow")[0].onmouseenter= function(){
	if(catalogSwitchShowJudge){
		catalogShowDown(1);
	};
};


document.getElementsByClassName("catalogSwitchShowDiv")[0].onmouseleave = function(){
		clearInterval(moveTime);
		catalogShowUp(1);
};

document.getElementsByClassName("bubbleButton")[0].onclick = function(){
	if(commentMoveJudge === 1){
		commentUp(60);
	}
	else if(commentMoveJudge === 2){
		commentDown(30);
	}
};

var catalogShowDown = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	catalogSwitchShowJudge = 0;
	var catalogSwitchShowHeight = (parseFloat(window.getComputedStyle(document.getElementsByClassName("catalogSwitchShow")[0],false).height)-15)/100;
	moveTime = setInterval(function(){	
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
		};
		document.getElementsByClassName("catalogSwitchShowDivBg")[0].style.top = (-355 + catalogSwitchShowHeight*moveDistance)+"px";
		if(countTime < T){
			++countTime;
		}
		else{
			document.getElementsByClassName("catalogSwitchShowDivBg")[0].style.zIndex = 100;
			catalogSwitchShowJudge = 101;
			clearInterval(moveTime);
		}
	},1);
};

var catalogShowUp = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	catalogSwitchShowJudge = 0;
	var catalogSwitchShowDivBgTop = parseFloat(document.getElementsByClassName("catalogSwitchShowDivBg")[0].style.top);
	document.getElementsByClassName("catalogSwitchShowDivBg")[0].style.zIndex = 99;
	var moveLength= (catalogSwitchShowDivBgTop+355)/100;
	moveTime = setInterval(function(){	
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
		};
		document.getElementsByClassName("catalogSwitchShowDivBg")[0].style.top = (catalogSwitchShowDivBgTop - moveLength*moveDistance)+"px";
		if(countTime < T){
			++countTime;
		}
		else{
			catalogSwitchShowJudge = 1;
			clearInterval(moveTime);
		}
	},1);
};

var commentDown = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	const height = 3.26;
	commentMoveJudge = 0;
	commentMoveTime = setInterval(function(){	
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
		};
		document.getElementsByClassName("commentDiv")[0].style.bottom = (0 - height*moveDistance)+"px";
		if(countTime < T){
			++countTime;
		}
		else{
			commentMoveJudge = 1;
			clearInterval(commentMoveTime);
		}
	},1);
};

var commentUp = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;
	const t2 = 0.6*T;
	const v  = 200/T;
	const height = 3.26;
	commentMoveJudge = 0;
	commentMoveTime = setInterval(function(){	
		if(countTime <= t1){
			moveDistance = 0.5*a1*countTime*countTime;
		}
		else{
			moveDistance = 40+v*(countTime-t1)-0.5*a2*(countTime-t1)*(countTime-t1);
		};
		document.getElementsByClassName("commentDiv")[0].style.bottom = (-326 + height*moveDistance)+"px";
		if(countTime < T){
			++countTime;
		}
		else{
			commentMoveJudge = 2;
			clearInterval(commentMoveTime);
		}
	},1);
};