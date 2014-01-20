$(function(){
    var isIE = false;
    if(navigator.userAgent.indexOf("MSIE")>0) {
        isIE=true;
    }
    if(isIE){
        document.getElementById("loadingBar").innerHTML = "(◍╹ｘ╹◍):团队不支持IE赶快用Chrome或者Firefox吧！";
        return ;
    }
    var pageId = -1,viewing = "all",init_all_back = true;
    var position = {"all":"12px","news":"112px","comments":"212px"};
    var nav = ["all","news","comments","search"];
    var lenHolder = {"nav_height":44,"user_height":34,"inner_width":324};
    function init(){
        adjustSize();
        // init the content
        $("#share").show();
        $("#login_div").hide();
        $.post("api/getAll",function(result){
            $("#all_div").html(result);
            if(pageId != -1){
                $($("#all_div").find("#page_"+pageId)).addClass("current");
                all.current = "all_a_"+pageId;
            }
            else{
                init_all_back = false;
            }
        });
        $.post("api/getNews",function(result){
            $("#news_div").html(result);
        });
        if(window.location.hash && window.location.hash!="#"){
            hashHandler(true);
            //setTimeout('$($("#all_div").find(".row")[0]).removeClass("current");',2000);
        }
        else{
            $.post("api/getFirstItem",function(response){
                showOnOuter(response);
            });
        }
        // check news
        checkNews();
    }
    function adjustSize(){
        var outHeight = $(document).height()-lenHolder.nav_height;
        var inHeight = outHeight-lenHolder.user_height;
        var userTop = $(document).height()-lenHolder.user_height;
        $("#inner").height(inHeight);
        $("#user").css("top",userTop+"px");
        $("#outer").height(outHeight);
        var outWidth = $(document).width()-lenHolder.inner_width+"px";
        $("#right_div").width(outWidth);
    }
    function entrance(holder,is_all_div,self){
        if(holder.current){
            $("#"+holder.current).parent().attr("class","row");
        }
        else if(is_all_div){
            $($("#all_div .row")[0]).attr("class","row");
        }
        holder.current = self.id;
        $(self).parent().attr("class","row current");
        changePageId(self.id.split("_")[2]);
        //pageId = self.id.split("_")[2];
        var href = $(self).attr("uid");
        $("#outer").attr("src",href);
        $("#loading_frame").show();
        $("#view_url").attr("href",href);
        var arr = $(self).attr("tid").split("_");
        $("#clickTimes").html("点击"+arr[0]);
        $("#commentNums").html("回复"+arr[1]);
        $("#up").html("顶 "+arr[2]);
        $("#like").attr("src","images/like.png");
    }

    function controlView(k){
        for(i=0;i<4;i++){
            viewing = k;
            if(nav[i] == k){
                $("#"+nav[i]+"_div").show();
            }
            else{
                $("#"+nav[i]+"_div").hide();
            }
        }
        if(k == "all" || k == "search"){
            $("#user_search").show();
        }
        else{
            $("#user_search").hide();
        }
    }
    function showOnOuter(response){
        var rsp = JSON.parse(response);
        if(rsp.result == true){
            changePageId(rsp.data.id);
            //pageId = rsp.data.id;
            $("#clickTimes").html("点击 "+rsp.data.clickTimes);
            $("#commentNums").html("回复 "+rsp.data.commentNums);
            $("#up").html("顶 "+rsp.data.up);
            $("#like").attr("src","images/like.png");
            $("#view_url").attr("href",rsp.data.href);
            $("#outer").attr("src",rsp.data.href);
            $("#loading_frame").show();
            if(!init_all_back){
                $($("#all_div").find("#page_"+pageId)).addClass("current");
                init_all_back = true;
            }
        }
    }
    function checkNews(){
        $.post("api/getNewsMount",function(result){
            rsp = JSON.parse(result);
            if(rsp.result == true){
                if(rsp.data.newsMount>0){
                    news.hasNews = true;
                    if($("#news_div").css("display") == "block")
        {
            $("#news_show").show();
        }
        remind();
                }
            }
        });
        setTimeout(checkNews,1000*60);
    }
    function remind(){
        $("#news a").addClass("hasNews");
    }
    function recover(){
        $("#news a").removeClass("hasNews");
    }
    function showNews(self){
        var arr = self.id.split("_");
        changePageId(arr[1]);
        //pageId = arr[1];
        var comment_id = arr[2];
        $("#slider").animate({"left":position["comments"]},function(){
            var parameters = "pageId="+pageId;
            $.post("api/getComments",parameters,function(result){
                $("#comments_div").html(result);
                controlView(nav[2]);
                window.location.hash = "cm_"+comment_id;
            });
            /*
               var href = $(self).closest(".row").attr("uid");
               $("#outer").attr("src",href);
               $("#view_url").attr("href",href);
               */
        });
    }
    function hashHandler(isFirst){
        var hash = window.location.hash;
        if(hash && hash != "#"){
            var hashArr = hash.split("=");
            var hashKey = hashArr[0];
            if(hashKey == "#share"){
                var hashVal = hashArr[1];
                if(isFirst){
                    pageId = hashVal;
                    $($("#all_div").find(".row")[0]).removeClass("current");

                }
                $.post("api/getSpecificItem",{pageId:pageId},function(result){
                    showOnOuter(result);
                    /* if(isFirst){
                       $("#"+nav[2]).click();
                       }*/
                });
            }
        }
    }
    function changePageId(page_id){
        pageId = page_id;
        window.location.hash = "share="+pageId;
    }
    window.onhashchange = function(){
        hashHandler();
    };
    window.onbeforeunload = function(){
        return "确定离开当前页面吗？"
    }
    $.post("api/isLogged",function(result){
        var rsp = JSON.parse(result);
        if(rsp.result == true){
            $("#user_name").html(rsp.data.username);
            init();
        }
        else{
            $("#login_div").show();
            $("#login_un").focus();
        }
    });
    $("#login_sub").click(function(){
        var username = $("#login_un").val();
        var password = $("#login_pw").val();
        /*
           $.get("api/login?username="+username+"&password="+password,function(result){
           var rsp = JSON.parse(result);
           if(rsp.result == true){
           var name = rsp.data.username
           $("#user_name").html(name);
           init();
           }
           else{
           $("#login_error").show();
           $("#login_pw").val("").focus();
           }
           })
           */
        var parameters = {username:username,password:hex_md5(password)};
        $.post("api/login",parameters,function(result){
            var rsp = JSON.parse(result);
            if(rsp.result == true){
                var name = rsp.data.username;
                $("#user_name").html(name);
                init();
            }
            else{
                $("#login_error").show();
                $("#login_pw").val("").focus();
            }
        });
    });

    $("#logout").click(function(){
        $.post("api/logout",function(){
            location.reload();
        });
    });
    $(window).resize(function(){
        adjustSize();
    });
    // slider
    $(".nav_li").click(function(){
        var self = this;
        $("#slider").animate({"left":position[this.id]},function(){
            if(self.id == nav[0]){
                if(viewing == nav[0]){
                    $.post("api/getAll",function(result){
                        $("#all_div").html(result).scrollTop(0);
                    });
                }
                controlView(nav[0]);
            }
            else if(self.id == nav[1]){
                if(viewing == nav[1]){
                    $.post("api/getNews",function(result){
                        $("#news_div").html(result).scrollTop(0);
                    });
                }
                else if(news.hasNews){
                    $.post("api/getNews",function(result){
                        $("#news_div").html(result);
                        controlView(nav[1]);
                        recover();
                        //$("#news").find(".nav_url").removeClass("hasNews1").removeClass("hasNews2");
                        news.hasNews = false;
                        var sid = $("#news_div .row")[0].id;
                        var newsId = sid.split("_")[1];
                        $.post("api/read",{newsId:newsId});
                    });
                }
                else{
                    controlView(nav[1]);
                }
            }
            else if(self.id == nav[2]){
                $.post("api/getComments",{pageId:pageId},function(result){
                    $("#comments_div").html(result);
                    controlView(nav[2]);
                });
            }
        });
    });
    $("#outer")[0].onload=function(){
        if(pageId != -1){
            $.post("api/addClickTimes",{pageId:pageId});
            $("#loading_frame").hide();
        }
    }
    $("#random").click(function(){
        $.post("api/getRandomItem",function(result){
            showOnOuter(result);
        });
    });
    $("#up_span").click(function(){
        if($("#like").attr("src").indexOf("like.png") != -1){
            $.post("api/up",{pageId:pageId},function(result){
                var rsp = JSON.parse(result);
                if(rsp.result == true){
                    $("#up").html("顶 "+rsp.data.up);
                    var $a = $("#all_a_"+pageId);
                    if($a){
                        var arr = $a.attr("tid").split("_");
                        arr[2] = rsp.data.up;
                        var newTid = arr.join("_");
                        $a.attr("tid",newTid);
                        $a.find(".all_up").html(rsp.data.up);
                    }
                }
                $("#like").attr("src","images/liked.png");
            });
        }
    });

    $("#search").click(function(){
        var search_val = $("#user_val").val();
        var val = trim(search_val);
        if(val){
            $.post("api/search",{keyword:val},function(result){
                $("#search_div").html(result);
                controlView(nav[3]);
            });
        }
    });
    function trim(s){
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }
    // all
    var all = new Object();
    all.current = "";
    all.number = 20;
    all.oldnumber = 0;
    $("#all_div .page_url").live("click",function(){
        entrance(all,true,this);
    });
    $("#all_div").scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = this.scrollHeight;
        var height = $(this).height();
        if(scrollTop+height+20>scrollHeight){
            $("#loading").show();
            if(all.number != all.oldnumber){
                all.oldnumber = all.number;
                $.post("api/getItems",{number:all.number},function(result){
                    var rsp = JSON.parse(result);
                    if(rsp.result == true){
                        var data = rsp.data;
                        $("#all_div .itemList").append(data.html);
                        if(data.continueBool){
                            all.number = data.last;
                            $("#loading").hide();
                        }
                        else{
                            addBool = false;
                            $("#loading").html("已到最底端");
                        }
                    }
                    else{
                        $("#loading").html("出现错误,请刷新后重试");
                    }
                });
            }
        }
    });
    // news
    var news = new Object();
    news.nav = ["news_first","news_previous","news_next"];
    news.position = 1;
    news.hasNews = false;
    news.read = false;
    $(".news_nav_control").live("click",function(){
        var order,url="api/getNews",suffix="";
        if(this.id == news.nav[1]){
            order = news.position-1;
        }
        else if(this.id == news.nav[2]){
            order = news.position+1;
        }
    if(order && order > 0){
        suffix="order="+order;
    }
    $.post(url,suffix,function(result){
        $("#news_div").html(result);
        $("#news_div").scrollTop(0);
        news.position = order?order:1;
    });
    });
    $(".news_comment").live("click",function(){
        var self = this;
        showNews(self);
    });
    $(".news_reply").live("click",function(){
        var self = this;
        showNews(self);
    });
    $("#news_show").live("click",function(){
        $.post("api/getNews",function(result){
            $("#news_div").html(result);
            $("#news_div").scrollTop(0);
            var sid = $("#news_div .row")[0].id;
            var newsId = sid.split("_")[1];
            news.hasNews = false;
            recover();
            //$("#news").find(".nav_url").removeClass("hasNews1").removeClass("hasNews2");
            $.post("api/read","newsId="+newsId);
        });
    });
    // comment
    var cm = new Object();
    cm.sub_able = true;
    cm.subs_able = true;
    $(".cm_reply").live("click",function(){
        var $li = $(this).closest(".row");
        if($li.find("#cm_editors").size() && $("#cm_editors").css("display") == "block"){
            $("#cm_editors").slideUp();
            $("#cm_writes").val("");
            return;
        }
        $li.append($("#cm_editors").detach());
        $("#cm_editors").hide().slideDown();
        var name = $li.find(".cm_name").html();
        $("#cm_writes").val("回复 "+name).focus();
    });
    $("#cm_sub").live("click",function(){
        if(!cm.sub_able)return;
        cm.sub_able = false;
        var content = $("#cm_write").val();
        if(!content) return;
        $.post("api/reply",{content:content,pageId:pageId},function(result){
            var rsp = JSON.parse(result);
            if(rsp.result == true){
                $("#cm_main .itemList").append(rsp.data.html);
                $("#cm_write").val("");
            }
            else{
                $("#cm_show_span").html("发表失败,请刷新后重试");
                $("#cm_show").slideDown();
                setTimeout('$("#cm_show").slideUp()',1500);
            }
        cm.sub_able = true;
        });

    });
    $("#cm_subs").live("click",function(){
        if(!cm.subs_able) return;
        cm.subs_able = false;
        var content = $("#cm_writes").val();
        var t = $(this).closest(".row").attr("id");
        var replyId = t.split("_")[1];
        $.post("api/reply",{content:content,pageId:pageId,replyId:replyId},function(result){
            var rsp = JSON.parse(result);
            if(rsp.result == true){
                $("#cm_main .itemList").append(rsp.data.html);
                $("#cm_show_span").html("发表成功");
                $("#cm_show").slideDown();
                setTimeout('$("#cm_show").slideUp()',1500);
            }
            else{
                $("#cm_show_span").html("发表失败,请刷新后重试");
                $("#cm_show").slideDown();
                setTimeout('$("#cm_show").slideUp()',1500);
            }
        $("#cm_editors").hide();
        $("#cm_writes").val("");
        cm.subs_able = true;
        });
    });
    // search
    var search = new Object();
    search.current = "";
    $("#search_div .page_url").live("click",function(){
        entrance(search,false,this);
    });
});
