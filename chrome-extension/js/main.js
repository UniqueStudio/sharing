require.config({
    // 定义文件、路径的简写
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',

        'html' : '../html',
        'text' : 'lib/text'
    },
    // 对没有定义为AMD模块的第三方类库框架，在此补充定义该模块的依赖和输出
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
    }
});

require([
    'controller',
    'jquery',
], function(controller, $){
    $(function($){
        //oauth login
        // var remoteUrl = "http://localhost:5000";
        var remoteUrl = "http://www.uniqueguoqi.com:5000";
        console.log('init');
        $.get(remoteUrl + "/api/islogged", function(r){
            console.log('islogged result', r);
            result = $.parseJSON(r);
            if(result.logged){
                console.log('logged');
                controller.init();
            }else{
                console.log('not logged');
                chrome.tabs.create({url: 'http://localhost:5000'});
            }

        })
    });
});
