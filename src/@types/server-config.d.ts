
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

interface IConfig extends IServerConfig {
  mail: string

}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};