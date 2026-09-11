/**
 * Hermetic API-contract tests for PermaAPI.
 *
 * These tests cover every HTTP-facing SDK method without contacting a Perma
 * deployment. The live suite remains available separately for local use.
 */
import { jest } from "@jest/globals";

import { PermaAPI, PermaAPIError } from "./index.js";

const API_KEY = "abcdefghijklmnopqrstuvwxyz12345678901234";
const BASE_URL = "https://api.perma.test:8000";
const ARCHIVE_ID = "ABCD-1234";
const RESPONSE_DATA = { ok: true };
const AUTHORIZATION = `ApiKey ${API_KEY}`;

function response(data = RESPONSE_DATA, status = 200) {
  return {
    status,
    json: jest.fn().mockResolvedValue(data),
  };
}

function expectRequest({ url, method, authenticated = true, body }) {
  expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  const [actualUrl, options] = globalThis.fetch.mock.calls[0];

  expect(actualUrl).toBe(url);

  if (!method && !authenticated && body === undefined) {
    expect(options).toBeUndefined();
    return;
  }

  expect(options.method).toBe(method || "GET");
  expect(options.headers).toEqual({
    ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    ...(authenticated ? { Authorization: AUTHORIZATION } : {}),
  });

  if (body === undefined) {
    expect(options.body).toBeUndefined();
  } else {
    expect(JSON.parse(options.body)).toEqual(body);
  }
}

beforeEach(() => {
  globalThis.fetch = jest.fn().mockResolvedValue(response());
});

afterEach(() => {
  jest.restoreAllMocks();
  delete globalThis.fetch;
});

describe("PermaAPI HTTP contract", () => {
  const cases = [
    {
      name: "pullPublicArchives",
      invoke: (api) => api.pullPublicArchives(25, 5),
      request: {
        url: `${BASE_URL}/v1/public/archives?limit=25&offset=5`,
        authenticated: false,
      },
    },
    {
      name: "pullPublicArchive",
      invoke: (api) => api.pullPublicArchive(ARCHIVE_ID),
      request: {
        url: `${BASE_URL}/v1/public/archives/${ARCHIVE_ID}`,
        authenticated: false,
      },
    },
    {
      name: "pullUser",
      invoke: (api) => api.pullUser(),
      request: { url: `${BASE_URL}/v1/user`, method: "GET" },
    },
    {
      name: "pullOrganizations",
      invoke: (api) => api.pullOrganizations(),
      request: { url: `${BASE_URL}/v1/organizations`, method: "GET" },
    },
    {
      name: "pullOrganization",
      invoke: (api) => api.pullOrganization(12),
      request: { url: `${BASE_URL}/v1/organization/12`, method: "GET" },
    },
    {
      name: "createArchive",
      invoke: (api) => api.createArchive("https://example.test/page?x=1", {
        title: "Example",
        parentFolderId: 12,
        isPrivate: true,
        notes: "A note",
      }),
      request: {
        url: `${BASE_URL}/v1/archives`,
        method: "POST",
        body: {
          url: "https://example.test/page?x=1",
          title: "Example",
          folder: 12,
          is_private: true,
          notes: "A note",
        },
      },
    },
    {
      name: "pullArchive",
      invoke: (api) => api.pullArchive(ARCHIVE_ID),
      request: { url: `${BASE_URL}/v1/archives/${ARCHIVE_ID}`, method: "GET" },
    },
    {
      name: "editArchive",
      invoke: (api) => api.editArchive(ARCHIVE_ID, {
        title: "Updated",
        notes: "Updated note",
        isPrivate: false,
      }),
      request: {
        url: `${BASE_URL}/v1/archives/${ARCHIVE_ID}`,
        method: "PATCH",
        body: { title: "Updated", notes: "Updated note", is_private: false },
      },
    },
    {
      name: "moveArchive",
      invoke: (api) => api.moveArchive(ARCHIVE_ID, 12),
      request: {
        url: `${BASE_URL}/v1/folders/12/archives/${ARCHIVE_ID}`,
        method: "PUT",
      },
    },
    {
      name: "pullArchives",
      invoke: (api) => api.pullArchives(25, 5, "https://example.test/page?x=1"),
      request: {
        url: `${BASE_URL}/v1/archives?limit=25&offset=5&url=https%3A%2F%2Fexample.test%2Fpage%3Fx%3D1`,
        method: "GET",
      },
    },
    {
      name: "pullTopLevelFolders",
      invoke: (api) => api.pullTopLevelFolders(25, 5),
      request: { url: `${BASE_URL}/v1/folders?limit=25&offset=5`, method: "GET" },
    },
    {
      name: "pullFolder",
      invoke: (api) => api.pullFolder(12),
      request: { url: `${BASE_URL}/v1/folders/12/`, method: "GET" },
    },
    {
      name: "pullFolderChildren",
      invoke: (api) => api.pullFolderChildren(12, 25, 5),
      request: {
        url: `${BASE_URL}/v1/folders/12/folders?limit=25&offset=5`,
        method: "GET",
      },
    },
    {
      name: "createFolder",
      invoke: (api) => api.createFolder(12, "Folder name"),
      request: {
        url: `${BASE_URL}/v1/folders/12/folders`,
        method: "POST",
        body: { name: "Folder name" },
      },
    },
    {
      name: "editFolder",
      invoke: (api) => api.editFolder(12, { name: "Renamed" }),
      request: {
        url: `${BASE_URL}/v1/folders/12`,
        method: "PATCH",
        body: { name: "Renamed" },
      },
    },
    {
      name: "moveFolder",
      invoke: (api) => api.moveFolder(12, 34),
      request: { url: `${BASE_URL}/v1/folders/34/folders/12`, method: "PUT" },
    },
    {
      name: "pullFolderArchives",
      invoke: (api) => api.pullFolderArchives(12, 25, 5),
      request: {
        url: `${BASE_URL}/v1/folders/12/archives?limit=25&offset=5`,
        method: "GET",
      },
    },
    {
      name: "pullOngoingCaptureJobs",
      invoke: (api) => api.pullOngoingCaptureJobs(25, 5),
      request: { url: `${BASE_URL}/v1/capture_jobs?limit=25&offset=5`, method: "GET" },
    },
    {
      name: "pullArchiveCaptureJob",
      invoke: (api) => api.pullArchiveCaptureJob(ARCHIVE_ID),
      request: { url: `${BASE_URL}/v1/capture_jobs/${ARCHIVE_ID}`, method: "GET" },
    },
    {
      name: "createArchivesBatch",
      invoke: (api) => api.createArchivesBatch(
        ["https://example.test/one", "https://example.test/two"],
        12,
      ),
      request: {
        url: `${BASE_URL}/v1/archives/batches`,
        method: "POST",
        body: {
          urls: ["https://example.test/one", "https://example.test/two"],
          target_folder: 12,
        },
      },
    },
    {
      name: "pullArchivesBatch",
      invoke: (api) => api.pullArchivesBatch(56),
      request: { url: `${BASE_URL}/v1/archives/batches/56`, method: "GET" },
    },
  ];

  test.each(cases)("$name sends the documented request", async ({ invoke, request }) => {
    const result = await invoke(new PermaAPI(API_KEY, `${BASE_URL}/ignored/path`));

    expect(result).toEqual(RESPONSE_DATA);
    expectRequest(request);
  });

  test("deleteFolder sends DELETE and returns true", async () => {
    const result = await new PermaAPI(API_KEY, BASE_URL).deleteFolder(12);

    expect(result).toBe(true);
    expectRequest({ url: `${BASE_URL}/v1/folders/12`, method: "DELETE" });
  });

  test("deleteArchive can bypass safe-mode polling and returns true", async () => {
    const result = await new PermaAPI(API_KEY, BASE_URL).deleteArchive(ARCHIVE_ID, false);

    expect(result).toBe(true);
    expectRequest({ url: `${BASE_URL}/v1/archives/${ARCHIVE_ID}`, method: "DELETE" });
  });

  test("deleteArchive waits for pending captures before deleting", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(response({ captures: [{ status: "pending" }] }))
      .mockResolvedValueOnce(response({ captures: [{ status: "success" }] }))
      .mockResolvedValueOnce(response({}, 204));
    jest.spyOn(globalThis, "setTimeout").mockImplementation((callback) => {
      callback();
      return 0;
    });

    const result = await new PermaAPI(API_KEY, BASE_URL).deleteArchive(ARCHIVE_ID);

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    expect(globalThis.fetch.mock.calls.map(([url, options]) => [url, options.method])).toEqual([
      [`${BASE_URL}/v1/archives/${ARCHIVE_ID}`, "GET"],
      [`${BASE_URL}/v1/archives/${ARCHIVE_ID}`, "GET"],
      [`${BASE_URL}/v1/archives/${ARCHIVE_ID}`, "DELETE"],
    ]);
  });
});

describe("PermaAPI response and authentication handling", () => {
  test("protected methods reject missing credentials before making a request", async () => {
    await expect(new PermaAPI(null, BASE_URL).pullUser()).rejects.toThrow(
      "This method requires an API key.",
    );
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("createArchive rejects malformed URLs before making a request", async () => {
    await expect(
      new PermaAPI(API_KEY, BASE_URL).createArchive("not a URL"),
    ).rejects.toThrow("`url` needs to be a valid url.");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test("non-2xx JSON responses become PermaAPIError values", async () => {
    globalThis.fetch.mockResolvedValue(response({ detail: "Denied" }, 403));

    let error;
    try {
      await new PermaAPI(API_KEY, BASE_URL).pullUser();
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(PermaAPIError);
    expect(error).toMatchObject({ httpStatusCode: 403, detail: "Denied" });
    expect(error.message).toBe("HTTP 403 Denied");
  });

  test("successful empty responses return an empty object", async () => {
    globalThis.fetch.mockResolvedValue({
      status: 204,
      json: jest.fn().mockRejectedValue(new SyntaxError("empty body")),
    });

    await expect(new PermaAPI(API_KEY, BASE_URL).pullUser()).resolves.toEqual({});
  });

  test("network errors propagate unchanged", async () => {
    const networkError = new TypeError("network unavailable");
    globalThis.fetch.mockRejectedValue(networkError);

    await expect(new PermaAPI(API_KEY, BASE_URL).pullUser()).rejects.toBe(networkError);
  });

  test("malformed response objects are rejected", async () => {
    globalThis.fetch.mockResolvedValue({});

    await expect(new PermaAPI(API_KEY, BASE_URL).pullUser()).rejects.toThrow(
      "#parseAPIResponse expects a Fetch API Response object.",
    );
  });
});
