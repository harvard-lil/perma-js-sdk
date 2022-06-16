<a name="module_types"></a>

## types
JSDoc type definitions for `perma-js-sdk`. Mainly describes objects coming back from the Rest API.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [types](#module_types)
    * [~PermaApiError](#module_types..PermaApiError) : <code>Object</code>
    * [~PermaPaginationMeta](#module_types..PermaPaginationMeta) : <code>Object</code>
    * [~PermaOrganization](#module_types..PermaOrganization) : <code>Object</code>
    * [~PermaOrganizationsPage](#module_types..PermaOrganizationsPage) : <code>Object</code>
    * [~PermaUser](#module_types..PermaUser) : <code>Object</code>
    * [~PermaFolder](#module_types..PermaFolder) : <code>Object</code>
    * [~PermaArchive](#module_types..PermaArchive) : <code>Object</code>
    * [~PermaCapture](#module_types..PermaCapture) : <code>Object</code>
    * [~PermaCaptureJob](#module_types..PermaCaptureJob) : <code>Object</code>

<a name="module_types..PermaApiError"></a>

### types~PermaApiError : <code>Object</code>
**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type |
| --- | --- |
| detail | <code>string</code> | 

<a name="module_types..PermaPaginationMeta"></a>

### types~PermaPaginationMeta : <code>Object</code>
Pagination metadata (as returned by the API). Served alongside paginated queries.

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> |  |
| offset | <code>number</code> |  |
| total_count | <code>number</code> |  |
| next | <code>string</code> | Url to the next "page", if any. |
| previous | <code>string</code> | Url to the previous "page", if any. |

<a name="module_types..PermaOrganization"></a>

### types~PermaOrganization : <code>Object</code>
Information about an organization (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> |  |
| name | <code>string</code> |  |
| registrar | <code>string</code> |  |
| default_to_private | <code>boolean</code> |  |
| [shared_folder] | <code>PermaFolder</code> | If set, describes the folder shared at organization-level. |

<a name="module_types..PermaOrganizationsPage"></a>

### types~PermaOrganizationsPage : <code>Object</code>
Object returned by the `/v1/organizations/` endpoint. Paginated.

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type |
| --- | --- |
| meta | <code>PermaPaginationMeta</code> | 
| objects | <code>Array.&lt;PermaOrganization&gt;</code> | 

<a name="module_types..PermaUser"></a>

### types~PermaUser : <code>Object</code>
Information about a user (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type |
| --- | --- |
| id | <code>number</code> | 
| first_name | <code>string</code> | 
| last_name | <code>string</code> | 
| short_name | <code>string</code> | 
| [full_name] | <code>string</code> | 
| [top_level_folders] | <code>Array.&lt;PermaFolder&gt;</code> | 

<a name="module_types..PermaFolder"></a>

### types~PermaFolder : <code>Object</code>
Information about a given folder (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> |  |
| name | <code>string</code> |  |
| parent | <code>string</code> | API path to parent. Example: "/v1/folders/25/" |
| has_children | <code>boolean</code> |  |
| path | <code>string</code> | Hyphen-separated list of folder ids from root to this folder. |
| organization | <code>number</code> | Organization id. |
| [is_sponsored_root_folder] | <code>boolean</code> |  |
| [sponsored_by] | <code>PermaUser</code> |  |
| read_only | <code>boolean</code> |  |

<a name="module_types..PermaArchive"></a>

### types~PermaArchive : <code>Object</code>
Information about a given archive (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| guid | <code>string</code> |  |
| creation_timestamp | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| url | <code>string</code> |  |
| title | <code>string</code> |  |
| description | <code>string</code> |  |
| warc_size | <code>number</code> | Archive size in bytes |
| warc_download_url | <code>string</code> |  |
|  | <code>Array.&lt;PermaCapture&gt;</code> |  |
| queue_time | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| capture_time | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| [notes] | <code>string</code> |  |
| [created_by] | <code>PermaUser</code> |  |
| [is_private] | <code>boolean</code> |  |
| [private_reason] | <code>string</code> |  |
| [user_deleted] | <code>boolean</code> |  |
| [archive_timestamp] | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| [organization] | <code>PermaOrganization</code> |  |

<a name="module_types..PermaCapture"></a>

### types~PermaCapture : <code>Object</code>
Information about an individual capture (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| role | <code>string</code> | Can be "primary", "screenshot" or "favicon" |
| status | <code>string</code> | Can be "pending", "failed" or "success" |
| url | <code>string</code> | Url that was captured OR of the resource directly if this was a user upload. |
| record_type | <code>string</code> | Can be "response" or "resource" |
| content_type | <code>string</code> | MIME type of the content (i.e: "text/html; charset=utf-8", "image/png") |
| user_upload | <code>boolean</code> | Whether or not this was a direct upload instead of a capture. |

<a name="module_types..PermaCaptureJob"></a>

### types~PermaCaptureJob : <code>Object</code>
Information about an individual capture job (as returned by the API).

**Kind**: inner typedef of [<code>types</code>](#module_types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| guid | <code>string</code> |  |
| status | <code>string</code> | Can be "pending", "in_progress", "completed", "deleted", "failed", "invalid" |
| message | <code>string</code> |  |
| attempt | <code>number</code> |  |
| step_count | <code>number</code> |  |
| step_description | <code>string</code> |  |
| capture_start_time | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| capture_end_time | <code>string</code> | Ex: 2022-01-12T16:11:19.516152Z |
| queue_position | <code>number</code> |  |
| title | <code>string</code> |  |
| user_deleted | <code>boolean</code> |  |

