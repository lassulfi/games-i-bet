import ValidatorInterface from "../../@shared/validator/validator.interface";
import Genre from "../entity/genre";
import GenreYupValidator from "../validator/genre.yup.validator";

export default class GenreValidatorFactory {
    static create(): ValidatorInterface<Genre> {
        return new GenreYupValidator();
    }
}