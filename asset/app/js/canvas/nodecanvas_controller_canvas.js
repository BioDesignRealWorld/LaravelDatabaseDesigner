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
        if (typeof process != 'undefined') {
            $("#fileOpenDialog").trigger("click");
        } else {


            var view = new DesignerApp.NodeModule.Modal.GistLoad({});

            var loadGist = function(gistId) {
                var github = hello("github");            
                github.api('/gists/' + gistId , 'get').then(function(resp) {
                      var jsonfile = (JSON.parse(resp.files.fileName.content));
                      DesignerApp.NodeEntities.ClearNodeCanvas(DesignerApp.NodeEntities.getNodeCanvas());
                      DesignerApp.NodeEntities.AddNodeCanvas(jsonfile);
                });
            };

            view.listenTo(view, "okClicked", function(fileName) {
                loadGist(fileName);
            });

            if (!authenticated) {
                hello.login("github", {
                    scope: "gist"
                });
            } else {
                var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
            }



        }
    });

    viewNodeCanvas.on("canvas:save", function() {
        if (typeof process != 'undefined') {
            $("#fileSaveDialog").trigger("click");
        } else {

        }
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