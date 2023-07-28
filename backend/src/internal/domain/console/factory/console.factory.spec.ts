import ConsoleFactory from "./console.factory";

describe("Console factory unit tests", () => {
    it("should create a active console", () => {
        const console = ConsoleFactory.create("some console", true);

        expect(console.id).toBeDefined();
        expect(console.name).toBe("some console");
        expect(console.isActive).toBeTruthy();
        expect(console.createdAt).toBeDefined();
        expect(console.updatedAt).toBeDefined();
        expect(console.deletedAt).toBeNull();
    });

    it("should create an inactive console", () => {
        const console = ConsoleFactory.create("some console", false);

        expect(console.id).toBeDefined();
        expect(console.name).toBe("some console");
        expect(console.isActive).toBeFalsy();
        expect(console.createdAt).toBeDefined();
        expect(console.updatedAt).toBeDefined();
        expect(console.deletedAt).toBeDefined();
    })
});