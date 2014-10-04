DesignerApp.module("NodeCanvas.Views", function(Views, DesignerApp, Backbone, Marionette, $, _) {

    Views.NodeCanvas = Backbone.Marionette.CompositeView.extend({
        id: "container",
        template: "#nodecanvas-template",
        childView: DesignerApp.NodeModule.Views.NodeContainer,
        triggers: {
            "click .addcontainer": "canvas:createcontainer",
            "click .open": "canvas:open",
            "click .save": "canvas:save",
            "click .saveas": "canvas:saveas",
            "click .generate": "canvas:generate",
            "click .clearcanvas": "canvas:clearcanvas",
            "click .loadexample": "canvas:loadexample",
            "dblclick": "canvas:createcontainer"
        },
    });

});