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
    
    });

    viewNodeCanvas.on("childview:container:viewrelation", function(childview) {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.ViewRelations({
            model: childview.model
        }));
    });

    viewNodeCanvas.on("childview:container:deletecontainer", function(childview) {
    
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