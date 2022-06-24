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
// `PermaAPI.pullOrganizations()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullOrganizations()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullOrganizations()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullOrganizations()).rejects.toThrow();
  });

  test("Returns paginated results and take into account pagination limits.", async() => {
    const results = await apiWithAuth.pullPublicArchives(10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

//------------------------------------------------------------------------------
// `PermaAPI.pullOrganization()`
//------------------------------------------------------------------------------
// Ideally: Add a test pulling actual organization details.
describe("Integration tests for PermaAPI.pullOrganization()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullOrganization(1)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullOrganization(1)).rejects.toThrow();
  });

  test("Throws when trying to pull details from an organization that the user doesn't have access to / doesn't exist.", async() => {
    expect(async() => await apiWithAuth.pullOrganization(1)).rejects.toThrow();
  });

  test("Throws when given an organization id in an invalid format.", async() => {
    expect(async() => await apiWithAuth.pullOrganization("FOO")).rejects.toThrow();
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

//------------------------------------------------------------------------------
// `PermaAPI.pullTopLevelFolders()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullTopLevelFolders()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullTopLevelFolders()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullTopLevelFolders()).rejects.toThrow();
  });

  test("Returns paginated results and take into account pagination limits.", async() => {
    const results = await apiWithAuth.pullTopLevelFolders(10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

//------------------------------------------------------------------------------
// `PermaAPI.pullFolder()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const firstFolder = (await apiWithAuth.pullTopLevelFolders()).objects[0].id;
    expect(async() => await apiNoAuth.pullFolder(firstFolder)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolder(firstFolder)).rejects.toThrow();
  });

  test("Returns folder details.", async() => {
    const firstFolder = (await apiWithAuth.pullTopLevelFolders()).objects[0].id;
    const result = await apiWithAuth.pullFolder(firstFolder);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("has_children")
  });

});
