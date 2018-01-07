module.exports = function (RED) {
    function SonoffList(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        node.on('input', function (msg) {
            msg.payload = sonoffServer.getConnectedDevices();
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-list", SonoffList);
}