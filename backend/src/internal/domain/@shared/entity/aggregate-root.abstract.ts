import Entity from "./entity.abstract";
import Identifier from "./identifier";

export default abstract class AggregateRoot<ID extends Identifier> extends Entity<ID> {
    
    constructor(id: ID) {
        super(id);
    }
}