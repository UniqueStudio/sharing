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
    'config'
], function(controller, $, config){
    $(function($){
        //oauth login
        //var remoteUrl = "http://www.uniqueguoqi.com:5000";
        console.log('init');
        var isloggedUrl = config.remoteUrl + "/api/islogged";
        console.log('logged url', isloggedUrl);
        $.get(config.remoteUrl + "/api/islogged", function(r){
            console.log('islogged result', r);
            result = $.parseJSON(r);
            if(result.logged){
                console.log('logged');
                controller.init();
            }else{
                console.log('not logged');
                chrome.tabs.create({url: config.remoteUrl});
            }

        })
    });
});
