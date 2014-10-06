DesignerApp.module("NodeModule.Modal", function(Modal, DesignerApp, Backbone, Marionette, $, _) {
   
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
        initialize: function() {
            this.listenTo(this, "formDataInvalid", this.formDataInvalid);
        },
        okClicked: function(modal) {

            this.trigger("okClicked", Backbone.Syphon.serialize(this));
        },
         render: function() {

            this.$el.html(this.template(this.model.toJSON()));
            this.$('#type').find('option[value=' + this.model.get('type') + ']').attr('selected', 'selected');
            this.changeColumnType(this);

            var chk_box = ["pk", "nu", "un", "ui", "in", "ai", "visible", "hidden", "guarded", "fillable"];
            for (var item in chk_box){
                var chk_id = (chk_box[item]);
                this.$("#" + chk_id).prop('checked', this.model.get(chk_id));
            }         

            return this.el;
        }
    });

   
});