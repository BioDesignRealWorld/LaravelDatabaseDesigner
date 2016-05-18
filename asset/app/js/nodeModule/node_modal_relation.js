DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {

    Modal.CreateRelation = Modal.BaseModal.extend({
        initialize: function(param) {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
            this.target = param.target;
            this.targetClass = param.targetClass;

            //console.log(param.target);
        },
        model: Node,
        idPrefix: "relation",
        template: _.template($('#relationcreate-template').html()),
        optionTemplate: _.template("<select id=\"relation-relatedcolumn\" name=\"relatedcolumn\" class=\"form-control\"><% _.each(relatedcolumn, function(related) { %><option value=\"<%=related.name%>\" ><%=related.name%><\/option><% }); %><\/select>"),        
        events: {
            "click .ok": "okClicked",
            "change #relation-relatedmodel" : "consoleLog"            
        },
        consoleLog: function(e)
        {
            var model = (DesignerApp.NodeEntities.getNodeContainerFromClassName(e.target.value));
            var column = (model.get('column').toJSON());

            var options = (this.optionTemplate({relatedcolumn: column}));
            this.$('#relation-relatedcolumn').html(options);

        },        
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            var parent = DesignerApp.request("nodeentities:canvas");
            var templatevar = {
                relationship: this.model.get('relation').toJSON(),
                relatedmodel: parent.toJSON(),
                title: "Create Relation in Model " + this.model.get('classname'),
                relatedcolumn: ""
            };
            //
            //
            if (this.target) {
                templatevar.title = "Create Relation Between " + this.model.get('classname') + " and " + this.targetClass;
            }
            //
            //
            this.$el.html(this.template(templatevar));
            //

            var model = "";

            if (this.target) {
                this.$('.classoption').hide(); //hide option box
                this.$('#relation-relatedmodel').find('option[value=' + this.targetClass + ']').attr('selected', 'selected'); //make destination selected by default
            
                model = (DesignerApp.NodeEntities.getNodeContainerFromClassName(this.targetClass));
            }else{
                this.$('#relation-relatedmodel').find('option[value=' + this.model.get('classname') + ']').remove(); //remove self (model) from option list
                model = (DesignerApp.NodeEntities.getNodeContainerFromClassName(this.$('#relation-relatedmodel').val()));
            }

            

            var column = (model.get('column').toJSON());
            var options = (this.optionTemplate({relatedcolumn: column}));
            this.$('#relation-relatedcolumn').html(options);

            //
            return this.el;
        }
    });



    Modal.EditRelationItem = Modal.BaseModal.extend({
        template: _.template($('#relationcreate-template').html()),
        optionTemplate: _.template("<select id=\"relation-relatedcolumn\" name=\"relatedcolumn\" class=\"form-control\"><% _.each(relatedcolumn, function(related) { %><option value=\"<%=related.name%>\" ><%=related.name%><\/option><% }); %><\/select>"),
        idPrefix: "relation",
        initialize: function(options, param) {
            this.container = param.container;
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        events: {
            "click #btnsave.ok": "okClicked",
            "click #btndelete.delete": "delClicked",
            "change #relation-relatedmodel" : "consoleLog"
        },
        consoleLog: function(e)
        {
            var model = (DesignerApp.NodeEntities.getNodeContainerFromClassName(e.target.value));
            var column = (model.get('column').toJSON());

            var options = (this.optionTemplate({relatedcolumn: column}));
            this.$('#relation-relatedcolumn').html(options);

        },
        delClicked: function(e) {
            this.trigger("delClicked", this.model);
        },
        okClicked: function() {
            //todo
            var data = Backbone.Syphon.serialize(this);
                        //console.log(data);

            this.trigger("okClicked", data);
        },
        render: function() {
            var templatevar = {
                title: 'Edit Relation in Model ' + this.container.get('classname'),
                relationship: this.model.toJSON(),
                //todo: change to reqreq
                relatedmodel: DesignerApp.NodeEntities.getNodeCanvas().toJSON(),
                relatedcolumn: DesignerApp.NodeEntities.getNodeContainerFromClassName(this.model.get('relatedmodel')).get('column').toJSON()
            };

            //console.log(this.model.get('relatedcolumn'));

            this.$el.html(this.template(templatevar));

            var model = (DesignerApp.NodeEntities.getNodeContainerFromClassName(this.model.get('relatedmodel')));
            var column = (model.get('column').toJSON());

            var options = (this.optionTemplate({relatedcolumn: column}));
            //this.$('#relation-relatedcolumn').html(options);


            // console.log(this.parent);
            this.$('#relation-relatedcolumn').find('option[value=' + this.model.get('relatedcolumn') + ']').attr('selected', 'selected'); //make destination selected by default            
            this.$('#relation-relatedmodel').find('option[value=' + this.model.get('relatedmodel') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relationtype').find('option[value=' + this.model.get('relationtype') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relatedmodel').find('option[value=' + this.container.get('classname') + ']').remove(); //remove self (model) from option list

            return this.el;

        }
    });


    Modal.RelationItem = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($("#relationitem-template").html()),
        events: {
            'click .delete': 'deleteRelation',
            'click .edit': 'editRelation'
        },
        initialize: function(options, param) {
            this.container = param.container;
            this.listenTo(this.model, "change", this.render);
        },
        deleteRelation: function() {
            //todo refactor this
            this.model.destroy();
        },
        editRelation: function() {
            DesignerApp.execute("nodecanvas:edit:relation", this.container, this.model);
        },
        render: function() { // console.log('destroy render');
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });


    Modal.ViewRelations = Backbone.View.extend({
        template: _.template($("#relationcollection-template").html()),
        events: {
            "click .ok": "addNewRelationClicked"
        },
        initialize: function() {
            this.childViews = [];
            this.listenTo(this.model.get("relation"), 'destroy', this.render);
            this.listenTo(this.model.get("relation"), 'add', this.addOne);
        },
        addNewRelationClicked: function() {
            this.trigger("addNewRelationClicked");
        },
        addOne: function(relation) {
            var view = new Modal.RelationItem({
                model: relation
            }, {
                container: this.model
            });
            this.childViews.push(view);
            this.$("tbody").append(view.render());
        },
         close: function(){
            this.remove();
            this.unbind();
            // handle other unbinding needs, here
            _.each(this.childViews, function(childView){
              if (childView.remove){
                childView.remove();
              }
            });
          },        
        render: function() {
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.model.get("relation").each(function(item) {
                self.addOne(item);
            });
            return this.el;
        }
    });

});