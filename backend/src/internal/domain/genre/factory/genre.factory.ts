import Genre from "../entity/genre";
import GenreID from "../entity/genre.id";

export default class GenreFactory {
    static create(name: string, isActive: boolean): Genre {
        return Genre.newGenre(GenreID.unique(), name, isActive);
    }
}