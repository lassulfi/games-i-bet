import GameFactory from "../../game/factory/game.factory";
import Console from "./console";
import ConsoleID from "./console.id";

describe("Console unit tests", () => {
  it("should change console name", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      true
    );

    expect(console).toBeDefined();

    console.changeName("new console");

    expect(console.name).toBe("new console");
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
  });

  it("should inactivate a console", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      true
    );

    expect(console).toBeDefined();
    expect(console.isActive).toBeTruthy();
    expect(console.deletedAt).toBeNull();

    console.deactivate();

    expect(console.isActive).toBeFalsy();
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
    expect(console.deletedAt).toBeDefined();
  });

  it("should activate console", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      false
    );

    expect(console).toBeDefined();
    expect(console.isActive).toBeFalsy();
    expect(console.deletedAt).toBeDefined();

    console.activate();

    expect(console.isActive).toBeTruthy();
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
    expect(console.deletedAt).toBeNull();
  });

  it("should add a game", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      true
    );

    expect(console.games.length).toBe(0);

    console.addGame(
      GameFactory.create({
        name: "some game",
        finishedDate: new Date(),
        finishedTime: 900,
        betCondition: "some bet condition",
        rating: 10,
        isActive: true,
      })
    );

    expect(console.games.length).toBe(1);
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
  });

  it("should not add game is console is inactive", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      false
    );

    expect(console.games.length).toBe(0);

    expect(() => {
      console.addGame(
        GameFactory.create({
          name: "some game",
          finishedDate: new Date(),
          finishedTime: 900,
          betCondition: "some bet condition",
          rating: 10,
          isActive: true,
        })
      );
    }).toThrow("console: cannot add game to inactive console");
    expect(console.games.length).toBe(0);
    expect(console.createdAt).toStrictEqual(console.updatedAt);
  });

  it("should remove a game", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      true
    );
    const someGame = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });
    console.addGame(someGame);

    const anotherGame = GameFactory.create({
      name: "another game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "another bet condition",
      rating: 10,
      isActive: true,
    });
    console.addGame(anotherGame);

    expect(console.games.length).toBe(2);

    console.removeGame(someGame);

    expect(console.games.length).toBe(1);
    expect(console.games[0]).toStrictEqual(anotherGame);
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
  });

  it("should not remove game is console is inactive", () => {
    const console = Console.newConsole(
      ConsoleID.from("123"),
      "some console",
      true
    );

    const game = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });

    console.addGame(game);

    console.deactivate();

    expect(console.games.length).toBe(1);
    expect(() => {
      console.removeGame(game);
    }).toThrow("console: cannot remove game from inactive console");
    expect(console.games.length).toBe(1);
    expect(console.games[0]).toStrictEqual(game);
    expect(console.createdAt.getTime()).toBeLessThan(
      console.updatedAt.getTime()
    );
  });

  it("should throw an error when name is missing", () => {
    expect(() => {
      const console = Console.newConsole(ConsoleID.from("123"), "", true);
    }).toThrow(
      "console: name must be at least 3 characters long, console: name is required"
    );
  });

  it("should throw an error when name has more then 255 characters", () => {
    expect(() => {
      const console = Console.newConsole(
        ConsoleID.from("123"),
        "a".repeat(256),
        true
      );
    }).toThrow("console: name must not exceed 255 characters");
  });
});
