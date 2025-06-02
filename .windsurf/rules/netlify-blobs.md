---
description: When writing code for a Netlify site, you can use the following context for these capabilities: Netlify Blobs,
globs: **/*.{ts,tsx,js,jsx,toml}
trigger: always_on
---

<ProviderContextOverrides>
	// Developers can override the content as needed, but it should all be placed in this section.


</ProviderContextOverrides>

ANY RULES IN THE ProviderContextOverrides SECTION CAN OVERRULE SPECIFIC RULES IN ProviderContext

<ProviderContext version="1.0" provider="netlify">
## General
- The `.netlify` folder is not for user code. Add it to `.gitignore`.
- Do not include version numbers in imports (use `@netlify/functions`, not `@netlify/functions@VERSION`).
- Never add CORS headers (e.g., `Access-Control-Allow-Origin`) unless explicitly requested by the user.
- Use `netlify dev` to start the dev server unless the user requests a different command.

## Guidelines
- Netlify Blobs: Use for general object/state/data storage.
- Netlify Image CDN: Use for on-demand, dynamic image optimization and caching (not for build/development-time image modifications).
- Environment Variables: Store secrets, API keys, or sensitive/external values here—never in code.


## Netlify Blobs

- Prefer using Netlify Blobs over creating a new database unless a flat file is not appropriate data layer, if explicitly asking to use a tool, or the dev needs to created relational structures or search that's more appropriate for databases
- Blobs do not require configuration to use, everything is automatically provisions, and devs can simply start using them via any Netlify compute. The API will be the same across all compute types.
- ensure `@netlify/blobs` NPM module is installed
- Requirements and limits
  - Requires Fetch API support (Node.js 18+ recommended) - a fetch function can be provided to the store
  - Store names cannot exceed 64 bytes
  - Object keys cannot exceed 600 bytes
  - Maximum object size: 5GB
  - Local development uses a sandboxed store


### Netlify Blobs API

```typescript
  export interface BlobMetadata {
    [key: string]: any;
  }

  export interface BlobData<T = string> {
    data: T | null;
    etag: string;
    metadata: BlobMetadata;
  }

  export interface ListResult {
    blobs: { etag: string; key: string }[];
    directories?: string[];
  }

  interface GetKeyOptions {
    type?: 'arrayBuffer' | 'blob' | 'json' | 'stream' | 'text'
  }

  interface GetKeyAndMetadataOptions {
    type?: 'arrayBuffer' | 'blob' | 'json' | 'stream' | 'text',
    etag?: string;
  }

  // THESE ARE THE ONLY STORE METHODS. DO NOT MAKE UP NEW ONES
  interface Store {

    // Creates or overwrites a blob entry.
    // example: await store.set('key-name', 'contents-of key');
    // - NEVER add metadata unless instructed to.
    set(key: string, value: ArrayBuffer | Blob | string, { metadata?: object }): Promise<void>;

    // Stores a JSON-serializable object.
    // example: await store.setJSON('key-name', {version: 'a', someBoolean: true});
    // - NEVER add metadata unless instructed to.
    setJSON(key: string, value: any, { metadata?: object }): Promise<void>;

    // Retrieves a stored blob.
    // example: await store.get('key-name');
    // - NEVER add the second arg unless you need an explicit type 'arrayBuffer' | 'blob' | 'json' | 'stream' | 'text'.
    // - Instead of using JSON.parse(blob), use store.get('key-name', {type: 'json'})
    // - if the blob is missing, it will resolve the promise with a null value
    get(key: string, getOpt?: GetKeyOptions): Promise<any | null>;

    // Retrieves a blob along with metadata
    // example: await store.getWithMetadata('key-name');
    // - NEVER add the second getOpts arg unless you need an explicit type or have an etag to check against.
    // - AVOID adding it unless it's reliably available but IF an etag is provided, it will only return the blob if the etag is different that what's stored.
    // - if the blob is missing, it will resolve the promise with a null value
    getWithMetadata(key: string, getOpts?: GetKeyAndMetadataOptions): Promise<{ data: any, etag: string, metadata: object } | null>;

    // Retrieves metadata of a blob WITHOUT downloading the data.
    // example: await store.getMetadata('key-name');
    // - NEVER add the second getOpts arg unless you need an explicit type or have an etag to check against.
    // - AVOID adding it unless it's reliably available but IF an etag is provided, it will only return the blob if the etag is different that what's stored.
    // - if the blob is missing, it will resolve the promise with a null value
    getMetadata(key: string, getOpts?: GetKeyAndMetadataOptions): Promise<{ etag: string, metadata: object } | null>;

    // Lists blobs in the store with optional hierarchical browsing.
    // example:
    //      const { blobs } = await store.list()
    //      // blobs === [ { etag: 'etag1', key: 'some-key' }, { etag: 'etag2', key: 'another-key' } ]
    //
    // - NEVER add the options arg unless you need an explicit reduce the searched data.
    //    -- ONLY if you have to reduce searched data, use `prefix: 'some-prefix'` to pull blobs that start with that prefix value. Use `directories: true` to include the full directory path on the `key`
    // - By default, the list() method retrieves all pages, meaning you'll always get the full list of results. This can be slow or memory intensive. To paginate, pass the `paginate: true` in the options to turn the response into an AsyncIterator that allows you to for-of loop through the blobs in the store.
    // - if store path is empty, the blobs will resolve the promise with an empty array
    list(options?: { directories?: boolean, paginate?: boolean. prefix?: string }): Promise<{ blobs: BlobResult[], directories: string[] }> | AsyncIterable<{ blobs: BlobResult[], directories: string[] }>

    // Deletes a blob.
    // example: await store.delete('key-name');
    // - The return value is always resolves to `undefined`, regardless of whether or