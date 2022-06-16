/**
 * perma-js-sdk
 * @module index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).
 */
/// <reference path="types.js" />

/**
 * `node-fetch` fallback for Node <= 17 (or if behind a flag)
 */
if (typeof process !== "undefined" && typeof fetch === "undefined") {
  fetch = async (...args) => {
    const module = await import('node-fetch');
    return await module.default(...args);
  };
}

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
 * @property {?string} #apiKey - API key to be used to access restricted features (private).
 * @property {string} #baseUrl - Base url of the Perma.cc API.  Can be only at constructor level (private).
 */
export class PermaAPI {

  #apiKey = null;
  #baseUrl = "https://api.perma.cc"

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
    // If a replacement was provided, it needs to be a valid url.
    if (forceBaseUrl) {
      forceBaseUrl = String(forceBaseUrl);
      forceBaseUrl = new URL(forceBaseUrl);
      this.#baseUrl = forceBaseUrl.origin;
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

    return {"Authorization": `ApiKey ${this.#apiKey}`};
  }

  /**
   * Tries to parse an API response as JSON. 
   * 
   * If the status code isn't 2XX and/or an error message was provided, will throw an exception with that information. 
   * For example: `Error: Invalid token. (HTTP 401)`
   * 
   * @param {Response} response - Fetch API response
   * @returns {?object} 
   * @async
   * @private
   */
  async #parseAPIResponse(response) {
    const data = await response.json();

    if (Math.floor(response.status / 100) !== 2) {
      let message = "";

      if (data.detail) { // The API returns error messages via "detail".
        message += `${data.detail} `;
      }

      message += `(HTTP ${response.status})`;

      throw new Error(message);
    }

    return data;
  }

  /**
   * Fetches a subset of all the available public archives.
   * Wraps [GET] `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives)
   * @param {number} [limit=10]
   * @param {number} [offset=0]
   * @return {PermaPublicArchivesPage}
   * @async
   */
  async pullPublicArchivesPage(limit=10, offset=0) {
    const searchParams = new URLSearchParams({limit, offset});
    const response = await fetch(`${this.#baseUrl}/v1/public/archives?${searchParams}`); 
    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details of a given public archive.
   * Wraps [GET] `/v1/public/archives/{guid}` 
   * @param {string} guid
   * @return {PermaArchive}
   * @async
   */
  async pullPublicArchive(guid) {
    try {
      guid = String(guid);
      if (guid.match(/[A-Z0-9]{4}\-[A-Z0-9]{4}/)[0] !== guid) {
        throw new Error();
      }
    }
    catch(err) {
      throw new Error("`guid` must be a string representing an archive id (ex: ABCD-1234)");
    }

    const response = await fetch(`${this.#baseUrl}/v1/public/archives/${guid}`);
    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches account details for the signed-in user. 
   * Wraps [GET] `/v1/user/` (https://perma.cc/docs/developer#developer-users).
   * Requires an API key.
   * 
   * @return {PermaUser}
   * @async
   */
  async pullCurrentUser() {
    const authorizationHeader = this.#getAuthorizationHeader();

    const response = await fetch(`${this.#baseUrl}/v1/user`, {
      method: 'GET',
      headers: { ...authorizationHeader },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches a list of all the organizations the signed-in user belongs to.
   * Wraps [GET] `/v1/organizations/` (https://perma.cc/docs/developer#developer-organizations).
   * Requires an API key.
   * 
   * @return {PermaOrganizationsPage}
   * @async
   */
  async pullOrganizationsList() {
    const authorizationHeader = this.#getAuthorizationHeader();

    const response = await fetch(`${this.#baseUrl}/v1/organizations`, {
      method: 'GET',
      headers: { ...authorizationHeader },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Fetches details an organization. 
   * Wraps [GET] `/v1/organization/{id}` (https://perma.cc/docs/developer#get-one-organization)
   * Requires an API key.
   * 
   * @param {number} id 
   * @return {PermaOrganization}
   * @async
   */
  async pullOrganization(id) {
    const authorizationHeader = this.#getAuthorizationHeader();

    id = parseInt(id);
    if (isNaN(id)) {
      throw new Error("`id` needs to be interpretable as an integer.");
    }

    const response = await fetch(`${this.#baseUrl}/v1/organization/${id}`, {
      method: 'GET',
      headers: { ...authorizationHeader },
    });

    return await this.#parseAPIResponse(response);
  }

  /**
   * Creates an archive.
   * Wraps [POST] `/v1/archives/` (https://perma.cc/docs/developer#create-an-archive)
   * Requires an API key.
   * 
   * @param {string} url
   * @param {?string} title
   * @param {number} folder - Folder id.
   * @return {PermaArchive}
   * @async
   */
  async createArchive(url, title=null, folder=null) {
    const authorizationHeader = this.#getAuthorizationHeader();

    const body = {};

    try {
      url = new URL(url);
      url = url.href;
      body.url = url;
    }
    catch(err) {
      throw new Error("`url` needs to be a valid url.")
    }

    if (title !== null) {
      title = String(title);
      body.title = title;
    }

    if (folder !== null) {
      folder = parseInt(folder);
      if (isNaN(folder)) {
        throw new Error("If provided, `folder` must be interpretable as an integer.");
      }
      body.folder = folder;
    }

    const response = await fetch(`${this.#baseUrl}/v1/archives`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        ...authorizationHeader 
      },
      body: JSON.stringify(body)
    });

    return await this.#parseAPIResponse(response);
  }

}