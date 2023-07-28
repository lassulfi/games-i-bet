import Identifier from "../../@shared/entity/identifier";
import { v4 as uuid } from 'uuid';

export default class TypeID extends Identifier {
    private _value: string

    constructor(value: string) {
        super();
        this._value = value;
    }

    static unique(): TypeID {
        return this.from(uuid());
    }

    static from(anId: string): TypeID {
        return new TypeID(anId);
    }
    
    public getValue() {
        return this._value;
    }
}