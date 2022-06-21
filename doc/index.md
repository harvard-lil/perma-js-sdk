<a name="module_index"></a>

## index
A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [index](#module_index)
    * [.PermaAPI](#module_index.PermaAPI)
        * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
        * [.validateArchiveGuid(guid)](#module_index.PermaAPI+validateArchiveGuid) ⇒ <code>string</code>
        * [.pullPublicArchivesPage([limit], [offset])](#module_index.PermaAPI+pullPublicArchivesPage) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
        * [.pullPublicArchive(guid)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
        * [.pullCurrentUser()](#module_index.PermaAPI+pullCurrentUser) ⇒ <code>Promise.&lt;PermaUser&gt;</code>
        * [.pullOrganizationsList()](#module_index.PermaAPI+pullOrganizationsList) ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
        * [.pullOrganization(organizationId)](#module_index.PermaAPI+pullOrganization) ⇒ <code>Promise.&lt;PermaOrganization&gt;</code>
        * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
        * [.createArchiveBatch(urls, folderId)](#module_index.PermaAPI+createArchiveBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
        * [.pullArchive(guid)](#module_index.PermaAPI+pullArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
        * [.editArchive(guid, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
        * [.moveArchive(guid, folderId)](#module_index.PermaAPI+moveArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
        * [.deleteArchive()](#module_index.PermaAPI+deleteArchive) ⇒ <code>Promise.&lt;Boolean&gt;</code>
        * [.pullArchivesPage([limit], [offset])](#module_index.PermaAPI+pullArchivesPage) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
        * [.createFolder(parentFolderId, name)](#module_index.PermaAPI+createFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
        * [.pullFolderDetails(folderId)](#module_index.PermaAPI+pullFolderDetails) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
        * [.pullFolderChildren(parentFolderId, [limit], [offset])](#module_index.PermaAPI+pullFolderChildren) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>

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
    * [.validateArchiveGuid(guid)](#module_index.PermaAPI+validateArchiveGuid) ⇒ <code>string</code>
    * [.pullPublicArchivesPage([limit], [offset])](#module_index.PermaAPI+pullPublicArchivesPage) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
    * [.pullPublicArchive(guid)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.pullCurrentUser()](#module_index.PermaAPI+pullCurrentUser) ⇒ <code>Promise.&lt;PermaUser&gt;</code>
    * [.pullOrganizationsList()](#module_index.PermaAPI+pullOrganizationsList) ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
    * [.pullOrganization(organizationId)](#module_index.PermaAPI+pullOrganization) ⇒ <code>Promise.&lt;PermaOrganization&gt;</code>
    * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.createArchiveBatch(urls, folderId)](#module_index.PermaAPI+createArchiveBatch) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
    * [.pullArchive(guid)](#module_index.PermaAPI+pullArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.editArchive(guid, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.moveArchive(guid, folderId)](#module_index.PermaAPI+moveArchive) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
    * [.deleteArchive()](#module_index.PermaAPI+deleteArchive) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.pullArchivesPage([limit], [offset])](#module_index.PermaAPI+pullArchivesPage) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
    * [.createFolder(parentFolderId, name)](#module_index.PermaAPI+createFolder) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.pullFolderDetails(folderId)](#module_index.PermaAPI+pullFolderDetails) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
    * [.pullFolderChildren(parentFolderId, [limit], [offset])](#module_index.PermaAPI+pullFolderChildren) ⇒ <code>Promise.&lt;PermaFoldersPage&gt;</code>

<a name="new_module_index.PermaAPI_new"></a>

#### new exports.PermaAPI(apiKey, forceBaseUrl)
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | If provided, gives access to features that are behind auth. |
| forceBaseUrl | <code>string</code> | <code>null</code> | If provided, will be used instead of "https://api.perma.cc". Needs to be a valid url. |

<a name="module_index.PermaAPI+validateArchiveGuid"></a>

#### permaAPI.validateArchiveGuid(guid) ⇒ <code>string</code>
Checks that a given string is an archive GUID (2x 4 alphanumeric chars separated by an hyphen).
Throws an exception otherwise.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+pullPublicArchivesPage"></a>

#### permaAPI.pullPublicArchivesPage([limit], [offset]) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
Fetches a subset of all the available public archives.
Wraps [GET] `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullPublicArchive"></a>

#### permaAPI.pullPublicArchive(guid) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Fetches details of a given public archive.
Wraps [GET] `/v1/public/archives/{guid}` (https://perma.cc/docs/developer#get-one-archive).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+pullCurrentUser"></a>

#### permaAPI.pullCurrentUser() ⇒ <code>Promise.&lt;PermaUser&gt;</code>
Fetches account details for the signed-in user.
Wraps [GET] `/v1/user/` (https://perma.cc/docs/developer#developer-users).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullOrganizationsList"></a>

#### permaAPI.pullOrganizationsList() ⇒ <code>Promise.&lt;PermaOrganizationsPage&gt;</code>
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

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> |  |
| [options] | <code>Object</code> |  |
| [options.title] | <code>string</code> |  |
| [options.folder] | <code>number</code> | Folder id. |
| [options.isPrivate] | <code>boolean</code> |  |
| [options.notes] | <code>string</code> |  |

<a name="module_index.PermaAPI+createArchiveBatch"></a>

#### permaAPI.createArchiveBatch(urls, folderId) ⇒ <code>Promise.&lt;PermaArchivesBatch&gt;</code>
Requests the creation of a batch of archives. 
Wraps [POST] `/v1/archives/batches` (https://perma.cc/docs/developer#batches). 
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| urls | <code>Array.&lt;string&gt;</code> | Must contain valid urls. |
| folderId | <code>number</code> | Destination folder of the resulting archives. |

<a name="module_index.PermaAPI+pullArchive"></a>

#### permaAPI.pullArchive(guid) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Fetches details of a given archive.
Wraps [GET] `/v1/archives/{guid}` (https://perma.cc/docs/developer#view-details-of-one-archive).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+editArchive"></a>

#### permaAPI.editArchive(guid, [options]) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Edit details for a given archive. 
Wraps [PATCH] `/v1/archives/{guid}` (https://perma.cc/docs/developer#move-to-dark-archive).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| guid | <code>string</code> |  |
| [options] | <code>Object</code> |  |
| [options.isPrivate] | <code>boolean</code> | If set, will toggle an archive between public and private mode. |
| [options.title] | <code>string</code> | If set, will update the archive's title. |
| [options.notes] | <code>string</code> | If set, will update the archives notes |

<a name="module_index.PermaAPI+moveArchive"></a>

#### permaAPI.moveArchive(guid, folderId) ⇒ <code>Promise.&lt;PermaArchive&gt;</code>
Moves an archive to a different folder. 
Wraps [PATCH] `/v1/folders/{folderId}/archives/{guid}` (https://perma.cc/docs/developer#move-archive). 
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Description |
| --- | --- | --- |
| guid | <code>string</code> | Identifier of the archive to move. |
| folderId | <code>number</code> | Identifier of the folder to move the archive into. |

<a name="module_index.PermaAPI+deleteArchive"></a>

#### permaAPI.deleteArchive() ⇒ <code>Promise.&lt;Boolean&gt;</code>
Deletes an archive. 
Wraps [DELETE] `/v1/archives/{guid}` (https://perma.cc/docs/developer#delete-archive). 
Required an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullArchivesPage"></a>

#### permaAPI.pullArchivesPage([limit], [offset]) ⇒ <code>Promise.&lt;PermaArchivesPage&gt;</code>
Fetches a subset of all the archives the user has access to. 
Wraps [GET] `/v1/archives` (https://perma.cc/docs/developer#view-all-archives-of-one-user).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

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

<a name="module_index.PermaAPI+pullFolderDetails"></a>

#### permaAPI.pullFolderDetails(folderId) ⇒ <code>Promise.&lt;PermaFolder&gt;</code>
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

