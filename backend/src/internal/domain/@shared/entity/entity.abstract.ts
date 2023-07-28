import Notification from "../notification/notification";
import NotificationError from "../notification/notification.error";
import Identifier from "./identifier";

export default abstract class Entity<ID extends Identifier> {
    protected _id: ID;
    protected _notification: Notification;

    constructor(id: ID) {
        this._id = id;
        this._notification = new Notification();
    }

    protected notifyIfHasErrors() {
        if (this.notification.hasErrors()) {
            throw new NotificationError(this._notification.errors);
        }
    }

    get id(): ID {
        return this._id;
    }

    get notification(): Notification {
        return this._notification;
    }
}