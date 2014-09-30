DesignerApp.module("NodeModule", function(NodeModule, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------


    DesignerApp.commands.setHandler("draw:relation:model", function() {
        DesignerApp.NodeEntities.AddNodeCanvas(node_data);
    });

    DesignerApp.reqres.setHandler("nodeentities:new:nodeitem", function(type) {
        return DesignerApp.NodeEntities.getNewNodeModel();
    });

    DesignerApp.reqres.setHandler("nodeentities:new:relation", function(type) {
        return DesignerApp.NodeEntities.getNewRelationModel();
    });

    DesignerApp.reqres.setHandler("nodeentities:canvas", function(type) {
        return DesignerApp.NodeEntities.getNodeCanvas();
    });

    // Public
    // -------------------------

    DesignerApp.vent.on("noderelation:add", function(param) {
        var conn = DesignerApp.NodeModule.Views.CreateConnection(
            param.srcNodeContainer,
            param.dstRelation
        );
        param.dstRelation.set("conn", conn);
    });

    DesignerApp.vent.on("noderelation:change", function(param) {
        //todo refactor this
        var conn = param.dstRelation.get("conn");
        jsPlumb.detach(conn);

        conn = DesignerApp.NodeModule.Views.CreateConnection(
            param.srcNodeContainer,
            param.dstRelation
        );

        param.dstRelation.set("conn", conn);
    });

    DesignerApp.vent.on("noderelation:destroy", function(param) {
        var conn = param.dstRelation.get("conn");
        if (conn !== "") {
            if (conn.connector !== null) {
                conn.unbind();
                jsPlumb.detach(conn);
            }
        }

    });

    DesignerApp.vent.on("noderelation:redraw", function(param) {
        var conn = param.dstRelation.get("conn");
        $(conn.getOverlay('label').canvas).html(param.srcNodeContainer.get('name') + ' ' + param.dstRelation.get('relationtype') + ' ' + param.dstRelation.get('relatedmodel'));
    });



    // Initializers
    // -------------------------



});