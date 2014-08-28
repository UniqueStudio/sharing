/**
面板view
@module
**/
define([
    'backbone'
], function(
    Backbone
){
    var ShareView;

    /**
    @class ShareView
    @extends Backbone.View
    **/
    ShareView = Backbone.View.extend({

        className: "shareItem",

        template: function(share){
            if(share.title.length > 12){
                share.title = share.title.slice(0, 12) + "...";
            }
            html = [
                "<a class='shareUrl' href='",
                share.url,
              "'>", share.title, "</a>"
            ]
            return html.join('');
        },

        events: {
            "click .shareUrl": "updateCurrent"
        },

        /**
        初始化方法，会在默认的构造函数中被调用
        @method initialize
        **/
        initialize: function(){
       

        },

        render: function(){
            console.log('model', this.model.toJSON());
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        updateCurrent: function(e){
            var $target = $(e.target);
            var href = $target.attr('href');
            e.preventDefault();
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
                var tab = tabs[0];
                chrome.tabs.update(tab.id, {url: href});
            });
        }

    });

    return ShareView;
});
