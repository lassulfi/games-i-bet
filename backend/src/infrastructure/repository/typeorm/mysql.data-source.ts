import { DataSource } from "typeorm";
import { GenreModel } from "./genre/genre.model";
import { TypeModel } from "./type/type.model";
import { ConsoleModel } from "./console/console.model";
import { GameModel } from "./game/game.model";

export let mySQLDataSource: DataSource;

export async function setupDb() {
  mySQLDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 13306,
    username: "admin",
    password: "root",
    database: "games",
    synchronize: true,
    entities: [ConsoleModel, GenreModel, TypeModel, GameModel],
    logging: true,
  });

  await mySQLDataSource.initialize();
}
