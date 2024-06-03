export type NotionBaseColor =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export type NotionColor = NotionBaseColor | `${NotionBaseColor}_background`;

export type NotionCodeLanguage =
  | 'abap'
  | 'agda'
  | 'arduino'
  | 'assembly'
  | 'bash'
  | 'basic'
  | 'bnf'
  | 'c'
  | 'c#'
  | 'c++'
  | 'clojure'
  | 'coffeescript'
  | 'coq'
  | 'css'
  | 'dart'
  | 'dhall'
  | 'diff'
  | 'docker'
  | 'ebnf'
  | 'elixir'
  | 'elm'
  | 'erlang'
  | 'f#'
  | 'flow'
  | 'fortran'
  | 'gherkin'
  | 'glsl'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'haskell'
  | 'html'
  | 'idris'
  | 'java'
  | 'javascript'
  | 'json'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'livescript'
  | 'llvm ir'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'markup'
  | 'matlab'
  | 'mathematica'
  | 'mermaid'
  | 'nix'
  | 'notion formula'
  | 'objective-c'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plain text'
  | 'powershell'
  | 'prolog'
  | 'protobuf'
  | 'purescript'
  | 'python'
  | 'r'
  | 'racket'
  | 'reason'
  | 'ruby'
  | 'rust'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shell'
  | 'solidity'
  | 'sql'
  | 'swift'
  | 'toml'
  | 'typescript'
  | 'vb.net'
  | 'verilog'
  | 'vhdl'
  | 'visual basic'
  | 'webassembly'
  | 'xml'
  | 'yaml'
  | 'java/c/c++/c#';

export enum NotionIconType {
  Emoji = 'emoji',
  Image = 'image',
}

export type NotionIcon =
  | {
      type: NotionIconType.Emoji;
      emoji: string;
    }
  | {
      type: NotionIconType.Image;
      file: NotionFile;
    };

export type NotionFile = {
  url: string;
  name?: string;
};

export enum NotionObjectType {
  Block = 'block',
  Page = 'page',
  Database = 'database',
  Workspace = 'workspace',
  Comment = 'comment',
}

export enum NotionRichTextItemType {
  Text = 'text',
  Mention = 'mention',
  Equation = 'equation',
}

export type NotionRichTextAnnotation = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color?: NotionColor;
};

export type NotionRichText = Array<NotionRichTextItem>;

export interface NotionRichTextItem {
  type: NotionRichTextItemType;
  annotations: NotionRichTextAnnotation;
  text: string;
  href?: string;
}

export type NotionDate = {
  start: string;
  end?: string;
  timeZone?: string;
};

export enum NotionVerificationStatus {
  Unverified = 'unverified',
  Verified = 'verified',
  Expired = 'expired',
}

/**
 * These are the possible standalone blocks a page can have
 */
export type NotionTopLevelBlock =
  | NotionParagraphBlock
  | NotionHeading1Block
  | NotionHeading2Block
  | NotionHeading3Block
  | NotionBulletedListBlock
  | NotionNumberedListBlock
  | NotionToDoListBlock
  | NotionQuoteBlock
  | NotionToggleBlock
  | NotionTemplateBlock
  | NotionSyncedBlockBlock
  | NotionChildPageBlock
  | NotionChildDatabaseBlock
  | NotionEquationBlock
  | NotionCodeBlock
  | NotionCalloutBlock
  | NotionDividerBlock
  | NotionBreadcrumbBlock
  | NotionTableOfContentsBlock
  | NotionColumnListBlock
  | NotionLinkToPageBlock
  | NotionTableBlock
  | NotionEmbedBlock
  | NotionBookmarkBlock
  | NotionImageBlock
  | NotionVideoBlock
  | NotionPdfBlock
  | NotionFileBlock
  | NotionAudioBlock
  | NotionLinkPreviewBlock;

/**
 * These are all possible blocks. Note that the ones listed here can only exist as children of other blocks
 */
export type NotionBlock =
  | NotionTopLevelBlock
  | NotionBulletedListItemBlock
  | NotionToDoListItemBlock
  | NotionNumberedListItemBlock
  | NotionTableRowBlock
  | NotionColumnBlock;

export enum NotionBlockType {
  Paragraph = 'paragraph',
  Heading1 = 'heading1',
  Heading2 = 'heading2',
  Heading3 = 'heading3',
  BulletedListItem = 'bulletedListItem',
  NumberedListItem = 'numberedListItem',
  ToDoListItem = 'toDoListItem',
  Quote = 'quote',
  Toggle = 'toggle',
  Template = 'template',
  SyncedBlock = 'syncedBlock',
  ChildPage = 'childPage',
  ChildDatabase = 'childDatabase',
  Equation = 'equation',
  Code = 'code',
  Callout = 'callout',
  Divider = 'divider',
  Breadcrumb = 'breadcrumb',
  TableOfContents = 'tableOfContents',
  ColumnList = 'columnList',
  Column = 'column',
  LinkToPage = 'linkToPage',
  Table = 'table',
  TableRow = 'tableRow',
  Embed = 'embed',
  Bookmark = 'bookmark',
  Image = 'image',
  Video = 'video',
  Pdf = 'pdf',
  File = 'file',
  Audio = 'audio',
  LinkPreview = 'linkPreview',
  // Virtual blocks
  BulletedList = 'bulletedList',
  NumberedList = 'numberedList',
  ToDoList = 'toDoList',
}

/**
 * Definitions for all block types. Note that in most cases these closely match the types from the official Notion API.
 * Note that each block has 3 standard properties:
 * - `type`: The type of block
 * - `content`: The content of the block. This can be a rich text object, a file object, etc. This is only defined for blocks that have content
 * - `children`: An array of child blocks. This is only defined for blocks that can have children
 *
 * *see `AnyNotionBlock` for a general block definition*
 */
export interface AnyNotionBlock {
  type: NotionBlockType;
  content: object | undefined;
  children: Array<NotionBlock> | undefined;
}

export interface NotionParagraphBlock {
  type: NotionBlockType.Paragraph;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading1Block {
  type: NotionBlockType.Heading1;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading2Block {
  type: NotionBlockType.Heading2;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading3Block {
  type: NotionBlockType.Heading3;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionBulletedListBlock {
  type: NotionBlockType.BulletedList;
  children: Array<NotionBulletedListItemBlock>;
  content: undefined;
}

export interface NotionBulletedListItemBlock {
  type: NotionBlockType.BulletedListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionNumberedListBlock {
  type: NotionBlockType.NumberedList;
  children: Array<NotionNumberedListItemBlock>;
  content: undefined;
}

export interface NotionNumberedListItemBlock {
  type: NotionBlockType.NumberedListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionToDoListBlock {
  type: NotionBlockType.ToDoList;
  children: Array<NotionToDoListItemBlock>;
  content: undefined;
}

export interface NotionToDoListItemBlock {
  type: NotionBlockType.ToDoListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    checked: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionQuoteBlock {
  type: NotionBlockType.Quote;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionToggleBlock {
  type: NotionBlockType.Toggle;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionTemplateBlock {
  type: NotionBlockType.Template;
  content: {
    richText: NotionRichText;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionSyncedBlockBlock {
  type: NotionBlockType.SyncedBlock;
  content: {
    blockId?: string;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionChildPageBlock {
  type: NotionBlockType.ChildPage;
  content: {
    title: string;
  };
  children: undefined;
}

export interface NotionChildDatabaseBlock {
  type: NotionBlockType.ChildDatabase;
  content: {
    title: string;
  };
  children: undefined;
}

export interface NotionEquationBlock {
  type: NotionBlockType.Equation;
  content: {
    expression: string;
  };
  children: undefined;
}

export interface NotionCodeBlock {
  type: NotionBlockType.Code;
  content: {
    richText: NotionRichText;
    caption: NotionRichText;
    language: NotionCodeLanguage;
  };
  children: undefined;
}

export interface NotionCalloutBlock {
  type: NotionBlockType.Callout;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    icon?: NotionIcon;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionDividerBlock {
  type: NotionBlockType.Divider;
  content: undefined;
}

export interface NotionBreadcrumbBlock {
  type: NotionBlockType.Breadcrumb;
  content: undefined;
  children: undefined;
}

export interface NotionTableOfContentsBlock {
  type: NotionBlockType.TableOfContents;
  content: {
    color?: NotionColor;
  };
  children: undefined;
}

export interface NotionColumnListBlock {
  type: NotionBlockType.ColumnList;
  children: Array<NotionColumnBlock>;
  content: undefined;
}

export interface NotionColumnBlock {
  type: NotionBlockType.Column;
  children: Array<NotionTopLevelBlock>;
  content: undefined;
}

export interface NotionLinkToPageBlock {
  type: NotionBlockType.LinkToPage;
  content: {
    type:
      | NotionObjectType.Page
      | NotionObjectType.Database
      | NotionObjectType.Comment;
    id: string;
  };
  children: undefined;
}

export interface NotionTableBlock {
  type: NotionBlockType.Table;
  content: {
    hasColumnHeader: boolean;
    hasRowHeader: boolean;
    tableWidth: number;
  };
  children: Array<NotionTableRowBlock>;
}

export interface NotionTableRowBlock {
  type: NotionBlockType.TableRow;
  content: {
    cells: Array<NotionRichText>;
  };
  children: undefined;
}

export interface NotionEmbedBlock {
  type: NotionBlockType.Embed;
  content: {
    url: string;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionBookmarkBlock {
  type: NotionBlockType.Bookmark;
  content: {
    url: string;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionImageBlock {
  type: NotionBlockType.Image;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionVideoBlock {
  type: NotionBlockType.Video;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionPdfBlock {
  type: NotionBlockType.Pdf;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionFileBlock {
  type: NotionBlockType.File;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionAudioBlock {
  type: NotionBlockType.Audio;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionLinkPreviewBlock {
  type: NotionBlockType.LinkPreview;
  content: {
    url: string;
  };
  children: undefined;
}
