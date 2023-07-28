import GenreFactory from "./genre.factory";

describe("Genre factory unit tests", () => {
    it("should create an active genre", () => {
        const genre = GenreFactory.create("some genre", true);

        expect(genre.id).toBeDefined();
        expect(genre.name).toBe("some genre");
        expect(genre.isActive).toBeTruthy();
        expect(genre.updatedAt).toBeDefined();
        expect(genre.updatedAt).toBeDefined();
        expect(genre.deletedAt).toBeNull();
    });

    it("should create an inactive genre", () => {
        const genre = GenreFactory.create("some genre", false);

        expect(genre.id).toBeDefined();
        expect(genre.name).toBe("some genre");
        expect(genre.isActive).toBeFalsy();
        expect(genre.updatedAt).toBeDefined();
        expect(genre.updatedAt).toBeDefined();
        expect(genre.deletedAt).toBeDefined();
    });
});