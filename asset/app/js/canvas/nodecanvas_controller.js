DesignerApp.module("NodeCanvas", function(NodeCanvas, DesignerApp, Backbone, Marionette, $, _) {

    var viewNodeCanvas = new DesignerApp.NodeModule.Views.NodeCanvas({
        collection: DesignerApp.NodeEntities.getNodeCanvas()
    });

    viewNodeCanvas.on("childview:addnewnodeitem", function(childview) {
        res = DesignerApp.request("nodeentities:new:nodeitem");
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateNodeItem({
            model: res
        }));
    });

    viewNodeCanvas.on("childview:viewrelation", function(childview) {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.ViewRelations({
            model: childview.model
        }));
    });

    viewNodeCanvas.on("childview:nodeitem:edit", function(childview, itemview) {
        DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.EditNodeItem({
            model: itemview.model
        }));
    });

    viewNodeCanvas.on("childview:nodeitem:delete", function(childview, itemview) {
        //todo refresh jsplumb
        itemview.model.destroy();
    });

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

    DesignerApp.mainContent.show(viewNodeCanvas);

});