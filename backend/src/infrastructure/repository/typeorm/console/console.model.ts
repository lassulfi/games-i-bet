import { Column, Entity, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import Console from "../../../../internal/domain/console/entity/console";
import ConsoleID from "../../../../internal/domain/console/entity/console.id";
import { GameModel, newGameModelFrom } from "../game/game.model";
import { ConsoleModelInterface, GameModelInterface } from "../model/model";

@Entity({
  name: "tb_console",
})
export class ConsoleModel implements ConsoleModelInterface {
  @PrimaryColumn({
    name: "id",
  })
  id: string;

  @Column({
    name: "name",
    length: 255,
  })
  name: string;

  @Column({
    name: "is_active",
  })
  isActive: boolean;

  @OneToMany(() => GameModel, (game) => game.console)
  games: GameModelInterface[];

  @Column({
    name: "created_at",
    type: "datetime",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "datetime",
  })
  updatedAt: Date;

  @Column({
    name: "deleted_at",
    type: "datetime",
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(
    id: string,
    name: string,
    isActive: boolean,
    games: GameModel[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.games = games;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toAggregate(): Console {
    const gamesAggregate = this.games ? this.games.map(game => game.toAggregate()) : [];

    return Console.with(
      ConsoleID.from(this.id),
      this.name,
      this.isActive,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      gamesAggregate,
    );
  }
}

export function newConsoleModelFrom(aConsole: Console): ConsoleModelInterface {
  const {id, name, isActive, games, createdAt, updatedAt, deletedAt} = aConsole;
  const gamesModel = games.map(game => newGameModelFrom(game));

  return new ConsoleModel(id.getValue(), name, isActive, gamesModel, createdAt, updatedAt, deletedAt);

}
