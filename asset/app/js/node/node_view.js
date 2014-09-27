DesignerApp.module("NodeModule.Views", function(Views, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------

    Views.CreateConnection = function(srcNodeContainer, dstRelationModel) {
        var conn = jsPlumb.connect({
            source: srcNodeContainer.get("name"),
            target: dstRelationModel.get("relatedmodel"),
            overlays: [
                ["Arrow", {
                    location: 1
                }],
                ["Label", {
                    cssClass: "label",
                    label: srcNodeContainer.get('name') + ' ' + dstRelationModel.get('relationtype') + ' ' + dstRelationModel.get('relatedmodel'),
                    location: 0.3,
                    id: "label"
                }]
            ]
        });
    };

    Views.NodeItem = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        className: 'node-column',
        template: "#nodeitem-template",
        events: {
            'click .edit': 'editItem',
            'click .delete': 'deleteItem'

        },
        initialize: function() {
            //console.log(this.model);
        },
        editItem: function() {
            DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateNodeItem());
        },
        deleteItem: function() {
            this.model.destroy();
        }
    });

    /*

        this.model.get('relation').each(function(item) {
            jsPlumb.detach(item.get('conn'));
            item.set('conn', '');
        }, this);

        this.model.get('relation').each(function(item) {
            item.destroy();
        }, this);


        this.$(".conn").draggable({
            revert: true
        });
        this.$(".conn").droppable({

    */
    //ColumnCollectionView + NodeView
    Views.NodeContainer = Backbone.Marionette.CompositeView.extend({
        template: "#nodecontainer-template",
        className: "node-view item",
        childView: Views.NodeItem,
        childViewContainer: ".nodecollection-container",
        nodeViewList: [],
        events: {
            'click .add': 'addNew',
            'click .dump': 'dumpJSON',
            'click .relation': 'viewRelation',
            'click .parent': 'testParent',
            'click .relationadd': 'relationAdd',
            'click .delete': 'deleteNode'
        },
        addNew: function()
        {
            this.trigger("add");
        },
        initialize: function() {
            this.collection = this.model.get("column");
            this.$el.attr("id", this.model.get("name"));
        },
        onAddChild: function(child) {
            this.nodeViewList.push(child);
            child.model.set('order', child.$el.index());
        },
        onShow: function() {
            //var this_dom = $("#" + this.model.get('name'));
            //var this_conn = $(this.model.get('name')).find(".conn");
        },
        onDomRefresh: function(dom) {

            jsPlumb.makeTarget(this.el, {
                allowLoopback: false,
                anchor: 'Continuous'
            }, this);


            jsPlumb.makeSource(this.$el.find(".conn"), {
                parent: this.el,
                anchor: 'Continuous',
                allowLoopback: false,
            }, {view:this});

            jsPlumb.draggable(this.el, {
                containment: 'parent'
            }, {view:this});

        },
        onRender: function(dom) {
            //console.log($("body"));

            var self = this;

            this.$(this.childViewContainer).sortable({
                update: function(ev, ui) {
                    self.updateIndex();
                }
            });

            var pos = this.model.get("position");
            this.$el.css("left", pos.x);
            this.$el.css("top", pos.y);


            this.$el.on("dragstop", function(event, ui) {
                console.log(ui);
                if (typeof ui.helper.attr('tag') == 'undefined') {
                    self.model.set("position", {
                        x: ui.position.left,
                        y: ui.position.top,
                    });
                }
            });
        },
        onBeforeDestroy: function() {
            jsPlumb.detachAllConnections(this.$el);
            jsPlumb.removeAllEndpoints(this.$el);
        },
        updateIndex: function() {
            for (var i in this.nodeViewList)
                this.nodeViewList[i].model.set('order', this.nodeViewList[i].$el.index());
            this.collection.sort({
                silent: true
            });
        }
    });


    Views.RelationItem = Backbone.Marionette.ItemView.extend({
        template: "#relationcollection-template",
        tagName: 'tr',
        events: {
            //'click .delete': 'deleteRelation',
            //'click .edit': 'editRelation'
        },
    });
    //composite tbody
    Views.RelationCollection = Backbone.Marionette.CollectionView.extend({
        template: "#relationview-template",
        childView: Views.RelationItem,
    });


    Views.NodeCanvas = Backbone.Marionette.CompositeView.extend({
        id: "container",
        template: "#nodecanvas-template",
        childView: Views.NodeContainer,
        events:{
            "click .addcontainer" : "createContainer"
        },
        createContainer: function()
        {
            DesignerApp.NodeModule.Modal.CreateTestModal(new DesignerApp.NodeModule.Modal.CreateNodeContainer());
        },
        initialize: function()
        {

        }
    });

    Views.Test = Backbone.Marionette.ItemView.extend({
        template: false
    });


    Views.Modal = Backbone.Marionette.Modals.extend({
    });

    // Public
    // -------------------------

    // Initializers
    // -------------------------
});