import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import GenreID from "../../../domain/genre/entity/genre.id";
import { GenreNotFoundError } from "../../../domain/genre/repository/genre-repository.error";
import { InputFindGenreDto } from "./find.genre.dto";
import FindGenreUseCase from "./find.genre.usecase";

let input: InputFindGenreDto;

const MockGenre = () => ({
    id: GenreID.from("1234"),
    name: "some genre",
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
    id: "1234",
  };
});

describe("Find genre unit tests", () => {
  it("should find genre by id", async () => {
    const genreRepository = MockRepository();
    const findGenreUseCase = new FindGenreUseCase(genreRepository);

    const genre = MockGenre();

    const findByIdSpy = jest.spyOn(genreRepository, 'findById').mockReturnValue(genre);

    const output = await findGenreUseCase.execute(input);

    expect(output).toStrictEqual({
        id: "1234",
        name: "some genre",
        isActive: true
    });
    expect(findByIdSpy).toBeCalledWith(GenreID.from(input.id));
  });

  it("should not find genre if id is invalid", async () => {
    const genreRepository = MockRepository();
    const findGenreUseCase = new FindGenreUseCase(genreRepository);

    input.id = "invalid-id";

    const findByIdSpy = jest.spyOn(genreRepository, 'findById').mockRejectedValue(new GenreNotFoundError("Genre ID 'invalid-id' not found"));

    await expect(findGenreUseCase.execute(input)).rejects.toThrow(new NotFoundError("Genre ID 'invalid-id' not found", 404, "genre"));
    expect(findByIdSpy).toBeCalledWith(GenreID.from(input.id));
  });

  it("should throw error if repository throws unknown error",async () => {
    const genreRepository = MockRepository();
    const findGenreUseCase = new FindGenreUseCase(genreRepository);

    const findByIdSpy = jest.spyOn(genreRepository, 'findById').mockRejectedValue(new Error("Database offline"));

    await expect(findGenreUseCase.execute(input)).rejects.toThrow(new DatabaseGenericError(`Error while retrieving genre ID ${input.id}`, 500));
    expect(findByIdSpy).toBeCalledWith(GenreID.from(input.id));
  });
});
