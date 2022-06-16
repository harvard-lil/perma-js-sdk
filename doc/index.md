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
        * [.user()](#module_index.PermaAPI+user) ⇒ <code>PermaUser</code>
        * [.organizations()](#module_index.PermaAPI+organizations) ⇒ <code>PermaOrganizationsPage</code>

<a name="module_index.PermaAPI"></a>

### index.PermaAPI
Wrapper for Perma.cc's Rest API (v1).

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
    * [.getAuthorizationHeader()](#module_index.PermaAPI+getAuthorizationHeader) ⇒ <code>object</code>
    * [.parseAPIResponse(response)](#module_index.PermaAPI+parseAPIResponse) ⇒ <code>object</code>
    * [.user()](#module_index.PermaAPI+user) ⇒ <code>PermaUser</code>
    * [.organizations()](#module_index.PermaAPI+organizations) ⇒ <code>PermaOrganizationsPage</code>

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
