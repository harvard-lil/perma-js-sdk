/**
 * perma-js-sdk
 * @module index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).
 */
/// <reference path="permatypes.js" />

/**
 * TODO
 */
 export class PermaAPI {

  /**
   * API key to be used to access restricted features.
   * @type {?string}
   */
  #apiKey = null;

  /**
   * Base url of the Perma.cc API. 
   * Can be only at constructor level.
   * @type {string}
   */
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
   * @return {object} - Key / value pair be added to the headers object sent alongside requests.
   */
  getAuthorizationHeader() {
    if (!this.#apiKey) {
      throw new Error("This method requires an API key.");
    }

    return {"Authorization": `ApiKey ${this.apiKey}`};
  }

  /**
   * Wrapper for `/v1/user/` (https://perma.cc/docs/developer#developer-users).
   * Requires an API key.
   * 
   * @return {(PermaUser|PermaApiError)}
   * @throws
   * @async
   */
  async user() {
    authorizationHeader = this.getAuthorizationHeader();

    try {
      let response = await fetch(`${this.#baseUrl}/v1/user`, {
        method: 'GET',
        headers: { ...authorizationHeader },
      });

      // TO DO
      
    }
    catch(err) {

    }
  }

}