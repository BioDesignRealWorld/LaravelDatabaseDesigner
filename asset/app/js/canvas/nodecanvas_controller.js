DesignerApp.module("NodeCanvas.Controller", function(Controller, DesignerApp, Backbone, Marionette, $, _) {

    // INIT CANVAS

    var viewNodeCanvas = new DesignerApp.NodeCanvas.Views.NodeCanvas({
        collection: DesignerApp.NodeEntities.getNodeCanvas()
    });

    //
    //
    //  MAIN CANVAS
    //
    //

    viewNodeCanvas.on("canvas:createcontainer", function() {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateNodeContainer());
    });

    viewNodeCanvas.on("canvas:open", function() {
        $("#fileOpenDialog").trigger("click");
    });

    viewNodeCanvas.on("canvas:save", function() {
        $("#fileSaveDialog").trigger("click");
    });

    viewNodeCanvas.on("canvas:dump", function() {
        console.log(DesignerApp.request("nodeentities:canvas").toJSON());
    });

    //
    //
    //  CHILD NODES
    //
    //

    viewNodeCanvas.on("childview:container:addnewitem", function(childview) {
        res = DesignerApp.request("nodeentities:new:nodeitem");
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateNodeItem({
            model: res
        }));
    });

    viewNodeCanvas.on("childview:container:addrelation", function(childview) {
        var relation = DesignerApp.request("nodeentities:new:relation");
        //need model, parent
        //model = childview.model
        //parent = ? nodeentities:canvas
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateRelation({
            model: childview.model
        }));    
    });

    viewNodeCanvas.on("childview:container:viewrelation", function(childview) {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.ViewRelations({
            model: childview.model
        }));
    });

    viewNodeCanvas.on("childview:container:deletecontainer", function(childview) {
        //todo refactor
        var test = childview.model.get("relation");
                var model;
        while (model = test.first()) {
            model.destroy();
        }
        test = childview.model.get("column");
                while (model = test.first()) {
            model.destroy();
        }
        childview.model.destroy();
    });

    viewNodeCanvas.on("childview:container:nodeitem:delete", function(childview, itemview) {
        itemview.model.destroy();
    });

    viewNodeCanvas.on("childview:container:nodeitem:edit", function(childview, itemview) {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.EditNodeItem({
            model: itemview.model
        }));
    });

    //
    //  LAUNCH
    //

    DesignerApp.mainContent.show(viewNodeCanvas);

});