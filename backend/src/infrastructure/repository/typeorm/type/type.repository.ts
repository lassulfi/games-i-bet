import { DataSource, Repository } from "typeorm";
import Type from "../../../../internal/domain/type/entity/type";
import TypeID from "../../../../internal/domain/type/entity/type.id";
import TypeRepositoryInterface from "../../../../internal/domain/type/repository/type-repository.interface";
import  {TypeModel, newTypeModelFrom } from "./type.model";
import TypeNotFoundError from "../../../../internal/domain/type/repository/type-repository.error";

export default class TypeRepository implements TypeRepositoryInterface {
    private _typeRepository: Repository<TypeModel>;

    constructor(dataSource: DataSource) {
        this._typeRepository = dataSource.getRepository(TypeModel);
    }

    async create(entity: Type): Promise<void> {
        const actualModel = newTypeModelFrom(entity);

        await this._typeRepository.save(actualModel);

    }
    update(entity: Type): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    async findById(id: TypeID): Promise<Type> {
        const actualModel = await this._typeRepository.findOneBy({
            id: id.getValue()
        });

        if(!actualModel) {
            throw new TypeNotFoundError(`Type ID '${id.getValue()}' not found`)
        }

        return actualModel.toAggregate();
    }

    findAll(page?: any): Promise<Type[]> {
        throw new Error("Method not implemented.");
    }

}