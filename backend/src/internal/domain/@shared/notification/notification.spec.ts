import Notification from "./notification";

describe("Notification unit tests", () => {
    it("should create errors", () => {
        const notification = new Notification();

        const error1 = {
            message: "error message 1",
            context: "game"
        };
        notification.addError(error1);

        expect(notification.hasErrors()).toBeTruthy();
        expect(notification.message("game")).toBe("game: error message 1, ");

        const error2 = {
            message: "error message 2",
            context: "game"
        };
        notification.addError(error2);

        expect(notification.hasErrors()).toBeTruthy();
        expect(notification.message("game")).toBe("game: error message 1, game: error message 2, ");

        const error3 = {
            message: "error message 3",
            context: "console"
        };
        notification.addError(error3);

        expect(notification.hasErrors()).toBeTruthy();
        expect(notification.message("console")).toBe("console: error message 3, ");
        expect(notification.message()).toBe("game: error message 1, game: error message 2, console: error message 3, ")
    });

    it("should get all errors", () => {
        const notification = new Notification();

        const error = {
            message: "error message 1",
            context: "game"
        };
        notification.addError(error);

        expect(notification.hasErrors()).toBeTruthy();
        expect(notification.errors).toEqual([error]);
    });
});