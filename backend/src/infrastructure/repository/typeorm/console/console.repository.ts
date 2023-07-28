import { DataSource, Repository } from "typeorm";
import Console from "../../../../internal/domain/console/entity/console";
import ConsoleID from "../../../../internal/domain/console/entity/console.id";
import ConsoleRepositoryInterface from "../../../../internal/domain/console/repository/console-repository.interface";
import { ConsoleNotFoundError } from "../../../../internal/domain/console/repository/console-repository.error";
import { ConsoleModel, newConsoleModelFrom } from "./console.model";

export default class ConsoleRepository implements ConsoleRepositoryInterface {
    private _consoleRepository: Repository<ConsoleModel>;

    constructor(dataSource: DataSource) {
        this._consoleRepository = dataSource.getRepository(ConsoleModel);
    }

    async create(entity: Console): Promise<void> {        
        const model = newConsoleModelFrom(entity);

        await this._consoleRepository.save(model);
    }
    update(entity: Console): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findById(id: ConsoleID): Promise<Console> {

        const model = await this._consoleRepository.findOneBy({
            id: id.getValue()
        });

        if(!model) {
            throw new ConsoleNotFoundError(`Console ID '${id.getValue()}' not found`);
        }

        return model.toAggregate();

    }
    findAll(page?: any): Promise<Console[]> {
        throw new Error("Method not implemented.");
    }

}