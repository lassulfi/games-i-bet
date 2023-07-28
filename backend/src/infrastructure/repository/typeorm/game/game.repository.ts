import { DataSource, Repository } from "typeorm";
import Game from "../../../../internal/domain/game/entity/game";
import GameID from "../../../../internal/domain/game/entity/game.id";
import GameRepositoryInterface from "../../../../internal/domain/game/repository/game-repository.interface";
import { GameModel, newGameModelFrom } from "./game.model";
import { GameNotFoundError } from "../../../../internal/domain/game/repository/game-repository.error";

export default class GameRepository implements GameRepositoryInterface {
    private _gameRepository: Repository<GameModel>;

    constructor(dataSource: DataSource) {
        this._gameRepository = dataSource.getRepository(GameModel);
    }
    
    async create(entity: Game): Promise<void> {
        const actualModel = newGameModelFrom(entity);

        await this._gameRepository.save(actualModel);
    }
    update(entity: Game): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findById(id: GameID): Promise<Game> {
        const actualModel = await this._gameRepository.findOne({
            relations: {
                console: true,
                genre: true,
                type: true
            },
            where: {
                id: id.getValue()
            }
        });

        if (!actualModel) {
            throw new GameNotFoundError(`Game ID '${id.getValue()}' not found`);
        }

        return actualModel.toAggregate();
    }
    findAll(page?: any): Promise<Game[]> {
        throw new Error("Method not implemented.");
    }

}