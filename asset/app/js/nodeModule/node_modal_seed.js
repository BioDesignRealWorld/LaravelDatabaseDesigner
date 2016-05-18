DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {

    Modal.SeedContent = Backbone.Marionette.ItemView.extend({
        tagName: "td",         
        template: "#seeditem-template",
        events:{
            "change .editvalue" : "editValue"
        },
        editValue: function(e)
        {
            var val = (this.$(".editvalue").val());
            this.model.set("content", val);
            console.log(this.model);
        },
        initialize: function(param) {
            this.parentNode = param.parentNode;
            this.parentView = param.parentView;            
        },
        serializeData: function() {
            var ser = {};
            //console.log(this.model);
            //ser.name = this.parentNode.get("column").get(this.model.get("colid")).get("name");
            ser.content = this.model.get("content");
            return ser;
        }
    });

    Modal.SeedItem = Backbone.Marionette.CollectionView.extend({
        tagName: "tr",        
        childView: Modal.SeedContent,
        childViewOptions: {},
        events:
        {
            "click .delete" : "delClicked"
        },
        delClicked: function(c,d)
        {
            //console.log(this);
            this.childViewOptions.parentView.trigger("delClicked", this.model);
        },
        onRender: function(){
            this.$el.append('<td><a href="#" class="btn delete btn-xs btn-default"><span class="glyphicon glyphicon-remove"></span></a></td>');
        },
        initialize: function(param) {
            this.collection = (this.model.get("column"));
            this.childViewOptions.parentNode = param.parentNode;
            this.childViewOptions.parentView = param.parentView;            
        },
    });

    Modal.SeedList = Backbone.Marionette.CollectionView.extend({
        tagName: "tbody",
        childView: Modal.SeedItem,
        initialize: function(){
        }
    });


    Modal.Seeding = Modal.BaseModal.extend({
        template: _.template($("#seeding-template").html()),
        initialize: function(param) {
            this.parentNode = param.parentNode;
            this.seeding = (param.seeding);
            this.seedview = new Modal.SeedList({
                collection: this.seeding,
                childViewOptions: {
                    parentNode: this.parentNode,
                    parentView: this
                }
            });
            //console.log(this.model);
        },
        events: {
            "click .btn-success": "okClicked",

        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            //console.log(data);
            this.trigger("okClicked", data);
        },
        render: function() {
            //console.log(view.render().el);
            this.$el.html(this.template({
                column: this.model.toJSON()
            }));
            this.$("table").append(this.seedview.render().el);
            return this.el;
        }
    });

});