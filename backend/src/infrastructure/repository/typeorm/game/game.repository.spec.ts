import ConsoleFactory from "../../../../internal/domain/console/factory/console.factory";
import GameID from "../../../../internal/domain/game/entity/game.id";
import GameFactory from "../../../../internal/domain/game/factory/game.factory";
import { GameNotFoundError } from "../../../../internal/domain/game/repository/game-repository.error";
import GenreFactory from "../../../../internal/domain/genre/factory/genre.factory";
import TypeFactory from "../../../../internal/domain/type/factory/type.factory";
import { setupSqliteDb, sqliteDataSource } from "../../sqlite/sqlite.data-source";
import { ConsoleModel, newConsoleModelFrom } from "../console/console.model";
import { GenreModel, newGenreModelFrom } from "../genre/genre.model";
import { TypeModel, newTypeModelFrom } from "../type/type.model";
import { GameModel, newGameModelFrom } from "./game.model";
import GameRepository from "./game.repository";

describe("game repository tests", () => {
    beforeEach(async () => {
        await setupSqliteDb();
    });

    afterEach(async () => {
        await sqliteDataSource.destroy();
    });

    it("should persist a game",async () => {

        const aConsole = ConsoleFactory.create("some console", true);
        const consoleRepository = sqliteDataSource.getRepository(ConsoleModel);
        await consoleRepository.save(newConsoleModelFrom(aConsole));

        const aGenre = GenreFactory.create("some genre", true);
        const genreRepository = sqliteDataSource.getRepository(GenreModel);
        await genreRepository.save(newGenreModelFrom(aGenre));

        const aType = TypeFactory.create("some type", true);
        const typeRepository = sqliteDataSource.getRepository(TypeModel);
        await typeRepository.save(newTypeModelFrom(aType));

        const aGame = GameFactory.create({
            name: "some game",
            finishedDate: new Date(),
            finishedTime: 900,
            betCondition: "some bet condition",
            isActive: true,
            rating: 10
        });

        aGame.changeConsole(aConsole)
            .changeGenre(aGenre)
            .changeType(aType); 
        
        const gameRepository = new GameRepository(sqliteDataSource);

        await gameRepository.create(aGame);

        const repository = sqliteDataSource.getRepository(GameModel);

        const actualEntity = await repository.findOne({
            relations: {
                console: true,
                type: true,
                genre: true
            },
            where: {
                id: aGame.id.getValue()
            }
        });

        expect(actualEntity).toBeDefined();
        expect(actualEntity?.id).toBe(aGame.id.getValue());
        expect(actualEntity?.name).toBe(aGame.name);
        expect(actualEntity?.finishedDate).toStrictEqual(aGame.finishedDate);
        expect(actualEntity?.finishedTime).toBe(aGame.finishedTime);
        expect(actualEntity?.betCondition).toBe(aGame.betCondition);
        expect(actualEntity?.rating).toBe(aGame.rating);
        expect(actualEntity?.console).toBeDefined();
        expect(actualEntity?.genre).toBeDefined();
        expect(actualEntity?.type).toBeDefined();
        expect(actualEntity?.isActive).toBe(aGame.isActive);
        expect(actualEntity?.createdAt).toStrictEqual(aGame.createdAt);
        expect(actualEntity?.updatedAt).toStrictEqual(aGame.updatedAt);
        expect(actualEntity?.deletedAt).toStrictEqual(aGame.deletedAt);
        await expect(repository.count()).resolves.toBe(1);
    });

    it("should find a game by id", async () => {
        const aConsole = ConsoleFactory.create("some console", true);
        const consoleRepository = sqliteDataSource.getRepository(ConsoleModel);
        await consoleRepository.save(newConsoleModelFrom(aConsole));

        const aGenre = GenreFactory.create("some genre", true);
        const genreRepository = sqliteDataSource.getRepository(GenreModel);
        await genreRepository.save(newGenreModelFrom(aGenre));

        const aType = TypeFactory.create("some type", true);
        const typeRepository = sqliteDataSource.getRepository(TypeModel);
        await typeRepository.save(newTypeModelFrom(aType));

        const aGame = GameFactory.create({
            name: "some game",
            finishedDate: new Date(),
            finishedTime: 900,
            betCondition: "some bet condition",
            isActive: true,
            rating: 10
        });

        aGame.changeConsole(aConsole)
            .changeGenre(aGenre)
            .changeType(aType); 

        const repository = sqliteDataSource.getRepository(GameModel); 

        await repository.save(newGameModelFrom(aGame));

        await expect(repository.count()).resolves.toBe(1);

        const gameRepository = new GameRepository(sqliteDataSource);

        const actualGame = await gameRepository.findById(aGame.id);

        expect(actualGame).toBeDefined();
        expect(actualGame.id).toStrictEqual(aGame.id);
        expect(actualGame.name).toBe(aGame.name);
        expect(actualGame.finishedDate).toStrictEqual(aGame.finishedDate);
        expect(actualGame.finishedTime).toBe(aGame.finishedTime);
        expect(actualGame.betCondition).toBe(aGame.betCondition);
        expect(actualGame.rating).toBe(aGame.rating);
        expect(actualGame.console).toBeDefined();
        expect(actualGame.genre).toBeDefined();
        expect(actualGame.type).toBeDefined();
        expect(actualGame.isActive).toBe(aGame.isActive);
        expect(actualGame.createdAt).toStrictEqual(aGame.createdAt);
        expect(actualGame.updatedAt).toStrictEqual(aGame.updatedAt);
        expect(actualGame.deletedAt).toStrictEqual(aGame.deletedAt);
    });

    it("should throw game not found error if game id is invalid when find game by id", async () => {
        const repository = sqliteDataSource.getRepository(GameModel);
        await expect(repository.count()).resolves.toBe(0);
    
        const gameRepository = new GameRepository(sqliteDataSource);
    
        await expect(gameRepository.findById(GameID.from("123"))).rejects.toThrow(
          new GameNotFoundError("Game ID '123' not found")
        );
      });
});