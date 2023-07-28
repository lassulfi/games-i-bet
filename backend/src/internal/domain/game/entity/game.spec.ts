import Console from "../../console/entity/console";
import ConsoleID from "../../console/entity/console.id";
import ConsoleFactory from "../../console/factory/console.factory";
import Genre from "../../genre/entity/genre";
import GenreFactory from "../../genre/factory/genre.factory";
import Type from "../../type/entity/type";
import TypeFactory from "../../type/factory/type.factory";
import Game from "./game";
import GameID from "./game.id";

const mockGame = {
  id: GameID.from("some id"),
  name: "some game",
  date: new Date(),
  elapsedTime: 900,
  betCondition: "some bet condition",
  rating: 10,
  isActive: true
};

const gameMock = () => {
  const { id, name, date, elapsedTime, betCondition, rating, isActive } =
    mockGame;
  return Game.newGame(
    id,
    name,
    date,
    elapsedTime,
    betCondition,
    rating,
    isActive
  );
};

describe("Game unit tests", () => {
  it("should change name", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedName = "new game";
    game.changeName(expectedName);

    expect(game.name).toStrictEqual(expectedName);
  });

  it("should change console", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedConsole = ConsoleFactory.create("new console", true);
    game.changeConsole(expectedConsole);

    expect(game.console).toStrictEqual(expectedConsole);
  });

  it("should change type", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedType = TypeFactory.create("new type", true);
    game.changeType(expectedType);

    expect(game.type).toStrictEqual(expectedType);
  });

  it("should change genre", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedGenre = GenreFactory.create("new genre", true);
    game.changeGenre(expectedGenre);

    expect(game.genre).toStrictEqual(expectedGenre);
  });

  it("should change finished date", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedFinishedDate = new Date();
    game.changeFinishedDate(expectedFinishedDate);

    expect(game.finishedDate).toStrictEqual(expectedFinishedDate);
  });

  it("should change finished time", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedFinishedTime = 1000;
    game.changeFinishedTime(expectedFinishedTime);

    expect(game.finishedTime).toStrictEqual(expectedFinishedTime);
  });

  it("should change bet condition", () => {
    const game = gameMock();

    expect(game).toBeDefined();

    const expectedBetCondition = "new bet condition";
    game.changeBetCondition(expectedBetCondition);

    expect(game.betCondition).toStrictEqual(expectedBetCondition);
  });

  it("should change rating", () => {
    const game = gameMock();
    
    expect(game).toBeDefined();

    const expectedRating = 5;
    game.changeRating(expectedRating);

    expect(game.rating).toStrictEqual(expectedRating);
  })

  it("should activate a game", () => {
    const game = Game.newGame(GameID.from("some id"), "some game", new Date(), 900, "some bet condition", 10, false);

    expect(game).toBeDefined();
    expect(game.isActive).toBeFalsy();
    expect(game.deletedAt).toBeDefined();

    game.activate();

    expect(game.isActive).toBeTruthy();
    expect(game.deletedAt).toBeNull();
    expect(game.createdAt.getTime()).toBeLessThan(game.updatedAt.getTime())
  });

  it("should deactivate a game", () => {
    const game = Game.newGame(GameID.from("some id"), "some game", new Date(), 900, "some bet condition", 10, true);

    expect(game).toBeDefined();
    expect(game.isActive).toBeTruthy();
    expect(game.deletedAt).toBeNull();

    game.deactivate();

    expect(game.isActive).toBeFalsy();
    expect(game.deletedAt).toBeDefined();
    expect(game.createdAt.getTime()).toBeLessThan(game.updatedAt.getTime())
  });

  describe("name validation errors", () => {
    it("should throw error if name is empty", () => {
      const game = gameMock();

      expect(game).toBeDefined();
      expect(() => {
        game.changeName("");
      }).toThrow(
        "game: name must be at least 3 characters long, game: name is required"
      );
    });
  });

  it("should throw error if name contains more then 255 characters", () => {
    const game = gameMock();

    expect(game).toBeDefined();
    expect(() => {
      game.changeName("a".repeat(256));
    }).toThrow("game: name must not exceed 255 characters");
  });

  describe("finishedDate validation errors", () => {
    it("should throw error if finishedDate is empty", () => {
      const game = gameMock();

      expect(game).toBeDefined();
      expect(() => {
        game.changeFinishedDate(undefined as unknown as Date);
      }).toThrow("game: finishedDate is required");
    });
  });

  describe("finishedTime validation errors", () => {
    it("should throw error if finishedTime is negative", () => {
      const game = gameMock();

      expect(game).toBeDefined();
      expect(() => {
        game.changeFinishedTime(-1);
      }).toThrow("game: finishedTime must be positive");
    });

    it("should throw error if finishedTime is empty", () => {
      const game = gameMock();

      expect(game).toBeDefined();
      expect(() => {
        game.changeFinishedTime(undefined as unknown as number);
      }).toThrow("game: finishedTime is required");
    });
  });

  describe("betCondition validation errors", () => {
    it("should throw error if name is empty", () => {
      const game = gameMock();

      expect(game).toBeDefined();
      expect(() => {
        game.changeBetCondition("");
      }).toThrow(
        "game: betCondition must be at least 3 characters long"
      );
    });

    it("should throw error if betCondition contains more then 255 characters", () => {
        const game = gameMock();
    
        expect(game).toBeDefined();
        expect(() => {
          game.changeBetCondition("a".repeat(501));
        }).toThrow("game: betCondition must not exceed 500 characters");
      });
  });

  describe("rating validation errors", () => {
    it("should throw error if rating is empty", () => {
        const game = gameMock();
    
        expect(game).toBeDefined();

        expect(() => {
            game.changeRating(undefined as unknown as number)
        }).toThrow("game: rating is required");
    });

    it("should throw error if rating is negative", () => {
        const game = gameMock();
    
        expect(game).toBeDefined();

        expect(() => {
            game.changeRating(-10)
        }).toThrow("game: rating must be positive");
    });

    it("should throw error if rating is greater then 11", () => {
        const game = gameMock();
    
        expect(game).toBeDefined();

        expect(() => {
            game.changeRating(12)
        }).toThrow("game: rating must not be greater then 11");
    })
  });
});
