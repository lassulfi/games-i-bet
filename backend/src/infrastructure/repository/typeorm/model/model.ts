import Console from "../../../../internal/domain/console/entity/console";
import Game from "../../../../internal/domain/game/entity/game";
import Genre from "../../../../internal/domain/genre/entity/genre";
import Type from "../../../../internal/domain/type/entity/type";

export interface ConsoleModelInterface {
    id: string;
    name: string;
    isActive: boolean;
    games: GameModelInterface[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    toAggregate(): Console;
}

export interface GameModelInterface {
    id: string;
    name: string;
    console: ConsoleModelInterface;
    genre: GenreModelInterface;
    type: TypeModelInterface;
    finishedDate: Date;
    finishedTime: number;
    betCondition: string;
    rating: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    toAggregate(): Game
}

export interface GenreModelInterface {
    id: string;
    name: string;
    isActive: boolean;
    games: GameModelInterface[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    toAggregate(): Genre
}

export interface TypeModelInterface {
    id: string;
    name: string;
    isActive: boolean;
    games: GameModelInterface[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    toAggregate(): Type
}