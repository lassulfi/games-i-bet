import Identifier from "../../@shared/entity/identifier";
import { v4 as uuid } from "uuid";

export default class ConsoleID extends Identifier {
    
    private _value: string;

    constructor(value: string) {
        super();
        this._value = value;
    }

    static unique(): ConsoleID {
        return this.from(uuid());
    }

    static from(anId: string): ConsoleID {
        return new ConsoleID(anId);
    }    
    public getValue() {
        return this._value;
    }

}