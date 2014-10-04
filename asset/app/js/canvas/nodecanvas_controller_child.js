DesignerApp.module("NodeCanvas.Controller", function(Controller, DesignerApp, Backbone, Marionette, $, _) {

    var viewNodeCanvas = Controller.viewNodeCanvas;


    viewNodeCanvas.on("childview:container:editcontainer", function(childview) {
        var containerModel = childview.model;
        var view = new DesignerApp.NodeModule.Modal.EditNodeContainer({
            model: containerModel
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.listenTo(view, "okClicked", function(data) {
            //console.log(data);
            if (containerModel.set(data, {
                validate: true
            })) {
                //DesignerApp.NodeEntities.AddNewNode(data);
            } else {
                view.trigger("formDataInvalid", containerModel.validationError);
                modal.preventClose();
            }
        });



    });




    viewNodeCanvas.on("childview:container:addrelation", function(childview) {
        //var relation = DesignerApp.request("nodeentities:new:relation");
        //need model, parent
        //model = childview.model
        //parent = ? nodeentities:canvas

        var view = new DesignerApp.NodeModule.Modal.CreateRelation({
            model: childview.model
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.listenTo(view, "okClicked", function(data) {
            var new_rel = DesignerApp.NodeEntities.getNewRelationModel();
            if (new_rel.set(data, {
                validate: true
            })) {
                var relation = childview.model.get("relation");
                relation.add(new_rel);
                DesignerApp.NodeEntities.AddRelation(childview.model, new_rel);
                console.log(new_rel);
            } else {
                view.trigger("formDataInvalid", new_rel.validationError);
                modal.preventClose();
                console.log("error");
            }
        });

        modal.on("hidden", function() {
            modal.off();
            view.remove();
        });

    });

    viewNodeCanvas.on("childview:container:viewrelation", function(childview) {

        var view = new DesignerApp.NodeModule.Modal.ViewRelations({
            model: childview.model
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.on("addNewRelationClicked", function() {
            viewNodeCanvas.trigger("childview:container:addrelation", childview);
            modal.preventClose();
        });

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


    viewNodeCanvas.on("childview:container:addnewitem", function(childview) {

        var view = new DesignerApp.NodeModule.Modal.CreateNodeItem({
            model: DesignerApp.request("nodeentities:new:nodeitem")
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);
        view.on("okClicked", function(data) {
            childview.collection.add(data);
        });

    });

    viewNodeCanvas.on("childview:container:nodeitem:delete", function(childview, itemview) {
        itemview.model.destroy();
    });

    viewNodeCanvas.on("childview:container:nodeitem:edit", function(childview, itemview) {
        var view = new DesignerApp.NodeModule.Modal.EditNodeItem({
            model: itemview.model
        });
        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.on("okClicked", function(data) {
            itemview.model.set(data);
        });


    });

    viewNodeCanvas.on("childview:container:seeding", function(childview) {

        var nodeContainer = childview.model;
        var nodeItem = nodeContainer.get("column");
        var nodeSeeding = nodeContainer.get("seeding");


        // var seeding = [];

        //nodeSeeding.each(function(seed){
        //    var newseed = {};
        //    nodeItem.each(function(nodecolumn){
        //        var s = seed.get("column").findWhere({cid: nodecolumn.cid});
        //        if(s)
        //        {
        //            newseed[nodecolumn.get("name")] = s.get("content");
        //        }
        //    });
        //    seeding.push(newseed);
        //});


        var view = new DesignerApp.NodeModule.Modal.Seeding({
            model: childview.model.get("column"),
            seeding: nodeContainer.getSeeding(),
            parentNode: nodeContainer
        });

        var modal = DesignerApp.NodeModule.Modal.CreateTestModal(view);

        view.listenTo(view, "delClicked", function(data) {
            data.destroy();
            nodeContainer.set("seeding", view.seeding);
            //console.log("wedew");
        });

        view.listenTo(view, "okClicked", function(data) {

            var seed = new DesignerApp.NodeEntities.SeedTableCollection();

            _.each(data, function(value, key) {
                var key_to_colid = nodeItem.findWhere({
                    name: key
                }).get("colid");
                console.log(key_to_colid);

                seed.get("column").add({
                    colid: key_to_colid,
                    content: value
                });

            });

            view.seeding.add(seed);
            //nodeSeeding.add(seed);
            nodeContainer.set("seeding", view.seeding);

            modal.preventClose();
        });

        modal.on("hidden", function() {
            //console.log("hidden");
            nodeContainer.set("seeding", view.seeding);
            view.seedview.destroy();
            view.remove();
        });



    });

});