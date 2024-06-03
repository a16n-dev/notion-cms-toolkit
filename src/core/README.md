The `core` module contains the bulk of the core functionality, manily responsible for interacting with the Notion API, parsing incoming data, and storing it into the cache.

This code is using MongoDB as a backing data source for the cache, however it would be fairly straightforward to rewrite `datastore/documentCacheV1.ts` to support any other data source.

