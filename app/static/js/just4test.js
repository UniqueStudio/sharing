function list_share(start, sortby) {
    var data = {
        start: start || 1,
        sortby: sortby || null
    };

    $.post('/share/list', data)
        .done(function(json) {
            console.log(json);
            var j = $.parseJSON(json);
            if (j.status === true) {
                var html = j.result;
                $('.ctLMain').html(html);
            } else {
                console.log(j.msg);
            }
        })
        .fail(function() {
            console.log("加载错误");
        });
}


function add_comment(share_id, content) {
    var data = {
        share_id: share_id,
        content: content
    };

    $.post('/comment/add', data)
        .done(function(json) {
            var j = $.parseJSON(json);
            if (j.status === true) {
                console.log('发送成功');
            } else {
                console.log(j.msg);
            }
        })
        .fail(function() {
            console.log('加载错误');
        });
}

function list_comment(start, share_id){
    var data = {
        start: start, 
        share_id: share_id
    };

    $.get('/comment/list', data)
        .done(function(json){
            var j = $.parseJSON(json);
            if (j.status === true){
                html = j.result;
                $('.ctLMain').html(html);
            }
            else{
                console.log(j.msg);
            }
        })
        .fail(function(){
            console.log('加载错误');
        })
}

$(function(){
    list_share(2, 'likes');
});
