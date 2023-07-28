import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import { InputCreateGenreDto } from "./create.genre.dto";
import CreateGenreUseCase from "./create.genre.usecase";

let input: InputCreateGenreDto;

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

beforeEach(() => {
  input = {
    name: "some genre",
    isActive: true,
  };
});

describe("Create genre unit tests", () => {
  it("should create a genre", async () => {
    const genreRepository = MockRepository();
    const createGenreUseCase = new CreateGenreUseCase(genreRepository);

    const createSpy = jest.spyOn(genreRepository, "create");

    const output = await createGenreUseCase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
    });
    expect(createSpy).toBeCalled();
  });

  it("should throw error when name is invalid", async () => {
    const genreRepository = MockRepository();
    const createGenreUseCase = new CreateGenreUseCase(genreRepository);

    const createSpy = jest.spyOn(genreRepository, "create");

    input.name = "";

    await expect(createGenreUseCase.execute(input)).rejects.toThrow(
      new NotificationError([
        {
          message: "name must be at least 3 characters long",
          context: "genre",
        },
        {
          message: "name is required",
          context: "genre",
        },
      ])
    );
  });

  it("should throw error if genre repository throws unknown error", async () => {
    const genreRepository = MockRepository();
    const createGenreUseCase = new CreateGenreUseCase(genreRepository);

    const createSpy = jest
      .spyOn(genreRepository, "create")
      .mockRejectedValue(new Error("Database offline"));

    await expect(createGenreUseCase.execute(input)).rejects.toThrow(
      new DatabaseGenericError("Error while persisting data to database", 500)
    );
    expect(createSpy).toBeCalled();
  });
});
