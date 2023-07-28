import Identifier from "../../@shared/entity/identifier";
import { v4 as uuid } from 'uuid';

export default class GenreID extends Identifier {
    private _value: string;

    constructor(value: string) {
        super();
        this._value = value;
    }

    static unique(): GenreID {
        return this.from(uuid());
    }

    static from(anId: string): GenreID {
        return new GenreID(anId);
    }

    public getValue() {
        return this._value;
    }
}