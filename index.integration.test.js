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
 * Module-level instance of `PermaAPI`.
 */
let api = null;

//------------------------------------------------------------------------------
// Setup / teardown
//------------------------------------------------------------------------------
beforeEach(() => {
  api = new PermaAPI(
    process.env["TESTS_API_KEY"], 
    process.env["TESTS_FORCE_BASE_URL"]);
});

//------------------------------------------------------------------------------
// `PermaAPI.pullPublicArchives()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullPublicArchives()", () => {

  test("Should return paginated results and take into account pagination limits.", async() => {
    const results = await api.pullPublicArchives(10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});