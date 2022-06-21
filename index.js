/**
 * perma-js-sdk
 * @module index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).
 */
/// <reference path="types.js" />
// @ts-check

/**
 * Wrapper class for Perma.cc's Rest API (v1).
 * 
 * Usage:
 * ```
 * try {
 *   const perma = new PermaAPI("my-api-key");
 *   const user = await perma.user();
 *   // ...
 * }
 * catch(err) { ... }
 * ```
 * 
 */
export class PermaAPI {

  /**
   * @type {?string} 
   * @description API key to be used to access restricted features (private).
   */
  #apiKey = null;

  /**
   * @type {string} 
   * @description Base url of the Perma.cc API.  Can be only at constructor level (private).
   */
  #baseUrl = "https://api.perma.cc";

  /**
   * @description Local proxy to the Fetch API. Used to load `node-module` as a fallback when needed (see constructor). 
   */
  #fetch = globalThis.fetch;

  /**
   * Constructor
   * @param {?string} apiKey - If provided, gives access to features that are behind auth.
   * @param {?string} forceBaseUrl - If provided, will be used instead of "https://api.perma.cc". Needs to be a valid url.
   */
  constructor(apiKey = "", forceBaseUrl = null) {
    // Check if an API key was provided.
    // If provided, format must match.
    if (apiKey) {
      apiKey = String(apiKey);

      if (!apiKey.match(/^[0-9a-z]{40}$/)) {
        throw new Error("`apiKey` must be a string of 40 lowercase alphanumeric characters.");
      }

      this.#apiKey = apiKey;
    }

    // Check if base url needs to be replaced.
    // If a replacement was provided, it needs to be a valid url (will throw otherwise).
    if (forceBaseUrl) {
      let newBaseUrl = new URL(forceBaseUrl);
      this.#baseUrl = newBaseUrl.origin;
    }

    // Load `node-fetch` if we're running Node.js and `fetch()` is not available
    if (!this.#fetch && "process" in globalThis) {
      this.#fetch = async (...args) => {
        const module = await import("node-fetch");
        return await module.default(...args);
      };
    }
  }

  /**
   * Returns a ready-to-use Authorization header object. Throws if no API key was provided.
   * @return {object} - Key / value pair be added to the `headers` object sent alongside requests.
   * @private
   */
  #getAuthorizationHeader() {
    if (!this.#apiKey) {
      throw new Error("This method requires an API key.");
    }

    return { Authorization: `ApiKey ${this.#apiKey}` };
  }

  /**
   * Checks that a given string is an archive GUID (2x 4 alphanumeric chars separated by an hyphen).
   * Throws an exception otherwise. 
   * Note: Only checks format. 
   * 
   * @param {string} archiveId
   * @return {string}
   */
  validateArchiveId(archiveId) {
    archiveId = String(archiveId);

    if (!archiveId.match(/^[A-Z0-9]{4}\-[A-Z0-9]{4}$/)) {
      throw new Error("`archiveId` must be a string representing an archive id (ex: ABCD-1234)");
    }

    return archiveId;
  }

  /**
   * Checks that a given variable can be a folder id.
   * Throws an exception otherwise. 
   * Note: Only checks format. 
   * 
   * @param {number} folderId
   * @return {number}
   */
  validateFolderId(folderId) {
    folderId = parseInt(String(folderId));

    if (isNaN(folderId)) {
      throw new Error("`folderId` must be interpretable as an integer.");
    }

    return folderId;
  }

  /**
   * Checks that a given variable can be a folder id.
   * Throws an exception otherwise. 
   * Note: Only checks format. 
   * 
   * @param {number} organizationId
   * @return {number}
   */
  validateOrganizationId(organizationId) {
    organizationId = parseInt(String(organizationId));

    if (isNaN(organizationId)) {
      throw new Error("`organizationId` must be interpretable as an integer.");
    }

    return organizationId;
  }


  /**
   * Checks that a given pagination limit and offset pair is valid.
   * 
   * @param {number} limit
   * @param {number} offset
   * @return {{limit: number, offset: number}} 
   */
  validatePagination(limit, offset) {
    limit = parseInt(String(limit));
    offset = parseInt(String(offset));

    if (isNaN(limit) || isNaN(offset)) {
      throw new Error("`limit` and `offset` must be interpretable as integers.");
    }

    if (limit < 1 || offset < 0) {
      throw new Error(`\`limit\` (${limit}) and / or \`offset\` (${offset}) out of bounds.`);
    }

    return {limit, offset};
  }

  /**
   * Tries to parse an API response as JSON.
   *
   * If the status code isn't 2XX and/or an error message was provided, will throw an exception with that information.
   * For example: `HTTP 401 Invalid token.`.
   *
   * @param {Response} response - Fetch API response
   * @returns {Promise<Object>}
   * @private
   * @async
   */
  async #parseAPIResponse(response) {
    let data = {};
    let message = "";

    // Checking that we received a Fetch API response
    if (!(`status` in response) || !(`json` in response)) {
      throw new Error(`#parseAPIResponse expects a Fetch API Response object.`);
    }

    // Try to parse data as JSON.
    try {
      data = await response.json();
    }
    catch(err) { /*Some routes do not return any data. */ }

    // Return parsed data "as is" if HTTP 2XX
    if (Math.floor(response.status / 100) === 2) {
      return data;
    }

    // Throw error with details given by the API (if any) otherwise
    message = `HTTP ${response.status}`;

    if (data.detail) { // See `PermaApiError`
      message += ` ${data.detail}`;
    }

    throw new Error(message);
  }

  /**
   * Fetches a subset of all the available public archives.
   * Wraps [GET] `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives).
   * @param {number} [limit=10]
   * @param {number} [offset=0]
   * @return {Promise<PermaArchivesPage>}
   * @async
   */
  async pullPublicArchives(limit = 10, offset = 0) {
    const searchParams = new URLSearchParams(this.validatePagination(limit, offset));

    const response = await this.#fetch(`${this.#baseUrl}/v1/public/archives?${searchParams}`);
    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details of a given public archive.
   * Wraps [GET] `/v1/public/archives/{archiveId}` (https://perma.cc/docs/developer#get-one-archive).
   * @param {string} archiveId
   * @return {Promise<PermaArchive>}
   * @async
   */
  async pullPublicArchive(archiveId) {
    archiveId = this.validateArchiveId(archiveId);
    const response = await this.#fetch(`${this.#baseUrl}/v1/public/archives/${archiveId}`);
    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches account details for the signed-in user.
   * Wraps [GET] `/v1/user/` (https://perma.cc/docs/developer#developer-users).
   * Requires an API key.
   *
   * @return {Promise<PermaUser>}
   * @async
   */
  async pullCurrentUser() {
    const response = await this.#fetch(`${this.#baseUrl}/v1/user`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches a list of all the organizations the signed-in user belongs to.
   * Wraps [GET] `/v1/organizations/` (https://perma.cc/docs/developer#developer-organizations).
   * Requires an API key.
   *
   * @return {Promise<PermaOrganizationsPage>}
   * @async
   */
  async pullOrganizationsList() {
    const response = await this.#fetch(`${this.#baseUrl}/v1/organizations`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details an organization.
   * Wraps [GET] `/v1/organization/{organizationId}` (https://perma.cc/docs/developer#get-one-organization).
   * Requires an API key.
   *
   * @param {number} organizationId
   * @return {Promise<PermaOrganization>}
   * @async
   */
  async pullOrganization(organizationId) {
    organizationId = this.validateOrganizationId(organizationId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/organization/${organizationId}`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Creates an archive.
   * Wraps [POST] `/v1/archives/` (https://perma.cc/docs/developer#create-an-archive).
   * Requires an API key.
   *
   * @param {string} url
   * @param {Object} [options]
   * @param {?string} [options.title]
   * @param {?number} [options.folder] - Folder id.
   * @param {boolean} [options.isPrivate]
   * @param {string} [options.notes]
   * @return {Promise<PermaArchive>}
   * @async
   */
  async createArchive(url, options = { title: null, folder: null, isPrivate: false, notes: "" }) {
    const body = {};

    try {
      url = new URL(url).href;
      body.url = url;
    } 
    catch (err) {
      throw new Error("`url` needs to be a valid url.");
    }

    if (options.title !== null) {
      body.title = String(options.title);
    }

    if (options.folder !== null) {
      options.folder = this.validateFolderId(options.folder);
      body.folder = options.folder;
    }

    body.is_private = Boolean(options.isPrivate);
    body.notes = String(options.notes);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.#getAuthorizationHeader(),
      },
      body: JSON.stringify(body),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Requests the creation of a batch of archives. 
   * Wraps [POST] `/v1/archives/batches` (https://perma.cc/docs/developer#batches). 
   * Requires an API key.
   * 
   * @param {string[]} urls - Must contain valid urls.
   * @param {number} folderId - Destination folder of the resulting archives.
   * @return {Promise<PermaArchivesBatch>}
   * @async
   */
   async createArchiveBatch(urls, folderId) {
    for(let url of urls) {
      new URL(url); // Will throw if not a valid URL
    }

    folderId = this.validateFolderId(folderId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.#getAuthorizationHeader(),
      },
      body: JSON.stringify({
        urls: urls,
        target_folder: folderId
      }),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details of a given archive.
   * Wraps [GET] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#view-details-of-one-archive).
   * Requires an API key.
   *
   * @param {string} archiveId
   * @return {Promise<PermaArchive>}
   * @async
   */
  async pullArchive(archiveId) {
    archiveId = this.validateArchiveId(archiveId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/${archiveId}`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Edit details for a given archive. 
   * Wraps [PATCH] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#move-to-dark-archive).
   * Requires an API key.
   *
   * @param {string} archiveId
   * @param {Object} [options]
   * @param {?boolean} [options.isPrivate] - If set, will toggle an archive between public and private mode.
   * @param {?string} [options.title] - If set, will update the archive's title.
   * @param {?string} [options.notes] - If set, will update the archives notes
   * @return {Promise<PermaArchive>}
   * @async
   */
  async editArchive(archiveId, options = { isPrivate: null, title: null, notes: null }) {
    const body = {};

    if (options.title !== null) {
      body.title = String(options.title);
    }

    if (options.notes !== null) {
      body.notes = String(options.notes);
    }

    if (options.isPrivate !== null) {
      body.is_private = Boolean(options.isPrivate);
    }

    archiveId = this.validateArchiveId(archiveId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/${archiveId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.#getAuthorizationHeader(),
      },
      body: JSON.stringify(body),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Moves an archive to a different folder. 
   * Wraps [PATCH] `/v1/folders/{folderId}/archives/{archiveId}` (https://perma.cc/docs/developer#move-archive). 
   * Requires an API key.
   * 
   * @param {string} archiveId - Identifier of the archive to move.
   * @param {number} folderId - Identifier of the folder to move the archive into. 
   * @return {Promise<PermaArchive>}
   * @async 
   */
  async moveArchive(archiveId, folderId) {
    folderId = this.validateFolderId(folderId);
    archiveId = this.validateArchiveId(archiveId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/folders/${folderId}/archives/${archiveId}`, {
      method: "PATCH",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Deletes an archive. 
   * Wraps [DELETE] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#delete-archive). 
   * Required an API key.
   * 
   * @return {Promise<boolean>}
   * @async
   */
  async deleteArchive(archiveId) {
    archiveId = this.validateArchiveId(archiveId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/${archiveId}`, {
      method: "DELETE",
      headers: { ...this.#getAuthorizationHeader() },
    });

    await this.#parseAPIResponse(response); // Will throw if deletion failed
    return true;
  }

  /**
   * Fetches a subset of all the archives the user has access to. 
   * Wraps [GET] `/v1/archives` (https://perma.cc/docs/developer#view-all-archives-of-one-user).
   * Requires an API key.
   * 
   * @param {number} [limit=10]
   * @param {number} [offset=0]
   * @return {Promise<PermaArchivesPage>}
   * @async
   */
  async pullArchives(limit = 10, offset = 0) {
    const searchParams = new URLSearchParams(this.validatePagination(limit, offset));

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives?${searchParams}`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Creates a folder.
   * Wraps [POST] `/v1/folders/{parentFolderId}/folders/` (https://perma.cc/docs/developer#create-folder). 
   * Requires an API key.
   * 
   * @param {number} parentFolderId - Id of the parent folder (required).
   * @param {string} name - Name to be given to the new folder. 
   * @return {Promise<PermaFolder>} 
   */
  async createFolder(parentFolderId, name) {
    parentFolderId = this.validateFolderId(parentFolderId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/folders/${parentFolderId}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.#getAuthorizationHeader(),
      },
      body: JSON.stringify({name: String(name)}),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Retrieves the details of a given folder. 
   * Wraps [GET] `/v1/folders/{folderId}` (https://perma.cc/docs/developer#view-folder-details). 
   * Requires an API key.
   * 
   * @param {number} folderId 
   * @return {Promise<PermaFolder>}
   * @async
   */
  async pullFolderDetails(folderId) {
    folderId = this.validateFolderId(folderId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/folders/${folderId}/`, {
      method: "GET",
      headers: { ...this.#getAuthorizationHeader() },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Lists direct children of a given folder. 
   * Wraps [GET] `/v1/folders/{parentFolderId}/folders` (https://perma.cc/docs/developer#view-folder-subfolders). 
   * Requires an API key.
   * 
   * @param {number} parentFolderId - Id of the parent folder (required).
   * @param {number} [limit=100]
   * @param {number} [offset=0]
   * @return {Promise<PermaFoldersPage>}
   * @async
   */
  async pullFolderChildren(parentFolderId, limit=100, offset=0) {
    this.validatePagination(limit, offset); // Will throw if invalid
    const searchParams = new URLSearchParams({limit, offset });

    parentFolderId = this.validateFolderId(parentFolderId);

    const response = await this.#fetch(
      `${this.#baseUrl}/v1/folders/${parentFolderId}/folders?${searchParams}`,
      {
        method: "GET",
        headers: { ...this.#getAuthorizationHeader() },
      }
    );

    return await this.#parseAPIResponse(response);
  }

  /**
   * Pulls a list of archives from a specific folder. 
   * Wraps [GET] `/v1/folders/{folderId}/archives` (https://perma.cc/docs/developer#view-folder-archives). 
   * Requires an API key.
   * 
   * @param {number} folderId
   * @param {number} [limit=10]
   * @param {number} [offset=0]
   * @return {Promise<PermaArchivesPage>}
   * @async 
   */
  async pullFolderArchives(folderId, limit=10, offset=0) {
    const searchParams = new URLSearchParams(this.validatePagination(limit, offset));

    folderId = this.validateFolderId(folderId);

    const response = await this.#fetch(
      `${this.#baseUrl}/v1/folders/${folderId}/archives?${searchParams}`,
      {
        method: "GET",
        headers: { ...this.#getAuthorizationHeader() },
      }
    );

    return await this.#parseAPIResponse(response);
  }

  /**
   * Edit details for a given folder. 
   * Wraps [PATCH] `/v1/folders/{folderId}/` (https://perma.cc/docs/developer#rename-folder).
   * Requires an API key.
   *
   * @param {number} folderId
   * @param {Object} [options]
   * @param {?string} [options.name] - If set, will update the folder's name.
   * @return {Promise<PermaFolder>}
   * @async
   */
  async editFolder(folderId, options = {name: null}) {
    const body = {};

    if (options.name) {
      body.name = String(options.name);
    }

    folderId = this.validateFolderId(folderId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/folders/${folderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.#getAuthorizationHeader(),
      },
      body: JSON.stringify(body),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Moves a folder into another.
   * Wraps [PUT] `/v1/folders/{parentFolderId}/folders/{folderId}/` (https://perma.cc/docs/developer#move-folder). 
   * Requires an API key.
   * 
   * @param {number} folderId - Folder to move. 
   * @param {number} parentFolderId - Where to move that folder into.
   * @returns {Promise<PermaFolder>}
   * @async
   */
  async moveFolder(folderId, parentFolderId) {
    folderId = this.validateFolderId(folderId);
    parentFolderId = this.validateFolderId(parentFolderId);

    const response = await this.#fetch(
      `${this.#baseUrl}/v1/folders/${parentFolderId}/folders/${folderId}`,
      {
        method: "PUT",
        headers: { ...this.#getAuthorizationHeader() },
      }
    );

    return await this.#parseAPIResponse(response);
  }

  /**
   * Deletes a folder. 
   * Wraps [DELETE] `/v1/folders/{folderId}` (https://perma.cc/docs/developer#delete-folder). 
   * Requires an API key.
   * 
   * @param {number} folderId
   * @return {Promise<boolean>}
   */
  async deleteFolder(folderId) {
    folderId = this.validateFolderId(folderId);

    const response = await this.#fetch(`${this.#baseUrl}/v1/folders/${folderId}`, {
      method: "DELETE",
      headers: { ...this.#getAuthorizationHeader() },
    });

    await this.#parseAPIResponse(response); // Will throw if deletion failed
    return true;
  }

}
