import { DataSource } from "typeorm";
import { TypeModel } from "../typeorm/type/type.model";
import { ConsoleModel } from "../typeorm/console/console.model";
import { GameModel } from "../typeorm/game/game.model";
import { GenreModel } from "../typeorm/genre/genre.model";

export let sqliteDataSource: DataSource;

export async function setupSqliteDb() {
  sqliteDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [ConsoleModel, GameModel, GenreModel, TypeModel],
    synchronize: true,
    logging: false,
  });

  await sqliteDataSource.initialize();
}
