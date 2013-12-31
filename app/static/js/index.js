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

$(function(){
    $('.groupDiv .remove').click(function(){
        var group_id = $(this).attr("data");
        var req = {
            group_id: group_id
        };

        $.post('/remove_attention_from_group/', req)
            .done(function(result){
                alert(result);
            })
            .fail(function(){
                console.log('failed');
            });
    });

    $('.groupDiv .add').click(function(){
        var group_id = $(this).attr("data");
        var req = {
            group_id: group_id
        };

        $.post('/add_attention_to_group/', req)
            .done(function(result){
                alert(result);
            })
            .fail(function(){
                console.log('failed');
            });
    });
});
