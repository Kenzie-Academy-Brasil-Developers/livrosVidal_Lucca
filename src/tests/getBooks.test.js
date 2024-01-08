import { describe, it, expect, beforeAll } from "vitest";
import { bookDefaultExpects } from "./utils/bookDefaultExpects";
import { errorDefaultExpects } from "./utils/errorDefaultExpects";
import { request } from "./setupFiles";
import { booksDatabase } from "../database/database";
import { firstBookMock } from "./__mocks/books";

describe("get books", () => {
  beforeAll(() => {
    booksDatabase.push(firstBookMock());
  });

  it("should be able to get books correctly", async () => {
    const data = await request
      .get("/books")
      .expect(200)
      .then((response) => response.body);

    expect(data).toHaveLength(1);

    bookDefaultExpects(data[0]);

    expect(data[0].category).toBeDefined();
    expect(data[0].category).toBeTypeOf("string");
  });

  it("should be able to get a single book with the correct id", async () => {
    const data = await request
      .get("/books/1")
      .expect(200)
      .then((response) => response.body);

    bookDefaultExpects(data);

    expect(data.category).toBeDefined();
    expect(data.category).toBeTypeOf("string");
  });

  it("should throw error when the id is incorrect", async () => {
    const data = await request
      .get("/books/2")
      .expect(404)
      .then((response) => response.body);

    errorDefaultExpects(data);
    expect(data.error).toEqual("Book not found.");
  });
});
