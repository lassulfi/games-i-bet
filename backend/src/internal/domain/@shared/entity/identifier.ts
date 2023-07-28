import ValueObject from "../value-objects/value-object.abstract";

export default abstract class Identifier extends ValueObject {
    protected abstract getValue(): any; 
}