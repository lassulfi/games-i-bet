import {
  ConstraintValidationError,
  DatabaseGenericError,
  NotFoundError,
} from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import ConsoleID from "../../../domain/console/entity/console.id";
import ConsoleRepositoryInterface from "../../../domain/console/repository/console-repository.interface";
import GameFactory from "../../../domain/game/factory/game.factory";
import GameRepositoryInterface from "../../../domain/game/repository/game-repository.interface";
import GenreID from "../../../domain/genre/entity/genre.id";
import GenreRepositoryInterface from "../../../domain/genre/repository/genre-repository.interface";
import TypeID from "../../../domain/type/entity/type.id";
import TypeRepositoryInterface from "../../../domain/type/repository/type-repository.interface";
import { InputCreateGameDto, OutputCreateGameDto } from "./create.game.dto";

export default class CreateGameUseCase {
  private _gameRepository: GameRepositoryInterface;
  private _consoleRepository: ConsoleRepositoryInterface;
  private _typeRepository: TypeRepositoryInterface;
  private _genreRepository: GenreRepositoryInterface;

  constructor(
    gameRepository: GameRepositoryInterface,
    consoleRepository: ConsoleRepositoryInterface,
    typeRepository: TypeRepositoryInterface,
    genreRepository: GenreRepositoryInterface
  ) {
    this._gameRepository = gameRepository;
    this._consoleRepository = consoleRepository;
    this._typeRepository = typeRepository;
    this._genreRepository = genreRepository;
  }

  async execute(input: InputCreateGameDto): Promise<OutputCreateGameDto> {
    let output: OutputCreateGameDto;

    try {
      const game = GameFactory.create(input);

      const [console, genre, type] = await Promise.all([
        this._consoleRepository.findById(ConsoleID.from(input.consoleId)),
        this._genreRepository.findById(GenreID.from(input.genreId)),
        this._typeRepository.findById(TypeID.from(input.typeId)),
      ]);

      game.changeConsole(console);
      game.changeGenre(genre);
      game.changeType(type);

      await this._gameRepository.create(game);

      output = { id: game.id.getValue() };
    } catch (error) {
      if (error instanceof NotFoundError) {
        const constraint = `${error.context}: ${error.message}`;
        throw new ConstraintValidationError(
          "Error while creating game",
          422,
          "game",
          [constraint]
        );
      }

      if (error instanceof NotificationError) {
        throw error;
      }

      throw new DatabaseGenericError(
        "Error while persisting data to database",
        500
      );
    }

    return output;
  }
}
