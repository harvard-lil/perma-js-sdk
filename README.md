> 🚧 Work in progress

# perma-js-sdk
A JavaScript library to interact with [Perma.cc's REST API](https://perma.cc/docs/developer).

[![Test suite](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml/badge.svg?branch=develop)](https://github.com/harvard-lil/perma-js-sdk/actions/workflows/run-tests-on-pr.yml)

[![npm version](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk.svg)](https://badge.fury.io/js/@harvard-lil%2Fperma-js-sdk)

---

## Summary

- [Getting started](#getting-started)
- [Design and stack](#design-and-stack)
- [Compatibility](#compatibility)
- [API documentation](#api-documentation)
- [Environment variables](#environment-variables)
- [Testing](#testing)
- [Publishing a new version](#publishing-a-new-version)

---

## Getting started

### As a dependency
You may use `npm` or your favorite JavaScript package manager to install `perma-js-sdk` as a dependency.

```bash
npm install @harvard-lil/perma-js-sdk
```

**Usage:**
```javascript
import { PermaAPI, PermaAPIError } from "perma-js-sdk";

try {
  const api = new PermaAPI(apiKey);
  const archive = await api.createArchive("https://lil.harvard.edu/");
  // ...
}
catch(err) {
  // ...
}
```

### Directly in the browser
`perma-js-sdk` can be consumed directly from `unpkg.com`.

```javascript
import { PermaAPI } from "https://unpkg.com/@harvard-lil/perma-js-sdk@latest/index.js";
// ...
```

[☝️ Back to summary](#summary)

---

## Design and stack

[☝️ Back to summary](#summary)

---

## Compatibility

[☝️ Back to summary](#summary)

---

## API documentation

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

## Testing

[☝️ Back to summary](#summary)

---

## Publishing a new version

[☝️ Back to summary](#summary)
