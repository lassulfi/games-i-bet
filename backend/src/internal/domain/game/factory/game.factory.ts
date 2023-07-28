import Game from "../entity/game";
import GameID from "../entity/game.id";

interface GameFactoryProps {
  name: string;
  finishedDate: Date;
  finishedTime: number;
  betCondition: string;
  rating: number;
  isActive: boolean;
}

export default class GameFactory {
  static create(props: GameFactoryProps): Game {
    const {
      name,
      finishedDate,
      finishedTime,
      betCondition,
      rating,
      isActive
    } = props;
    return Game.newGame(
      GameID.unique(),
      name,
      finishedDate,
      finishedTime,
      betCondition,
      rating,
      isActive
    );
  }
}
