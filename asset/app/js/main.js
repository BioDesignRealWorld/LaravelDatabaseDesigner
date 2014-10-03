var node_data = [{"name":"Users","color":"","position":{"x":121,"y":71},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c6","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c7","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c9","name":"password","type":"string","length":100,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c8","name":"email","type":"string","length":200,"order":3,"defaultvalue":"","enumvalue":""},{"colid":"c770","name":"message","type":"string","length":"100","order":4,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Roles","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Map","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"user_id","name":"machines","relatedmodel":"Roles","relationtype":"hasMany","usenamespace":""},{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Roles","relationtype":"hasOne","usenamespace":""}],"seeding":[[{"colid":"c6","content":"1"},{"colid":"c7","content":"johndoe"},{"colid":"c9","content":"pass123"},{"colid":"c8","content":"hack@a.com"},{"colid":"c770","content":"bogus"}],[{"colid":"c6","content":"2"},{"colid":"c7","content":"hacker01"},{"colid":"c9","content":"pass456"},{"colid":"c8","content":"bgus@bags.com"},{"colid":"c770","content":"yes"}],[{"colid":"c6","content":"3"},{"colid":"c7","content":"hoaxman"},{"colid":"c9","content":"pass789"},{"colid":"c8","content":"drop@me.com"},{"colid":"c770","content":"no"}],[{"colid":"c6","content":"4"},{"colid":"c7","content":"badgeek"},{"colid":"c9","content":"slalom123"},{"colid":"c8","content":"iyok@deadmediafm.org"},{"colid":"c770","content":"ok"}]]},{"name":"Roles","color":"","position":{"x":1087,"y":59},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c45","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c46","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c47","name":"email","type":"string","length":200,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c48","name":"password","type":"string","length":100,"order":3,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Map","relationtype":"hasOne","usenamespace":""}],"seeding":[]},{"name":"Map","color":"","position":{"x":162,"y":480},"increment":"","timestamp":"","softdelete":"","column":[{"colid":"c66","name":"id","type":"increments","length":30,"order":0,"defaultvalue":"","enumvalue":""},{"colid":"c67","name":"username","type":"string","length":30,"order":1,"defaultvalue":"","enumvalue":""},{"colid":"c68","name":"email","type":"string","length":200,"order":2,"defaultvalue":"","enumvalue":""},{"colid":"c69","name":"password","type":"string","length":100,"order":3,"defaultvalue":"","enumvalue":""}],"relation":[{"extramethods":"","foreignkeys":"","name":"","relatedmodel":"Users","relationtype":"hasOne","usenamespace":""}],"seeding":[]}];
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
            //console.log(relation);

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