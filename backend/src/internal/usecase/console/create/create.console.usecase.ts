import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import ConsoleFactory from "../../../domain/console/factory/console.factory";
import ConsoleRepositoryInterface from "../../../domain/console/repository/console-repository.interface";
import { InputCreateConsoleDto, OutputCreateConsoleDto } from "./create.console.dto";

export default class CreateConsoleUseCase {
    private _consoleRepository: ConsoleRepositoryInterface;

    constructor(consoleRepository: ConsoleRepositoryInterface) {
        this._consoleRepository = consoleRepository;
    }

    async execute(input: InputCreateConsoleDto): Promise<OutputCreateConsoleDto> {
        let output: OutputCreateConsoleDto;

        try {
            const { name, isActive } = input;
            const console = ConsoleFactory.create(name, isActive);

            await this._consoleRepository.create(console);

            output = {
                id: console.id.getValue()
            };
        } catch (error) {
            if (error instanceof NotificationError) {
                throw error;
            }
            
            throw new DatabaseGenericError("Error while persisting data to database", 500)
        }

        return output;
    }
}