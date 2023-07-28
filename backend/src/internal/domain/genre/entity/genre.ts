import AggregateRoot from "../../@shared/entity/aggregate-root.abstract";
import ValueObject from "../../@shared/value-objects/value-object.abstract";
import Game from "../../game/entity/game";
import GenreValidatorFactory from "../factory/genre.validator.factory";
import GenreID from "./genre.id";

export default class Genre extends AggregateRoot<GenreID> {
    private _name: string;
    private _isActive: boolean;
    private _games: Game[]
    private _createdAt: Date;
    private _updatedAt: Date;
    private _deletedAt: Date | null;

    constructor(id: GenreID, name: string, isActive: boolean, games: Game[], createdAt: Date, updatedAt: Date, deletedAt: Date | null) {
        super(id);
        this._name = name;
        this._isActive = isActive;
        this._games = games;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;

        this.validate();
        this.notifyIfHasErrors();
    }

    static newGenre(id: GenreID, name: string, isActive: boolean): Genre {
        const games: Game[] = [];
        const now = new Date();
        const deletedAt = isActive ? null : now;

        return new Genre(id, name, isActive, games, now, now, deletedAt);
    }

    changeName(aName: string): Genre {
        this._name = aName;

        this.updateDate();

        this.validate();

        return this;
    }

    activate(): Genre {
        this._deletedAt = null;
        
        this._isActive = true;

        this.updateDate();

        this.validate();

        return this;
    }

    deactivate(): Genre {
        if (!this._deletedAt) {
            this._deletedAt = new Date();
        }

        this._isActive = false;

        this.updateDate();

        return this;
    }

    addGame(aGame: Game): Genre {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot add game to inactive genre',
                context: 'genre'
            });
            this.notifyIfHasErrors();
        }

        this._games.push(aGame);

        this.updateDate();

        return this;
    }

    removeGame(aGame: Game): Genre {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot remove game from inactive genre',
                context: 'genre'
            });
            this.notifyIfHasErrors();
        }

        this._games = this._games.filter(game => game.id.getValue() != aGame.id.getValue());

        return this;
    }
 
    private updateDate() {
        this._updatedAt = new Date();
    }

    validate() {
        const validator = GenreValidatorFactory.create();
        validator.validate(this);
    }

    get name(): string {
        return this._name;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get games(): Game[] {
        return this._games;
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