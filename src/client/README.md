The `client` section of the toolkit is the application-facing code, which exposes methods for application code to retrieve data from the cache.

In a real-world application, the `client` would likely be a REST API or similar. A simple boilerplate setup for this can be found in `express.ts`

The `clientTypes.ts` file is intended to be a stand-alone types file that contains all the types needed for application code to work with the datatypes provided by the client. If the data was provided via a REST API, the clientTypes would be likely copied to any application code that consumes the API.

# Client Types
The client types closely mirror the types used in the `NotionConnector` component, with a few minor differences:
* Some additional data is inlined, such as replacing user IDs with user info objects
* document properties are returned in a key:value format, rather than an array of property values
* All types omit the underlying Notion IDs for privacy & security reasons, in favour of content slugs and their newly assigned IDs
* A few other fields, such as each block's ID, are omitted to optimize the output size
