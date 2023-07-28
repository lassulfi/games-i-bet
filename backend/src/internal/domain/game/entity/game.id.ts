import Identifier from "../../@shared/entity/identifier";
import { v4 as uuid } from "uuid";

export default class GameID extends Identifier {
    private _value: string

    constructor(value: string) {
        super();
        this._value = value;
    }

    static unique(): GameID {
        return this.from(uuid());
    }

    static from(anId: string): GameID {
        return new GameID(anId);
    }

    public getValue() {
        return this._value;
    }

}