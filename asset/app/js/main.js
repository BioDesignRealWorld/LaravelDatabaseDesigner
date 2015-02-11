
var GITHUB_CLIENT_ID = '25bbf727cf799dcb1081';
var OAUTH_PROXY_URL = 'https://auth-server.herokuapp.com/proxy';

var authenticated = false;
var gistloaded = false;
var gistloadedid = "";
var gistfilename = "";

var node_data = [{"name":"BlogUsers","color":"Red","position":{"x":93,"y":126},"classname":"BlogUser","namespace":"","increment":false,"timestamp":true,"softdelete":false,"column":[{"name":"id","type":"increments","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c87","order":0},{"name":"username","type":"string","length":"","defaultvalue":"bogus","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c185","order":1},{"name":"password","type":"string","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c193","order":2},{"name":"profile","type":"text","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c201","order":3}],"relation":[{"extramethods":"","foreignkeys":"","name":"postsz","relatedmodel":"Post","relationtype":"hasMany","usenamespace":""}],"seeding":[[{"colid":"c87","content":"0"},{"colid":"c185","content":"badgeek"},{"colid":"c193","content":"test123"},{"colid":"c201","content":"profile 0"}],[{"colid":"c87","content":"1"},{"colid":"c185","content":"hello"},{"colid":"c193","content":"test123"},{"colid":"c201","content":"profile 1"}],[{"colid":"c87","content":"2"},{"colid":"c185","content":"void"},{"colid":"c193","content":"test123"},{"colid":"c201","content":"profile 2"}],[{"colid":"c87","content":"3"},{"colid":"c185","content":"john"},{"colid":"c193","content":"john123"},{"colid":"c201","content":"profile 3"}]]},{"name":"Posts","color":"Green","position":{"x":660,"y":231},"classname":"Post","namespace":"","increment":false,"timestamp":false,"softdelete":false,"column":[{"name":"id","type":"increments","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c95","order":0},{"name":"title","type":"string","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c218","order":1},{"name":"content","type":"text","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c226","order":2}],"relation":[{"extramethods":"","foreignkeys":"","name":"Categories","relatedmodel":"Category","relationtype":"hasMany","usenamespace":""}],"seeding":[]},{"name":"Categories","color":"Blue","position":{"x":89,"y":349},"classname":"Category","namespace":"","increment":false,"timestamp":false,"softdelete":false,"column":[{"name":"id","type":"increments","length":"","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c111","order":0},{"name":"name","type":"string","length":"100","defaultvalue":"","enumvalue":"","ai":false,"pk":false,"nu":false,"ui":false,"in":false,"un":false,"fillable":false,"guarded":false,"visible":false,"hidden":false,"colid":"c70","order":1}],"relation":[],"seeding":[]}];

hello.init({
    'github': GITHUB_CLIENT_ID
}, {
    oauth_proxy: OAUTH_PROXY_URL
});

hello.services.github.post = hello.services.github.post || {};
hello.services.github.post['default'] = function(p, callback) {
    p.data = JSON.stringify(p.data);
    p.headers = {
        'content-type': 'application/x-www-form-urlencoded'
    };
    callback(p.path);
};


hello.services.github.patch = hello.services.github.patch || {};
hello.services.github.patch['default'] = function(p, callback) {
    p.data = JSON.stringify(p.data);
    p.headers = {
        'content-type': 'application/x-www-form-urlencoded'
    };
    callback(p.path);
};


hello.on('auth.login', function(r) {
    authenticated = true;
});


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
            console.log(connection);
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