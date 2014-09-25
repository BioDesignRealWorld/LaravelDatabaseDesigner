
var Node = Backbone.Model.extend({});

var NodeCollection = Backbone.Collection.extend(
{   
    model: Node, 
    comparator: "order"
});


var RelationModel = Backbone.Model.extend({
    defaults: {
        name: '',
        relationtype: '',
        usenamespace: '',
        relatedmodel: '',
        foreignkeys: '',
        extramethods: ''
    }
});

var RelationCollection = Backbone.Collection.extend({
    model: RelationModel
});


var nodes = new NodeCollection([
  {
    "name" : "username",
    "type" : "string",
    "length" : 30,
    "order" : 0,
    "defaultvalue" : "",
    "enumvalue" : ""
  },
  {
    "name" : "id",
    "type" : "increments",
    "length" : 30,
    "order" : 1,
    "defaultvalue" : "",
    "enumvalue" : ""
  },
  {
    "name" : "email",
    "type" : "string",
    "length" : 200,
    "order" : 2,
    "defaultvalue" : "",
    "enumvalue" : ""
  },
  {
    "name" : "password",
    "type" : "string",
    "length" : 100,
    "order" : 3,
    "defaultvalue" : "",
    "enumvalue" : ""
  }
]);

var testview = new DesignerApp.NodeModule.Views.NodeCollection({id: "wew", collection: nodes});


DesignerApp.mainContent.show(testview);




jsPlumb.Defaults.Connector = ["Flowchart", {
    stub: [40, 60],
    gap: 10,
    cornerRadius: 5,
    alwaysRespectStubs: true
}];
jsPlumb.Defaults.HoverPaintStyle = {
    strokeStyle: "#637b94",
    lineWidth: 6
};
jsPlumb.Defaults.EndpointHoverStyle = {
    fillStyle: "#637b94"
};

jsPlumb.ready(function() {
    var instance = jsPlumb.importDefaults({
        ConnectionsDetachable:true,
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        PaintStyle: {
            strokeStyle: '#666',
            lineWidth: 2,
            joinstyle: "round",
        },
        Anchors: ["TopCenter", "TopCenter"],
        endpointStyle: {
            fillStyle: "yellow"
        }

    });


});