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
   * @param {string} guid
   * @return {string}
   */
  validateArchiveGuid(guid) {
    guid = String(guid);

    if (!guid.match(/^[A-Z0-9]{4}\-[A-Z0-9]{4}$/)) {
      throw new Error("`guid` must be a string representing an archive id (ex: ABCD-1234)");
    }

    return guid;
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
    const data = await response.json();

    // Return data as is if HTTP 2XX
    if (Math.floor(response.status / 100) === 2) {
      return data;
    }

    // Throw error with details given by the API (if any) otherwise
    let message = `HTTP ${response.status}`;

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
   * @return {Promise<PermaPublicArchivesPage>}
   * @async
   */
  async pullPublicArchivesPage(limit = 10, offset = 0) {
    const searchParams = new URLSearchParams({ limit, offset });
    const response = await this.#fetch(`${this.#baseUrl}/v1/public/archives?${searchParams}`);
    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details of a given public archive.
   * Wraps [GET] `/v1/public/archives/{guid}` (https://perma.cc/docs/developer#get-one-archive).
   * @param {string} guid
   * @return {Promise<PermaArchive>}
   * @async
   */
  async pullPublicArchive(guid) {
    guid = this.validateArchiveGuid(guid);
    const response = await this.#fetch(`${this.#baseUrl}/v1/public/archives/${guid}`);
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
    const authorizationHeader = this.#getAuthorizationHeader();

    const response = await this.#fetch(`${this.#baseUrl}/v1/user`, {
      method: "GET",
      headers: { ...authorizationHeader },
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
    const authorizationHeader = this.#getAuthorizationHeader();

    const response = await this.#fetch(`${this.#baseUrl}/v1/organizations`, {
      method: "GET",
      headers: { ...authorizationHeader },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details an organization.
   * Wraps [GET] `/v1/organization/{id}` (https://perma.cc/docs/developer#get-one-organization).
   * Requires an API key.
   *
   * @param {number} id
   * @return {Promise<PermaOrganization>}
   * @async
   */
  async pullOrganization(id) {
    const authorizationHeader = this.#getAuthorizationHeader();

    id = parseInt(String(id));
    if (isNaN(id)) {
      throw new Error("`id` needs to be interpretable as an integer.");
    }

    const response = await this.#fetch(`${this.#baseUrl}/v1/organization/${id}`, {
      method: "GET",
      headers: { ...authorizationHeader },
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
    const authorizationHeader = this.#getAuthorizationHeader();

    const body = {};

    try {
      url = new URL(url).href;
      body.url = url;
    } catch (err) {
      throw new Error("`url` needs to be a valid url.");
    }

    if (options.title !== null) {
      body.title = String(options.title);
    }

    if (options.folder !== null) {
      options.folder = parseInt(String(options.folder));
      if (isNaN(options.folder)) {
        throw new Error("If provided, `options.folder` must be interpretable as an integer.");
      }
      body.folder = options.folder;
    }

    body.is_private = Boolean(options.isPrivate);
    body.notes = String(options.notes);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authorizationHeader,
      },
      body: JSON.stringify(body),
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details of a given archive.
   * Wraps [GET] `/v1/archives/{guid}` (https://perma.cc/docs/developer#view-details-of-one-archive).
   * Requires an API key.
   *
   * @param {string} guid
   * @return {Promise<PermaArchive>}
   * @async
   */
  async pullArchive(guid) {
    const authorizationHeader = this.#getAuthorizationHeader();

    guid = this.validateArchiveGuid(guid);

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/${guid}`, {
      method: "GET",
      headers: { ...authorizationHeader },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Edit archive details
   * Wraps [PATCH] `/v1/archives/{guid}` (https://perma.cc/docs/developer#move-to-dark-archive).
   * Requires an API key.
   *
   * @param {string} guid
   * @param {Object} [options]
   * @param {?boolean} [options.isPrivate] - If set, will toggle an archive between public and private mode.
   * @param {?string} [options.title] - If set, will update the archive's title.
   * @param {?string} [options.notes] - If set, will update the archives notes
   * @return {Promise<PermaArchive>}
   * @async
   */
  async editArchive(guid, options = { isPrivate: null, title: null, notes: null }) {
    const authorizationHeader = this.#getAuthorizationHeader();

    const body = {};
    guid = this.validateArchiveGuid(guid);

    if (options.title !== null) {
      body.title = String(options.title);
    }

    if (options.notes !== null) {
      body.notes = String(options.notes);
    }

    if (options.isPrivate !== null) {
      body.is_private = Boolean(options.isPrivate);
    }

    const response = await this.#fetch(`${this.#baseUrl}/v1/archives/${guid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authorizationHeader,
      },
      body: JSON.stringify(body),
    });

    return await this.#parseAPIResponse(response);
  }
}
