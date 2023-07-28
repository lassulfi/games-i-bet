import TypeFactory from "./type.factory";

describe("Type factory unit tests", () => {
    it("should create an active type", () => {
        const type = TypeFactory.create("some type", true);

        expect(type.id).toBeDefined();
        expect(type.name).toBe("some type");
        expect(type.isActive).toBeTruthy();
        expect(type.updatedAt).toBeDefined();
        expect(type.updatedAt).toBeDefined();
        expect(type.deletedAt).toBeNull();
    });

    it("should create an inactive type", () => {
        const type = TypeFactory.create("some type", false);

        expect(type.id).toBeDefined();
        expect(type.name).toBe("some type");
        expect(type.isActive).toBeFalsy();
        expect(type.updatedAt).toBeDefined();
        expect(type.updatedAt).toBeDefined();
        expect(type.deletedAt).toBeDefined();
    });
});