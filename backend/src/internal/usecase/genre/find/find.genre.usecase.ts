import { DatabaseGenericError, NotFoundError } from "../../../domain/@shared/errors/errors";
import GenreID from "../../../domain/genre/entity/genre.id";
import { GenreNotFoundError } from "../../../domain/genre/repository/genre-repository.error";
import GenreRepositoryInterface from "../../../domain/genre/repository/genre-repository.interface";
import { InputFindGenreDto, OutputFindGenreDto } from "./find.genre.dto";

export default class FindGenreUseCase {
    private _genreRepository: GenreRepositoryInterface;

    constructor(genreRepository: GenreRepositoryInterface) {
        this._genreRepository = genreRepository;
    }

    async execute(input: InputFindGenreDto): Promise<OutputFindGenreDto> {
        let output: OutputFindGenreDto;
        const { id } = input;
        try {
            const genre = await this._genreRepository.findById(GenreID.from(id));
    
            output = {
                id: genre.id.getValue(),
                name: genre.name,
                isActive: genre.isActive
            };
        } catch (error) {
            if (error instanceof GenreNotFoundError) {
                throw new NotFoundError(`Genre ID '${id}' not found`, 404, "genre");
            }

            throw new DatabaseGenericError(`Error while retrieving genre ID ${id}`, 500);
        }

        return output;
    }
}