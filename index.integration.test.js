/**
 * perma-js-sdk
 * @module index.integration.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Integration tests suite for `index`. Requires access to the Perma API. 
 * 
 * Important: 
 * - We strongly suggest using an API key to an account used _solely_ for integration tests purposes.
 * - This test series cannot make assumptions regarding the type of account it's pull info from, which is a limiting factor.
 */
/// <reference path="types.js" />

import { PermaAPI } from "./index.js";

/**
 * Module-level instance of `PermaAPI` with valid api key.
 * Refreshed before each test (see `beforeEach()`).
 * 
 * @type {?PermaAPI}
 */
let apiWithAuth = null;

/**
 * Module-level instance of `PermaAPI` with no api key.
 * Refreshed before each test (see `beforeEach()`).
 * 
 * @type {?PermaAPI}
 */
let apiNoAuth = null;

/**
 * Module-level instance of `PermaAPI` with invalid api key.
 * Refreshed before each test (see `beforeEach()`).
 * 
 * @type {?PermaAPI}
 */
let apiBadAuth = null;

/**
 * Default URL to archive
 */
const URL_TO_ARCHIVE = `http://info.cern.ch/hypertext/WWW/TheProject.html`;

/**
 * Pull the first PermaFolder object available from `pullTopLevelFolders`.
 * Memoized.
 * 
 * @async
 * @returns {PermaFolder}
 */
const getFirstFolder = async() => {
  if (_getFirstFolder) {
    return _getFirstFolder;
  }
  _getFirstFolder = (await apiWithAuth.pullTopLevelFolders()).objects[0];
  return _getFirstFolder;
}
let _getFirstFolder = null; // Module-level memoization for `getFirstFolder`

beforeEach(() => {
  const apiKey = process.env.TESTS_API_KEY; // Throws if not set
  const forceBaseUrl = process.env.TESTS_FORCE_BASE_URL; // Throws if not set
  const dummyApiKey = "abcedfghijklmnopqrstuvwxyz12345678901234";

  apiWithAuth = new PermaAPI(apiKey, forceBaseUrl);
  apiNoAuth = new PermaAPI(null, forceBaseUrl);
  apiBadAuth = new PermaAPI(dummyApiKey, forceBaseUrl);
});

describe("PermaAPI.pullUser()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullUser()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullUser()).rejects.toThrow();
  });

  test("Returns user details.", async() => {
    const user = await apiWithAuth.pullUser();
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("first_name");
  });

});

describe("PermaAPI.pullOrganizations()", () => {

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

// Ideally: Add a test pulling actual organization details.
describe("PermaAPI.pullOrganization()", () => {

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

describe("PermaAPI.pullPublicArchives()", () => {

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

describe("PermaAPI.pullTopLevelFolders()", () => {

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

describe("PermaAPI.pullFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const folderId = (await getFirstFolder()).id;
    expect(async() => await apiNoAuth.pullFolder(folderId)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolder(folderId)).rejects.toThrow();
  });

  test("Returns folder details.", async() => {
    const folderId = (await getFirstFolder()).id;
    const result = await apiWithAuth.pullFolder(folderId);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("has_children")
  });

});

describe("PermaAPI.pullFolderChildren()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const folderId = (await getFirstFolder()).id;
    expect(async() => await apiNoAuth.pullFolderChildren(folderId)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolderChildren(folderId)).rejects.toThrow();
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.pullFolderChildren("FOO")).rejects.toThrow();
  });

  test("Returns paginated results and takes into account pagination limits.", async() => {
    const folderId = (await getFirstFolder()).id;
    const results = await apiWithAuth.pullFolderChildren(folderId, 10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

describe("PermaAPI.createFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const name = "Integration Test folder";

    expect(async() => await apiNoAuth.createFolder(parentFolderId, name)).rejects.toThrow();
    expect(async() => await apiBadAuth.createFolder(parentFolderId, name)).rejects.toThrow();
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.createFolder("FOO", "FOO")).rejects.toThrow();
  });

  test("Returns new folder details.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const name = "Integration Test folder";

    const newFolder = await apiWithAuth.createFolder(parentFolderId, name);
    expect(newFolder).toHaveProperty("id");
    expect(newFolder).toHaveProperty("name");
    expect(newFolder).toHaveProperty("has_children");
    expect(newFolder).toHaveProperty("parent");
    expect(newFolder.parent).toBe(parentFolderId);

    await apiWithAuth.deleteFolder(newFolder.id);
  });

});

describe("PermaAPI.moveFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder = await apiWithAuth.createFolder(parentFolderId, "This is a new folder");

    expect(async() => await apiNoAuth.moveFolder(newFolder.id, parentFolderId)).rejects.toThrow();
    expect(async() => await apiBadAuth.moveFolder(newFolder.id, parentFolderId)).rejects.toThrow();

    await apiWithAuth.deleteFolder(newFolder.id);
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.moveFolder("FOO", "BAR")).rejects.toThrow();
  });

  test("Returns moved folder details.", async() => {
    // Setup:
    // - Two new folders under `getFirstFolder`
    // - Try to move one of the two one level under
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder1 = await apiWithAuth.createFolder(parentFolderId, "Test 1");
    const newFolder2 = await apiWithAuth.createFolder(parentFolderId, "Test 2");

    const movedFolder = await apiWithAuth.moveFolder(newFolder1.id, newFolder2.id);
    expect(movedFolder).toHaveProperty("id");
    expect(movedFolder).toHaveProperty("name");
    expect(movedFolder).toHaveProperty("parent");
    expect(movedFolder.parent).toBe(newFolder2.id);

    await apiWithAuth.deleteFolder(newFolder1.id);
    await apiWithAuth.deleteFolder(newFolder2.id);
  });

});

describe("PermaAPI.deleteFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder = await apiWithAuth.createFolder(parentFolderId, "This is a new folder");

    expect(async() => await apiNoAuth.deleteFolder(newFolder.id)).rejects.toThrow();
    expect(async() => await apiBadAuth.deleteFolder(newFolder.id)).rejects.toThrow();

    await apiWithAuth.deleteFolder(newFolder.id);
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.deleteFolder("FOO")).rejects.toThrow();
  });

  test("Folder gets deleted.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder = await apiWithAuth.createFolder(parentFolderId, "This is a new folder");

    const result = await apiWithAuth.deleteFolder(newFolder.id);
    expect(result).toBe(true);
    expect(async() => await apiWithAuth.pullFolder(newFolder.id)).rejects.toThrow();
  });

});

describe("PermaAPI.editFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder = await apiWithAuth.createFolder(parentFolderId, "This is a new folder");
    const options = {name: "New folder name"};

    expect(async() => await apiNoAuth.editFolder(newFolder.id, options)).rejects.toThrow();
    expect(async() => await apiBadAuth.editFolder(newFolder.id, options)).rejects.toThrow();

    await apiWithAuth.deleteFolder(newFolder.id);
  });

  test("Throws if invalid folder id provided.", () => {
    const options = {name: "Bar"};
    expect(async() => await apiWithAuth.editFolder("FOO", options)).rejects.toThrow();
  });

  test("Folder details are edited and returned.", async() => {
    const parentFolderId = (await getFirstFolder()).id;
    const newFolder = await apiWithAuth.createFolder(parentFolderId, "This is a new folder");
    const options = {name: "New folder name"};

    const editedFolder = await apiWithAuth.editFolder(newFolder.id, options);
    expect(editedFolder).toHaveProperty("id");
    expect(editedFolder).toHaveProperty("name");
    expect(editedFolder).toHaveProperty("parent");
    expect(editedFolder.name).toBe(options.name);

    await apiWithAuth.deleteFolder(newFolder.id);
  });

});

describe("PermaAPI.createArchive()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.createArchive(URL_TO_ARCHIVE)).rejects.toThrow();
    expect(async() => await apiBadAuth.createArchive(URL_TO_ARCHIVE)).rejects.toThrow();
  });

  test("Throws if invalid url provided.", async() => {
    const badUrl = URL_TO_ARCHIVE.substring(1);
    expect(async() => await apiWithAuth.createArchive(badUrl)).rejects.toThrow();
  });

  test("Throws if invalid folder id provided.", async() => {
    const options = {parentFolderId: "FOO"};
    expect(async() => await apiWithAuth.createArchive(URL_TO_ARCHIVE, options)).rejects.toThrow();
  });

  test("Creates a new archive, no options.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);
    expect(archive).toHaveProperty("guid");
    expect(archive).toHaveProperty("url");
    expect(archive.url).toBe(URL_TO_ARCHIVE);

    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Creates a new archive, all options.", async() => {
    const options = {
      title: "Title override", 
      parentFolderId: (await getFirstFolder()).id, 
      isPrivate: true, 
      notes: "This is a test note" 
    };

    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE, options);
    expect(archive).toHaveProperty("guid");
    expect(archive).toHaveProperty("url");
    expect(archive).toHaveProperty("title");
    expect(archive).toHaveProperty("is_private");
    expect(archive).toHaveProperty("notes");
    expect(archive.url).toBe(URL_TO_ARCHIVE);
    expect(archive.title).toBe(options.title);
    expect(archive.is_private).toBe(options.isPrivate);
    expect(archive.notes).toBe(options.notes);

    await apiWithAuth.deleteArchive(archive.guid);
  });

});
