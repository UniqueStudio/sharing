/**
骨骼collection的类
@module
**/
define([
    'backbone',
    'view.share',
    'model.share',
    'config'
], function(
    Backbone,
    ShareView,
    Share,
    config
){
    var ShareCollection;

    /**
    @class ShareCollection
    @extends Backbone.Collection
    **/
    ShareCollection = Backbone.Collection.extend({
        model: Share,

        url: config.remoteUrl + '/api/list',
        initialize: function(){
            console.log('new share collection');

            // 为变化打log
            this.on('add', this._onAdd);
            this.on('remove', this._onRemove);
        },

        _onAdd: function(share){

            console.log('add share');

        },

        _onRemove: function(share){
            console.log('remove share');
        }
    });

    return ShareCollection;
});
