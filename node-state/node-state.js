module.exports = function (RED) {
    function SonoffState(config) {
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.server = RED.nodes.getNode(config.server);
        const sonoffServer = node.server.sonoffServer;

        onDisconnect();

        sonoffServer.registerOnDeviceUpdatedListener(config.device_id, (deviceState) => {
            if (deviceState === "on" || deviceState === "off") {
                onConnect(deviceState);
            } else {
                onDisconnect();
            }
        });

        sonoffServer.registerOnDeviceConnectedListener(config.device_id, (deviceState) => {
            onConnect(deviceState);
        });

        sonoffServer.registerOnDeviceDisconnectedListener(config.device_id, (deviceState) => {
            onDisconnect();
        });

        function onConnect(deviceState) {
            node.status({ fill: "green", shape: "dot", text: "connected/" + deviceState });
            node.send({
                topic: config.device_id,
                payload: deviceState
            });
        }

        function onDisconnect() {
            node.status({ fill: "red", shape: "dot", text: "disconnected" });
            node.send({
                topic: config.device_id,
                payload: "disconnected"
            });
        }

        node.on('input', function (msg) {
            msg.topic = config.device_id;
            msg.payload = sonoffServer.getDeviceState(config.device_id);
            node.send(msg);
        });
    }
    RED.nodes.registerType("sonoff-state", SonoffState);
}