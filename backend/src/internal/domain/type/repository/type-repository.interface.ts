import RepositoryInterface from "../../@shared/repository/repository-interface";
import Type from "../entity/type";
import TypeID from "../entity/type.id";

export default interface TypeRepositoryInterface extends RepositoryInterface<Type, TypeID> {}