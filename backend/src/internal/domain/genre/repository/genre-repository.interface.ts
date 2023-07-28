import RepositoryInterface from "../../@shared/repository/repository-interface";
import Genre from "../entity/genre";
import GenreID from "../entity/genre.id";

export default interface GenreRepositoryInterface extends RepositoryInterface<Genre, GenreID> {}