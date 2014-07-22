
/**
@module
**/
define([
    'backbone',
    'view.share'
], function(
    Backbone,
    ShareView
){
    var AppView;

    /**
    @class AppView
    @extends Backbone.View
    **/
    AppView = Backbone.View.extend({
        el: $("#app"),

        events: {
            "click #shareBtn": "shareItToServer"
        },

        /**
        初始化方法，会在默认的构造函数中被调用
        @method initialize
        **/
        initialize: function(){
            console.log('new app view');
            this.list = this.$("#shareList");
            this.shareDiv = this.$('#shareDiv');

        },

        addShare: function(share){
            console.log('AppView addShare');
            var view = new ShareView({model: share});
            this.list.append(view.render().el);
        },

        shareItToServer: function(){
            console.log('shareItToServer');
            var explain = this.$('#explain').val();
            var resultDiv = this.$('#shareResult');
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){                                                          
                var tab = tabs[0];
                var parameters = {};
                parameters.url = tab.url;
                parameters.title = tab.title;
                parameters.explain = explain;
                console.log('parameters', parameters);

                $.post("http://localhost:5000/api/add", parameters).done(function(r){
                    var result = $.parseJSON(r);
                    console.log('result', result);
                    if(result.status){
                        resultDiv.html('分享成功');
                    }else{
                        resultDiv.html(result.msg);
                    }
                }).fail(function(){
                    resultDiv.html('服务器出了点小问题');

                })
            })


        }


    });

    return AppView;
});
