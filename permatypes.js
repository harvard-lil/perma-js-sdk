/**
 * perma-js-sdk
 * @module permatypes
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description JSDoc type definitions for `perma-js-sdk`.
 */

//------------------------------------------------------------------------------
// Pagination
//------------------------------------------------------------------------------
/**
 * Pagination metadata (as returned by the API). Served alongside paginated queries.
 * @typedef {Object} PermaPaginationMeta
 * @property {!number} limit 
 * @property {!number} offset
 * @property {!number} total_count
 * @property {?string} next - Url to the next "page", if any.
 * @property {?string} previous - Url to the previous "page", if any.
 */

//------------------------------------------------------------------------------
// Organizations
//------------------------------------------------------------------------------
/**
 * Information about an organization (as returned by the API).
 * @typedef {Object} PermaOrganization
 * @property {number} id
 * @property {string} name
 * @property {string} registrar
 * @property {boolean} default_to_private 
 * @property {PermaFolder} [shared_folder] - If set, describes the folder shared at organization-level.
 */

//------------------------------------------------------------------------------
// Folders
//------------------------------------------------------------------------------
/**
 * Information about a given folder (as returned by the API).
 * @typedef {Object} PermaFolder
 * @property {number} id
 * @property {string} name
 * @property {?string} parent - API path to parent. Example: "/v1/folders/25/"
 * @property {boolean} has_children
 * @property {?string} path - Hyphen-separated list of folder ids from root to this folder.
 * @property {?number} organization - Organization id.
 */

//------------------------------------------------------------------------------
// Archives
//------------------------------------------------------------------------------
/**
 * Information about the creator of an archive (as returned by the API).
 * @typedef {Object} PermaArchiveCreator
 * @property {number} id 
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} short_name
 */

/**
 * Information about a given archive (as returned by the API).
 * @typedef {Object} PermaArchive
 * @property {string} guid
 * @property {string} creation_timestamp - Ex: 2022-01-12T16:11:19.516152Z
 * @property {string} url
 * @property {?string} title
 * @property {?string} description
 * @property {?number} warc_size - Archive size in bytes
 * @property {?string} warc_download_url
 * @property {PermaCapture[]}
 * @property {string} queue_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {string} capture_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {string} [notes]
 * @property {?PermaArchiveCreator} [created_by]
 * @property {boolean} [is_private]
 * @property {?string} [private_reason]
 * @property {boolean} [user_deleted]
 * @property {string} [archive_timestamp] - Ex: 2022-01-12T16:11:19.516152Z
 * @property {PermaOrganization} [organization]
 */

//------------------------------------------------------------------------------
// Capture
//------------------------------------------------------------------------------
/**
 * Information about an individual capture (as returned by the API).  
 * @typedef {Object} PermaCapture
 * @property {string} role - Can be "primary", "screenshot" or "favicon"
 * @property {string} status - Can be "pending", "failed" or "success"
 * @property {?string} url - Url that was captured OR of the resource directly if this was a user upload.
 * @property {string} record_type - Can be "response" or "resource"
 * @property {string} content_type - MIME type of the content (i.e: "text/html; charset=utf-8", "image/png")
 * @property {boolean} user_upload - Whether or not this was a direct upload instead of a capture.
 */
