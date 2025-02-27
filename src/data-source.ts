import { DataSource } from 'typeorm';

const dbConfig: any = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'todoapp',
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: ['**/*.entity.ts'],
};

const AppDataSource = new DataSource(dbConfig);

export default AppDataSource;
