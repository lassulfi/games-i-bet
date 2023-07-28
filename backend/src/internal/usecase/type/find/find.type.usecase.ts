import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import TypeID from "../../../domain/type/entity/type.id";
import TypeNotFoundError from "../../../domain/type/repository/type-repository.error";
import TypeRepositoryInterface from "../../../domain/type/repository/type-repository.interface";
import { InputFindTypeDto, OutputFindTypeDto } from "./find.type.dto";

export default class FindTypeUseCase {
    private _typeRepository: TypeRepositoryInterface;

    constructor(typeRepository: TypeRepositoryInterface) {
        this._typeRepository = typeRepository;
    }

    async execute(input: InputFindTypeDto): Promise<OutputFindTypeDto> {
        let output: OutputFindTypeDto;

        const { id } = input;

        try {
            const type = await this._typeRepository.findById(TypeID.from(id));

            output = {
                id: type.id.getValue(),
                name: type.name,
                isActive: type.isActive
            }
        } catch (error) {
            if (error instanceof TypeNotFoundError) {
                throw new NotFoundError(`Type ID '${id}' not found`, 404, "type");
            }

            throw new DatabaseGenericError(`Error while retrieving type ID ${id}`, 500);
        }

        return output;
    }
}