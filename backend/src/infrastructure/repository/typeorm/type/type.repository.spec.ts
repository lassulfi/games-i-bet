import TypeFactory from "../../../../internal/domain/type/factory/type.factory";
import TypeRepository from "./type.repository";
import TypeID from "../../../../internal/domain/type/entity/type.id";
import TypeNotFoundError from "../../../../internal/domain/type/repository/type-repository.error";
import GameFactory from "../../../../internal/domain/game/factory/game.factory";
import { TypeModel, newTypeModelFrom } from "./type.model";
import { setupSqliteDb, sqliteDataSource } from "../../sqlite/sqlite.data-source";

describe("type repository test", () => {
  beforeEach(async () => {
    await setupSqliteDb();
  });

  afterEach(async () => {
    await sqliteDataSource.destroy();
  });

  it("should persist a type", async () => {
    const aType = TypeFactory.create("some type", true);
    const aGame = GameFactory.create({
        name: "some game",
        finishedDate: new Date(),
        finishedTime: 900,
        betCondition: "some bet condition",
        isActive: true,
        rating: 10
    });
    aGame.changeType(aType);

    const typeRepository = new TypeRepository(sqliteDataSource);

    await typeRepository.create(aType);

    const repository = sqliteDataSource.getRepository(TypeModel);

    const actualModel = await repository.findOneBy({
      id: aType.id.getValue(),
    });

    expect(actualModel).toBeDefined();
    expect(actualModel?.id).toBe(aType.id.getValue());
    expect(actualModel?.name).toBe(aType.name);
    expect(actualModel?.isActive).toBe(aType.isActive);
    expect(actualModel?.createdAt).toStrictEqual(aType.createdAt);
    expect(actualModel?.updatedAt).toStrictEqual(aType.updatedAt);
    expect(actualModel?.deletedAt).toStrictEqual(aType.deletedAt);
    await expect(repository.count()).resolves.toBe(1);
  });

  it("should find type by id", async () => {
    const aType = TypeFactory.create("some type", true);

    const aModel = newTypeModelFrom(aType);

    const repository = sqliteDataSource.getRepository(TypeModel);

    await repository.save(aModel);

    await expect(repository.count()).resolves.toBe(1);

    const typeRepository = new TypeRepository(sqliteDataSource);

    const actualType = await typeRepository.findById(aType.id);

    expect(actualType).toStrictEqual(aType);
  });

  it("should throw type not found error if type id is invalid when find type by id", async () => {
    const repository = sqliteDataSource.getRepository(TypeModel);
    await expect(repository.count()).resolves.toBe(0);

    const typeRepository = new TypeRepository(sqliteDataSource);

    await expect(typeRepository.findById(TypeID.from("123"))).rejects.toThrow(
      new TypeNotFoundError("Type ID '123' not found")
    );
  });
});
