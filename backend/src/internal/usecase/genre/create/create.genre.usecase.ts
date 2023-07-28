import { DatabaseGenericError } from "../../../domain/@shared/errors/errors";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import GenreFactory from "../../../domain/genre/factory/genre.factory";
import GenreRepositoryInterface from "../../../domain/genre/repository/genre-repository.interface";
import { InputCreateGenreDto, OutputCreateGenreDto } from "./create.genre.dto";

export default class CreateGenreUseCase {
  private _genreRepository: GenreRepositoryInterface;

  constructor(genreRepository: GenreRepositoryInterface) {
    this._genreRepository = genreRepository;
  }

  async execute(input: InputCreateGenreDto): Promise<OutputCreateGenreDto> {
    let output: OutputCreateGenreDto;
    try {
      const { name, isActive } = input;
      const genre = GenreFactory.create(name, isActive);

      await this._genreRepository.create(genre);

      output = {
        id: genre.id.getValue(),
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
