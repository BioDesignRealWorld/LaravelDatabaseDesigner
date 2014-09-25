DesignerApp.module("NodeModule.Views", function(Views, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------

    Views.CreateConnection = function(srcNodeContainer, dstNodeContainer) {

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


    };

    Views.NodeItem = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        className: 'node-column',
        template: "#nodeitem-template",
        events: {
            'click .edit': 'editColumn'
        },
        initialize: function() {
            //console.log(this.model);
        },
        editColumn: function() {
            console.log("editColumn");
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
        template: "#nodecollection-template",
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
        initialize: function() {
            this.collection = this.model.get("column");
            this.$el.attr("id", this.model.cid);
        },
        onAddChild: function(child) {
            this.nodeViewList.push(child);
            child.model.set('order', child.$el.index());
        },
        onShow: function() {
            //this.$el.fadeOut();
            var this_dom = $("#" + this.model.get('name'));
            var this_conn = $(this.model.get('name')).find(".conn");

            //console.log($("body"));

            // console.log(jsPlumb.addEndpoint(this.el));



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

    });
    // Public
    // -------------------------

    // Initializers
    // -------------------------
});