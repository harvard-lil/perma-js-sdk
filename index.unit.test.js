/**
 * perma-js-sdk
 * @module index.unit.test
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Unit tests suite for `index`.
 */
/// <reference path="types.js" />

import { PermaAPI } from "./index.js";

/**
 * To be used as a mock API key.
 * @constant
 */
const DUMMY_API_KEY = "abcedfghijklmnopqrstuvwxyz12345678901234";

/**
 * To be used as a mock for `forceBaseUrl`
 * @constant
 */
const DUMMY_FORCE_BASE_URL = "https://api.perma.test:8000/";

/**
 * To be used as a mock for `forceThrottleMs`
 * @constant
 */
const DUMMY_FORCE_THROTTLE_MS = 500;

/**
 * To be used as a mock archive id
 */
const DUMMY_ARCHIVE_ID = "ABCD-1234";

describe("PermaAPI.constructor()", () => {

  test("Can be instantiated with no args.", () => {
    expect(() => new PermaAPI()).not.toThrow();
  });

  test("Throws if `apiKey` is provided but in an invalid format.", () => {
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

  test("Does not throw if `apiKey` is provided and its format is valid.", () => {
    expect(() => new PermaAPI(DUMMY_API_KEY))
  });

  test("Throws if `forceBaseUrl` is provided and its format is invalid.", () => {
    const invalidUrls = [[], {}, () => {}, 2, 2.4, "api.perma.cc"];

    for (let forceBaseUrl of invalidUrls) {
      expect(() => new PermaAPI(null, forceBaseUrl)).toThrow();
    }
  });

  test("Does not throw if `forceBaseUrl` is provided and its format is valid.", () => {
    expect(() => new PermaAPI(null, DUMMY_FORCE_BASE_URL));
  });

  test("Throws if `forceThrottleMs` is provided and its format is invalid.", () => {
    const invalid = [[], {}, () => {}, "FOO"];

    for (let forceThrottleMs of invalid) {
      expect(() => new PermaAPI(null, null, forceThrottleMs)).toThrow();
    }
  });

  test("Does not throw if `forceThrottleMs` is provided and its format is valid.", () => {
    expect(() => new PermaAPI(null, null, DUMMY_FORCE_THROTTLE_MS));
  });

  test("Can be instantiated with no args.", () => {
    expect(() => new PermaAPI()).not.toThrow();
  });

  test("Can be instantiated with all (valid) args.", () => {
    expect(() => new PermaAPI(
      DUMMY_API_KEY, 
      DUMMY_FORCE_BASE_URL, 
      DUMMY_FORCE_THROTTLE_MS)
    ).not.toThrow();
  });

});

describe("PermaAPI.validateArchiveId()", () => {

  test("Throws when given an archive id in an invalid format.", () => {
    const invalidArchiveIds = [
      [],
      {},
      () => {},
      null,
      "FOO",
      "FOOBAR",
      12,
      2.5,
      DUMMY_ARCHIVE_ID + `F`
    ];

    const api = new PermaAPI();

    for (let archiveId of invalidArchiveIds) {
      expect(() => api.validateArchiveId(archiveId)).toThrow();
    }
  });

  test("Does not throw when given an archive id in a valid format.", () => {
    expect(() => new PermaAPI().validateArchiveId(DUMMY_ARCHIVE_ID)).not.toThrow();
  });

});

describe("PermaAPI.validateFolderId()", () => {

  test("Throws when given a folder id in an invalid format.", () => {
    const invalidFolderIds = [[], {}, () => {}, "FOO", null, true];

    const api = new PermaAPI();

    for (let folderId of invalidFolderIds) {
      expect(() => api.validateFolderId(folderId)).toThrow();
    }
  });

  test("Does not throw when given a folder id in a valid format.", () => {
    const validFolderIds = [
      12,
      "12",
      "12.5", // ParseInt-able
    ];

    const api = new PermaAPI();

    for (let folderId of validFolderIds) {
      expect(() => api.validateFolderId(folderId)).not.toThrow();
    }
  });

});

describe("PermaAPI.validateOrganizationId()", () => {

  test("Throws when given a organization id in an invalid format.", () => {
    const invalidOrganizationIds = [[], {}, () => {}, "FOO", null, true];

    const api = new PermaAPI();

    for (let organizationId of invalidOrganizationIds) {
      expect(() => api.validateOrganizationId(organizationId)).toThrow();
    }
  });

  test("Does not throw when given an organization id in a valid format.", () => {
    const validOrganizationIds = [
      12,
      "12",
      "12.5", // ParseInt-able
    ];

    const api = new PermaAPI();

    for (let organizationId of validOrganizationIds) {
      expect(() => api.validateOrganizationId(organizationId)).not.toThrow();
    }
  });

});

describe("PermaAPI.validatePagination()", () => {

  test("Throws when given invalid `limit` and `offset` values or range.", () => {
    const invalidPairs = [
      [10, null],
      [10, {}],
      [10, []],
      [10, () => {}],
      [10, "FOO"],
      [10, -1]
    ];

    const api = new PermaAPI();

    for (let pair of invalidPairs) {
      expect(() => api.validatePagination(pair[0], pair[1])).toThrow();
      expect(() => api.validatePagination(pair[1], pair[0])).toThrow();
    }
  });

  test("Does not throw when given a valid `limit` and `offset` pair.", () => {
    const validPairs = [
      [10, 0],
      [1, 10],
      [1000, 0],
    ];

    const api = new PermaAPI();

    for (let pair of validPairs) {
      expect(() => api.validatePagination(...pair)).not.toThrow();
    }
  });

});