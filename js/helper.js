//create jsPlumb connection 

//createConnection
// relationModel = RelationModel
// sourceNode = Node

function createConnection(relationModel, sourceNode) {



    var relationModal = function(sourceNode, relationModel) {

        var relationEditView = new RelationEditView({
            model: relationModel,
            parent: sourceNode,
            title: 'Edit Relation in Table '
        });

        var modal = new Backbone.BootstrapModal({
            showFooter: false,
            content: relationEditView
        });

        modal.open();
    };

    relationModel.on('add', function() {

        //console.log(relationModel.get('sourcenode'));

        var conn = jsPlumb.connect({
            source: sourceNode.get('name'),
            target: relationModel.get('relatedmodel'),
            overlays: [
                ["Arrow", {
                    location: 1
                }],
                ["Label", {
                    cssClass: "label",
                    label: sourceNode.get('name') + ' ' + relationModel.get('relationtype') + ' ' + relationModel.get('relatedmodel'),
                    location: 0.3,
                    id: "label"
                }]
            ]
        });

        conn.bind("click", function() {
            relationModal(sourceNode, relationModel);
        });

        var targetModel = sourceNode.get('parent').where({
            name: relationModel.get('relatedmodel')
        })[0];


        relationModel.listenTo(targetModel, 'destroy', relationModel.destroy);

        relationModel.set('conn', conn);
    });

    relationModel.on('change:relationtype', function() {
        $(relationModel.get('conn').getOverlay('label').canvas).html(sourceNode.get('name') + ' ' + relationModel.get('relationtype') + ' ' + relationModel.get('relatedmodel'));

    });

    relationModel.on('change:relatedmodel', function() {

        relationModel.get('detachListen')();

        jsPlumb.detach(relationModel.get('conn'));
        var conn = jsPlumb.connect({
            source: sourceNode.get('name'),
            target: relationModel.get('relatedmodel'),
            overlays: [
                ["Arrow", {
                    location: 1
                }],
                ["Label", {
                    cssClass: "label",
                    label: sourceNode.get('name') + ' ' + relationModel.get('relationtype') + ' ' + relationModel.get('relatedmodel'),
                    location: 0.3,
                    id: "label"
                }]
            ]
        });

        conn.bind("click", function() {
            relationModal(sourceNode, relationModel);
        });

        var targetModel = sourceNode.get('parent').where({
            name: relationModel.get('relatedmodel')
        })[0];


        relationModel.listenTo(targetModel, 'destroy', relationModel.destroy);


        relationModel.set('detachListen', detachListen);
        relationModel.set('conn', conn);
    });

    relationModel.on('destroy', function() {
        relationModel.stopListening();
        //console.log("destroyed");
        if (relationModel.get('conn').connector !== null) {
            jsPlumb.detach(relationModel.get('conn'));
        }
    });
}
