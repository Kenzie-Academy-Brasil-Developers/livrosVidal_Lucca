import { describe, it, expect, beforeAll } from "vitest";
import { booksDatabase } from "../database/database";
import { bookDefaultExpects } from "./utils/bookDefaultExpects";
import { errorDefaultExpects } from "./utils/errorDefaultExpects";
import { request } from "./setupFiles";

describe("create book", () => {
  beforeAll(() => {
    booksDatabase.length = 0;
  });

  it("should be able to create a book sucessfully", async () => {
    const data = await request
      .post("/books")
      .send({
        name: "Harry Potter",
        pages: 325,
        category: "fantasia",
      })
      .expect(201)
      .then((response) => response.body);

    bookDefaultExpects(data);
    expect(data.category).toBeDefined();
    expect(data.category).toBeTypeOf("string");
    expect(data.id).toEqual(1);
  });

  it("should be able to create a book without a category", async () => {
    const data = await request
      .post("/books")
      .send({
        name: "Jogos Vorazes",
        pages: 225,
      })
      .expect(201)
      .then((response) => response.body);

    bookDefaultExpects(data);
    expect(data.category).toBeUndefined();
    expect(data.id).toEqual(2);
  });

  it("should not be able to create a book with the same name", async () => {
    const data = await request
      .post("/books")
      .send({
        name: "Jogos Vorazes",
        pages: 225,
      })
      .expect(409)
      .then((response) => response.body);

    errorDefaultExpects(data);
    expect(data.error).toEqual("Book already registered.");
  });
});
