import {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import {
  NotionBlock,
  NotionBlockType,
} from '../../sharedTypes/notionBlockTypes.ts';
import {
  NotionColor,
  NotionDate,
  NotionRichText,
} from '../../sharedTypes/notionHelperTypes.ts';
import { NotionPropertyType } from '../../sharedTypes/propertyTypes.ts';

export const mapColor = (color: string): NotionColor | undefined => {
  if (color === 'default') {
    return undefined;
  }

  return color as NotionColor;
};

export const mapNotionBlockTypeToBlockType = (
  type: BlockObjectResponse['type'],
): NotionBlockType | undefined => {
  switch (type) {
    case 'paragraph':
      return NotionBlockType.Paragraph;
    case 'heading_1':
      return NotionBlockType.Heading1;
    case 'heading_2':
      return NotionBlockType.Heading2;
    case 'heading_3':
      return NotionBlockType.Heading3;
    case 'bulleted_list_item':
      return NotionBlockType.BulletedListItem;
    case 'numbered_list_item':
      return NotionBlockType.NumberedListItem;
    case 'quote':
      return NotionBlockType.Quote;
    case 'to_do':
      return NotionBlockType.ToDoListItem;
    case 'toggle':
      return NotionBlockType.Toggle;
    case 'template':
      return NotionBlockType.Template;
    case 'synced_block':
      return NotionBlockType.SyncedBlock;
    case 'child_page':
      return NotionBlockType.ChildPage;
    case 'child_database':
      return NotionBlockType.ChildDatabase;
    case 'equation':
      return NotionBlockType.Equation;
    case 'code':
      return NotionBlockType.Code;
    case 'callout':
      return NotionBlockType.Callout;
    case 'divider':
      return NotionBlockType.Divider;
    case 'breadcrumb':
      return NotionBlockType.Breadcrumb;
    case 'table_of_contents':
      return NotionBlockType.TableOfContents;
    case 'column_list':
      return NotionBlockType.ColumnList;
    case 'column':
      return NotionBlockType.Column;
    case 'link_to_page':
      return NotionBlockType.LinkToPage;
    case 'table':
      return NotionBlockType.Table;
    case 'table_row':
      return NotionBlockType.TableRow;
    case 'embed':
      return NotionBlockType.Embed;
    case 'bookmark':
      return NotionBlockType.Bookmark;
    case 'image':
      return NotionBlockType.Image;
    case 'video':
      return NotionBlockType.Video;
    case 'pdf':
      return NotionBlockType.Pdf;
    case 'file':
      return NotionBlockType.File;
    case 'audio':
      return NotionBlockType.Audio;
    case 'link_preview':
      return NotionBlockType.LinkPreview;
    case 'unsupported':
      console.warn('Unsupported block type', type);
  }
};

export const mapNotionPropertyTypeToPropertyType = (
  type: PageObjectResponse['properties'][string]['type'],
): NotionPropertyType => {
  switch (type) {
    case 'number':
      return NotionPropertyType.Number;
    case 'url':
      return NotionPropertyType.Url;
    case 'select':
      return NotionPropertyType.Select;
    case 'multi_select':
      return NotionPropertyType.MultiSelect;
    case 'status':
      return NotionPropertyType.Status;
    case 'date':
      return NotionPropertyType.Date;
    case 'email':
      return NotionPropertyType.Email;
    case 'phone_number':
      return NotionPropertyType.PhoneNumber;
    case 'checkbox':
      return NotionPropertyType.Checkbox;
    case 'files':
      return NotionPropertyType.Files;
    case 'created_by':
      return NotionPropertyType.CreatedBy;
    case 'created_time':
      return NotionPropertyType.CreatedTime;
    case 'last_edited_by':
      return NotionPropertyType.LastEditedBy;
    case 'last_edited_time':
      return NotionPropertyType.LastEditedTime;
    case 'formula':
      return NotionPropertyType.StringFormula;
    case 'button':
      return NotionPropertyType.Button;
    case 'unique_id':
      return NotionPropertyType.UniqueId;
    case 'verification':
      return NotionPropertyType.Verification;
    case 'title':
      return NotionPropertyType.Title;
    case 'rich_text':
      return NotionPropertyType.RichText;
    case 'people':
      return NotionPropertyType.People;
    case 'relation':
      return NotionPropertyType.Relation;
    case 'rollup':
      return NotionPropertyType.Rollup;
  }
};

export const dateResponseToNotionDate = (date: {
  start: string;
  end: string | null;
  time_zone: string | null;
}): NotionDate => ({
  start: date.start,
  end: date.end ?? undefined,
  timeZone: date.time_zone ?? undefined,
});

const notionRichTextToPlainText = (richText: NotionRichText) =>
  richText.map((t) => t.text).join('');

export const getPlainTextContent = (blocks: NotionBlock[]) => {
  const withChildren = (text: string, blocks?: NotionBlock[]) => {
    if (!blocks || blocks.length === 0) {
      return text;
    }

    return `${text}\n${getPlainTextContent(blocks)}`;
  };

  const res = blocks.map((block): string | undefined => {
    switch (block.type) {
      case NotionBlockType.Divider:
        break;
      case NotionBlockType.Paragraph:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading1:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading2:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading3:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.BulletedList:
        return getPlainTextContent(block.children);
      case NotionBlockType.NumberedList:
        return getPlainTextContent(block.children);
      case NotionBlockType.ToDoList:
        return getPlainTextContent(block.children);
      case NotionBlockType.Quote:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Toggle:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Template:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.SyncedBlock:
        return getPlainTextContent(block.children);
      case NotionBlockType.ChildPage:
        break;
      case NotionBlockType.ChildDatabase:
        break;
      case NotionBlockType.Equation:
        return block.content.expression;
      case NotionBlockType.Code:
        return notionRichTextToPlainText(block.content.richText);
      case NotionBlockType.Callout:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Breadcrumb:
        break;
      case NotionBlockType.TableOfContents:
        break;
      case NotionBlockType.ColumnList:
        return getPlainTextContent(block.children);
      case NotionBlockType.LinkToPage:
        break;
      case NotionBlockType.Table:
        return getPlainTextContent(block.children);
      case NotionBlockType.Embed:
        return (
          block.content.url +
          '\n' +
          notionRichTextToPlainText(block.content.caption)
        );
      case NotionBlockType.Bookmark:
        return (
          block.content.url +
          '\n' +
          notionRichTextToPlainText(block.content.caption)
        );
      case NotionBlockType.Image:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Video:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Pdf:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.File:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Audio:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.LinkPreview:
        return block.content.url;
      case NotionBlockType.BulletedListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.ToDoListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.NumberedListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.TableRow:
        return block.content.cells
          .map((cell) => notionRichTextToPlainText(cell))
          .join(' ');
      case NotionBlockType.Column:
        return getPlainTextContent(block.children);
    }
  });

  return res.filter((r) => r).join('\n');
};
