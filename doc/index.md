<a name="module_index"></a>

## index
A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [index](#module_index)
    * [.PermaAPI](#module_index.PermaAPI)
        * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
        * [.validateArchiveGuid(guid)](#module_index.PermaAPI+validateArchiveGuid) ⇒ <code>string</code>
        * [.pullPublicArchivesPage([limit], [offset])](#module_index.PermaAPI+pullPublicArchivesPage) ⇒ <code>PermaPublicArchivesPage</code>
        * [.pullPublicArchive(guid)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>PermaArchive</code>
        * [.pullCurrentUser()](#module_index.PermaAPI+pullCurrentUser) ⇒ <code>PermaUser</code>
        * [.pullOrganizationsList()](#module_index.PermaAPI+pullOrganizationsList) ⇒ <code>PermaOrganizationsPage</code>
        * [.pullOrganization(id)](#module_index.PermaAPI+pullOrganization) ⇒ <code>PermaOrganization</code>
        * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>PermaArchive</code>
        * [.pullArchive(guid)](#module_index.PermaAPI+pullArchive) ⇒ <code>PermaArchive</code>
        * [.editArchive(guid, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>PermaArchive</code>

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
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| #apiKey | <code>string</code> | API key to be used to access restricted features (private). |
| #baseUrl | <code>string</code> | Base url of the Perma.cc API.  Can be only at constructor level (private). |


* [.PermaAPI](#module_index.PermaAPI)
    * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
    * [.validateArchiveGuid(guid)](#module_index.PermaAPI+validateArchiveGuid) ⇒ <code>string</code>
    * [.pullPublicArchivesPage([limit], [offset])](#module_index.PermaAPI+pullPublicArchivesPage) ⇒ <code>PermaPublicArchivesPage</code>
    * [.pullPublicArchive(guid)](#module_index.PermaAPI+pullPublicArchive) ⇒ <code>PermaArchive</code>
    * [.pullCurrentUser()](#module_index.PermaAPI+pullCurrentUser) ⇒ <code>PermaUser</code>
    * [.pullOrganizationsList()](#module_index.PermaAPI+pullOrganizationsList) ⇒ <code>PermaOrganizationsPage</code>
    * [.pullOrganization(id)](#module_index.PermaAPI+pullOrganization) ⇒ <code>PermaOrganization</code>
    * [.createArchive(url, [options])](#module_index.PermaAPI+createArchive) ⇒ <code>PermaArchive</code>
    * [.pullArchive(guid)](#module_index.PermaAPI+pullArchive) ⇒ <code>PermaArchive</code>
    * [.editArchive(guid, [options])](#module_index.PermaAPI+editArchive) ⇒ <code>PermaArchive</code>

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

#### permaAPI.pullPublicArchivesPage([limit], [offset]) ⇒ <code>PermaPublicArchivesPage</code>
Fetches a subset of all the available public archives. 
Wraps [GET] `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+pullPublicArchive"></a>

#### permaAPI.pullPublicArchive(guid) ⇒ <code>PermaArchive</code>
Fetches details of a given public archive.
Wraps [GET] `/v1/public/archives/{guid}` (https://perma.cc/docs/developer#get-one-archive).

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+pullCurrentUser"></a>

#### permaAPI.pullCurrentUser() ⇒ <code>PermaUser</code>
Fetches account details for the signed-in user. 
Wraps [GET] `/v1/user/` (https://perma.cc/docs/developer#developer-users).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullOrganizationsList"></a>

#### permaAPI.pullOrganizationsList() ⇒ <code>PermaOrganizationsPage</code>
Fetches a list of all the organizations the signed-in user belongs to.
Wraps [GET] `/v1/organizations/` (https://perma.cc/docs/developer#developer-organizations). 
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+pullOrganization"></a>

#### permaAPI.pullOrganization(id) ⇒ <code>PermaOrganization</code>
Fetches details an organization. 
Wraps [GET] `/v1/organization/{id}` (https://perma.cc/docs/developer#get-one-organization). 
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="module_index.PermaAPI+createArchive"></a>

#### permaAPI.createArchive(url, [options]) ⇒ <code>PermaArchive</code>
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

<a name="module_index.PermaAPI+pullArchive"></a>

#### permaAPI.pullArchive(guid) ⇒ <code>PermaArchive</code>
Fetches details of a given archive.
Wraps [GET] `/v1/archives/{guid}` (https://perma.cc/docs/developer#view-details-of-one-archive). 
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+editArchive"></a>

#### permaAPI.editArchive(guid, [options]) ⇒ <code>PermaArchive</code>
Edit archive details
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
