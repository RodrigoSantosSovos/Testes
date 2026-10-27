import assert from "node:assert/strict";
import test from "node:test";
import { greet } from "../src/greet.js";

test("greet returns a personalized message", () => {
  assert.equal(greet("Testes"), "Hello, Testes!");
});

test("greet rejects empty names", () => {
  assert.throws(() => greet(""), /name is required/);
});
