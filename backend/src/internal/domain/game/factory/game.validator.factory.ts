import ValidatorInterface from "../../@shared/validator/validator.interface";
import Game from "../entity/game";
import GameYupValidator from "../validator/game.yup.validator";

export default class GameValidatorFactory {
    static create(): ValidatorInterface<Game> {
        return new GameYupValidator();
    }
}