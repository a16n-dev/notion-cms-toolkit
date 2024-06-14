/**
 * This file defines the data format for each block type
 */

import {
  NotionCodeLanguage,
  NotionColor,
  NotionFile,
  NotionIcon,
  NotionObjectType,
  NotionRichText,
} from './notionHelperTypes';

export interface NotionBlockBase {
  id: string;
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
export interface AnyNotionBlock extends NotionBlockBase {
  type: NotionBlockType;
  content: object | undefined;
  children: Array<NotionBlock> | undefined;
}

export interface NotionParagraphBlock extends NotionBlockBase {
  type: NotionBlockType.Paragraph;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading1Block extends NotionBlockBase {
  type: NotionBlockType.Heading1;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading2Block extends NotionBlockBase {
  type: NotionBlockType.Heading2;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionHeading3Block extends NotionBlockBase {
  type: NotionBlockType.Heading3;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    isToggleable: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionBulletedListBlock extends NotionBlockBase {
  type: NotionBlockType.BulletedList;
  children: Array<NotionBulletedListItemBlock>;
  content: undefined;
}

export interface NotionBulletedListItemBlock extends NotionBlockBase {
  type: NotionBlockType.BulletedListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionNumberedListBlock extends NotionBlockBase {
  type: NotionBlockType.NumberedList;
  children: Array<NotionNumberedListItemBlock>;
  content: undefined;
}

export interface NotionNumberedListItemBlock extends NotionBlockBase {
  type: NotionBlockType.NumberedListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionToDoListBlock extends NotionBlockBase {
  type: NotionBlockType.ToDoList;
  children: Array<NotionToDoListItemBlock>;
  content: undefined;
}

export interface NotionToDoListItemBlock extends NotionBlockBase {
  type: NotionBlockType.ToDoListItem;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    checked: boolean;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionQuoteBlock extends NotionBlockBase {
  type: NotionBlockType.Quote;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionToggleBlock extends NotionBlockBase {
  type: NotionBlockType.Toggle;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionTemplateBlock extends NotionBlockBase {
  type: NotionBlockType.Template;
  content: {
    richText: NotionRichText;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionSyncedBlockBlock extends NotionBlockBase {
  type: NotionBlockType.SyncedBlock;
  content: {
    blockId?: string;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionChildPageBlock extends NotionBlockBase {
  type: NotionBlockType.ChildPage;
  content: {
    title: string;
  };
  children: undefined;
}

export interface NotionChildDatabaseBlock extends NotionBlockBase {
  type: NotionBlockType.ChildDatabase;
  content: {
    title: string;
  };
  children: undefined;
}

export interface NotionEquationBlock extends NotionBlockBase {
  type: NotionBlockType.Equation;
  content: {
    expression: string;
  };
  children: undefined;
}

export interface NotionCodeBlock extends NotionBlockBase {
  type: NotionBlockType.Code;
  content: {
    richText: NotionRichText;
    caption: NotionRichText;
    language: NotionCodeLanguage;
  };
  children: undefined;
}

export interface NotionCalloutBlock extends NotionBlockBase {
  type: NotionBlockType.Callout;
  content: {
    richText: NotionRichText;
    color?: NotionColor;
    icon?: NotionIcon;
  };
  children: Array<NotionTopLevelBlock>;
}

export interface NotionDividerBlock extends NotionBlockBase {
  type: NotionBlockType.Divider;
  content: undefined;
  children: undefined;
}

export interface NotionBreadcrumbBlock extends NotionBlockBase {
  type: NotionBlockType.Breadcrumb;
  content: undefined;
  children: undefined;
}

export interface NotionTableOfContentsBlock extends NotionBlockBase {
  type: NotionBlockType.TableOfContents;
  content: {
    color?: NotionColor;
  };
  children: undefined;
}

export interface NotionColumnListBlock extends NotionBlockBase {
  type: NotionBlockType.ColumnList;
  children: Array<NotionColumnBlock>;
  content: undefined;
}

export interface NotionColumnBlock extends NotionBlockBase {
  type: NotionBlockType.Column;
  children: Array<NotionTopLevelBlock>;
  content: undefined;
}

export interface NotionLinkToPageBlock extends NotionBlockBase {
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

export interface NotionTableBlock extends NotionBlockBase {
  type: NotionBlockType.Table;
  content: {
    hasColumnHeader: boolean;
    hasRowHeader: boolean;
    tableWidth: number;
  };
  children: Array<NotionTableRowBlock>;
}

export interface NotionTableRowBlock extends NotionBlockBase {
  type: NotionBlockType.TableRow;
  content: {
    cells: Array<NotionRichText>;
  };
  children: undefined;
}

export interface NotionEmbedBlock extends NotionBlockBase {
  type: NotionBlockType.Embed;
  content: {
    url: string;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionBookmarkBlock extends NotionBlockBase {
  type: NotionBlockType.Bookmark;
  content: {
    url: string;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionImageBlock extends NotionBlockBase {
  type: NotionBlockType.Image;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionVideoBlock extends NotionBlockBase {
  type: NotionBlockType.Video;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionPdfBlock extends NotionBlockBase {
  type: NotionBlockType.Pdf;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionFileBlock extends NotionBlockBase {
  type: NotionBlockType.File;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionAudioBlock extends NotionBlockBase {
  type: NotionBlockType.Audio;
  content: {
    file: NotionFile;
    caption: NotionRichText;
  };
  children: undefined;
}

export interface NotionLinkPreviewBlock extends NotionBlockBase {
  type: NotionBlockType.LinkPreview;
  content: {
    url: string;
  };
  children: undefined;
}
