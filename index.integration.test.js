/**
 * perma-js-sdk
 * @module index.integration.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Integration tests suite for `index`. Requires access to a Perma API instance. 
 * 
 * Notes: 
 * - We suggest running this test in series (`--runInBand`).
 * - We suggest using an API key for an account used solely for integration tests purposes.
 * - This test series cannot make assumptions regarding the type of account it's pull info from, which is a limiting factor.
 */
/// <reference path="types.js" />

import { PermaAPI } from "./index.js";

/**
 * Default URL to archive
 */
const URL_TO_ARCHIVE = `http://info.cern.ch/hypertext/WWW/TheProject.html`;

/**
 * Name to give to temporary folder
 */
const TMP_FOLDER_NAME = `Temporary`

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

/**
 * Before each test:
 * Instantiate three separate `PermaAPI` instances with different level of authentication.
 * These instances use credentials and settings provided by `TESTS_XYZ` environment variables (see README.md).
 */
beforeEach(async() => {
  const dummyApiKey = "abcedfghijklmnopqrstuvwxyz12345678901234";
  const apiKey = process.env.TESTS_API_KEY; // Throws if not set
  const forceBaseUrl = process.env.TESTS_FORCE_BASE_URL; // Throws if not set
  const forceThrottleMs = process.env["TESTS_FORCE_THROTTLE_MS"] ? process.env.TESTS_FORCE_THROTTLE_MS : null;

  apiWithAuth = new PermaAPI(apiKey, forceBaseUrl, forceThrottleMs);
  apiNoAuth = new PermaAPI(null, forceBaseUrl, forceThrottleMs);
  apiBadAuth = new PermaAPI(dummyApiKey, forceBaseUrl, forceThrottleMs);
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
    const parentFolder = await getFirstFolder();
    const name = "Integration Test folder";

    expect(async() => await apiNoAuth.createFolder(parentFolder.id, name)).rejects.toThrow();
    expect(async() => await apiBadAuth.createFolder(parentFolder.id, name)).rejects.toThrow();
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.createFolder("FOO", "FOO")).rejects.toThrow();
  });

  test("Returns new folder details.", async() => {
    const parentFolder = await getFirstFolder();

    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);
    expect(newFolder).toHaveProperty("id");
    expect(newFolder).toHaveProperty("name");
    expect(newFolder).toHaveProperty("has_children");
    expect(newFolder).toHaveProperty("parent");
    expect(newFolder.parent).toBe(parentFolder.id);

    await apiWithAuth.deleteFolder(newFolder.id);
  });

});

describe("PermaAPI.moveFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolder = await getFirstFolder();
    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);

    expect(async() => await apiNoAuth.moveFolder(newFolder.id, parentFolder.id)).rejects.toThrow();
    expect(async() => await apiBadAuth.moveFolder(newFolder.id, parentFolder.id)).rejects.toThrow();

    await apiWithAuth.deleteFolder(newFolder.id);
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.moveFolder("FOO", "BAR")).rejects.toThrow();
  });

  test("Returns moved folder details.", async() => {
    // Setup:
    // - Two new folders under `getFirstFolder`
    // - Try to move one of the two one level under
    const parentFolder = await getFirstFolder();
    const newFolder1 = await apiWithAuth.createFolder(parentFolder.id, `${TMP_FOLDER_NAME} 1`);
    const newFolder2 = await apiWithAuth.createFolder(parentFolder.id, `${TMP_FOLDER_NAME} 2`);

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
    const parentFolder = await getFirstFolder();
    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);

    expect(async() => await apiNoAuth.deleteFolder(newFolder.id)).rejects.toThrow();
    expect(async() => await apiBadAuth.deleteFolder(newFolder.id)).rejects.toThrow();

    await apiWithAuth.deleteFolder(newFolder.id);
  });

  test("Throws if invalid folder id provided.", () => {
    expect(async() => await apiWithAuth.deleteFolder("FOO")).rejects.toThrow();
  });

  test("Deletes a folder and returns a boolean.", async() => {
    const parentFolder = await getFirstFolder();
    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);

    const result = await apiWithAuth.deleteFolder(newFolder.id);
    expect(result).toBe(true);

    // Double check that folder was deleted
    expect(async() => await apiWithAuth.pullFolder(newFolder.id)).rejects.toThrow();
  });

});

describe("PermaAPI.editFolder()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolder = await getFirstFolder();
    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);
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
    const parentFolder = await getFirstFolder();
    const newFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);
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

  test("Creates a new archive and returns details (no options).", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);
    expect(archive).toHaveProperty("guid");
    expect(archive).toHaveProperty("url");
    expect(archive.url).toBe(URL_TO_ARCHIVE);

    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Creates a new archive and returns details (all options).", async() => {
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

    // Check that the archive was created in `parentFolderId`
    const folderArchives = await apiWithAuth.pullFolderArchives(options.parentFolderId);
    let archiveIsInTargetFolder = false;

    for (let folderArchive of folderArchives.objects) {
      if (folderArchive.guid === archive.guid) {
        archiveIsInTargetFolder = true;
        break;
      }
    }
    expect(archiveIsInTargetFolder).toBe(true);

    await apiWithAuth.deleteArchive(archive.guid);
  });

});

describe("PermaAPI.pullArchives()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullArchives()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullArchives()).rejects.toThrow();
  });

  test("Returns paginated results and takes into account pagination limits.", async() => {
    const results = await apiWithAuth.pullArchives(10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

describe("PermaAPI.pullArchive()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    expect(async() => await apiNoAuth.pullArchive(archive.guid)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullArchive(archive.guid)).rejects.toThrow();

    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Throws if no / invalid archive id provided..", async() => {
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.pullArchive(archiveId)).rejects.toThrow();
    }
  });

  test("Returns archive details.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    const result = await apiWithAuth.pullArchive(archive.guid);
    expect(result).toHaveProperty("guid");
    expect(result).toHaveProperty("url");
    expect(result.url).toBe(URL_TO_ARCHIVE);
    expect(result.guid).toBe(archive.guid);

    await apiWithAuth.deleteArchive(archive.guid);
  });

});

describe("Perma.editArchive()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    expect(async() => await apiNoAuth.editArchive(archive.guid)).rejects.toThrow();
    expect(async() => await apiBadAuth.editArchive(archive.guid)).rejects.toThrow();

    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Throws if no / invalid archive id provided..", async() => {
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.editArchive(archiveId)).rejects.toThrow();
    }
  });

  test("Edits an archive archive and returns details (all options).", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    const options = {
      title: "Title override", 
      isPrivate: true, 
      notes: "This is a test note" 
    };

    const editedArchive = await apiWithAuth.editArchive(archive.guid, options);
    expect(editedArchive).toHaveProperty("guid");
    expect(editedArchive).toHaveProperty("url");
    expect(editedArchive).toHaveProperty("title");
    expect(editedArchive).toHaveProperty("is_private");
    expect(editedArchive).toHaveProperty("notes");
    expect(editedArchive.url).toBe(URL_TO_ARCHIVE);
    expect(editedArchive.title).toBe(options.title);
    expect(editedArchive.is_private).toBe(options.isPrivate);
    expect(editedArchive.notes).toBe(options.notes);

    await apiWithAuth.deleteArchive(archive.guid);
  });

});

describe("Perma.moveArchive()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const parentFolder = await getFirstFolder();
    const targetFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);

    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE, {
      parentFolderId: parentFolder.id,
    });

    expect(async() => await apiNoAuth.moveArchive(archive.guid, targetFolder.id)).rejects.toThrow();
    expect(async() => await apiBadAuth.moveArchive(archive.guid, targetFolder.id)).rejects.toThrow();

    await apiWithAuth.deleteArchive(archive.guid);
    await apiWithAuth.deleteFolder(targetFolder.id);
  });

  test("Throws if invalid folder id provided.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);
    expect(async() => await apiWithAuth.moveArchive(archive.guid, "FOO")).rejects.toThrow();
    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Throws if no / invalid archive id provided..", async() => {
    const folderId = await getFirstFolder();
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.moveArchive(archiveId, folderId)).rejects.toThrow();
    }
  });

  test("Moves archive from folder A to B and returns archive details.", async() => {
    const parentFolder = await getFirstFolder();
    const targetFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);

    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE, {
      parentFolderId: parentFolder.id,
    }); 

    const movedArchive = await apiWithAuth.moveArchive(archive.guid, targetFolder.id);
    expect(movedArchive).toHaveProperty("guid");
    expect(movedArchive).toHaveProperty("url");
    expect(movedArchive.url).toBe(URL_TO_ARCHIVE);

    // Check that the archive was moved to `targetFolder`
    const folderArchives = await apiWithAuth.pullFolderArchives(targetFolder.id);
    let archiveIsInTargetFolder = false;

    for (let folderArchive of folderArchives.objects) {
      if (folderArchive.guid === movedArchive.guid) {
        archiveIsInTargetFolder = true;
        break;
      }
    }
    expect(archiveIsInTargetFolder).toBe(true);

    await apiWithAuth.deleteArchive(archive.guid);
    await apiWithAuth.deleteFolder(targetFolder.id);
  });

});

describe("Perma.deleteArchive()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    expect(async() => await apiNoAuth.deleteArchive(archive.guid)).rejects.toThrow();
    expect(async() => await apiBadAuth.deleteArchive(archive.guid)).rejects.toThrow();

    await apiWithAuth.deleteArchive(archive.guid);
  });

  test("Throws if no / invalid archive id provided..", async() => {
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.deleteArchive(archiveId)).rejects.toThrow();
    }
  });

  test("Deletes an archive and returns a boolean.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE); 

    const result = await apiWithAuth.deleteArchive(archive.guid);
    expect(result).toBe(true);

    // Double-check that it was deleted
    expect(async() => await apiWithAuth.pullArchive(archive.guid)).rejects.toThrow();
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

describe("PermaAPI.pullPublicArchive()", () => {

  test("Throws if no / invalid archive id provided..", async() => {
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.pullPublicArchive(archiveId)).rejects.toThrow();
    }
  });

  test("Returns public archive details, regardless of auth status.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    for (let api of [apiBadAuth, apiNoAuth, apiWithAuth]) {
      const result = await api.pullPublicArchive(archive.guid);
      expect(result).toHaveProperty("guid");
      expect(result).toHaveProperty("url");
      expect(result.url).toBe(URL_TO_ARCHIVE);
      expect(result.guid).toBe(archive.guid);
    }

    await apiWithAuth.deleteArchive(archive.guid);
  });

});

describe("PermaAPI.pullFolderArchives()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const folder = await getFirstFolder();
    expect(async() => await apiNoAuth.pullFolderArchives(folder.id)).rejects.toThrow();
    expect(async() => await apiBadAuth.pullFolderArchives(folder.id)).rejects.toThrow();
  });

  test("Throws if invalid folder id provided.", async() => {
    expect(async() => await apiWithAuth.pullFolderArchives("FOO")).rejects.toThrow();
  });

  test("Returns paginated results and takes into account pagination limits.", async() => {
    const folder = await getFirstFolder();
    const results = await apiWithAuth.pullFolderArchives(folder.id, 10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

describe("PermaAPI.pullOngoingCaptureJobs()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async() => await apiNoAuth.pullOngoingCaptureJobs()).rejects.toThrow();
  });  

  test("Returns paginated results and takes into account pagination limits.", async() => {
    const results = await apiWithAuth.pullOngoingCaptureJobs(10, 0);
    expect(results).toHaveProperty("meta");
    expect(results).toHaveProperty("objects");
    expect(results.meta.limit).toBe(10);
    expect(results.objects.length).toBeLessThanOrEqual(10);
  });

});

describe("PermaAPI.pullArchiveCaptureJob()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    expect(async() => await apiNoAuth.pullArchiveCaptureJob()).rejects.toThrow();
    expect(async() => await apiBadAuth.pullArchiveCaptureJob()).rejects.toThrow();

    await apiWithAuth.deleteArchive(archive.guid);
  });  

  test("Throws if no / invalid archive id provided.", async() => {
    const invalidArchiveIds = [null, "FOO", [], {}, 12];

    for (let archiveId of invalidArchiveIds) {
      expect(async() => await apiWithAuth.pullArchiveCaptureJob(archiveId)).rejects.toThrow();
    }
  });

  test("Returns latest capture job detail.", async() => {
    const archive = await apiWithAuth.createArchive(URL_TO_ARCHIVE);

    const captureJob = await apiWithAuth.pullArchiveCaptureJob(archive.guid);
    expect(captureJob).toHaveProperty("guid");
    expect(captureJob).toHaveProperty("status");

    await apiWithAuth.deleteArchive(archive.guid); 
  });

});

describe("PermaAPI.createArchivesBatch()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    const folder = await getFirstFolder();

    expect(
      async () => await apiNoAuth.createArchivesBatch([URL_TO_ARCHIVE], folder.id)
    ).rejects.toThrow();

    expect(
      async () => await apiBadAuth.createArchivesBatch([URL_TO_ARCHIVE], folder.id)
    ).rejects.toThrow();
  });  

  test("Throws if invalid folder id provided.", async() => {
    expect(
      async () => await apiWithAuth.createArchivesBatch([URL_TO_ARCHIVE], "FOO")
    ).rejects.toThrow();
  });

  test("Creates a batch of archives and returns details.", async() => {
    const parentFolder = await getFirstFolder();
    const targetFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);
    const urls = [URL_TO_ARCHIVE, URL_TO_ARCHIVE];

    const batch = await apiWithAuth.createArchivesBatch(urls, targetFolder.id);
    expect(batch).toHaveProperty("id");
    expect(batch).toHaveProperty("started_on");
    expect(batch).toHaveProperty("capture_jobs");
    expect(batch).toHaveProperty("target_folder");
    expect(batch.target_folder.id).toBe(targetFolder.id);

    // Delete archives and folders created during this batch
    for (let captureJob of batch.capture_jobs) {
      await apiWithAuth.deleteArchive(captureJob.guid);
    }

    await apiWithAuth.deleteFolder(targetFolder.id);
  });

});

describe("PermaAPI.pullArchivesBatch()", () => {

  test("Throws if no / invalid api key provided.", async() => {
    expect(async () => await apiNoAuth.pullArchivesBatch(1)).rejects.toThrow();
    expect(async () => await apiBadAuth.pullArchivesBatch(1)).rejects.toThrow();
  });  

  test("Throws if invalid batch id provided.", async() => {
    expect(async () => await apiNoAuth.pullArchivesBatch("FOO")).rejects.toThrow();
  });

  test("Returns details of a batch.", async() => {
    const parentFolder = await getFirstFolder();
    const targetFolder = await apiWithAuth.createFolder(parentFolder.id, TMP_FOLDER_NAME);
    const urls = [URL_TO_ARCHIVE, URL_TO_ARCHIVE];
    const batch = await apiWithAuth.createArchivesBatch(urls, targetFolder.id);
    
    const pulledBatch = await apiWithAuth.pullArchivesBatch(batch.id);
    expect(pulledBatch).toHaveProperty("id");
    expect(pulledBatch).toHaveProperty("started_on");
    expect(pulledBatch).toHaveProperty("capture_jobs");
    expect(pulledBatch).toHaveProperty("target_folder");
    expect(pulledBatch.id).toBe(batch.id);
    expect(pulledBatch.target_folder.id).toBe(targetFolder.id);

    // Delete archives and folders created during this batch
    for (let captureJob of batch.capture_jobs) {
      await apiWithAuth.deleteArchive(captureJob.guid);
    }

    await apiWithAuth.deleteFolder(targetFolder.id);
  });

});