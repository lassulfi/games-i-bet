import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import ConsoleID from "../../../domain/console/entity/console.id";
import { ConsoleNotFoundError } from "../../../domain/console/repository/console-repository.error";
import ConsoleRepositoryInterface from "../../../domain/console/repository/console-repository.interface";
import { InputFindConsoleDto, OutputFindConsoleDto } from "./find.console.dto";

export default class FindConsoleUseCase {

    private _consoleRepository: ConsoleRepositoryInterface;

    constructor(consoleRepository: ConsoleRepositoryInterface) {
        this._consoleRepository = consoleRepository;
    }

    async execute(input: InputFindConsoleDto): Promise<OutputFindConsoleDto> {
        let output: OutputFindConsoleDto;
        const { id } = input;

        try {

            const console = await this._consoleRepository.findById(ConsoleID.from(id));

            output = {
                id: console.id.getValue(),
                name: console.name,
                isActive: console.isActive
            }
            
        } catch (error) {
            if (error instanceof ConsoleNotFoundError) {
                throw new NotFoundError(`Console ID '${id}' not found`, 404, 'console');
            }

            throw new DatabaseGenericError(`Error while retrieving console ID ${id}`, 500)
        }

        return output;
    }

}