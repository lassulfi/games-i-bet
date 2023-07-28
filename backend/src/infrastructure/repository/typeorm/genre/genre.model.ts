import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import Genre from "../../../../internal/domain/genre/entity/genre";
import GenreID from "../../../../internal/domain/genre/entity/genre.id";
import { GameModelInterface, GenreModelInterface } from "../model/model";
import { GameModel, newGameModelFrom } from "../game/game.model";

@Entity({
  name: "tb_genre",
})
export class GenreModel implements GenreModelInterface {
  @PrimaryColumn()
  id: string;

  @Column({
    length: 255,
  })
  name: string;

  @Column({
    name: "is_active",
  })
  isActive: boolean;

  @OneToMany(() => GameModel, (game) => game.console)
  games: GameModelInterface[]

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

  constructor(id: string, name: string, isActive: boolean, games: GameModelInterface[], createdAt: Date, updatedAt: Date, deletedAt: Date | null) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.games = games;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  toAggregate(): Genre {
    const gamesAggregate = this.games ? this.games.map(game => game.toAggregate()) : [];

    return new Genre(GenreID.from(this.id), this.name, this.isActive, gamesAggregate, this.createdAt, this.updatedAt, this.deletedAt);
  }
}

export function newGenreModelFrom(aGenre: Genre): GenreModelInterface {
  const {id, name, isActive, games, createdAt, updatedAt, deletedAt} = aGenre;
  const gamesModel = games.map(game => newGameModelFrom(game));
    return new GenreModel(id.getValue(), name, isActive, gamesModel, createdAt, updatedAt, deletedAt);
}
