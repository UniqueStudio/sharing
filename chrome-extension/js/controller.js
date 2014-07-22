define([
    'exports', 'underscore',
    'view.share', 'view.app',
    'model.share',
    'collection.share'
], function(
    exports, _,
    ShareView, AppView,
    ShareModel,
    ShareCollection
){

    var shareColl, app, handler;

    exports.init = function(){
        console.log('controller init');
        shareColl = new ShareCollection();
        app = new AppView();

        shareColl.fetch();

        handler = {
            addShare: function(share){
                console.log('handler, addShare');
                app.addShare(share);
            }
        }

        /*collection, view events listening */

        shareColl.
            on('add', handler.addShare);

        /*
        shareColl.fetch({
            success: function(collection, res){
                console.log('collection', collection);
            }, error: function(collection, res){
                console.log('error', res);
            }
        });
        */
    }

});

