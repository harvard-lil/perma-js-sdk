/**
 * perma-js-sdk
 * @module index.integration.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Integration tests suite for `index`. Requires access to the Perma API. 
 * 
 * Important: 
 * - We strongly suggest using an API key to an account used _solely_ for integration tests purposes.
 * - Should be run sequentially (`jest --runInBand`).
 * - This test series cannot make assumptions regarding the type of account it's pull info from, which is a limiting factor.
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

/**
 * Pull the first PermaFolder object available from `pullTopLevelFolders`.
 * Memoized.
 * 
 * @async
 * @returns {PermaFolder}
 */
const firstFolder = async() => {
  if (_firstFolder) {
    return _firstFolder;
  }
  _firstFolder = (await apiWithAuth.pullTopLevelFolders()).objects[0];
  return _firstFolder;
}
let _firstFolder = null; // Module-level memoization for `firstFolder`

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

  test("Returns paginated results and takes into account pagination limits.", async() => {
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

  test("Returns paginated results and takes into account pagination limits, regardless of auth status.", async() => {
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

  test("Returns paginated results and takes into account pagination limits.", async() => {
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
    const folderId = (await firstFolder()).id;
    expect(async() => await apiNoAuth.pullFolder(folderId)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolder(folderId)).rejects.toThrow();
  });

  test("Returns folder details.", async() => {
    const folderId = (await firstFolder()).id;
    const result = await apiWithAuth.pullFolder(folderId);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("has_children")
  });

});

//------------------------------------------------------------------------------
// `PermaAPI.pullFolderChildren()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.pullFolderChildren()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const folderId = (await firstFolder()).id;
    expect(async() => await apiNoAuth.pullFolderChildren(folderId)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolderChildren(folderId)).rejects.toThrow();
  });

  test("Returns paginated results and takes into account pagination limits.", async() => {
    const folderId = (await firstFolder()).id;
    const results = await apiWithAuth.pullFolderChildren(folderId, 10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

//------------------------------------------------------------------------------
// `PermaAPI.createFolder()`
//------------------------------------------------------------------------------
describe("Integration tests for PermaAPI.createFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolderId = (await firstFolder()).id;
    const name = "Integration Test folder";

    expect(async() => await apiNoAuth.createFolder(parentFolderId, name)).rejects.toThrow();
    expect(async() => await apiBadAuth.createFolder(parentFolderId, name)).rejects.toThrow();
  });

  test("Returns new folder details.", async() => {
    const parentFolderId = (await firstFolder()).id;
    const name = "Integration Test folder";

    const result = await apiWithAuth.createFolder(parentFolderId, name);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("has_children")

    // Delete temporary folder
    apiWithAuth.deleteFolder(result.id);
  });

});

