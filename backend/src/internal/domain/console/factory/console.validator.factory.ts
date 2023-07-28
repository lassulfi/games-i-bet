import ValidatorInterface from "../../@shared/validator/validator.interface";
import Console from "../entity/console";
import ConsoleYupValidator from "../validator/console.yup.validator";

export default class ConsoleValidatorFactory {
    static create(): ValidatorInterface<Console> {
        return new ConsoleYupValidator();
    }
}