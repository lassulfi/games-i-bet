import { PrimaryColumn, Column, Entity, OneToMany } from "typeorm";
import Type from "../../../../internal/domain/type/entity/type";
import TypeID from "../../../../internal/domain/type/entity/type.id";
import { GameModelInterface, TypeModelInterface } from "../model/model";
import { GameModel, newGameModelFrom } from "../game/game.model";

@Entity({
    name: "tb_type"
})
export class TypeModel implements TypeModelInterface {
  
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

  toAggregate(): Type {
    const gamesAggregate = this.games ? this.games.map(game => game.toAggregate()) : [];

    return new Type(TypeID.from(this.id), this.name, this.isActive, gamesAggregate, this.createdAt, this.updatedAt, this.deletedAt);
  }
}

export function newTypeModelFrom(aType: Type): TypeModelInterface {
    const {id, name, isActive, games, createdAt, updatedAt, deletedAt} = aType;
    const gamesModel = games.map(game => newGameModelFrom(game));
    return new TypeModel(id.getValue(), name, isActive, gamesModel, createdAt, updatedAt, deletedAt);
}
