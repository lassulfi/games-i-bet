import RepositoryInterface from "../../@shared/repository/repository-interface";
import Game from "../entity/game";
import GameID from "../entity/game.id";

export default interface GameRepositoryInterface extends RepositoryInterface<Game, GameID> {
    
}