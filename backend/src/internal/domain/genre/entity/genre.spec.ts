import GameFactory from "../../game/factory/game.factory";
import Genre from "./genre";
import GenreID from "./genre.id";

describe("Genre unit tests", () => {
  it("should change name", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", true);
    expect(genre).toBeDefined();

    genre.changeName("new genre");

    expect(genre.name).toBe("new genre");
    expect(genre.createdAt.getTime()).toBeLessThan(genre.updatedAt.getTime());
  });

  it("should activate genre", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", false);
    expect(genre).toBeDefined();
    expect(genre.isActive).toBeFalsy();
    expect(genre.deletedAt).toBeDefined();

    genre.activate();
    expect(genre.isActive).toBeTruthy();
    expect(genre.deletedAt).toBeNull();
  });

  it("should deactivate genre", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", true);
    expect(genre).toBeDefined();
    expect(genre.isActive).toBeTruthy();
    expect(genre.deletedAt).toBeNull();

    genre.deactivate();

    expect(genre.isActive).toBeFalsy();
    expect(genre.deletedAt).toBeDefined();
  });

  it("should add a game", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", true);

    expect(genre.games.length).toBe(0);

    genre.addGame(
      GameFactory.create({
        name: "some game",
        finishedDate: new Date(),
        finishedTime: 900,
        betCondition: "some bet condition",
        rating: 10,
        isActive: true,
      })
    );

    expect(genre.games.length).toBe(1);
    expect(genre.createdAt.getTime()).toBeLessThan(genre.updatedAt.getTime());
  });

  it("should not add game is genre is inactive", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", false);

    expect(genre.games.length).toBe(0);

    expect(() => {
      genre.addGame(
        GameFactory.create({
          name: "some game",
          finishedDate: new Date(),
          finishedTime: 900,
          betCondition: "some bet condition",
          rating: 10,
          isActive: true,
        })
      );
    }).toThrow("genre: cannot add game to inactive genre");
    expect(genre.games.length).toBe(0);
    expect(genre.createdAt).toStrictEqual(genre.updatedAt);
  });

  it("should remove a game", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", true);
    const someGame = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });
    genre.addGame(someGame);

    const anotherGame = GameFactory.create({
      name: "another game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "another bet condition",
      rating: 10,
      isActive: true,
    });
    genre.addGame(anotherGame);

    expect(genre.games.length).toBe(2);

    genre.removeGame(someGame);

    expect(genre.games.length).toBe(1);
    expect(genre.games[0]).toStrictEqual(anotherGame);
    expect(genre.createdAt.getTime()).toBeLessThan(
      genre.updatedAt.getTime()
    );
  });

  it("should not remove game is genre is inactive", () => {
    const genre = Genre.newGenre(GenreID.from("123"), "some genre", true);

    const game = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });

    genre.addGame(game);

    genre.deactivate();

    expect(genre.games.length).toBe(1);
    expect(genre.createdAt.getTime()).toBeLessThan(
      genre.updatedAt.getTime()
    );
    expect(() => {
      genre.removeGame(game);
    }).toThrow("genre: cannot remove game from inactive genre");
    expect(genre.games.length).toBe(1);
    expect(genre.games[0]).toStrictEqual(game);
  });

  it("should throw an error when name is missing", () => {
    expect(() => {
      const genre = Genre.newGenre(GenreID.from("123"), "", true);
    }).toThrow(
      "genre: name must be at least 3 characters long, genre: name is required"
    );
  });

  it("should throw an error when name has more then 255 characters", () => {
    expect(() => {
      const genre = Genre.newGenre(GenreID.from("123"), "a".repeat(256), true);
    }).toThrow("genre: name must not exceed 255 characters");
  });
});
