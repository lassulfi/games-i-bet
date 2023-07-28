import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import TypeFactory from "../../../domain/type/factory/type.factory";
import TypeRepositoryInterface from "../../../domain/type/repository/type-repository.interface";
import { InputCreateTypeDto, OutputCreateTypeDto } from "./create.type.dto";

export default class CreateTypeUseCase {
    private _typeRepository: TypeRepositoryInterface;

    constructor(typeRepository: TypeRepositoryInterface) {
        this._typeRepository = typeRepository;
    }

    async execute(input: InputCreateTypeDto): Promise<OutputCreateTypeDto> {
        let output: OutputCreateTypeDto;

        try {
            const { name, isActive } = input;

            const type = TypeFactory.create(name, isActive);

            await this._typeRepository.create(type);

            output = {
                id: type.id.getValue()
            }
        } catch (error) {
            if (error instanceof NotificationError) {
                throw error;
            }

            throw new DatabaseGenericError("Error while persisting data to database", 500)
        }

        return output;
    }
}