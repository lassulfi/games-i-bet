import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import ConsoleID from "../../../domain/console/entity/console.id";
import { ConsoleNotFoundError } from "../../../domain/console/repository/console-repository.error";
import { InputFindConsoleDto } from "./find.console.dto";
import FindConsoleUseCase from "./find.console.usecase";

let input: InputFindConsoleDto;

const MockConsole = () => ({
    id: ConsoleID.from("1234"),
    name: "some console",
    isActive: true,
});

const MockRepository = () => ({
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  });

beforeEach(() => {
    input = {
        id: "1234"
    }
});

describe("Find console unit tests", () => {
    it("should find console by id", async () => {
        const consoleRepository = MockRepository();
        const findConsoleUseCase = new FindConsoleUseCase(consoleRepository);

        const console = MockConsole();

        const findByIdSpy = jest.spyOn(consoleRepository, 'findById').mockReturnValue(console);

        const output = await findConsoleUseCase.execute(input);

        expect(output).toStrictEqual({
            id: console.id.getValue(),
            name: console.name,
            isActive: console.isActive
        });
        expect(findByIdSpy).toHaveBeenCalledWith(console.id);
    });

    it("should not find console if id is invalid", async () => {
        const consoleRepository = MockRepository();
        const findConsoleUseCase = new FindConsoleUseCase(consoleRepository);

        input.id = "invalid-id";

        const findByIdSpy = jest.spyOn(consoleRepository, 'findById').mockRejectedValue(new ConsoleNotFoundError("Console ID 'invalid-id' not found"));

        await expect(findConsoleUseCase.execute(input)).rejects.toThrow(new NotFoundError(`Console ID '${input.id}' not found`, 404, 'console'));
        expect(findByIdSpy).toHaveBeenCalledWith(ConsoleID.from(input.id));
    });

    it("should throw error if repository throws unknown error",async () => {
        const consoleRepository = MockRepository();
        const findConsoleUseCase = new FindConsoleUseCase(consoleRepository);

        const findByIdSpy = jest.spyOn(consoleRepository, 'findById').mockRejectedValue(new Error("Database offline"));

        await expect(findConsoleUseCase.execute(input)).rejects.toThrow(new DatabaseGenericError(`Error while retrieving console ID ${input.id}`, 500));
        expect(findByIdSpy).toHaveBeenCalledWith(ConsoleID.from(input.id));
    });
});