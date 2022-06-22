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

  test("Constructor should not throw if given an `apiKey` in a valid format.", () => {
    expect(() => new PermaAPI(DUMMY_API_KEY))
  });

  test("Constructor should throw if given an `forceBaseUrl` that is not a valid url.", () => {
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

});
