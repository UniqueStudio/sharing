window.onresize = function(){
	var contentDivMarginWidth = parseFloat(window.getComputedStyle(document.getElementsByClassName("contentDiv")[0],false).marginLeft);
	document.getElementsByClassName("groupDiv")[0].style.left = (contentDivMarginWidth -110)+"px";
};

window.onmousewheel = function(){
	var groupDiv = document.getElementsByClassName("groupDiv")[0];
	if(groupDiv.getBoundingClientRect().top<55){
		groupDiv.style.position = "fixed";
	}
	else if(document.getElementsByTagName("html")[0].getBoundingClientRect().top == 0 ){
		groupDiv.style.position = "absolute";
	}
}