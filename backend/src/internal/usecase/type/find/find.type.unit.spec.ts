import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import TypeID from "../../../domain/type/entity/type.id";
import TypeNotFoundError from "../../../domain/type/repository/type-repository.error";
import { InputFindTypeDto } from "./find.type.dto";
import FindTypeUseCase from "./find.type.usecase";

let input: InputFindTypeDto;

const MockType = () => ({
  id: TypeID.from("123"),
  name: "some type",
  isActive: true
});

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

beforeEach(() => {
    input = {
        id: "123"
    }
});

describe("Find type use case unit tests", () => {
  it("should find type by id", async () => {
    const typeRepository = MockRepository();
    const findTypeUseCase = new FindTypeUseCase(typeRepository);

    const type = MockType();

    const findByIdSpy = jest.spyOn(typeRepository, "findById").mockReturnValue(type);

    const output = await findTypeUseCase.execute(input);
    expect(output).toStrictEqual({
        id: type.id.getValue(),
        name: type.name,
        isActive: type.isActive
    });
    expect(findByIdSpy).toBeCalledWith(TypeID.from(input.id));
  });

  it("should not find type if id is invalid", async () => {
    const typeRepository = MockRepository();
    const findTypeUseCase = new FindTypeUseCase(typeRepository);

    input.id = "invalid-id";

    const findByIdSpy = jest.spyOn(typeRepository, "findById").mockRejectedValue(new TypeNotFoundError(`Type ID ${input.id} not found`));

    await expect(findTypeUseCase.execute(input)).rejects.toThrow(new NotFoundError(`Type ID '${input.id}' not found`, 404, "type"));
    expect(findByIdSpy).toBeCalledWith(TypeID.from(input.id));
  })

  it("should throw error if repository throws unknown error", async () => {
    const typeRepository = MockRepository();
    const findTypeUseCase = new FindTypeUseCase(typeRepository);

    const findByIdSpy = jest.spyOn(typeRepository, "findById").mockRejectedValue(new Error("Database offline"));

    await expect(findTypeUseCase.execute(input)).rejects.toThrow(new DatabaseGenericError(`Error while retrieving type ID ${input.id}`, 500));
    expect(findByIdSpy).toBeCalledWith(TypeID.from(input.id))
  })
});
