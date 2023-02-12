
interface IServerConfig {
  db: IDb;
  port: number;
  serverEnvironment: string;
  isRelease: boolean;
  isStaging: boolean;
}

interface IDb {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
}
