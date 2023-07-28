import ConsoleFactory from "../../../../internal/domain/console/factory/console.factory";
import ConsoleRepository from "./console.repository";
import ConsoleID from "../../../../internal/domain/console/entity/console.id";
import { ConsoleNotFoundError } from "../../../../internal/domain/console/repository/console-repository.error";
import GameFactory from "../../../../internal/domain/game/factory/game.factory";
import { ConsoleModel, newConsoleModelFrom } from "./console.model";
import { setupSqliteDb, sqliteDataSource } from "../../sqlite/sqlite.data-source";

describe("Console repository test", () => {

    beforeEach(async () => {
        await setupSqliteDb()
    });

    afterEach(async () => {
        await sqliteDataSource.destroy();
    });

    it("should persist a console",async () => {
        const aConsole = ConsoleFactory.create("some console", true);
        const aGame = GameFactory.create({
            name: "some game",
            finishedDate: new Date(),
            finishedTime: 900,
            betCondition: "some bet condition",
            isActive: true,
            rating: 10
        });
        aGame.changeConsole(aConsole);

        const consoleRepository = new ConsoleRepository(sqliteDataSource);

        await consoleRepository.create(aConsole);

        const repository = sqliteDataSource.getRepository(ConsoleModel);        

        const entity = await repository.findOneBy({
            id: aConsole.id.getValue()
        });

        expect(entity).toBeDefined();
        expect(entity?.id).toBe(aConsole.id.getValue());
        expect(entity?.name).toBe(aConsole.name);
        expect(entity?.isActive).toBe(aConsole.isActive);
        expect(entity?.createdAt).toStrictEqual(aConsole.createdAt);
        expect(entity?.updatedAt).toStrictEqual(aConsole.updatedAt);
        expect(entity?.deletedAt).toStrictEqual(aConsole.deletedAt);
        await expect(repository.count()).resolves.toBe(1);
    });

    it("should find a console by id", async () => {
        const aConsole = ConsoleFactory.create("some console", true);

        const aModel = newConsoleModelFrom(aConsole);

        const repository = sqliteDataSource.getRepository(ConsoleModel); 

        await repository.save(aModel);

        await expect(repository.count()).resolves.toBe(1);

        const consoleRepository = new ConsoleRepository(sqliteDataSource);

        const actualConsole = await consoleRepository.findById(aConsole.id);

        expect(actualConsole).toStrictEqual(aConsole);
    });

    it("should throw console not found error if console id is invalid when find console by id",async () => {
        const repository = sqliteDataSource.getRepository(ConsoleModel);
        await expect(repository.count()).resolves.toBe(0);

        const consoleRepository = new ConsoleRepository(sqliteDataSource);

        await expect(consoleRepository.findById(ConsoleID.from("123"))).rejects.toThrow(new ConsoleNotFoundError("Console ID '123' not found"));
    });
});