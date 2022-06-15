/**
 * perma-js-sdk
 * @module index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).
 */


/**
 * Pagination metadata. Served alongside paginated queries.
 * @typedef {Object} PermaPaginationMeta
 * @property {!number} limit 
 * @property {!number} offset
 * @property {!number} total_count
 * @property {?string} next - Url to the next "page", if any.
 * @property {?string} previous - Url to the previous "page", if any.
 */

/**
 * Capture-related metadata (individual entry).  
 * @typedef {Object} PermaCapture
 * @property {string} role - Can be "primary", "screenshot" or "favicon"
 * @property {string} status - Can be "pending", "failed" or "success"
 * @property {?string} url - Url that was captured OR of the resource directly if this was a user upload.
 * @property {string} record_type - Can be "response" or "resource"
 * @property {string} content_type - MIME type of the content (i.e: "text/html", "image/png")
 * @property {boolean} user_upload - Whether or not this was a direct upload instead of a capture.
 */

/**
 * Information about the creator of a given archive.
 * @typedef {Object} PermaArchiveCreator
 * @property {number} id 
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} short_name
 */

/**
 * 
 */
export default class PermaApi {
}