import serverConfig from "../src/utils/config-validate";


const defaultConf: IConfig = { ...serverConfig, mail: "default@gmail.com" };
export default defaultConf;
