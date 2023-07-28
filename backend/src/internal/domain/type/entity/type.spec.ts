import { tuple } from "yup";
import Type from "./type";
import TypeID from "./type.id";
import GameFactory from "../../game/factory/game.factory";

describe("Type unit tests", () => {
  it("should change name", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);

    expect(type).toBeDefined();

    type.changeName("new name");

    expect(type.name).toStrictEqual("new name");
    expect(type.createdAt.getTime()).toBeLessThan(type.updatedAt.getTime());
  });

  it("should throw an error when change name if name is invalid", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);

    expect(type).toBeDefined();

    expect(() => {
      type.changeName("");
    }).toThrow(
      "type: name must be at least 3 characters long, type: name is required"
    );
  });

  it("should activate a type", () => {
    const type = Type.newType(TypeID.from("123"), "some name", false);
    expect(type).toBeDefined();
    expect(type.isActive).toBeFalsy();
    expect(type.deletedAt).toBeDefined();

    type.activate();

    expect(type.isActive).toBeTruthy();
    expect(type.deletedAt).toBeNull();
    expect(type.createdAt.getTime()).toBeLessThan(type.updatedAt.getTime());
  });

  it("should deactivate a type", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);

    expect(type).toBeDefined();
    expect(type.isActive).toBeTruthy();
    expect(type.deletedAt).toBeNull();

    type.deactivate();

    expect(type.isActive).toBeFalsy();
    expect(type.deletedAt).toBeDefined();
    expect(type.createdAt.getTime()).toBeLessThan(type.updatedAt.getTime());
  });

  it("should add a game", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);

    expect(type.games.length).toBe(0);

    type.addGame(
      GameFactory.create({
        name: "some game",
        finishedDate: new Date(),
        finishedTime: 900,
        betCondition: "some bet condition",
        rating: 10,
        isActive: true,
      })
    );

    expect(type.games.length).toBe(1);
    expect(type.createdAt.getTime()).toBeLessThan(type.updatedAt.getTime());
  });

  it("should not add game is type is inactive", () => {
    const type = Type.newType(TypeID.from("123"), "some name", false);

    expect(type.games.length).toBe(0);

    expect(() => {
      type.addGame(
        GameFactory.create({
          name: "some game",
          finishedDate: new Date(),
          finishedTime: 900,
          betCondition: "some bet condition",
          rating: 10,
          isActive: true,
        })
      );
    }).toThrow("type: cannot add game to inactive type");
    expect(type.games.length).toBe(0);
    expect(type.createdAt).toStrictEqual(type.updatedAt);
  });

  it("should remove a game", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);
    const someGame = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });
    type.addGame(someGame);

    const anotherGame = GameFactory.create({
      name: "another game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "another bet condition",
      rating: 10,
      isActive: true,
    });
    type.addGame(anotherGame);

    expect(type.games.length).toBe(2);

    type.removeGame(someGame);

    expect(type.games.length).toBe(1);
    expect(type.games[0]).toStrictEqual(anotherGame);
    expect(type.createdAt.getTime()).toBeLessThan(
      type.updatedAt.getTime()
    );
  });

  it("should not remove game is type is inactive", () => {
    const type = Type.newType(TypeID.from("123"), "some name", true);

    const game = GameFactory.create({
      name: "some game",
      finishedDate: new Date(),
      finishedTime: 900,
      betCondition: "some bet condition",
      rating: 10,
      isActive: true,
    });

    type.addGame(game);

    type.deactivate();

    expect(type.games.length).toBe(1);
    expect(() => {
      type.removeGame(game);
    }).toThrow("type: cannot remove game from inactive type");
    expect(type.games.length).toBe(1);
    expect(type.games[0]).toStrictEqual(game);
    expect(type.createdAt.getTime()).toBeLessThan(
      type.updatedAt.getTime()
    );
  });

  it("should throw an error when name is missing", () => {
    expect(() => {
      const type = Type.newType(TypeID.from("123"), "", true);
    }).toThrow(
      "type: name must be at least 3 characters long, type: name is required"
    );
  });

  it("should throw an error when name has more then 255 characters", () => {
    expect(() => {
      const type = Type.newType(TypeID.from("123"), "a".repeat(256), true);
    }).toThrow("type: name must not exceed 255 characters");
  });
});
