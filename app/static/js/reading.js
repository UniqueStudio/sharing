$(document).ready(function(){
    $('.likes').on('click',function(){
        var share_id = $(this).attr('value');
        $.ajax({
            type: "POST",
            url: "/likes",
            data: {share_id: share_id}
        }).done(function(msg){
            // console.log(msg);
            alert(msg)
        }).fail(function(){
            console.log("fail");
        });

    });

    $('.comment').on('click', '.add_comment', function(){
        var comment_body = $(this).parent().find('.body').val();
        console.log(comment_body);
        var share_id = $(this).attr('value');
        $.ajax({
            type: "POST",
            url: "/add_comment",
            data: {share_id: share_id, comment_body: comment_body}
        }).done(function(msg){
            // console.log(msg);
            alert(msg)
        }).fail(function(){
            console.log("fail");
        });
    });

    $('.dislikes').click(function(){
        var share_id = $(this).attr('value')
        req = {
            share_id: share_id
        }
        $.post('/dislikes', req)
            .done(function(msg){
                alert(msg)
            })
            .fail(function(){
                console.log('fail')
            });
    });

});
