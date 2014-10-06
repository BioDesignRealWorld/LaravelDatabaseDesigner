DesignerApp.module("NodeCanvas.Controller", function(Controller, DesignerApp, Backbone, Marionette, $, _) {

    // INIT CANVAS
    // refactor this
    Controller.viewNodeCanvas = new DesignerApp.NodeCanvas.Views.NodeCanvas({
        collection: DesignerApp.NodeEntities.getNodeCanvas()
    });

    Controller.viewCanvasMenu = new DesignerApp.NodeCanvas.Views.MenuView();

    //
    //  LAUNCH
    //

var AppLayoutView = Backbone.Marionette.LayoutView.extend({
  template: "#testlayout-template",

  regions: {
    menu: "#menu",
    info: "#info",
    content: "#content"
  }
});

var LoadingView = Backbone.Marionette.ItemView.extend({
    template: "#loadingprogress-template",
    className: "progress"
});


var layoutView = new AppLayoutView();

DesignerApp.mainContent.show(layoutView);
layoutView.menu.show(Controller.viewCanvasMenu);
layoutView.content.show(Controller.viewNodeCanvas);


    DesignerApp.vent.on("canvas:loading:start", function(param) {
        layoutView.info.show(new LoadingView());
    });

    DesignerApp.vent.on("canvas:loading:stop", function(param) {
        layoutView.info.reset();
    });


    //todo refactor
    DesignerApp.commands.setHandler("nodecanvas:edit:relation", function(a, b) {

        var view = new DesignerApp.NodeModule.Modal.EditRelationItem({
            model: b
        }, {
            container: a
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.on("okClicked", function(data) {
            if (b.set(data, {
                validate: true
            })) {

            } else {
                view.trigger("formDataInvalid", b.validationError);
                modal.preventClose();
            }
        });

        view.on("delClicked", function(model) {
            model.destroy();
        });

        //console.log("Wew");

    });

    //todo: refactor this
    DesignerApp.commands.setHandler("nodecanvas:create:relation", function(containerModel, targetId) {

        var targetName = DesignerApp.NodeEntities.getNodeContainerFromNodeCid(targetId).get("name");

        var view = new DesignerApp.NodeModule.Modal.CreateRelation({
            model: containerModel,
            target: targetName
        });

        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.listenTo(view, "okClicked", function(data) {
            var new_rel = DesignerApp.NodeEntities.getNewRelationModel();
            if (new_rel.set(data, {
                validate: true
            })) {
                var relation = containerModel.get("relation");
                relation.add(new_rel);
                DesignerApp.NodeEntities.AddRelation(containerModel, new_rel);
                // console.log(new_rel);
            } else {
                view.trigger("formDataInvalid", new_rel.validationError);
                modal.preventClose();
                // console.log("error");
            }
        });

    });


});