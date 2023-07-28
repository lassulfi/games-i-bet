export default interface RepositoryInterface<T, ID> {
    create(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    findById(id: ID): Promise<T>;
    findAll(page?: any): Promise<T[]>;
}