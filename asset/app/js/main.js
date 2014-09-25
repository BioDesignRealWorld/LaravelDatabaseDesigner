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


var AddNewNode = function(param) {
    var nodeContainer = new NodeContainer(param);
    var col = nodeContainer.get("column"); //NodeCollection
    var rel = nodeContainer.get("relation"); //RelationCollection
    nodeContainer.set("column", new NodeCollection(col));
    nodeContainer.set("relation", new NodeCollection(rel));
    nodeCanvas.add(nodeContainer);
};


var node_data = [{"name":"Bears","color":"Blue","position":{"x":130,"y":162},"modelclass":"Bear","column":[{"name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"name":"name","type":"string","length":"200","order":1,"defaultvalue":"","enumvalue":""},{"name":"danger_level","type":"string","length":"200","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"fish","relatedmodel":"Fish","relationtype":"hasOne","usenamespace":""},{"extramethods":"","foreignkeys":"","name":"trees","relatedmodel":"Trees","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"bear_id, picnic_id","name":"picnics","relatedmodel":"Picnics","relationtype":"belongsToMany","usenamespace":""}]},{"name":"Fish","color":"Grey","position":{"x":1053,"y":28},"modelclass":"Fish","column":[{"name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"name":"bear_id","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"name":"weight","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"bear","relatedmodel":"Bears","relationtype":"belongsTo","usenamespace":""}]},{"name":"Trees","color":"Red","position":{"x":1048,"y":329},"modelclass":"Tree","column":[{"name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"name":"bear_id","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"name":"type","type":"string","length":"100","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"bear","relatedmodel":"Bears","relationtype":"belongsTo","usenamespace":""}]},{"name":"Picnics","color":"Red","position":{"x":130,"y":614},"modelclass":"Picnic","column":[{"name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"name":"name","type":"string","length":"100","order":1,"defaultvalue":"","enumvalue":""},{"name":"taste_level","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"picnic_id, bear_id","name":"bears","relatedmodel":"Bears","relationtype":"belongsToMany","usenamespace":""}]},{"name":"bears_picnics","color":"Red","position":{"x":402,"y":618},"modelclass":"bear_to_picnic","column":[{"name":"id","type":"increments","length":"0","order":0,"defaultvalue":"","enumvalue":""},{"name":"bear_id","type":"integer","length":"0","order":1,"defaultvalue":"","enumvalue":""},{"name":"picnic_id","type":"integer","length":"0","order":2,"defaultvalue":"","enumvalue":""}],"relation":[]}];




var nodeCanvas = new NodeCanvas();


for (var data in node_data)
{
  AddNewNode(node_data[data]);
}


//console.log("wew");
//var testview = new DesignerApp.NodeModule.Views.NodeContainer({model : nodeContainer});
var testview = new DesignerApp.NodeModule.Views.NodeCanvas({
    collection: nodeCanvas
});

MyLayout = Backbone.Marionette.LayoutView.extend({
  template: "#layout-template",
  regions:
  {
    content : "#content"
  },
});

DesignerApp.mainContent.show(testview);

//var laytest = new MyLayout();

//DesignerApp.mainContent.show(laytest);
//laytest.content.show(testview);




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
    instance.doWhileSuspended(function() {
        // bind to connection/connectionDetached events, and update the list of connections on screen.
        instance.bind("connection", function(info, originalEvent) {
         
           // console.log(info);
        });

        instance.bind("connectionDetached", function(info, originalEvent) {
           // console.log(info);

        });

        instance.bind("beforeDrop", function(connection) {
          console.log(connection);
          return false ;
            if(connection.sourceId == connection.targetid)
            return false ;
            else
                        return true ;
        });
    });


});