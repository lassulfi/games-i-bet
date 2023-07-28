import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Game from "../../../../internal/domain/game/entity/game";
import GameID from "../../../../internal/domain/game/entity/game.id";
import  {GenreModel,newGenreModelFrom } from "../genre/genre.model";
import {TypeModel, newTypeModelFrom } from "../type/type.model";
import { ConsoleModel, newConsoleModelFrom } from "../console/console.model";
import { ConsoleModelInterface, GameModelInterface, GenreModelInterface, TypeModelInterface } from "../model/model";

@Entity({
    name: "tb_game"
})
export class GameModel implements GameModelInterface {
  
  @PrimaryColumn()
  id: string;

  @Column({
    length: 255,
  })
  name: string;

  @ManyToOne(() => ConsoleModel, (console) => console.games)
  console: ConsoleModelInterface;

  @ManyToOne(() => GenreModel, (genre) => genre.games)
  genre: GenreModelInterface;

  @ManyToOne(() => TypeModel, (type) => type.games)
  type: TypeModelInterface;

  @Column({
    name: "finished_date",
    type: "datetime",
  })
  finishedDate: Date;

  @Column({
    name: "finished_time",
  })
  finishedTime: number;

  @Column({
    name: "bet_condition",
    length: 500,
  })
  betCondition: string;

  @Column()
  rating: number;

  @Column({
    name: "is_active",
  })
  isActive: boolean;

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
    nullable: true
  })
  deletedAt: Date | null;

  constructor(id: string, name: string, console: ConsoleModelInterface, genre: GenreModelInterface, type: TypeModelInterface, finishedDate: Date, finishedTime: number, betCondition: string, rating: number, isActive: boolean, createdAt: Date, updatedAt: Date, deletedAt: Date | null) {
    this.id = id;
    this.name = name;
    this.console = console;
    this.genre = genre;
    this.type = type;
    this.finishedDate = finishedDate;
    this.finishedTime = finishedTime;
    this.betCondition = betCondition;
    this.rating = rating;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toAggregate(): Game {
    const game = new Game(GameID.from(this.id), this.name, this.finishedDate, this.finishedTime, this.betCondition, this.rating, this.isActive, this.createdAt, this.updatedAt, this.deletedAt);
    game.changeConsole(this.console.toAggregate());
    game.changeGenre(this.genre.toAggregate());
    game.changeType(this.type.toAggregate());

    return game;
  }
}

export function newGameModelFrom(aGame: Game): GameModelInterface {
    const {id, name, console, genre, type, finishedDate, finishedTime, betCondition, rating, isActive, createdAt, updatedAt, deletedAt} = aGame;
    return new GameModel(id.getValue(), name, newConsoleModelFrom(console), newGenreModelFrom(genre), newTypeModelFrom(type), finishedDate, finishedTime, betCondition, rating, isActive, createdAt, updatedAt, deletedAt);
}
