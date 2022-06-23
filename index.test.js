/**
 * perma-js-sdk
 * @module index.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Unit and integration tests suite for `index`.
 */
/// <reference path="types.js" />

import { PermaAPI } from "./index.js";

/**
 * To be used as a mock API key.
 * @constant
 */
const DUMMY_API_KEY = "abcedfghijklmnopqrstuvwxyz12345678901234";

//------------------------------------------------------------------------------
// `PermaAPI.constructor()`
//------------------------------------------------------------------------------
describe("Unit tests for PermaAPI.constructor()", () => {

  test("Can be instantiated with no args.", () => {
    expect(() => new PermaAPI()).not.toThrow();
  });

  test("Constructor should throw if `apiKey` is provided but in an invalid format.", () => {
    const invalidApiKeys = [
      [],
      {},
      () => {},
      2,
      2.4,
      DUMMY_API_KEY.substring(0, 39), // Too short
      DUMMY_API_KEY.replace("e", "é"), // Non-ASCII letter
      DUMMY_API_KEY + "a" // Too long
    ];

    for (let apiKey of invalidApiKeys) {
      expect(() => new PermaAPI(apiKey)).toThrow();
    }
  });

  test("Constructor should not throw if `apiKey` is provided and its format is valid.", () => {
    expect(() => new PermaAPI(DUMMY_API_KEY))
  });

  test("Constructor should throw if `forceBaseUrl` is provided and its format is invalid.", () => {
    const invalidUrls = [
      [],
      {},
      () => {},
      2,
      2.4,
      "api.perma.cc"
    ];

    for (let forceBaseUrl of invalidUrls) {
      expect(() => new PermaAPI(null, forceBaseUrl)).toThrow();
    }
  });

  test("Constructor should not throw if `forceBaseUrl` is provided and its format is valid.", () => {
    expect(() => new PermaAPI(null, "https://api.perma.test:8000/"));
  });

});
