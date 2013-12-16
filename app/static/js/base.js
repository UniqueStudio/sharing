$(document).ready(function() {

    $(".share").on('click','.share_link',function () {

        var url = $(this).html();
        console.log(url);
        $("#share_web").attr('src', url);
    });

});
