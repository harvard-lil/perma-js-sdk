<a name="module_index"></a>

## index
A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [index](#module_index)
    * _static_
        * [.PermaAPI](#module_index.PermaAPI)
            * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
            * [.validateArchiveId(archiveId)](#module_index.PermaAPI+validateArchiveId) ⇒ <code>string</code>
            * [.validateFolderId(folderId)](#module_index.PermaAPI+validateFolderId) ⇒ <code>number</code>
            * [.validateOrganizationId(organizationId)](#module_index.PermaAPI+validateOrganizationId) ⇒ <code>number</code>
            * [.validatePagination(limit, offset)](#module_index.PermaAPI+validatePagination) ⇒ <code>Object</code>
            * [.pullPublicArchives([limit], [offset])](#module_index.PermaAPI+pullPublicArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
            * [.pullPublicArchive(archiveId)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
            * [.pullUser()](#module_index.PermaAPI+pullUser) ⇒ <code>Promise.&lt;PermaUser&gt;</code>
            * [.pullOrganizations()](#module_index.PermaAPI+pullOrganizations) ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
            * [.pullOrganization(organizationId)](#module_index.PermaAPI+pullOrganization) ⇒ <code>Promise.&lt;PermaOrganization&gt;</code>
            * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
            * [.pullArchive(archiveId)](#module_index.PermaAPI+pullArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
            * [.editArchive(archiveId, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
            * [.moveArchive(archiveId, folderId)](#module_index.PermaAPI+moveArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
            * [.deleteArchive([safeMode], [safeModeTries])](#module_index.PermaAPI+deleteArchive) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.pullArchives([url], [limit], [offset])](#module_index.PermaAPI+pullArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
            * [.pullTopLevelFolders([limit], [offset])](#module_index.PermaAPI+pullTopLevelFolders) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
            * [.pullFolder(folderId)](#module_index.PermaAPI+pullFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
            * [.pullFolderChildren(parentFolderId, [limit], [offset])](#module_index.PermaAPI+pullFolderChildren) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
            * [.createFolder(parentFolderId, name)](#module_index.PermaAPI+createFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
            * [.editFolder(folderId, [options])](#module_index.PermaAPI+editFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
            * [.moveFolder(folderId, parentFolderId)](#module_index.PermaAPI+moveFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
            * [.deleteFolder(folderId)](#module_index.PermaAPI+deleteFolder) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.pullFolderArchives(folderId, [limit], [offset])](#module_index.PermaAPI+pullFolderArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
            * [.pullOngoingCaptureJobs([limit], [offset])](#module_index.PermaAPI+pullOngoingCaptureJobs) ⇒ <code>Promise.&lt;PermaCaptureJobsPage&gt;</code>
            * [.pullArchiveCaptureJob(archiveId)](#module_index.PermaAPI+pullArchiveCaptureJob) ⇒ <code>Promise.&lt;PermaCaptureJob&gt;</code>
            * [.createArchivesBatch(urls, folderId)](#module_index.PermaAPI+createArchivesBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
            * [.pullArchivesBatch(batchId)](#module_index.PermaAPI+pullArchivesBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
    * _inner_
        * [~fetch](#module_index..fetch)

<a name="module_index.PermaAPI"></a>

### index.PermaAPI
Wrapper class for Perma.cc's Rest API (v1).

Usage:
```
try {
  const perma = new PermaAPI("my-api-key");
  const user = await perma.user();
  // ...
}
catch(err) { ... }
```

**Kind**: static class of [<code>index</code>](#module_index)  

* [.PermaAPI](#module_index.PermaAPI)
    * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
    * [.validateArchiveId(archiveId)](#module_index.PermaAPI+validateArchiveId) ⇒ <code>string</code>
    * [.validateFolderId(folderId)](#module_index.PermaAPI+validateFolderId) ⇒ <code>number</code>
    * [.validateOrganizationId(organizationId)](#module_index.PermaAPI+validateOrganizationId) ⇒ <code>number</code>
    * [.validatePagination(limit, offset)](#module_index.PermaAPI+validatePagination) ⇒ <code>Object</code>
    * [.pullPublicArchives([limit], [offset])](#module_index.PermaAPI+pullPublicArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
    * [.pullPublicArchive(archiveId)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.pullUser()](#module_index.PermaAPI+pullUser) ⇒ <code>Promise.&lt;PermaUser&gt;</code>
    * [.pullOrganizations()](#module_index.PermaAPI+pullOrganizations) ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
    * [.pullOrganization(organizationId)](#module_index.PermaAPI+pullOrganization) ⇒ <code>Promise.&lt;PermaOrganization&gt;</code>
    * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.pullArchive(archiveId)](#module_index.PermaAPI+pullArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.editArchive(archiveId, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.moveArchive(archiveId, folderId)](#module_index.PermaAPI+moveArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.deleteArchive([safeMode], [safeModeTries])](#module_index.PermaAPI+deleteArchive) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.pullArchives([url], [limit], [offset])](#module_index.PermaAPI+pullArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
    * [.pullTopLevelFolders([limit], [offset])](#module_index.PermaAPI+pullTopLevelFolders) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
    * [.pullFolder(folderId)](#module_index.PermaAPI+pullFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.pullFolderChildren(parentFolderId, [limit], [offset])](#module_index.PermaAPI+pullFolderChildren) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
    * [.createFolder(parentFolderId, name)](#module_index.PermaAPI+createFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.editFolder(folderId, [options])](#module_index.PermaAPI+editFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.moveFolder(folderId, parentFolderId)](#module_index.PermaAPI+moveFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.deleteFolder(folderId)](#module_index.PermaAPI+deleteFolder) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.pullFolderArchives(folderId, [limit], [offset])](#module_index.PermaAPI+pullFolderArchives) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
    * [.pullOngoingCaptureJobs([limit], [offset])](#module_index.PermaAPI+pullOngoingCaptureJobs) ⇒ <code>Promise.&lt;PermaCaptureJobsPage&gt;</code>
    * [.pullArchiveCaptureJob(archiveId)](#module_index.PermaAPI+pullArchiveCaptureJob) ⇒ <code>Promise.&lt;PermaCaptureJob&gt;</code>
    * [.createArchivesBatch(urls, folderId)](#module_index.PermaAPI+createArchivesBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
    * [.pullArchivesBatch(batchId)](#module_index.PermaAPI+pullArchivesBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>

<a name="new_module_index.PermaAPI_new"></a>

#### new exports.PermaAPI(apiKey, forceBaseUrl)
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | If provided, gives access to features that are behind auth. |
| forceBaseUrl | <code>string</code> | <code>null</code> | If provided, will be used instead of "https://api.perma.cc". Needs to be a valid url. |

<a name="module_index.PermaAPI+validateArchiveId"></a>

#### permaAPI.validateArchiveId(archiveId) ⇒ <code>string</code>
Checks that a given string is an archive GUID (2x 4 alphanumeric chars separated by an hyphen).
Throws an exception otherwise.
Note: Only checks format.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| archiveId | <code>string</code> | 

<a name="module_index.PermaAPI+validateFolderId"></a>

#### permaAPI.validateFolderId(folderId) ⇒ <code>number</code>
Checks that a given variable can be a folder id.
Throws an exception otherwise.
Note: Only checks format.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| folderId | <code>number</code> | 

<a name="module_index.PermaAPI+validateOrganizationId"></a>

#### permaAPI.validateOrganizationId(organizationId) ⇒ <code>number</code>
Checks that a given variable can be a folder id.
Throws an exception otherwise.
Note: Only checks format.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| organizationId | <code>number</code> | 

<a name="module_index.PermaAPI+validatePagination"></a>

#### permaAPI.validatePagination(limit, offset) ⇒ <code>Object</code>
Checks that a given pagination limit and offset pair is valid.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| limit | <code>number</code> | 
| offset | <code>number</code> | 

<a name="module_index.PermaAPI+pullPublicArchives"></a>

#### permaAPI.pullPublicArchives([limit], [offset]) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
Fetches a subset of all the available public archives.
Wraps [GET] `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullPublicArchive"></a>

#### permaAPI.pullPublicArchive(archiveId) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Fetches details of a given public archive.
Wraps [GET] `/v1/public/archives/{archiveId}` (https://perma.cc/docs/developer#get-one-archive).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| archiveId | <code>string</code> | 

<a name="module_index.PermaAPI+pullUser"></a>

#### permaAPI.pullUser() ⇒ <code>Promise.&lt;PermaUser&gt;</code>
Fetches account details for the current user.
Wraps [GET] `/v1/user/` (https://perma.cc/docs/developer#developer-users).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullOrganizations"></a>

#### permaAPI.pullOrganizations() ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
Fetches a list of all the organizations the signed-in user belongs to.
Wraps [GET] `/v1/organizations/` (https://perma.cc/docs/developer#developer-organizations).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullOrganization"></a>

#### permaAPI.pullOrganization(organizationId) ⇒ <code>Promise.&lt;PermaOrganization&gt;</code>
Fetches details an organization.
Wraps [GET] `/v1/organization/{organizationId}` (https://perma.cc/docs/developer#get-one-organization).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| organizationId | <code>number</code> | 

<a name="module_index.PermaAPI+createArchive"></a>

#### permaAPI.createArchive(url, [options]) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Creates an archive.
Wraps [POST] `/v1/archives/` (https://perma.cc/docs/developer#create-an-archive).
Requires an API key.
Throttled.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [options] | <code>Object</code> | 
| [options.title] | <code>string</code> | 
| [options.parentFolderId] | <code>number</code> | 
| [options.isPrivate] | <code>boolean</code> | 
| [options.notes] | <code>string</code> | 

<a name="module_index.PermaAPI+pullArchive"></a>

#### permaAPI.pullArchive(archiveId) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Fetches details of a given archive.
Wraps [GET] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#view-details-of-one-archive).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| archiveId | <code>string</code> | 

<a name="module_index.PermaAPI+editArchive"></a>

#### permaAPI.editArchive(archiveId, [options]) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Edit details for a given archive.
Wraps [PATCH] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#move-to-dark-archive).
Requires an API key.
Throttled.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| archiveId | <code>string</code> |  |
| [options] | <code>Object</code> |  |
| [options.isPrivate] | <code>boolean</code> | If set, will toggle an archive between public and private mode. |
| [options.title] | <code>string</code> | If set, will update the archive's title. |
| [options.notes] | <code>string</code> | If set, will update the archives notes |

<a name="module_index.PermaAPI+moveArchive"></a>

#### permaAPI.moveArchive(archiveId, folderId) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Moves an archive to a different folder.
Wraps [PUT] `/v1/folders/{folderId}/archives/{archiveId}` (https://perma.cc/docs/developer#move-archive).
Requires an API key.
Throttled.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| archiveId | <code>string</code> | Identifier of the archive to move. |
| folderId | <code>number</code> | Identifier of the folder to move the archive into. |

<a name="module_index.PermaAPI+deleteArchive"></a>

#### permaAPI.deleteArchive([safeMode], [safeModeTries]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Deletes an archive.
Wraps [DELETE] `/v1/archives/{archiveId}` (https://perma.cc/docs/developer#delete-archive).
Required an API key.
Throttled.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [safeMode] | <code>boolean</code> | <code>true</code> | If `true`, will check that the archive exists and wait until all capture jobs are complete before trying to delete. |
| [safeModeTries] | <code>number</code> | <code>0</code> | Used to keep track of how many times safe mode pulled info from the archive and waited for capture jobs to complete. |

<a name="module_index.PermaAPI+pullArchives"></a>

#### permaAPI.pullArchives([url], [limit], [offset]) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
Fetches a subset of all the archives the user has access to.
Wraps [GET] `/v1/archives` (https://perma.cc/docs/developer#view-all-archives-of-one-user).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>null</code> | If given, will try to fetch all archives matching this url. |
| [limit] | <code>number</code> | <code>10</code> |  |
| [offset] | <code>number</code> | <code>0</code> |  |

<a name="module_index.PermaAPI+pullTopLevelFolders"></a>

#### permaAPI.pullTopLevelFolders([limit], [offset]) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
Pulls a list of the user's top-level folders.
Wraps [GET] `/v1/folders` (https://perma.cc/docs/developer#view-top-level-folders).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>100</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullFolder"></a>

#### permaAPI.pullFolder(folderId) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
Retrieves the details of a given folder.
Wraps [GET] `/v1/folders/{folderId}` (https://perma.cc/docs/developer#view-folder-details).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| folderId | <code>number</code> | 

<a name="module_index.PermaAPI+pullFolderChildren"></a>

#### permaAPI.pullFolderChildren(parentFolderId, [limit], [offset]) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>
Lists direct children of a given folder.
Wraps [GET] `/v1/folders/{parentFolderId}/folders` (https://perma.cc/docs/developer#view-folder-subfolders).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parentFolderId | <code>number</code> |  | Id of the parent folder (required). |
| [limit] | <code>number</code> | <code>100</code> |  |
| [offset] | <code>number</code> | <code>0</code> |  |

<a name="module_index.PermaAPI+createFolder"></a>

#### permaAPI.createFolder(parentFolderId, name) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
Creates a folder.
Wraps [POST] `/v1/folders/{parentFolderId}/folders/` (https://perma.cc/docs/developer#create-folder).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| parentFolderId | <code>number</code> | Id of the parent folder (required). |
| name | <code>string</code> | Name to be given to the new folder. |

<a name="module_index.PermaAPI+editFolder"></a>

#### permaAPI.editFolder(folderId, [options]) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
Edit details for a given folder.
Wraps [PATCH] `/v1/folders/{folderId}/` (https://perma.cc/docs/developer#rename-folder).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| folderId | <code>number</code> |  |
| [options] | <code>Object</code> |  |
| [options.name] | <code>string</code> | If set, will update the folder's name. |

<a name="module_index.PermaAPI+moveFolder"></a>

#### permaAPI.moveFolder(folderId, parentFolderId) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
Moves a folder into another.
Wraps [PUT] `/v1/folders/{parentFolderId}/folders/{folderId}/` (https://perma.cc/docs/developer#move-folder).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| folderId | <code>number</code> | Folder to move. |
| parentFolderId | <code>number</code> | Where to move that folder into. |

<a name="module_index.PermaAPI+deleteFolder"></a>

#### permaAPI.deleteFolder(folderId) ⇒ <code>Promise.&lt;boolean&gt;</code>
Deletes a folder.
Wraps [DELETE] `/v1/folders/{folderId}` (https://perma.cc/docs/developer#delete-folder).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| folderId | <code>number</code> | 

<a name="module_index.PermaAPI+pullFolderArchives"></a>

#### permaAPI.pullFolderArchives(folderId, [limit], [offset]) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
Pulls a list of archives from a specific folder.
Wraps [GET] `/v1/folders/{folderId}/archives` (https://perma.cc/docs/developer#view-folder-archives).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| folderId | <code>number</code> |  | 
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullOngoingCaptureJobs"></a>

#### permaAPI.pullOngoingCaptureJobs([limit], [offset]) ⇒ <code>Promise.&lt;PermaCaptureJobsPage&gt;</code>
Retrieves the full list of ongoing capture jobs for the current user.
Wraps [GET] `/v1/capture_jobs/` (https://perma.cc/docs/developer#get-user-capture-jobs).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>100</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullArchiveCaptureJob"></a>

#### permaAPI.pullArchiveCaptureJob(archiveId) ⇒ <code>Promise.&lt;PermaCaptureJob&gt;</code>
Pulls the latest capture job details for a given archive id.
Wraps [GET] `/v1/capture_jobs/{archiveId}` (https://perma.cc/docs/developer#get-archive-status).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| archiveId | <code>string</code> | 

<a name="module_index.PermaAPI+createArchivesBatch"></a>

#### permaAPI.createArchivesBatch(urls, folderId) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
Creates multiple archives at once (batch).
Wraps [POST] `/v1/archives/batches` (https://perma.cc/docs/developer#batches).
Requires an API key.
Throttled.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| urls | <code>Array.&lt;string&gt;</code> | Must contain valid urls. |
| folderId | <code>number</code> | Destination folder of the resulting archives. |

<a name="module_index.PermaAPI+pullArchivesBatch"></a>

#### permaAPI.pullArchivesBatch(batchId) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
Pulls the status of a given archives batch.
Wraps [GET] `/v1/archives/batches/{batchId}` (https://perma.cc/docs/developer#get-batch-status).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| batchId | <code>number</code> | 

<a name="module_index..fetch"></a>

### index~fetch
Module-level `fetch()` fallback.
- Will be a reference to `globalThis.fetch` if running a version of Node.js with native support for `fetch()`.
- Will return a window-bound version of `fetch()` if running in a browser context.
- Will return a function dynamically loading `node-fetch` if we're running a version of Node.js that doesn't support `fetch()`.

**Kind**: inner constant of [<code>index</code>](#module_index)  
