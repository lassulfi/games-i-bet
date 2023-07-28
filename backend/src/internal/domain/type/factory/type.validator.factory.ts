import ValidatorInterface from "../../@shared/validator/validator.interface";
import Type from "../entity/type";
import TypeYupValidator from "../validator/type.yup.validator";

export default class TypeValidatorFactory {
    static create(): ValidatorInterface<Type> {
        return new TypeYupValidator();
    }
}