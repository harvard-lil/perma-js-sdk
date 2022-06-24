/**
 * perma-js-sdk
 * @module index.integration.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Integration tests suite for `index`. Requires access to the Perma API. 
 * 
 * Important: Should be run sequentially (`jest --runInBand`).
 */
/// <reference path="types.js" />

import { PermaAPI } from "./index.js";

/**
 * Module-level instance of `PermaAPI` with valid api key.
 * Refreshed before each test (see `beforeEach()`).
 */
let apiWithAuth = null;

/**
 * Module-level instance of `PermaAPI` with no api key.
 * Refreshed before each test (see `beforeEach()`).
 */
let apiNoAuth = null;

/**
 * Module-level instance of `PermaAPI` with invalid api key.
 * Refreshed before each test (see `beforeEach()`).
 */
let apiBadAuth = null;

//------------------------------------------------------------------------------
// Setup / teardown
//------------------------------------------------------------------------------
beforeEach(() => {
  const apiKey = process.env.TESTS_API_KEY; // Throws if not set
  const forceBaseUrl = process.env.TESTS_FORCE_BASE_URL; // Throws if not set
  const dummyApiKey = "abcedfghijklmnopqrstuvwxyz12345678901234";

  apiWithAuth = new PermaAPI(apiKey, forceBaseUrl);
  apiNoAuth = new PermaAPI(null, forceBaseUrl);
  apiBadAuth = new PermaAPI(dummyApiKey, forceBaseUrl);
});

//------------------------------------------------------------------------------
// `PermaAPI.pullUser()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullUser()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullUser()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullUser()).rejects.toThrow();
  });

  test("Returns user details.", async() => {
    const result = await apiWithAuth.pullUser();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("first_name");
  });

});

//------------------------------------------------------------------------------
// `PermaAPI.pullPublicArchives()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullPublicArchives()", () => {

  test("Returns paginated results and take into account pagination limits, regardless of auth status.", async() => {
    for (let api of [apiNoAuth, apiBadAuth, apiWithAuth]) {
      const results = await api.pullPublicArchives(10, 0);
      expect(results).toHaveProperty("meta");
      expect(results).toHaveProperty("objects");
      expect(results.meta.limit).toBe(10);
      expect(results.objects.length).toBeLessThanOrEqual(10);
    }
  });

});
