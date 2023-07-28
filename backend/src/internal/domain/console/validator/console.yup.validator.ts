import ValidatorInterface from "../../@shared/validator/validator.interface";
import Console from "../entity/console";
import * as yup from "yup";

export default class ConsoleYupValidator implements ValidatorInterface<Console> {
    validate(entity: Console): void {
        try {
            yup.object().shape({
                name: yup.string()
                .min(3, "name must be at least 3 characters long")
                .max(255, "name must not exceed 255 characters")
                .required("name is required"),
            }).validateSync({
                name: entity.name
            }, {
                abortEarly: false
            })
        } catch (error) {
            const e = error as yup.ValidationError;
            e.errors.forEach(error => {
                entity.notification.addError({
                    context: "console",
                    message: error
                })
            })
        }
    }

}