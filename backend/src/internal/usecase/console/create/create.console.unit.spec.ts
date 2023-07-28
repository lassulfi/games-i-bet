import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import { InputCreateConsoleDto } from "./create.console.dto";
import CreateConsoleUseCase from "./create.console.usecase";

let input: InputCreateConsoleDto;

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

beforeEach(() => {
  input = {
    name: "some console",
    isActive: true
  };
});

describe("Create console unit tests", () => {
  it("should create console", async () => {
    const consoleRepository = MockRepository();
    const createConsoleUseCase = new CreateConsoleUseCase(consoleRepository);

    const createSpy = jest.spyOn(consoleRepository, "create");

    const output = await createConsoleUseCase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String)
    });
    expect(createSpy).toBeCalled();
  });

  it("should throw error when name is invalid", async () => {
    const consoleRepository = MockRepository();
    const createConsoleUseCase = new CreateConsoleUseCase(consoleRepository);

    input.name = "";

    await expect(createConsoleUseCase.execute(input)).rejects.toThrow(
      new NotificationError([
        {
          message: "name must be at least 3 characters long",
          context: "console",
        },
        {
          message: "name is required",
          context: "console",
        },
      ])
    );
  });

  it("should throw error if genre repository throws unknown error", async () => {
    const consoleRepository = MockRepository();
    const createConsoleUseCase = new CreateConsoleUseCase(consoleRepository);

    const createSpy = jest
      .spyOn(consoleRepository, "create")
      .mockRejectedValue(new Error("Database offline"));

    await expect(createConsoleUseCase.execute(input)).rejects.toThrow(
      new DatabaseGenericError("Error while persisting data to database", 500)
    );
    expect(createSpy).toBeCalled();
  });
});
