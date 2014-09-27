DesignerApp.module("NodeModule", function(NodeModule, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------


    DesignerApp.commands.setHandler("draw:relation:model", function() {
        DesignerApp.NodeEntities.AddNodeCanvas(node_data);
    });

    DesignerApp.reqres.setHandler("nodeentities:new:nodeitem", function(type) {
        return DesignerApp.NodeEntities.getNewNodeModel();
    });

    DesignerApp.reqres.setHandler("nodeentities:canvas", function(type) {
        return DesignerApp.NodeEntities.getNodeCanvas();
    });

    // Public
    // -------------------------

    DesignerApp.vent.on("create:model:connection", function(param) {
        DesignerApp.NodeModule.Views.CreateConnection(
            param.srcNodeContainer,
            param.dstRelation
        );
    });

    // Initializers
    // -------------------------



});