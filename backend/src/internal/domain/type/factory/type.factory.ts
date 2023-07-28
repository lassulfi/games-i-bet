import Type from "../entity/type";
import TypeID from "../entity/type.id";

export default class TypeFactory {
    static create(name: string, isActive: boolean): Type {
        return Type.newType(TypeID.unique(), name, isActive);
    }
}