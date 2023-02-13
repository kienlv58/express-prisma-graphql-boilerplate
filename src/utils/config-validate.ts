import * as envalid from "envalid";

import dotenv from "dotenv";

dotenv.config();
const config = (): IServerConfig => {
    // eslint-disable-next-line no-useless-catch
    try {
        // console.log("process.env",process.env);
        const initialParsedEnv = envalid.cleanEnv(process.env, {
            ENVIRONMENT: envalid.str({
                choices: ["local", "development", "production"],
                default: "local",
            }),
        });

        const isRelease: boolean = initialParsedEnv.ENVIRONMENT === "production";
        const isStaging: boolean = initialParsedEnv.ENVIRONMENT === "development";

        const parsedEnv = envalid.cleanEnv(process.env, {
            PORT: envalid.port({
                default: 3000,
            }),
            DB_HOST: envalid.str(),
            DB_PORT: envalid.port(),
            DB_NAME: envalid.str(),
            DB_USER: envalid.str(),
            DB_PASSWORD: envalid.str(),
        });

        return {
            port: parsedEnv.PORT,
            serverEnvironment: initialParsedEnv.ENVIRONMENT,
            isRelease,
            isStaging,
            db: {
                host: parsedEnv.DB_HOST,
                name: parsedEnv.DB_NAME,
                user: parsedEnv.DB_USER,
                password: parsedEnv.DB_PASSWORD,
                port: parsedEnv.DB_PORT,
            },
        };
    } catch (error) {
        throw error;
    }
};

export default config();