<a name="module_index"></a>

## index
A JavaScript library to interact with Perma.cc's REST API (https://perma.cc/docs/developer).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [index](#module_index)
    * [.PermaAPI](#module_index.PermaAPI)
        * [new exports.PermaAPI(apiKey, forceBaseUrl)](#new_module_index.PermaAPI_new)
        * [.getAuthorizationHeader()](#module_index.PermaAPI+getAuthorizationHeader) ⇒ <code>object</code>
        * [.parseAPIResponse(response)](#module_index.PermaAPI+parseAPIResponse) ⇒ <code>object</code>
        * [.publicArchives([limit], [offset])](#module_index.PermaAPI+publicArchives) ⇒ <code>PermaPublicArchivesPage</code>
        * [.publicArchive(guid)](#module_index.PermaAPI+publicArchive) ⇒ <code>PermaArchive</code>
        * [.user()](#module_index.PermaAPI+user) ⇒ <code>PermaUser</code>
        * [.organizations()](#module_index.PermaAPI+organizations) ⇒ <code>PermaOrganizationsPage</code>
        * [.organization(id)](#module_index.PermaAPI+organization) ⇒ <code>PermaOrganization</code>

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
    * [.getAuthorizationHeader()](#module_index.PermaAPI+getAuthorizationHeader) ⇒ <code>object</code>
    * [.parseAPIResponse(response)](#module_index.PermaAPI+parseAPIResponse) ⇒ <code>object</code>
    * [.publicArchives([limit], [offset])](#module_index.PermaAPI+publicArchives) ⇒ <code>PermaPublicArchivesPage</code>
    * [.publicArchive(guid)](#module_index.PermaAPI+publicArchive) ⇒ <code>PermaArchive</code>
    * [.user()](#module_index.PermaAPI+user) ⇒ <code>PermaUser</code>
    * [.organizations()](#module_index.PermaAPI+organizations) ⇒ <code>PermaOrganizationsPage</code>
    * [.organization(id)](#module_index.PermaAPI+organization) ⇒ <code>PermaOrganization</code>

<a name="new_module_index.PermaAPI_new"></a>

#### new exports.PermaAPI(apiKey, forceBaseUrl)
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apiKey | <code>string</code> |  | If provided, gives access to features that are behind auth. |
| forceBaseUrl | <code>string</code> | <code>null</code> | If provided, will be used instead of "https://api.perma.cc". Needs to be a valid url. |

<a name="module_index.PermaAPI+getAuthorizationHeader"></a>

#### permaAPI.getAuthorizationHeader() ⇒ <code>object</code>
Returns a ready-to-use Authorization header object. Throws if no API key was provided.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
**Returns**: <code>object</code> - - Key / value pair be added to the headers object sent alongside requests.  
<a name="module_index.PermaAPI+parseAPIResponse"></a>

#### permaAPI.parseAPIResponse(response) ⇒ <code>object</code>
Tries to parse an API response as JSON. 

If the status code isn't 200 and/or an error message was provided, will throw an exception with that information. 
For example: `Error: Invalid token. (HTTP 401)`

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| response | <code>Response</code> | 

<a name="module_index.PermaAPI+publicArchives"></a>

#### permaAPI.publicArchives([limit], [offset]) ⇒ <code>PermaPublicArchivesPage</code>
Fetches a subset of all the available public archives.
Wraps `/v1/public/archives` (https://perma.cc/docs/developer#get-all-public-archives)

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type | Default |
| --- | --- | --- |
| [limit] | <code>number</code> | <code>10</code> | 
| [offset] | <code>number</code> | <code>0</code> | 

<a name="module_index.PermaAPI+publicArchive"></a>

#### permaAPI.publicArchive(guid) ⇒ <code>PermaArchive</code>
Fetches details of a given public archive.
Wraps `/v1/public/archives/{guid}`

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="module_index.PermaAPI+user"></a>

#### permaAPI.user() ⇒ <code>PermaUser</code>
Fetches account details for the signed-in user. 
Wraps `/v1/user/` (https://perma.cc/docs/developer#developer-users).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+organizations"></a>

#### permaAPI.organizations() ⇒ <code>PermaOrganizationsPage</code>
Fetches a list of all the organizations the signed-in user belongs to.
Wraps `/v1/organizations/` (https://perma.cc/docs/developer#developer-organizations).
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  
<a name="module_index.PermaAPI+organization"></a>

#### permaAPI.organization(id) ⇒ <code>PermaOrganization</code>
Fetches details an organization. 
Wraps `/v1/organization/{id}` (https://perma.cc/docs/developer#get-one-organization)
Requires an API key.

**Kind**: instance method of [<code>PermaAPI</code>](#module_index.PermaAPI)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

