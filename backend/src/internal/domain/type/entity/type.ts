import AggregateRoot from "../../@shared/entity/aggregate-root.abstract";
import Game from "../../game/entity/game";
import TypeValidatorFactory from "../factory/type.validator.factory";
import TypeID from "./type.id";

export default class Type extends AggregateRoot<TypeID> {
    private _name: string;
    private _isActive: boolean;
    private _games: Game[];
    private _createdAt: Date;
    private _updatedAt: Date;
    private _deletedAt: Date | null;

    constructor(id: TypeID, name: string, isActive: boolean, games: Game[], createdAt: Date, updatedAt: Date, deletedAt: Date | null) {
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

    static newType(id: TypeID, name: string, isActive: boolean): Type {
        const now = new Date();
        const deletedAt = isActive ? null : now;
        const games: Game[] = []

        return new Type(id, name, isActive, games, now, now, deletedAt);
    }

    changeName(aName: string): Type {
        this._name = aName;
        
        this.validate();
        this.notifyIfHasErrors();

        this.updateDate();


        return this;
    }

    activate(): Type {
        this._deletedAt = null;

        this._isActive = true;

        this.updateDate();

        this.validate();
        this.notifyIfHasErrors();

        return this;
    }

    deactivate(): Type {
        if (!this._deletedAt) {
            this._deletedAt = new Date();
        }

        this._isActive = false;

        this.updateDate();

        this.validate();
        this.notifyIfHasErrors();

        return this;
    }

    addGame(aGame: Game): Type {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot add game to inactive type',
                context: 'type'
            });
            this.notifyIfHasErrors();
        }

        this._games.push(aGame);

        this.updateDate();

        return this;
    }

    removeGame(aGame: Game): Type {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot remove game from inactive type',
                context: 'type'
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
        const validator = TypeValidatorFactory.create();
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