DesignerApp.module("NodeEntities", function(NodeEntities, DesignerApp, Backbone, Marionette, $, _){
    // Private
    // -------------------------

    
    // Public
    // -------------------------
	var NodeItem = Backbone.Model.extend({
	    defaults: {
	        name: '',
	        type: '',
	        length: 0,
	        defaultvalue: '',
	        enumvalue: ''
	    }
	});


    // Initializers
    // -------------------------
    DesignerApp.reqres.setHandler("get:node:model", function(){
    	return NodeItem;
    });

    
});