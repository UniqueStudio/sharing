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
//当网页大小发生变化时，对iframe大小作出调整
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
/**
 * 当选中评论输入框，并且有输入动作时，对点对点评论，输入字数多少做出相应的动作
 * 由于chrome与firefox对按键响应时间不同，因而同时对onkeyup，onkeydown设置相似的动作
 */
document.getElementsByClassName("sendCommentText")[0].onkeyup = function(){
	var sendCommentText =  document.getElementsByClassName("sendCommentText")[0].value;
	var sendCommentTextButton = document.getElementsByClassName("sendCommentTextButton")[0].style;
	//检测是否是点对点的评论，以nameLength是否为0作为以后动作的衡量标准
	var nameLength = sendCommentText.indexOf(":");
	if(nameLength == -1){
		nameLength = sendCommentText.indexOf("：");
	};
	//判断是否有被评论人的昵称
	if(nameLength>=3&&sendCommentText.indexOf("@")<nameLength){
		++nameLength;
	}
	else{
		nameLength = 0;
	};
	//显示当前可输入字数
	var inputNum = sendCommentText.length - nameLength;
	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120 -inputNum;
	//根据评论字数是否为零对提交按钮设置不同的样式
	if(inputNum){
		sendCommentTextButton.color = "#5F5F5F";
		sendCommentTextButton.cursor = "pointer";
	}
	else{
		sendCommentTextButton.color = "#c9c9c9";
		sendCommentTextButton.cursor = "default";
	};
};

document.getElementsByClassName("sendCommentText")[0].onkeydown = function(){
	var sendCommentText =  document.getElementsByClassName("sendCommentText")[0].value;
	//检测是否是点对点的评论，以nameLength是否为0作为以后动作的衡量标准
	var nameLength = sendCommentText.indexOf(":");
	if(nameLength == -1){
		nameLength = sendCommentText.indexOf("：");
	};
	//判断是否有被评论人的昵称
	if(nameLength>=3&&sendCommentText.indexOf("@")<nameLength){
		++nameLength;
	}
	else{
		nameLength = 0
	};
	//显示当前可输入字数
	var inputNum = sendCommentText.length - nameLength;
	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120 -inputNum;
};

//点赞功能
document.getElementsByClassName("likeClick")[0].onclick = function(){
	sendLike();
};

document.getElementsByClassName("likeClick")[1].onclick = function(){
	sendLike();
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

	sendCommentText.maxLength = 4+CommentNameLength+120;
};

var commentSubmit = function(){
	
	var xmlhttp;
	var commentTextLength;
	var shareManName = document.getElementsByClassName("shareManName")[0].innerHTML;
	var sendCommentText = document.getElementsByClassName("sendCommentText")[0].value;
	//在评论前端添加评论人昵称,并合成comment_body
	var SCTnameLength = sendCommentText.indexOf(":");
	if(SCTnameLength === -1){
		SCTnameLength = sendCommentText.indexOf("：");
	};
	if(SCTnameLength>=3
		&&sendCommentText.indexOf("@")<SCTnameLength
		&&sendCommentText.indexOf("@")<sendCommentText.indexOf("说")
		&&sendCommentText.indexOf("对") === 0
		&&sendCommentText.indexOf("说")<SCTnameLength){//点对点评论
		var comment_body = shareManName+sendCommentText;
		commentTextLength = sendCommentText.length - SCTnameLength - 1;
	}
	else{//自评论
		var comment_body = shareManName+":"+sendCommentText;
		commentTextLength = sendCommentText.length;
	};

	if(commentTextLength){
		var share_id = document.getElementsByClassName("shareId")[0].innerHTML;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xmlhttp.onreadystatechange=function(){
		    if (xmlhttp.readyState==4 && xmlhttp.status==200){//成功发送请求
		    	document.getElementsByClassName("sendCommentText")[0].value = "";//框内容清楚
		    	document.getElementsByClassName("commentInputNum")[0].innerHTML = 120;//可输入数字改回120
				var commentJSON  = JSON.parse(xmlhttp.responseText);
				sendSucceedShow();
				addComment(commentJSON );//新评论加载到评论流前端
		    };
		};
		//将评论内容发送到服务器中
		xmlhttp.open("POST","/add_comment",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("comment_body="+comment_body+"&share_id=" + share_id);
	};
};

var sendLike = function(){
	var xmlhttp;
	var share_id = document.getElementsByClassName("shareId")[0].innerHTML;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		 xmlhttp=new XMLHttpRequest();
	 }
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	};
	//将点赞动作发送到服务器中
	xmlhttp.open("POST","/toggleLikes",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("&shareID=" + share_id);
	xmlhttp.onreadystatechange=function(){
	   if (xmlhttp.readyState==4 && xmlhttp.status==200){//发送成功显示当前是否为“喜欢“
			var likeJSON  = JSON.parse(xmlhttp.responseText);
			if(likeJSON.userLike){
				document.getElementsByClassName("likeClick")[0].children[0].style.display = "none"
				document.getElementsByClassName("likeClick")[1].children[0].style.display = "none"
			}
			else{
				document.getElementsByClassName("likeClick")[0].children[0].style.display = "inline-block"
				document.getElementsByClassName("likeClick")[1].children[0].style.display = "inline-block"
			};
	    };
	};
};
//新评论加载到评论流前端
var addComment = function(commentJSON){
	var userImg     = commentJSON["user_avatar_src"];
	var commentBody = commentJSON["c_body"];
	var node        = document.createElement("div");
	var commentShow = document.getElementsByClassName("commentShow")[0];
	var firstChild  = commentShow.children[0];
	//在评论流前端插入div标签并添加commentEach类
	commentShow.insertBefore(node,firstChild );
	commentShow.children[0].className = "commentEach";
	firstChild  = commentShow.children[0];
	firstChild.style.opacity = 0;
	//向新div标签插入内容
	firstChild.innerHTML = "<img src='"+userImg+ "' alt=''>"
	+"<textarea rows=4 readonly='readonly'>"
	+commentBody
	+"</textarea>"
    +"<div onclick="+"'sendComment(this)'"+">"
    +"<img src='../static/img/bubble.png'alt=''>"
    +"</div>";
    //淡入插入
    var countTime = 0;
    var time = setInterval(function(){	
		firstChild.style.opacity = 0.004*countTime;
		if(countTime < 250){
			++countTime;
		}
		else{
			clearInterval(time);
		}
	},1);
};
//发送成功状态淡出显示
var sendSucceedShow = function(){
	var statusShowdiv = document.getElementsByClassName("statusShowdiv")[0];
	statusShowdiv.style.display = "inline-block";
	setTimeout(function(){
		var countTime = 0;
	    var time = setInterval(function(){	
			statusShowdiv.style.opacity = 1 - 0.004*countTime;
			if(countTime < 250){
				++countTime;
			}
			else{
				statusShowdiv.style.display = "none";
				statusShowdiv.style.opacity = 1;
				clearInterval(time);
			}
		},1);
	},300);
};
