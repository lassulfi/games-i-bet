import GenreFactory from "../../../../internal/domain/genre/factory/genre.factory";
import GenreRepository from "./genre.repository";
import GenreID from "../../../../internal/domain/genre/entity/genre.id";
import { GenreNotFoundError } from "../../../../internal/domain/genre/repository/genre-repository.error";
import { GenreModel, newGenreModelFrom } from "./genre.model";
import GameFactory from "../../../../internal/domain/game/factory/game.factory";
import {
  setupSqliteDb,
  sqliteDataSource,
} from "../../sqlite/sqlite.data-source";

describe("genre repository test", () => {
  beforeEach(async () => {
    await setupSqliteDb();
  });

  afterEach(async () => {
    await sqliteDataSource.destroy();
  });

  it("should persist a genre", async () => {
    const aGenre = GenreFactory.create("some genre", true);
    const aGame = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      isActive: true,
      rating: 10,
    });
    aGame.changeGenre(aGenre);

    const genreRepository = new GenreRepository(sqliteDataSource);

    await genreRepository.create(aGenre);

    const repository = sqliteDataSource.getRepository(GenreModel);

    const actualModel = await repository.findOneBy({
      id: aGenre.id.getValue(),
    });

    expect(actualModel).toBeDefined();
    expect(actualModel?.id).toBe(aGenre.id.getValue());
    expect(actualModel?.name).toBe(aGenre.name);
    expect(actualModel?.isActive).toBe(aGenre.isActive);
    expect(actualModel?.createdAt).toStrictEqual(aGenre.createdAt);
    expect(actualModel?.updatedAt).toStrictEqual(aGenre.updatedAt);
    expect(actualModel?.deletedAt).toStrictEqual(aGenre.deletedAt);
    await expect(repository.count()).resolves.toBe(1);
  });

  it("should find genre by id", async () => {
    const aGenre = GenreFactory.create("some genre", true);

    const aModel = newGenreModelFrom(aGenre);

    const repository = sqliteDataSource.getRepository(GenreModel);

    await repository.save(aModel);

    await expect(repository.count()).resolves.toBe(1);

    const genreRepository = new GenreRepository(sqliteDataSource);

    const actualGenre = await genreRepository.findById(aGenre.id);

    expect(actualGenre).toStrictEqual(aGenre);
  });

  it("should throw genre not found error if genre id is invalid when find genre by id", async () => {
    const repository = sqliteDataSource.getRepository(GenreModel);
    await expect(repository.count()).resolves.toBe(0);

    const genreRepository = new GenreRepository(sqliteDataSource);

    await expect(genreRepository.findById(GenreID.from("123"))).rejects.toThrow(
      new GenreNotFoundError("Genre ID '123' not found")
    );
  });
});
