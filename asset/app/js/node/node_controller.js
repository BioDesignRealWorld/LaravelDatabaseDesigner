DesignerApp.module("NodeModule", function(NodeModule, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------


    // Public
    // -------------------------
    DesignerApp.commands.setHandler("create:model:connection", function(param) {
        DesignerApp.NodeModule.Views.CreateConnection(
            param.srcNodeContainer,
            param.dstRelation
        );
    });
    // Initializers
    // -------------------------



});