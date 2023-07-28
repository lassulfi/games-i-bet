
import AggregateRoot from "../../@shared/entity/aggregate-root.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import Game from "../../game/entity/game";
import ConsoleValidatorFactory from "../factory/console.validator.factory";
import ConsoleID from "./console.id";

export default class Console extends AggregateRoot<ConsoleID> {

    private _name: string;
    private _isActive: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _deletedAt: Date | null;
    private _games: Game[]

    constructor(id: ConsoleID, name: string, isActive: boolean, createdAt: Date, updatedAt: Date, deletedAt: Date | null, games: Game[]) {
        super(id);
        this._name = name;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
        this._games = games;

        this.validate();
        this.notifyIfHasErrors();
    }

    static newConsole(id: ConsoleID, name: string, isActive: boolean): Console {
        const now = new Date();
        const deletedAt = isActive ? null : now;
        const games: Game[] = [];

        return new Console(id, name, isActive, now, now, deletedAt, games);
    }

    static with(id: ConsoleID, name: string, isActive: boolean, createdAt: Date, updatedAt: Date, deletedAt: Date | null, games: Game[]): Console {
        return new Console(id, name, isActive, createdAt, updatedAt, deletedAt, games);
    }

    changeName(anName: string): Console {
        this._name = anName;

        this.updateDate();

        this.validate();
        this.notifyIfHasErrors();

        return this;
    }

    deactivate(): Console {
        if (!this.deletedAt) {
            this._deletedAt = new Date();
        }

        this._isActive = false;

        this.updateDate();

        return this;
    }

    activate(): Console {
        this._deletedAt = null;
        this._isActive = true;

        this.updateDate();

        return this;
    }

    addGame(aGame: Game): Console {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot add game to inactive console',
                context: 'console'
            });
            this.notifyIfHasErrors();
        }

        this.games.push(aGame);

        this.updateDate();

        return this;
    }

    removeGame(aGame: Game): Console {
        if (!this._isActive) {
            this.notification.addError({
                message: 'cannot remove game from inactive console',
                context: 'console'
            });
            this.notifyIfHasErrors();
        }

        this._games = this._games.filter(game => game.id.getValue() != aGame.id.getValue());

        return this;
    }

    validate() {
        const validator = ConsoleValidatorFactory.create();
        validator.validate(this);
    }

    get name(): string {
        return this._name;
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

    get games(): Game[] {
        return this._games;
    }

    private updateDate(): void {
        this._updatedAt = new Date();
    }
}