/**
骨骼model的类
@module
**/
define([
    'underscore', 'backbone'
], function(
    _, Backbone
){
    var Share;

    /**
    @class Share
    @extends Backbone.Model
    **/
    Share = Backbone.Model.extend({

        defaults: {
        
            title: '',
            explain: '',
            url: '',
            likes: 0,
            timestamp: null

        },

        initialize: function(){

           
        },


        fetch: function(){},

        save: function(){}
    });

    return Share;
});
