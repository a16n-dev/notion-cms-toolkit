# Notion CMS Toolkit
Notion CMS Toolkit is a combination of tools that greatly simplify the process of using Notion as a headless CMS.

The toolkit has been designed to address all of the issues I've found from building headless CMS tools around the bare Notion API.

## Key Features
Some of the main benefits from the tools in the toolkit:
* Provides a wrapper around the Notion API that handles pagination, rate limiting, and recursive fetching of child blocks. 
* The wrapper returns the data in a simplified format that strips out many of the unnecessary fields the  API returns, reducing payload sizes by up to 60%
* Provides logic for managing caching of documents in an intermediate database, so you never have to worry about rate limits
* Provides logic for caching images and other files from Notion, to get around Notion's expiring content URLs
* Client-generation code for type-safe access to page properties in a database
* A general-purpose rendering framework for rendering Notion content using any Component library or styling framework.

## Why not use the Notion API directly?
See above features. From experience, I've found that all of these features are required for building a robust scalable CMS backed by the Notion API.

## Using the Toolkit
There isn't yet an easy way to drop this into an existing project, however the patterns used to solve the challenges will hopefully be useful if you're trying to build this yourself 

## System Design
<img width="398" alt="image" src="https://github.com/a16n-dev/notion-cms-toolkit/assets/39721828/bb56f584-b3e0-4d24-b586-634e6e5a49b3">
