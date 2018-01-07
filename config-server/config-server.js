module.exports = function (RED) {
    function SonoffServer(config) {
        const node = this;
        RED.nodes.createNode(node, config);

        const util = require("util");

        const serverConfig = {
            server: {
                IP: config.serverIP,
                httpPort: parseInt(config.httpPort),
                httpsPort: parseInt(config.httpsPort),
                websocketPort: parseInt(config.websocketPort)
            },
            logger: {
                log: (message, ...params) => {
                    node.log(util.format(message, ...params));
                },
                warn: (message, ...params) => {
                    node.warn(util.format(message, ...params));
                },
                error: (message, ...params) => {
                    node.error(util.format(message, ...params));
                },
                trace: (message, ...params) => {
                    node.trace(util.format(message, ...params));
                },
                debug: (message, ...params) => {
                    node.debug(util.format(message, ...params));
                }
            }
        }

        node.sonoffServer = require("simple-sonoff-server").createServer(serverConfig);

        this.on('close', function (removed, done) {
            node.sonoffServer.close();
            done();
        });
    }
    RED.nodes.registerType("sonoff-server", SonoffServer);
}
