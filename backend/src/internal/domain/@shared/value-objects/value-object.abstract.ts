import Notification from "../notification/notification";
import NotificationError from "../notification/notification.error";

export default abstract class ValueObject {
    protected _notification: Notification;

    constructor() {
        this._notification = new Notification();
    }

    protected notifyIfHasErrors() {
        if (this.notification.hasErrors()) {
            throw new NotificationError(this._notification.errors);
        }
    }

    get notification(): Notification {
        return this._notification;
    }
}