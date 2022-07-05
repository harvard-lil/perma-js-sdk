> 🚧 Work in progress

# perma-js-sdk
A JavaScript library to interact with [Perma.cc's REST API](https://perma.cc/docs/developer).

[![Test suite](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml/badge.svg?branch=develop)](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml) [![npm version](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk.svg)](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk)

---

## Summary

- [Getting started](#getting-started)
- [Design and stack](#design-and-stack)
- [Compatibility notes](#compatibility-notes)
- [API documentation](#api-documentation)
- [Environment variables](#environment-variables)
- [CLI Commands](#cli-commands)
- [Testing](#testing)
- [Publishing a new version](#publishing-a-new-version)

---

## Getting started

### Installation as a dependency
You may use `npm` or your favorite JavaScript package manager to install `perma-js-sdk` as a dependency.

```bash
npm install @harvard-lil/perma-js-sdk
```

### Directly in the browser
This library can be run directly in the browser. 
You may use a service such as [`unpkg.com`](https://unpkg.com) to import the latest version of the library from `npmjs.org`. 

```javascript
import { PermaAPI } from "https://unpkg.com/@harvard-lil/perma-js-sdk@latest/index.js";
```

### Example: Creating an archive
Here a quick example of how to use the `PermaAPI` class to interact with [Perma.cc's API](https://perma.cc). 
See the [API Documentation](#api-documentation) for details.

```javascript
import { PermaAPI } from "perma-js-sdk";

try {
  const api = new PermaAPI(API_KEY);
  const archive = await api.createArchive("https://lil.harvard.edu");
  console.log(`Archive created -- guid: ${archive.guid}`);
}
catch(err) {
  // ...
}
```

[☝️ Back to summary](#summary)

---

## Design and stack

> 🚧 TODO

[☝️ Back to summary](#summary)

---

## Compatibility notes
This library:
- [...] uses [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Versions of Node.js that do not support `fetch()` may instead use [`node-fetch` and make it globally accessible](https://github.com/node-fetch/node-fetch#providing-global-access).
- [...] is an ES module and doesn't support CommonJS syntax.
- [...] was written so it can be run without transpiling in:
  - Latest Chromium
  - Latest Gecko
  - Latest WebKit
  - Latest Node.js _(+ latest Node.js LTS with `node-fetch`)_

[☝️ Back to summary](#summary)

---

## API documentation

### Reference
- [`PermaAPI` class documentation](/doc/index.md)
- [Associated types documentation](/doc/types.md)

### Notes
This project uses [JSDoc](https://jsdoc.app/) and is compatible with IntelliSense. 

![](https://user-images.githubusercontent.com/625889/177423585-f92c491e-d98c-4476-8250-544d535b6ecc.png)

![](https://user-images.githubusercontent.com/625889/177424359-23906796-1c62-418e-996a-f0265c1f6be6.png)

### Misc
- [Perma.cc's REST API reference](https://perma.cc/docs/developer)

[☝️ Back to summary](#summary)

---

## Environment variables

### Scope: Integration tests
The following environment variables are only used in the context of [the integration tests suite](#testing).

| Name | Required? | Description |
| --- | --- | --- |
| `TESTS_API_KEY` | Yes | API key to be used to perform integration tests. |
| `TESTS_FORCE_BASE_URL` | No | Base API url to be used to perform integration tests. If not set, will default to `https://api.perma.cc`. |  

[☝️ Back to summary](#summary)

---

## CLI Commands

> 🚧 TODO

[☝️ Back to summary](#summary)

---

## Testing

> 🚧 TODO

[☝️ Back to summary](#summary)

---

## Publishing a new version

> 🚧 TODO

[☝️ Back to summary](#summary)
