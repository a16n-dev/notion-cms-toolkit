The `blockRenderer` is a general-purpose framework for translating the Notion block datastructure into any desired output type. For example:
 - [ ] Plain Text
 - [ ] Markdown
 - [ ] HTML
 - [ ] React HTML
 - [ ] React + Tailwind 

Note that the rendering framework uses extensions to build on top of each other. For example, all React-based renderers should extend the base `React HTML` renderer. This ensures that custom renderers only have to implement logic for the blocks they want to render, while having sensible fall-backs for all other block types
