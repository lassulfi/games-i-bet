import { ConstraintValidationError, DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import Console from "../../../domain/console/entity/console";
import ConsoleID from "../../../domain/console/entity/console.id";
import ConsoleRepositoryInterface from "../../../domain/console/repository/console-repository.interface";
import GameRepositoryInterface from "../../../domain/game/repository/game-repository.interface";
import Genre from "../../../domain/genre/entity/genre";
import GenreID from "../../../domain/genre/entity/genre.id";
import GenreRepositoryInterface from "../../../domain/genre/repository/genre-repository.interface";
import Type from "../../../domain/type/entity/type";
import TypeID from "../../../domain/type/entity/type.id";
import TypeRepositoryInterface from "../../../domain/type/repository/type-repository.interface";
import { InputCreateGameDto } from "./create.game.dto";
import CreateGameUseCase from "./create.game.usecase";

let input: InputCreateGameDto;
let gameRepository: GameRepositoryInterface;
let consoleRepository: ConsoleRepositoryInterface;
let typeRepository: TypeRepositoryInterface;
let genreRepository: GenreRepositoryInterface;

const consoleMock = () => {
  return Console.newConsole(ConsoleID.from("123"), "some console", true);
}

const genreMock = () => {
  return Genre.newGenre(GenreID.from("123"), "some genre", true);
}

const typeMock = () => {
  return Type.newType(TypeID.from("123"), "some type", true);
}

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
});

beforeEach(() => {
  input = {
    name: "some game",
    consoleId: "123",
    genreId: "123",
    typeId: "123",
    finishedDate: new Date(),
    finishedTime: 999,
    betCondition: "some bet condition",
    rating: 7,
    isActive: true
  };

  gameRepository = MockRepository();
  consoleRepository = MockRepository();
  typeRepository = MockRepository();
  genreRepository = MockRepository();
});

describe("Unit tests for create game use case", () => {
  describe("success flow", () => {
    it("should create game with success", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      const createSpy = jest.spyOn(gameRepository, "create");
      const findByIdConsoleSpy = jest.spyOn(consoleRepository, 'findById').mockResolvedValue(consoleMock());
      const findByIdGenreSpy = jest.spyOn(genreRepository, 'findById').mockResolvedValue(genreMock());
      const findByIdTypeSpy = jest.spyOn(typeRepository, 'findById').mockResolvedValue(typeMock());

      const output = await createGameUseCase.execute(input);

      expect(output).toBeDefined();
      expect(output.id).toStrictEqual(expect.any(String));
      expect(createSpy).toHaveBeenCalled();
      expect(findByIdConsoleSpy).toBeCalledWith(ConsoleID.from("123"));
      expect(findByIdGenreSpy).toBeCalledWith(GenreID.from("123"));
      expect(findByIdTypeSpy).toBeCalledWith(TypeID.from("123"));
    });
  });

  describe("validation errors", () => {
    it("should throw error if name is invalid", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.name = "";

      expect(createGameUseCase.execute(input)).rejects.toThrow(
        new NotificationError([
          {
            message: "name must be at least 3 characters long",
            context: "game",
          },
          {
            message: "name is required",
            context: "game",
          },
        ])
      );
    });

    it("should throw constraint validator error if console is not found", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.consoleId = "invalid-id";

      const findByIdConsoleSpy = jest.spyOn(consoleRepository, 'findById').mockRejectedValue(new NotFoundError(`Console ID '${input.consoleId}' not found`, 404, 'console'));
      const findByIdGenreSpy = jest.spyOn(genreRepository, 'findById').mockResolvedValue(genreMock());
      const findByIdTypeSpy = jest.spyOn(typeRepository, 'findById').mockResolvedValue(typeMock());

      await expect(createGameUseCase.execute(input)).rejects.toThrow(
        new ConstraintValidationError("Error while creating game", 422, "game", [`Console ID '${input.consoleId}' not found`])
      );
      expect(findByIdConsoleSpy).toBeCalledWith(ConsoleID.from(input.consoleId));
      expect(findByIdGenreSpy).toBeCalledWith(GenreID.from(input.genreId));
      expect(findByIdTypeSpy).toBeCalledWith(TypeID.from(input.typeId));
    });

    it("should throw constraint validator error if genre is not found", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.genreId = "invalid-id";

      const findByIdConsoleSpy = jest.spyOn(consoleRepository, 'findById').mockResolvedValue(consoleMock());
      const findByIdGenreSpy = jest.spyOn(genreRepository, 'findById').mockRejectedValue(new NotFoundError(`Genre ID '${input.genreId}' not found`, 404, 'genre'))
      const findByIdTypeSpy = jest.spyOn(typeRepository, 'findById').mockResolvedValue(typeMock());

      await expect(createGameUseCase.execute(input)).rejects.toThrow(
        new ConstraintValidationError("Error while creating game", 422, "game", [`Genre ID '${input.genreId}' not found`])
      );
      expect(findByIdConsoleSpy).toBeCalledWith(ConsoleID.from(input.consoleId));
      expect(findByIdGenreSpy).toBeCalledWith(GenreID.from(input.genreId));
      expect(findByIdTypeSpy).toBeCalledWith(TypeID.from(input.typeId));
    });

    it("should throw constraint validator error if type is not found", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.typeId = "invalid-id";

      const findByIdConsoleSpy = jest.spyOn(consoleRepository, 'findById').mockResolvedValue(consoleMock());
      const findByIdGenreSpy = jest.spyOn(genreRepository, 'findById').mockResolvedValue(genreMock());
      const findByIdTypeSpy = jest.spyOn(typeRepository, 'findById').mockRejectedValue(new NotFoundError(`Type ID '${input.typeId}' not found`, 404, 'type'))

      await expect(createGameUseCase.execute(input)).rejects.toThrow(
        new ConstraintValidationError("Error while creating game", 422, "game", [`Type ID '${input.typeId}' not found`])
      );
      expect(findByIdConsoleSpy).toBeCalledWith(ConsoleID.from(input.consoleId));
      expect(findByIdGenreSpy).toBeCalledWith(GenreID.from(input.genreId));
      expect(findByIdTypeSpy).toBeCalledWith(TypeID.from(input.typeId));
    });

    it("should throw error if finishedDate is invalid", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.finishedDate = undefined as unknown as Date;

      expect(createGameUseCase.execute(input)).rejects.toThrow(
        new NotificationError([
          {
            message: "finishedDate is required",
            context: "game",
          },
        ])
      );
    });

    it("should throw error if finishedTime is invalid", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.finishedTime = -1;

      expect(createGameUseCase.execute(input)).rejects.toThrow(
        new NotificationError([
          {
            message: "finishedTime must be positive",
            context: "game",
          },
        ])
      );
    });

    it("should throw error if betCondition is invalid", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.betCondition = "";

      expect(createGameUseCase.execute(input)).rejects.toThrow(
        new NotificationError([
          {
            message: "betCondition must be at least 3 characters long",
            context: "game",
          },
        ])
      );
    });

    it("should throw error if rating is invalid", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      input.rating = -1;

      expect(createGameUseCase.execute(input)).rejects.toThrow(
        new NotificationError([
          {
            message: "rating must be positive",
            context: "game",
          },
        ])
      );
    });
  });

  describe("repository errors", () => {
    it("should throw error if repository throws unknown error", async () => {
      const createGameUseCase = new CreateGameUseCase(gameRepository, consoleRepository, typeRepository, genreRepository);

      const spyCreate = jest
        .spyOn(gameRepository, "create")
        .mockRejectedValue(new Error("Database offline"));

        await expect(createGameUseCase.execute(input)).rejects.toThrow(new DatabaseGenericError("Error while persisting data to database", 500));
        expect(spyCreate).toBeCalled();
    });
  });
});
