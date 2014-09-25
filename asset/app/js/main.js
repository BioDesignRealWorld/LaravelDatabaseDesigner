var NodeItem = Backbone.Model.extend({});

/*
      1.NodeCanvas (col)
          *NodeContainer (model) -> composite view
            1.NodeCollection (col) -> NodeModel
            2.RelationCollection (col) -> RelationModel
            .....
*/

/*
{
  "name" : "id",
  "type" : "increments",
  "length" : 30,
  "order" : 0,
  "defaultvalue" : "",
  "enumvalue" : ""
}
*/
var NodeModel = Backbone.Model.extend({

});

var NodeCollection = Backbone.Collection.extend({
    model: NodeModel,
    comparator: "order"
});

/*
{
  "extramethods" : "",
  "foreignkeys" : "user_id",
  "name" : "machines",
  "relatedmodel" : "Roles",
  "relationtype" : "hasMany",
  "usenamespace" : ""
}
*/
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


//
//  Name
//  Color
//  position
//  NodeCollection
//  RelationCollection
//
var NodeContainer = Backbone.Model.extend({});


var NodeCanvas = Backbone.Collection.extend({
    model: NodeContainer
});

var node_data = {
    "name": "Users",
    "color": "",
    "position": {
        "x": 87,
        "y": 60
    },
    "column": [{
        "name": "username",
        "type": "string",
        "length": 30,
        "order": 0,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "id",
        "type": "increments",
        "length": 30,
        "order": 1,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "email",
        "type": "string",
        "length": 200,
        "order": 2,
        "defaultvalue": "",
        "enumvalue": ""
    }, {
        "name": "password",
        "type": "string",
        "length": 100,
        "order": 3,
        "defaultvalue": "",
        "enumvalue": ""
    }],
    "relation": [{
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Roles",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Map",
        "relationtype": "hasMany",
        "usenamespace": ""
    }, {
        "extramethods": "",
        "foreignkeys": "user_id",
        "name": "machines",
        "relatedmodel": "Roles",
        "relationtype": "hasMany",
        "usenamespace": ""
    }]
};

var nodeCanvas = new NodeCanvas();

var AddNewNode = function(param) {
    var nodeContainer = new NodeContainer(param);
    var col = nodeContainer.get("column"); //NodeCollection
    var rel = nodeContainer.get("relation"); //RelationCollection
    nodeContainer.set("column", new NodeCollection(col));
    nodeContainer.set("relation", new NodeCollection(rel));
    nodeCanvas.add(nodeContainer);
};


//console.log("wew");
//var testview = new DesignerApp.NodeModule.Views.NodeContainer({model : nodeContainer});
var testview = new DesignerApp.NodeModule.Views.NodeCanvas({
    collection: nodeCanvas
});

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
        ConnectionsDetachable: true,
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