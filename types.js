/**
 * perma-js-sdk
 * @module types
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description JSDoc type definitions for `perma-js-sdk`. Mainly describes objects coming back from the Rest API.
 */

//------------------------------------------------------------------------------
// System
//------------------------------------------------------------------------------
/**
 * Error objects as returned by the API.
 * @typedef {Object} PermaError
 * @property {string} detail
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

/**
 * Object returned by the [GET] `/v1/organizations/` endpoint. Paginated.
 * @typedef {Object} PermaOrganizationsPage
 * @property {PermaPaginationMeta} meta 
 * @property {PermaOrganization[]} objects
 */

//------------------------------------------------------------------------------
// Users
//------------------------------------------------------------------------------
/**
 * Information about a user (as returned by the API).
 * @typedef {Object} PermaUser
 * @property {number} id 
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} short_name
 * @property {string} [full_name]
 * @property {PermaFolder[]} [top_level_folders]
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
 * @property {boolean} [is_sponsored_root_folder]
 * @property {?PermaUser} [sponsored_by]
 * @property {boolean} read_only
 */

/**
 * Object returned by the [GET] `/v1/folder/{parentFolderId}/folders` endpoint(s). Paginated.
 * @typedef {Object} PermaFoldersPage
 * @property {PermaPaginationMeta} meta 
 * @property {PermaFolder[]} objects
 */

//------------------------------------------------------------------------------
// Archives
//------------------------------------------------------------------------------
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
 * @property {PermaCapture[]} captures
 * @property {string} queue_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {string} capture_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {string} [notes]
 * @property {?PermaUser} [created_by]
 * @property {boolean} [is_private]
 * @property {?string} [private_reason]
 * @property {boolean} [user_deleted]
 * @property {string} [archive_timestamp] - Ex: 2022-01-12T16:11:19.516152Z
 * @property {PermaOrganization} [organization]
 */

/**
 * Object returned by the [GET] `/v1[/public/]archives/` endpoint(s). Paginated.
 * @typedef {Object} PermaArchivesPage
 * @property {PermaPaginationMeta} meta 
 * @property {PermaArchive[]} objects
 */

/**
 * Object returned by the [POST] `/v1/archives/batches` endpoint.
 * @typedef {Object} PermaArchivesBatch
 * @property {number} id
 * @property {string} started_on - Ex: 2022-01-12T16:11:19.516152Z
 * @property {number} created_by - User id
 * @property {PermaCaptureJob[]} capture_jobs
 * @property {PermaFolder} target_folder
 * @property {(number|string)} links_remaining - How many more archives can the user create.
 * @property {string} [links_remaining_period] - Example: "once".
 */

//------------------------------------------------------------------------------
// Captures and Capture Jobs
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

/**
 * Information about an individual capture job (as returned by the API).
 * @typedef {Object} PermaCaptureJob
 * @property {string} guid
 * @property {string} status - Can be "pending", "in_progress", "completed", "deleted", "failed", "invalid"
 * @property {?string} message
 * @property {number} attempt
 * @property {number} step_count
 * @property {?string} step_description
 * @property {?string} capture_start_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {?string} capture_end_time - Ex: 2022-01-12T16:11:19.516152Z
 * @property {number} queue_position
 * @property {string} title
 * @property {boolean} user_deleted
 */

/**
 * Object returned by the [GET] `/v1/capture_job` endpoint(s). Paginated.
 * @typedef {Object} PermaCaptureJobsPage
 * @property {PermaPaginationMeta} meta 
 * @property {PermaCaptureJob[]} objects
 */