import Console from "../../console/entity/console";
import GameID from "./game.id";
import AggregateRoot from "../../@shared/entity/aggregate-root.abstract";
import GameValidatorFactory from "../factory/game.validator.factory";
import Genre from "../../genre/entity/genre";
import Type from "../../type/entity/type";

export default class Game extends AggregateRoot<GameID> {
  private _name: string;
  private _console!: Console;
  private _genre!: Genre;
  private _type!: Type;
  private _finishedDate: Date;
  private _finishedTime: number;
  private _betCondition: string;
  private _rating: number;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(
    id: GameID,
    name: string,
    finishedDate: Date,
    finishedTime: number,
    betCondition: string,
    rating: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    super(id);
    this._name = name;
    this._finishedDate = finishedDate;
    this._finishedTime = finishedTime;
    this._betCondition = betCondition;
    this._rating = rating;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._deletedAt = deletedAt;

    this.validate();
    this.notifyIfHasErrors();
  }

  static newGame(
    id: GameID,
    name: string,
    finishedDate: Date,
    finishedTime: number,
    betCondition: string,
    rating: number,
    isActive: boolean
  ): Game {
    const now = new Date();
    const deletedAt = isActive ? null : now;

    return new Game(
      id,
      name,
      finishedDate,
      finishedTime,
      betCondition,
      rating,
      isActive,
      now,
      now,
      deletedAt
    );
  }

  validate() {
    const validator = GameValidatorFactory.create();
    validator.validate(this);
  }

  changeName(name: string) {
    this._name = name;

    this.validate();
    this.notifyIfHasErrors();
  }

  changeConsole(console: Console): Game {
    this._console = console;

    return this;
  }

  changeType(type: Type): Game {
    this._type = type;

    return this;
  }

  changeGenre(genre: Genre): Game {
    this._genre = genre;

    return this;
  }

  changeFinishedDate(finishedDate: Date) {
    this._finishedDate = finishedDate;
    this.validate();

    this.notifyIfHasErrors();
  }

  changeFinishedTime(finishedTime: number) {
    this._finishedTime = finishedTime;

    this.validate();
    this.notifyIfHasErrors();
  }

  changeBetCondition(betCondition: string) {
    this._betCondition = betCondition;

    this.validate();
    this.notifyIfHasErrors();
  }

  changeRating(rating: number) {
    this._rating = rating;

    this.validate();
    this.notifyIfHasErrors();
  }

  activate(): Game {
    this._deletedAt = null;

    this._isActive = true;

    this.updateDate();

    return this;
  }

  deactivate(): Game {
    if (!this._deletedAt) {
      this._deletedAt = new Date();
    }

    this._isActive = false;

    this.updateDate();

    return this;
  }

  private updateDate() {
    this._updatedAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  get console(): Console {
    return this._console;
  }

  get genre(): Genre {
    return this._genre;
  }

  get type(): Type {
    return this._type;
  }

  get finishedDate(): Date {
    return this._finishedDate;
  }

  get finishedTime(): number {
    return this._finishedTime;
  }

  get betCondition(): string {
    return this._betCondition;
  }

  get rating(): number {
    return this._rating;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
