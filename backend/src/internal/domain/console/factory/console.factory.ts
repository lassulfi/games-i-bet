import Console from "../entity/console";
import ConsoleID from "../entity/console.id";

export default class ConsoleFactory {

    static create(name: string, isActive: boolean): Console {
        return Console.newConsole(ConsoleID.unique(), name, isActive);
    }
}