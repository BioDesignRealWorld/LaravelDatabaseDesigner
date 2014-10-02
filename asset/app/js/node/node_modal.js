DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {
    // Private
    // -------------------------
    Modal.BaseModal = Backbone.View.extend({
        formDataInvalid: function(error) {
            var self = this;
            this.$el.find(".has-error").each(function() {
                $(this).removeClass("has-error");
            });
            var markError = function(value, key) {
                var $control_group = self.$el.find("#" + self.idPrefix + "-" + key).parent();
                $control_group.parent().addClass("has-error");
                var $error_el = $("<span>", {
                    class: "help-block",
                    text: value
                });
                //$control_group.append($error_el);
            };
            _.each(error, markError);
        },
        render: function() {
            this.$el.html(this.template());
            return this.el;
        }

    });

    Modal.CreateNodeItem = Modal.BaseModal.extend({
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        template: _.template($("#nodemodel-template").html()),
        events: {
            "click .ok": "okClicked",
            "change #type": "changeColumnTypeEvent",
            "change #visible": "changeVisible",
            "change #hidden": "changeHidden",
            "change #guarded": "changeGuarded",
            "change #fillable": "changeFillable",
            "change #in": "changeIndex",
            "change #un": "changeUnique",
        },
        changeIndex: function(e) {
            if (this.$("#in").prop("checked") === true) this.$("#un").prop("checked", false);
        },
        changeUnique: function(e) {
            if (this.$("#un").prop("checked") === true) this.$("#in").prop("checked", false);
        },
        changeGuarded: function(e) {
            if (this.$("#guarded").prop("checked") === true) this.$("#fillable").prop("checked", false);
        },
        changeFillable: function(e) {
            if (this.$("#fillable").prop("checked") === true) this.$("#guarded").prop("checked", false);
        },
        changeVisible: function(e) {
            if (this.$("#visible").prop("checked") === true) this.$("#hidden").prop("checked", false);
        },
        changeHidden: function(e) {
            if (this.$("#hidden").prop("checked") === true) this.$("#visible").prop("checked", false);
        },
        changeColumnTypeEvent: function() {
            this.changeColumnType();
        },
        changeColumnType: function(ctx) {

            if (!ctx) ctx = this;

            var $e = function(elem) {
                ctx.$(elem).attr("disabled", false);
            };
            var $d = function(elem, state) {
                if (!state) state = true;
                ctx.$(elem).attr("disabled", state);
            };

            var column_type = ctx.$("#type").val();

            var disable_all_elem = function() {
                $d("#pk, #nu, #un, #ui, #in, #ai");
                $d("#length, #defaultvalue, #enumvalue");
                ctx.$("#pk, #nu, #un, #ui, #in, #ai").prop("checked", false);

                ctx.$("#length").attr("placeholder", "Length");
            };

            var $p = function(elem, txt) {
                ctx.$(elem).attr("placeholder", txt);
                ctx.$(elem).val("");
            };


            disable_all_elem();

            switch (column_type) {
                case "increments":
                case "bigIncrements":
                case "timestamps":
                case "softDeletes":
                    break;
                case "string":
                    $e("#length, #defaultvalue, #in, #un, #nu");
                    //$p("#length", "Length");
                    break;
                case "text":
                    $e("#defaultvalue, #in, #un, #nu");
                    $p("#length", "Length");
                    break;
                case "tinyInteger":
                    $e("#defaultvalue, #ai, #un, #ui, #nu, #in");
                    $p("#length", "1");
                    break;
                case "smallInteger":
                    $e("#defaultvalue, #ai, #un, #ui, #nu, #in");
                    $p("#length", "6");
                    break;
                case "integer": //todo enable foreign key
                    $e("#defaultvalue, #ai, #un, #ui, #nu, #in");
                    $p("#length", "10");
                    break;
                case "mediumInteger":
                    $e("#defaultvalue, #ai, #un, #ui, #nu, #in");
                    $p("#length", "9");
                    break;
                case "bigInteger": //todo enable foreign key
                    $e("#defaultvalue, #ai, #un, #ui, #nu, #in");
                    $p("#length", "20");
                    break;
                case "float":
                    $e("#defaultvalue, #in, #un, #nu");
                    $p("#length", "Length");
                    break;
                case "decimal":
                    $e("#defaultvalue, #length, #in, #un, #nu");
                    $p("#length", "8,2");
                    break;
                case "boolean":
                    $e("#defaultvalue, #nu, #in, #un");
                    $p("#length", "Length");
                    break;
                case "date":
                case "datetime":
                case "time":
                case "timestamp":
                case "binary":
                    break;
                case "enum":
                    $e("#nu, #in, #un");
                    $e("#enumvalue");
                    break;
                default:
                    break;
            }
        },
        okClicked: function() {
            this.trigger("okClicked", Backbone.Syphon.serialize(this));
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$('#type').find('option[value=' + this.model.get('type') + ']').attr('selected', 'selected');
            this.changeColumnType(this);
            return this.el;
        }
    });

    Modal.EditNodeItem = Modal.CreateNodeItem.extend({
        okClicked: function(modal) {

            this.trigger("okClicked", Backbone.Syphon.serialize(this));
        }
    });



    Modal.CreateNodeContainer = Modal.BaseModal.extend({
        template: _.template($('#createnode-template').html()),
        events: {
            'click .addnode': 'okClicked'
        },
        idPrefix: "container",
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this.el;
        }
    });

    Modal.EditNodeContainer = Modal.BaseModal.extend({
        template: _.template($('#createnode-template').html()),
        events: {
            'click .addnode': 'okClicked'
        },
        idPrefix: "container",
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        okClicked: function() {
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get("increment") === true) this.$("#container-increment").prop("checked", true);
            if (this.model.get("timestamp") === true) this.$("#container-timestamp").prop("checked", true);
            if (this.model.get("softdelete") === true) this.$("#container-softdelete").prop("checked", true);

            this.$('#container-color').find('option[value=' + this.model.get("color") + ']').attr('selected', 'selected'); //make destination selected by default
            return this.el;
        }
    });

    Modal.CreateRelation = Modal.BaseModal.extend({
        initialize: function(param) {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
            this.target = param.target;
            //console.log(param.target);
        },
        model: Node,
        idPrefix: "relation",
        template: _.template($('#relationcreate-template').html()),
        events: {
            "click .ok": "okClicked"
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
                title: "Create Relation in Table " + this.model.get('name')
            };
            //
            //
            if (this.target) {
                templatevar.title = "Create Relation Between " + this.model.get('name') + " and " + this.target;
            }
            //
            //
            this.$el.html(this.template(templatevar));
            //

            if (this.target) {
                this.$('.classoption').hide(); //hide option box
                this.$('#relation-relatedmodel').find('option[value=' + this.target + ']').attr('selected', 'selected'); //make destination selected by default
            }

            this.$('#relation-relatedmodel').find('option[value=' + this.model.get('name') + ']').remove(); //remove self (model) from option list
            //
            return this.el;
        }
    });



    Modal.EditRelationItem = Modal.BaseModal.extend({
        template: _.template($('#relationcreate-template').html()),
        idPrefix: "relation",
        initialize: function(options, param) {
            this.container = param.container;
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        events: {
            "click #btnsave.ok": "okClicked",
            "click #btndelete.delete": "delClicked"
        },
        delClicked: function(e) {
            this.trigger("delClicked", this.model);
        },
        okClicked: function() {
            //todo
            var data = Backbone.Syphon.serialize(this);
            this.trigger("okClicked", data);
        },
        render: function() {
            var templatevar = {
                title: 'Edit Relation in Table ' + this.container.get('name'),
                relationship: this.model.toJSON(),
                //todo: change to reqreq
                relatedmodel: DesignerApp.NodeEntities.getNodeCanvas().toJSON()
            };
            this.$el.html(this.template(templatevar));
            // console.log(this.parent);
            this.$('#relation-relatedmodel').find('option[value=' + this.model.get('relatedmodel') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relationtype').find('option[value=' + this.model.get('relationtype') + ']').attr('selected', 'selected'); //make destination selected by default
            this.$('#relation-relatedmodel').find('option[value=' + this.container.get('name') + ']').remove(); //remove self (model) from option list

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

    // Public
    // -------------------------
    Modal.CreateTestModal = function(view) {
        var modal = new Backbone.BootstrapModal({
            showFooter: false
        });
        modal.options.content = view;
        modal.on("hidden", function(){
            modal.off();
           if (typeof view.destroy == 'function') view.destroy(); 
           if (typeof view.remove == 'function') view.remove(); 
           if (typeof view.close == 'function') view.close(); 

        });
        modal.open();
        return modal;
    };

    // Initializers
    // -------------------------
});