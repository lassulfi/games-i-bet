import RepositoryInterface from "../../@shared/repository/repository-interface";
import Console from "../entity/console";
import ConsoleID from "../entity/console.id";

export default interface ConsoleRepositoryInterface extends RepositoryInterface<Console, ConsoleID> {}