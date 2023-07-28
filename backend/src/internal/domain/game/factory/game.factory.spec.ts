import GameFactory from "./game.factory";

describe("game factory unit tests", () => {
    it("should create an active game", () => {
        const now = new Date();

        const game = GameFactory.create({
            name: "some game",
            finishedDate: now,
            finishedTime: 700,
            betCondition: "some bet condition",
            rating: 6,
            isActive: true,
        });

        expect(game).toBeDefined();
        expect(game.name).toBe("some game");
        expect(game.finishedDate).toBe(now);
        expect(game.finishedTime).toBe(700);
        expect(game.betCondition).toBe("some bet condition");
        expect(game.rating).toBe(6);
        expect(game.isActive).toBeTruthy();
        expect(game.createdAt).toBeDefined();
        expect(game.updatedAt).toBeDefined();
        expect(game.deletedAt).toBeNull();
    });

    it("should create an inactive game", () => {
        const now = new Date();

        const game = GameFactory.create({
            name: "some game",
            finishedDate: now,
            finishedTime: 700,
            betCondition: "some bet condition",
            rating: 6,
            isActive: false,
        });

        expect(game).toBeDefined();
        expect(game.name).toBe("some game");
        expect(game.finishedDate).toBe(now);
        expect(game.finishedTime).toBe(700);
        expect(game.betCondition).toBe("some bet condition");
        expect(game.rating).toBe(6);
        expect(game.isActive).toBeFalsy();
        expect(game.createdAt).toBeDefined();
        expect(game.updatedAt).toBeDefined();
        expect(game.deletedAt).toBeDefined();
    });
});