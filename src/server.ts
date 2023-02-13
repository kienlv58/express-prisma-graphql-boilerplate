import "reflect-metadata";

import serverConfig from "./utils/config-validate";
import app from "./app";

import config from "config";
const dbConf = config.get("db");
const mail = config.get("mail");
console.log("dbConf",dbConf,mail);

const TAG = "server ====> ";

const PORT = serverConfig.port;

const bootstrap = async () => {
    /* Server startup */
    const serverApp = await app();
    const server = serverApp.listen(PORT, async () => {
    // tslint:disable-next-line: no-console
        console.log("\n");
        // tslint:disable-next-line: no-console
        console.log(
            TAG + "App  is running in %s mode at http://localhost:%d",
            serverConfig.serverEnvironment,
            PORT,
        );

        // return connectDatabase().catch((error) => {
        //     console.error("Couldn't connect to the database!");
        //     console.error(error);
        // });
    });

    const gracefulShutdown = async (callType: any) => {
        console.error(TAG + `${callType} signal received.`);

        // Stops the server from accepting new connections and finishes existing connections.
        server.close(function(err: any) {
            if (err) {
                console.error(TAG, "server error", err);
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    };

    process.on("SIGINT", async () => gracefulShutdown("SIGINT"));

    process.on("SIGINT", async () => gracefulShutdown("SIGINT"));
    return server;
};

export default bootstrap();