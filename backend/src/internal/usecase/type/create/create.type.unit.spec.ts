import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import { InputCreateTypeDto } from "./create.type.dto";
import CreateTypeUseCase from "./create.type.usecase";

let input: InputCreateTypeDto;

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

beforeEach(() => {
  input = {
    name: "some input",
    isActive: true
  };
});

describe("Create type use case tests", () => {
  it("should create a type", async () => {
    const typeRepository = MockRepository();
    const createTypeUseCase = new CreateTypeUseCase(typeRepository);

    const createSpy = jest.spyOn(typeRepository, "create");

    const output = await createTypeUseCase.execute(input);

    expect(output).toStrictEqual({
        id: expect.any(String)
    });
    expect(createSpy).toBeCalled();
  });

  it("should throw error when name is invalid", async () => {
    const typeRepository = MockRepository();
    const createTypeUseCase = new CreateTypeUseCase(typeRepository);

    input.name = "";

    await expect(createTypeUseCase.execute(input)).rejects.toThrow( new NotificationError([
        {
          message: "name must be at least 3 characters long",
          context: "type",
        },
        {
          message: "name is required",
          context: "type",
        },
      ]));
  });

  it("should throw error if type repository throws unknown error", async () => {
    const typeRepository = MockRepository();
    const createTypeUseCase = new CreateTypeUseCase(typeRepository);

    const createSpy = jest.spyOn(typeRepository, 'create').mockRejectedValue(new Error("Database is offline"));

    await expect(createTypeUseCase.execute(input)).rejects.toThrow(new DatabaseGenericError("Error while persisting data to database", 500));
    expect(createSpy).toBeCalled();
  });
});
