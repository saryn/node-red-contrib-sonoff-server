module.exports = function (RED) {
    function SonoffOn(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        node.on('input', function (msg) {
            msg.topic = config.device_id;
            msg.payload = sonoffServer.turnOnDevice(config.device_id);
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-on", SonoffOn);
}