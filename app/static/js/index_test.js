$(function(){
    $('#create_group').click(function(){
        var group_name = $('.create_group').find("input[name='group_name']").val();
        var req = {
            group_name: group_name
        };

        $.post('/create_group/', req)
            .done(function(result){
                alert(result);
            })
            .fail(function(){
                console.log('failed')
            });
    });

    $('.user_groups .remove').click(function(){
        var id = this.id;
        var remove = "remove_";
        var group_id = id.slice(remove.length);
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

    $('.diff_groups .add').click(function(){
        var id = this.id;
        var add = "add_";
        var group_id = id.slice(add.length);
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
