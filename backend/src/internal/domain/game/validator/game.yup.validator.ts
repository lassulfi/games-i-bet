import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import Game from "../entity/game";

export default class GameYupValidator implements ValidatorInterface<Game> {
    validate(entity: Game): void {
        try {
            yup.object().shape({
                id: yup.object()
                    .required("Id is required"),
                name: yup.string()
                    .min(3, "name must be at least 3 characters long")
                    .max(255, "name must not exceed 255 characters")
                    .required("name is required"),
                finishedDate: yup.date()
                    .required("finishedDate is required"),
                finishedTime: yup.number()
                    .positive("finishedTime must be positive")
                    .required("finishedTime is required"),
                betCondition: yup.string()
                    .min(3, "betCondition must be at least 3 characters long")
                    .max(500, "betCondition must not exceed 500 characters"),
                rating: yup.number()
                    .min(0, "rating must be positive")
                    .max(11, "rating must not be greater then 11")
                    .required("rating is required")
            }).validateSync({
                id: entity.id,
                name: entity.name,
                finishedDate: entity.finishedDate,
                finishedTime: entity.finishedTime,
                betCondition: entity.betCondition,
                rating: entity.rating
            }, {
                abortEarly: false
            })
        } catch (error) {
            const e = error as yup.ValidationError;
            e.errors.forEach(error => {
                entity.notification.addError({
                    context: "game",
                    message: error
                })
            })
        }
    }
}