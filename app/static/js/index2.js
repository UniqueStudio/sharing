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

window.onresize = function(){
	var contentMainHeight = parseFloat(window.getComputedStyle(document.getElementsByClassName("contentMain")[0],false).height);
	document.getElementsByClassName("contentShow")[0].style.height = (15+contentMainHeight) + "px"; 
};

window.onload = function(){
	var sendCommentText =  document.getElementsByClassName("sendCommentText")[0].value;
	var nameLength = sendCommentText.indexOf(":");
	if(nameLength<4){
		nameLength = sendCommentText.indexOf("：");
	};
	if(nameLength<4){
		if(sendCommentText.indexOf("@")<nameLength){
			++nameLength;
		}
		else{
			nameLength = 0;
		}
	}
	var inputNum = sendCommentText.length - nameLength;
	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120 -inputNum;
};

document.getElementsByClassName("bubbleButton")[0].onclick = function(){
	if(commentMoveJudge === 1){
		commentUp(60);
	}
	else if(commentMoveJudge === 2){
		commentDown(30);
	}
};

document.getElementsByClassName("sendCommentText")[0].onkeyup = function(){
	var sendCommentText =  document.getElementsByClassName("sendCommentText")[0].value;
	var nameLength = sendCommentText.indexOf(":");
	if(nameLength == -1){
		nameLength = sendCommentText.indexOf("：");
	};
	if(nameLength>=3&&sendCommentText.indexOf("@")<nameLength){
		++nameLength;
	}
	else{
		nameLength = 0;
	};
	var inputNum = sendCommentText.length - nameLength;
	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120 -inputNum;
};

document.getElementsByClassName("sendCommentText")[0].onkeydown = function(){
	var sendCommentText =  document.getElementsByClassName("sendCommentText")[0].value;
	var nameLength = sendCommentText.indexOf(":");
	if(nameLength == -1){
		nameLength = sendCommentText.indexOf("：");
	};
	//判断是否为系统自动插入的语句
	if(nameLength>=3&&sendCommentText.indexOf("@")<nameLength){
		++nameLength;
	}
	else{
		nameLength = 0
	};
	var inputNum = sendCommentText.length - nameLength;
	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120 -inputNum;
};

var catalogShowDown = function(T){
	var countTime = 1;
	const a1 = 500/(T*T);
	const a2 = 1000/(3*T*T);
	const t1 = 0.4*T;//加速时间
	const t2 = 0.6*T;//减速时间
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
	const t1 = 0.4*T;//加速时间
	const t2 = 0.6*T;//减速时间
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

function sendComment(element){
	var sendCommentText = document.getElementsByClassName("sendCommentText")[0];
	textNode = element.parentNode.children[1];
	//获取名字长度
	var CommentNameLength = textNode.value.indexOf(":");
	if(CommentNameLength == -1){
		CommentNameLength = textNode.value.indexOf("：");
	};
	if(textNode.value.indexOf("@")!== -1 
		&&CommentNameLength >=3
		&&textNode.value.indexOf("@")<CommentNameLength){
		CommentNameLength = textNode.value.indexOf("对");
	};
	//获取名字
	name = textNode.value.substring(0,CommentNameLength);
	//判断评论框是否早已有名字，有则替换

	var SCTnameLength = sendCommentText.value.indexOf(":");
	if(SCTnameLength == -1){
		SCTnameLength = sendCommentText.value.indexOf("：");
	};
	if(SCTnameLength>=3
		&&sendCommentText.value.indexOf("@")<SCTnameLength
		&&sendCommentText.value.indexOf("@")<sendCommentText.value.indexOf("说")
		&&sendCommentText.value.indexOf("对") === 0
		&&sendCommentText.value.indexOf("说")<SCTnameLength){
		var text = sendCommentText.value.substring(SCTnameLength+1);
		sendCommentText.focus();
		sendCommentText.value = "对@"+name + "说:" + text;
	}
	else{
		sendCommentText.focus();
		sendCommentText.value = "对@"+name + "说:" + sendCommentText.value;
	};
	
};

var commentSubmit = function(){
	
	var xmlhttp;
	var shareManName = document.getElementsByClassName("shareManName")[0].innerHTML;
	var sendCommentText = document.getElementsByClassName("sendCommentText")[0].value;
	var SCTnameLength = sendCommentText.indexOf(":");
	if(SCTnameLength === -1){
		SCTnameLength = sendCommentText.indexOf("：");
	};
	if(SCTnameLength>=3
		&&sendCommentText.indexOf("@")<SCTnameLength
		&&sendCommentText.indexOf("@")<sendCommentText.indexOf("说")
		&&sendCommentText.indexOf("对") === 0
		&&sendCommentText.indexOf("说")<SCTnameLength){
		var comment_body = shareManName+sendCommentText;
	}
	else{
		var comment_body = shareManName+":"+sendCommentText;
	};
	
	var share_id = document.getElementsByClassName("sendCommentTextDiv")[0].children[1].innerHTML;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	 xmlhttp.onreadystatechange=function()
	   {
	   if (xmlhttp.readyState==4 && xmlhttp.status==200)
	     {
	     	console.log(xmlhttp.responseText);
	     }
	   }
	xmlhttp.open("POST","/add_comment",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("comment_body="+comment_body+"&share_id=" + share_id);
};