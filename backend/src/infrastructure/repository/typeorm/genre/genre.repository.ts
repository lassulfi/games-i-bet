import { DataSource, Repository } from "typeorm";
import Genre from "../../../../internal/domain/genre/entity/genre";
import GenreID from "../../../../internal/domain/genre/entity/genre.id";
import GenreRepositoryInterface from "../../../../internal/domain/genre/repository/genre-repository.interface";
import  { GenreModel, newGenreModelFrom } from "./genre.model";
import { GenreNotFoundError } from "../../../../internal/domain/genre/repository/genre-repository.error";

export default class GenreRepository implements GenreRepositoryInterface {
    private _genreRepository: Repository<GenreModel>;

    constructor(dataSource: DataSource) {
        this._genreRepository = dataSource.getRepository(GenreModel);
    }

    async create(entity: Genre): Promise<void> {
        const actualModel = newGenreModelFrom(entity);

        await this._genreRepository.save(actualModel);
    }

    update(entity: Genre): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findById(id: GenreID): Promise<Genre> {
        const model = await this._genreRepository.findOneBy({
            id: id.getValue()
        });

        if(!model) {
            throw new GenreNotFoundError(`Genre ID '${id.getValue()}' not found`);
        }

        return model.toAggregate();
    }
    
    findAll(page?: any): Promise<Genre[]> {
        throw new Error("Method not implemented.");
    }

}