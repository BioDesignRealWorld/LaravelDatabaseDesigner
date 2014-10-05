DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {



    Modal.GistLoad = Modal.BaseModal.extend({
        template: _.template($("#gistload-template").html()),
        initialize: function(param)
        {
            this.content = param.content;
            this.listenTo(this, "listGistFiles", this.listGistFiles);            
        },
        events: {
            "click .ok": "okClicked",
            "click .list-group-item" : "listClicked"
        },
        listClicked: function(e)
        {
            var gistid = (this.$(e.currentTarget).attr("tag"));
            this.trigger("okClicked", gistid);
        },
        listGistFiles: function(data)
        {
            var test = _.template($("#gistfile-template").html());
            this.$el.append(test({gistlist: data}));
        },
        okClicked: function()
        {
            var file = this.$("#filename").val();
            this.trigger("okClicked", file);
        },
        render: function() {
            //console.log(view.render().el);
            this.$el.html(this.template({
                content: this.content
            }));
            return this.el;
        }
    });


    Modal.GistLoadId = Modal.BaseModal.extend({
        template: _.template($("#gistloadid-template").html()),
        initialize: function(param)
        {
            this.content = param.content;
            this.listenTo(this, "listGistFiles", this.listGistFiles);            
        },
        events: {
            "click .ok": "okClicked",
        },
        okClicked: function()
        {
            var file = this.$("#filename").val();
            this.trigger("okClicked", file);
        },
        render: function() {
            this.$el.html(this.template());
            return this.el;
        }
    });



    Modal.GistSaveAs = Modal.BaseModal.extend({
        template: _.template($("#gistsave-template").html()),
        initialize: function(param)
        {
            this.content = param.content;
        },
        events: {
            "click .ok": "okClicked",
        },
        okClicked: function()
        {
            var file = this.$("#filename").val();
            var desc = this.$("#description").val();
            this.trigger("okClicked", {filename: file, description: desc});
        },

        render: function() {
            //console.log(view.render().el);
            this.$el.html(this.template({
                content: this.content
            }));
            return this.el;
        }
    });    

});