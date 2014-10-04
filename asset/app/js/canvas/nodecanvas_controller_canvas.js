DesignerApp.module("NodeCanvas.Controller", function(Controller, DesignerApp, Backbone, Marionette, $, _) {

    var viewNodeCanvas = Controller.viewNodeCanvas;

    viewNodeCanvas.on("canvas:createcontainer", function() {

        var container = DesignerApp.NodeEntities.getNewNodeContainer();
        console.log(container);
        var view = new DesignerApp.NodeModule.Modal.CreateNodeContainer({
            model: container
        });

        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.on("okClicked", function(data) {
            if (container.set(data, {
                validate: true
            })) {
                data.position = {
                    x: 100,
                    y: 100
                };
                DesignerApp.NodeEntities.AddNewNode(data);
            } else {
                view.trigger("formDataInvalid", container.validationError);
                modal.preventClose();
            }
        });

    });


    viewNodeCanvas.on("canvas:open", function() {
        $("#fileOpenDialog").trigger("click");
    });

    viewNodeCanvas.on("canvas:save", function() {
        $("#fileSaveDialog").trigger("click");
    });

    viewNodeCanvas.on("canvas:saveas", function() {
        console.log("save as");
    });    

    viewNodeCanvas.on("canvas:loadexample", function() {
        DesignerApp.NodeEntities.ClearNodeCanvas(DesignerApp.NodeEntities.CurrentNodeCanvas);        
        DesignerApp.NodeEntities.AddNodeCanvas(node_data); 
   });

    viewNodeCanvas.on("canvas:clearcanvas", function() {
        DesignerApp.NodeEntities.ClearNodeCanvas(DesignerApp.NodeEntities.CurrentNodeCanvas);
    });

    viewNodeCanvas.on("canvas:generate", function() {
        var view = new DesignerApp.NodeModule.Modal.Generate({
            content: DesignerApp.NodeEntities.GenerateCode()
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
    });

});