# perma-js-sdk
A JavaScript library to interact with [Perma.cc's REST API](https://perma.cc/docs/developer).

> ⚠️ This is an early version.

[![Test suite](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml/badge.svg?branch=develop)](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml) [![npm version](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk.svg)](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk)

---

## Summary

- [Getting started](#getting-started)
- [Stack and compatibility](#stack-and-compatibility)
- [API documentation](#api-documentation)
- [Development CLI](#development-cli)
- [Environment variables](#environment-variables)
- [Publishing a new version](#publishing-a-new-version)

---

## Getting started

### Installation as a dependency
You may use `npm` or your favorite JavaScript package manager to install `perma-js-sdk` as a dependency.

```bash
npm install @harvard-lil/perma-js-sdk
```

### Directly in the browser
This library can be imported directly in the browser.<br>
You may use a service such as [`unpkg.com`](https://unpkg.com) to import its latest version from `npmjs.org`. 

```javascript
import { PermaAPI } from "https://unpkg.com/@harvard-lil/perma-js-sdk@latest/index.js";
```

### Quick Example
Here a quick example of how to use the `PermaAPI` class to interact with [Perma.cc's API](https://perma.cc).<br>
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

## Stack and compatibility

### Stack
This library, by design, has no runtime dependency and does not _require_ a build step in most cases.

### Compatibility notes
This library:
- [...] uses [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).<br>Versions of Node.js that do not support `fetch()` may instead use [`node-fetch` and make it globally accessible](https://github.com/node-fetch/node-fetch#providing-global-access).
- [...] is ES module-based and doesn't support CommonJS syntax.
- [...] was written so it can be run without transpiling in:
  - Latest Chromium
  - Latest Gecko
  - Latest WebKit
  - Latest Node.js _(+ latest Node.js LTS with `node-fetch`)_

[☝️ Back to summary](#summary)

---

## API documentation

### Reference
- [`PermaAPI` class documentation](/doc/index.md) _(Automatically generated)_
- [Associated types documentation](/doc/types.md) _(Automatically generated)_

### Notes
- This project uses [JSDoc](https://jsdoc.app/) and is compatible with IntelliSense (Examples: [[1]](https://user-images.githubusercontent.com/625889/177423585-f92c491e-d98c-4476-8250-544d535b6ecc.png) [[2]](https://user-images.githubusercontent.com/625889/177424359-23906796-1c62-418e-996a-f0265c1f6be6.png)). 

### Misc
- [Perma.cc's REST API reference](https://perma.cc/docs/developer)

[☝️ Back to summary](#summary)

---

## Development CLI

### docgen
```bash
npm run docgen
```

Refreshes files under `/doc` using `JSDoc` comments in `index.js` and `types.js`.

### test-unit
```bash
npm run test-unit
```

Runs `index.unit.test.js` using Jest.

### test-integration
```bash
npm run test-integration
```

Runs `index.integration.test.js` using Jest.<br> 
This test suite requires the `TESTS_API_KEY` and `TESTS_FORCE_BASE_URL` environment variables to be set.

### test-integration-local
```bash
npm run test-integration-local
```

Same as `test-integration` but: 
- Reads environment variables from `.env` file if available
- Ignores TLS certificates errors _(so the tests can be run against a local instance of the Perma API)_

[☝️ Back to summary](#summary)

---

## Environment variables

### Scope: Integration tests
The following environment variables are only used in the context of [the integration tests suite](#testing).<br>

| Name | Required? | Description |
| --- | --- | --- |
| `TESTS_API_KEY` | Yes | API key to be used to perform integration tests. Can be of any type of account. |
| `TESTS_FORCE_BASE_URL` | No | Base API url to be used to perform integration tests. If not set, will default to `https://api.perma.cc`. |  

[☝️ Back to summary](#summary)

---

## Publishing a new version

**Once changes have been merged to `develop` and a new version is ready, please follow these steps to deploy a new version of the package:**
1. Run unit tests: `npm run test-unit`
2. Run integration tests: `npm run test-integration-local`
3. Update documentation: `npm run docgen`
4. Update NPM package version number: `npm version patch --no-git-tag-version`
5. Publish on NPM: `npm publish --access public`
6. Commit and push changes to `develop`
7. PR and merge to `main`, with version number as PR title.

> ℹ️ Steps 1-5 can be replaced by `./test-and-publish.sh`

You will need access to the `@harvard-lil` organization on `npmjs.org` to publish new versions of the package.

[☝️ Back to summary](#summary)
