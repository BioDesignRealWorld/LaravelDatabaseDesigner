DesignerApp.module("NodeModule.Views", function(Views, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------

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
    Views.NodeCollection = Backbone.Marionette.CompositeView.extend({
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
        onAddChild: function(child) {
            this.nodeViewList.push(child);
            child.model.set('order', child.$el.index());
        },
        onRender: function(dom) {

            var self = this;

            this.$(this.childViewContainer).sortable({
                update: function(ev, ui) {
                    self.updateIndex();
                }
            });

            //this.$el.css("left", position.x);
            //this.$el.css("top", position.y);

            var this_dom = $(this.id);
            var this_conn = $(this.id).find(".conn");

            jsPlumb.makeTarget(this_dom, {
                allowLoopback: false,
                anchor: 'Continuous'
            });

            jsPlumb.makeSource(this_dom, {
                parent: this_conn,
                anchor: 'Continuous',
                allowLoopback: false,
            });

            jsPlumb.draggable(dom.el, {
                containment: 'parent'
            });

            this.$el.on("dragstop", function(event, ui) {
            	console.log(ui);
               /* if (typeof ui.helper.attr('tag') == 'undefined') {
                    param.model.set("position", {
                        x: ui.position.left,
                        y: ui.position.top,
                    });
                } */
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
    // Public
    // -------------------------

    // Initializers
    // -------------------------
});