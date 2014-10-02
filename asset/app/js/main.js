var node_data = [{"name":"Users","color":"","position":{"x":87,"y":59},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c6","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c7","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c9","name":"password","type":"string","length":100,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c8","name":"email","type":"string","length":200,"order":3,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Roles","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Map","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Roles","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Roles","relationtype":"hasOne","usenamespace":""}],"seeding":[[{"colid":"c6","content":"id"},{"colid":"c7","content":"user"},{"colid":"c9","content":"pass"},{"colid":"c8","content":"email"}],[{"colid":"c6","content":"id"},{"colid":"c7","content":"user"},{"colid":"c9","content":"pass"},{"colid":"c8","content":"email"}],[{"colid":"c6","content":"id"},{"colid":"c7","content":"user"},{"colid":"c9","content":"pass"},{"colid":"c8","content":"email"}]]},{"name":"Roles","color":"","position":{"x":1092,"y":80},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c45","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c46","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c47","name":"email","type":"string","length":200,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c48","name":"password","type":"string","length":100,"order":3,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Map","relationtype":"hasOne","usenamespace":""}],"seeding":[]},{"name":"Map","color":"","position":{"x":143,"y":582},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c66","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c67","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c68","name":"email","type":"string","length":200,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c69","name":"password","type":"string","length":100,"order":3,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Users","relationtype":"hasOne","usenamespace":""}],"seeding":[]}];

jsPlumb.ready(function() {

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
            //console.log(info.connection.getParameters());
        });

        instance.bind("connectionDetached", function(info, originalEvent) {
            //todo: refactor
            //console.log(info.connection.getParameter("relation"))
            var relation = info.connection.getParameter("relation");
            console.log(relation);

            if (relation) {
              //  console.log(info);
                relation.set("conn", "");
                relation.destroy();
            }


            //return false;
            //console.log(info.connection.getParameter("view").model);
            //info.connection.getParameter("view").model.destroy();
        });

        instance.bind("beforeDrop", function(connection) {

            if (connection.sourceId !== connection.targetId) {
                var node = connection.connection.getParameter("node");
                DesignerApp.execute("nodecanvas:create:relation", node, connection.targetId);
            }

            //console.log(getNodeContainerFromNodeCid(connection.sourceId));
            //console.log(getNodeContainerFromNodeCid(connection.targetId));

            return false;
        });
    });
    DesignerApp.execute("draw:relation:model");
});