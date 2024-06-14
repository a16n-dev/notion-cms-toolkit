import { APIErrorCode, Client } from '@notionhq/client';
import {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { camelCase, kebabCase } from 'change-case';

import {
  dateResponseToNotionDate,
  getPlainTextContent,
  mapColor,
  mapNotionBlockTypeToBlockType,
  mapNotionPropertyTypeToPropertyType,
} from './mappers.ts';
import {
  blockTypesWithChildren,
  compressObjectId,
  filterBlocksByType,
  findPropertyOfType,
  getSlugFromProperties,
  isAggregateBlock,
  removeNullUndefinedFromArray,
} from './utils.ts';

import {
  AnyNotionBlock,
  NotionBlock,
  NotionBlockType,
  NotionTopLevelBlock,
} from '../../sharedTypes/notionBlockTypes.ts';
import {
  NotionFile,
  NotionIcon,
  NotionIconType,
  NotionObjectType,
  NotionRichText,
  NotionRichTextItem,
  NotionRichTextItemType,
  NotionVerificationStatus,
} from '../../sharedTypes/notionHelperTypes.ts';
import {
  NotionDocumentProperty,
  NotionPropertySchemaDefinition,
} from '../../sharedTypes/propertyTypes.ts';
import {
  RawNotionDatabase,
  RawNotionDocument,
  RawNotionDocumentContent,
  RawNotionUser,
} from '../../sharedTypes/rawObjectTypes.ts';
import {
  NotionConnectorFileCacheHandler,
  NotionConnectorInterface,
} from './../notionConnectorInterface.ts';

class NotionAPIConnector implements NotionConnectorInterface {
  private readonly notionClient: Client;
  private fileCacheHandler: (url: string, name?: string) => Promise<NotionFile>;

  constructor(auth: string) {
    this.notionClient = new Client({
      auth,
    });
  }

  setFileCacheHandler(handler: NotionConnectorFileCacheHandler) {
    this.fileCacheHandler = async (url, name?: string) => {
      const newUrl = await handler(url);

      return { url: newUrl, name };
    };
  }

  async getConnectedDatabases(): Promise<RawNotionDatabase[]> {
    // Note: we don't do pagination here as we assume there will be less than 100 connected databases
    const databases = await this.notionClient.search({
      filter: {
        value: 'database',
        property: 'object',
      },
    });

    return Promise.all(
      (databases.results as DatabaseObjectResponse[]).map(async (db) => {
        const text = db.title.map((item) => item.plain_text).join('');

        const slug = kebabCase(text);

        return {
          notionId: db.id,
          url: db.url,
          slug,
          name: text,
          cover: db.cover ? await this.handleNotionFile(db.cover) : undefined,
          icon: await this.handleIcon(db.icon),
          propertySchema: this.getDatabsePropertySchema(db),
          createdTime: db.created_time,
          lastEditedTime: db.last_edited_time,
        };
      }),
    );
  }

  private getDatabsePropertySchema(
    db: DatabaseObjectResponse,
  ): NotionPropertySchemaDefinition[] {
    const properties: NotionPropertySchemaDefinition[] = [];

    for (const [name, value] of Object.entries(db.properties)) {
      let allowedValues: string[] | undefined = undefined;
      // if type is "status", "select", or "multi_select", we need to get the allowed values
      if (value.type === 'select') {
        allowedValues = value.select.options.map((o) => o.name);
      }

      if (value.type === 'multi_select') {
        allowedValues = value.multi_select.options.map((o) => o.name);
      }

      if (value.type === 'status') {
        allowedValues = value.status.options.map((o) => o.name);
      }

      properties.push({
        allowedValues,
        displayName: name,
        generatedName: camelCase(name),
        notionId: value.id,
        type: mapNotionPropertyTypeToPropertyType(value.type),
      });
    }

    return properties;
  }

  async getDatabase(notionDatabaseId: string): Promise<RawNotionDatabase> {
    const database = await this.notionClient.databases.retrieve({
      database_id: notionDatabaseId,
    });

    const db = database as DatabaseObjectResponse;

    const text = db.title.map((item) => item.plain_text).join('');

    const slug = kebabCase(text);

    return {
      notionId: db.id,
      url: db.url,
      slug,
      name: db.title.map((item) => item.plain_text).join(''),
      cover: db.cover ? await this.handleNotionFile(db.cover) : undefined,
      icon: await this.handleIcon(db.icon),
      propertySchema: [],
      createdTime: db.created_time,
      lastEditedTime: db.last_edited_time,
    };
  }

  async getDocument(notionDocumentId: string): Promise<RawNotionDocument> {
    const document = await this.notionClient.pages.retrieve({
      page_id: notionDocumentId,
    });

    return await this.processNotionPageObjectResponse(
      document as PageObjectResponse,
    );
  }

  async getDocumentContent(
    notionDocumentId: string,
  ): Promise<RawNotionDocumentContent> {
    const blocks = await this.getChildBlocks(notionDocumentId);

    return {
      blocks: blocks as NotionTopLevelBlock[],
      plainText: getPlainTextContent(blocks),
    };
  }

  async getDocumentsInDatabase(
    notionDatabaseId: string,
  ): Promise<RawNotionDocument[]> {
    return await this.getPaginatedNotionResults(async (cursor) => {
      const documents: RawNotionDocument[] = [];

      const response = await this.notionClient.databases.query({
        database_id: notionDatabaseId,
        start_cursor: cursor,
      });

      // direct sub-databases are not supported, so filter to only pages
      const results = response.results.filter(
        (res) => res.object === 'page',
      ) as PageObjectResponse[];

      for (const result of results) {
        const document = await this.processNotionPageObjectResponse(result);
        documents.push(document);
      }

      return {
        hasMore: response.has_more,
        cursor: response.next_cursor,
        results: documents,
      };
    });
  }

  async getUsers(): Promise<RawNotionUser[]> {
    return this.getPaginatedNotionResults(async (cursor) => {
      const users: RawNotionUser[] = [];

      const response = await this.notionClient.users.list({
        start_cursor: cursor,
      });

      for (const result of response.results) {
        const user = await this.processNotionUserObjectResponse(result);

        users.push(user);
      }

      return {
        hasMore: response.has_more,
        cursor: response.next_cursor,
        results: users,
      };
    });
  }

  private async processNotionUserObjectResponse(
    user: UserObjectResponse,
  ): Promise<RawNotionUser> {
    return {
      notionId: user.id,
      name: user.name ?? undefined,
      avatar: user.avatar_url
        ? await this.fileCacheHandler(user.avatar_url)
        : undefined,
      isBot: user.type === 'bot',
    };
  }

  private async processNotionBlocksResponse(
    results: BlockObjectResponse[],
  ): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = [];

    // loop through the blocks and process them
    for (let index = 0; index < results.length; index++) {
      const block = results[index];

      // check if the block needs to be handled as an aggregate block
      const type = block.type;
      if (
        ['bulleted_list_item', 'numbered_list_item', 'to_do'].includes(type)
      ) {
        // if the previous block was of the same type, skip this one as it's already been handled
        if (index > 0 && results[index - 1].type === type) {
          continue;
        }

        // lookahead to build a list of all blocks of the same type until we reach a block of a different type
        let endIndex = index + 1;
        while (true) {
          if (results[endIndex] && results[endIndex].type === block.type) {
            endIndex++;
          } else {
            break;
          }
        }

        const group = results.slice(index, endIndex);

        const converted =
          await this.processNotionAggregateBlockObjectResponse(group);
        blocks.push(converted);
      } else {
        // handle it normally
        const converted = await this.processNotionBlockObjectResponse(block);

        if (converted) {
          blocks.push(converted);
        }
      }
    }

    return blocks;
  }

  private async processNotionAggregateBlockObjectResponse(
    blocks: BlockObjectResponse[],
  ): Promise<NotionTopLevelBlock> {
    const type = blocks[0].type;

    const processedBlocks = removeNullUndefinedFromArray(
      await Promise.all(
        blocks.map(async (block) =>
          this.processNotionBlockObjectResponse(block),
        ),
      ),
    );

    if (type === 'bulleted_list_item') {
      return {
        id: `virtual-${blocks[0].id}`,
        content: undefined,
        type: NotionBlockType.BulletedList,
        children: filterBlocksByType(
          processedBlocks,
          NotionBlockType.BulletedListItem,
        ),
      };
    }
    if (type === 'numbered_list_item') {
      return {
        id: `virtual-${blocks[0].id}`,
        content: undefined,
        type: NotionBlockType.NumberedList,
        children: filterBlocksByType(
          processedBlocks,
          NotionBlockType.NumberedListItem,
        ),
      };
    }
    if (type === 'to_do') {
      return {
        id: `virtual-${blocks[0].id}`,
        content: undefined,
        type: NotionBlockType.ToDoList,
        children: filterBlocksByType(
          processedBlocks,
          NotionBlockType.ToDoListItem,
        ),
      };
    }

    throw new Error(`Unknown aggregate block type encountered ${type}`);
  }

  private async processNotionBlockObjectResponse(
    block: BlockObjectResponse,
  ): Promise<NotionBlock | undefined> {
    const type = mapNotionBlockTypeToBlockType(block.type);

    if (!type) return;

    let children: NotionBlock[] | undefined = undefined;
    // fetch children if the block type has children
    if (blockTypesWithChildren.includes(type as any) && block.has_children) {
      children = await this.getChildBlocks(block.id);
    }

    const content = await this.mapNotionBlockContent(block);

    return {
      id: block.id,
      type,
      content,
      children,
    } as AnyNotionBlock as any;
  }

  private async mapNotionBlockContent(
    block: BlockObjectResponse,
  ): Promise<NotionBlock['content'] | undefined> {
    switch (block.type) {
      case 'paragraph':
        return {
          richText: this.mapRichText(block.paragraph.rich_text),
          color: mapColor(block.paragraph.color),
        };
      case 'heading_1':
        return {
          richText: this.mapRichText(block.heading_1.rich_text),
          color: mapColor(block.heading_1.color),
          isToggleable: block.heading_1.is_toggleable,
        };
      case 'heading_2':
        return {
          richText: this.mapRichText(block.heading_2.rich_text),
          color: mapColor(block.heading_2.color),
          isToggleable: block.heading_2.is_toggleable,
        };
      case 'heading_3':
        return {
          richText: this.mapRichText(block.heading_3.rich_text),
          color: mapColor(block.heading_3.color),
          isToggleable: block.heading_3.is_toggleable,
        };
      case 'bulleted_list_item':
        return {
          richText: this.mapRichText(block.bulleted_list_item.rich_text),
          color: mapColor(block.bulleted_list_item.color),
        };
      case 'numbered_list_item':
        return {
          richText: this.mapRichText(block.numbered_list_item.rich_text),
          color: mapColor(block.numbered_list_item.color),
        };
      case 'quote':
        return {
          richText: this.mapRichText(block.quote.rich_text),
          color: mapColor(block.quote.color),
        };
      case 'to_do':
        return {
          richText: this.mapRichText(block.to_do.rich_text),
          color: mapColor(block.to_do.color),
          checked: block.to_do.checked,
        };
      case 'toggle':
        return {
          richText: this.mapRichText(block.toggle.rich_text),
          color: mapColor(block.toggle.color),
        };
      case 'template':
        return {
          richText: this.mapRichText(block.template.rich_text),
        };
      case 'synced_block':
        return {
          blockId: block.synced_block.synced_from?.block_id ?? undefined,
        };
      case 'child_page':
        return {
          title: block.child_page.title,
        };
      case 'child_database':
        return {
          title: block.child_database.title,
        };
      case 'equation':
        return {
          expression: block.equation.expression,
        };
      case 'code':
        return {
          language: block.code.language,
          caption: this.mapRichText(block.code.caption),
          richText: this.mapRichText(block.code.rich_text),
        };
      case 'callout':
        const icon = await this.handleIcon(block.callout.icon);
        return {
          icon,
          richText: this.mapRichText(block.callout.rich_text),
          color: mapColor(block.callout.color),
        };
      case 'divider':
        return undefined;
      case 'breadcrumb':
        return undefined;
      case 'table_of_contents':
        return {
          color: mapColor(block.table_of_contents.color),
        };
      case 'column_list':
        return undefined;
      case 'column':
        return undefined;
      case 'link_to_page':
        return block.link_to_page.type === 'page_id'
          ? {
              type: NotionObjectType.Page,
              id: block.link_to_page.page_id,
            }
          : block.link_to_page.type === 'comment_id'
            ? {
                type: NotionObjectType.Comment,
                id: block.link_to_page.comment_id,
              }
            : {
                type: NotionObjectType.Database,
                id: block.link_to_page.database_id,
              };
      case 'table':
        return {
          hasColumnHeader: block.table.has_column_header,
          hasRowHeader: block.table.has_row_header,
          tableWidth: block.table.table_width,
        };
      case 'table_row':
        return {
          cells: block.table_row.cells.map((cell) => this.mapRichText(cell)),
        };
      case 'embed':
        return {
          url: block.embed.url,
          caption: this.mapRichText(block.embed.caption),
        };
      case 'bookmark':
        return {
          url: block.bookmark.url,
          caption: this.mapRichText(block.bookmark.caption),
        };
      case 'image':
        return {
          file: await this.handleNotionFile(block.image),
          caption: this.mapRichText(block.image.caption),
        };
      case 'video':
        return {
          file: await this.handleNotionFile(block.video),
          caption: this.mapRichText(block.video.caption),
        };
      case 'pdf':
        return {
          file: await this.handleNotionFile(block.pdf),
          caption: this.mapRichText(block.pdf.caption),
        };
      case 'file':
        return {
          file: await this.handleNotionFile(block.file),
          caption: this.mapRichText(block.file.caption),
        };
      case 'audio':
        return {
          file: await this.handleNotionFile(block.audio),
          caption: this.mapRichText(block.audio.caption),
        };
      case 'link_preview':
        return {
          url: block.link_preview.url,
        };
      case 'unsupported':
        break;
    }
  }

  private async handleNotionFile(
    file:
      | {
          type: 'external';
          external: {
            url: string;
          };
        }
      | {
          type: 'file';
          file: {
            url: string;
            expiry_time: string;
          };
        },
  ): Promise<NotionFile> {
    if (file.type === 'external') {
      // don't cache the file as it's publicly accessible
      return this.fileCacheHandler(file.external.url);
    } else {
      return this.fileCacheHandler(file.file.url);
    }
  }

  private async handleNotionFiles(
    files: (
      | {
          type: 'external';
          name?: string;
          external: {
            url: string;
          };
        }
      | {
          type: 'file';
          name?: string;
          file: {
            url: string;
            expiry_time: string;
          };
        }
    )[],
  ): Promise<NotionFile[]> {
    const outputFiles: NotionFile[] = [];

    for (const file of files) {
      if (file.type === 'external') {
        // don't cache the file as it's publicly accessible
        outputFiles.push(
          await this.fileCacheHandler(file.external.url, file.name),
        );
      } else {
        outputFiles.push(await this.fileCacheHandler(file.file.url, file.name));
      }
    }

    return outputFiles;
  }

  private mapRichText(richText: RichTextItemResponse[]): NotionRichText {
    return richText.map((item) => {
      let type: NotionRichTextItemType;
      let text: string;

      if (item.type === 'text') {
        type = NotionRichTextItemType.Text;
        text = item.text.content;
      } else if (item.type === 'mention') {
        type = NotionRichTextItemType.Mention;
        text = item.mention.type;
      } else {
        type = NotionRichTextItemType.Equation;
        text = item.equation.expression;
      }

      const newItem: NotionRichTextItem = {
        type,
        text,
        annotations: {
          bold: item.annotations.bold,
          italic: item.annotations.italic,
          strikethrough: item.annotations.strikethrough,
          underline: item.annotations.underline,
          code: item.annotations.code,
          color: mapColor(item.annotations.color),
        },
        href: item.href ?? undefined,
      };
      return newItem;
    });
  }

  /**
   * Utility method to handle paginated results from the Notion API
   */
  private async getPaginatedNotionResults<T>(
    queryFn: (cursor: string | undefined) => Promise<{
      hasMore: boolean;
      cursor: string | null;
      results: T[];
    }>,
  ): Promise<T[]> {
    const data: T[] = [];

    let cursor: string | null = null;

    while (true) {
      const response = await queryFn(cursor ?? undefined);

      data.push(...response.results);

      if (!response.hasMore) {
        break;
      }

      cursor = response.cursor;
    }

    return data;
  }

  private async handleIcon(
    icon:
      | {
          emoji: string;
          type: 'emoji';
        }
      | {
          external: {
            url: string;
          };
          type: 'external';
        }
      | { type: 'file'; file: { url: string; expiry_time: string } }
      | null,
  ): Promise<NotionIcon | undefined> {
    if (!icon) {
      return undefined;
    }

    if (icon.type === 'emoji') {
      return {
        type: NotionIconType.Emoji,
        emoji: icon.emoji,
      };
    }

    const file = await this.handleNotionFile(icon);

    return {
      type: NotionIconType.Image,
      file,
    };
  }

  private async processNotionPageObjectResponse(
    page: PageObjectResponse,
  ): Promise<RawNotionDocument> {
    const specialProperties = await this.handleSpecialProperties(
      page.properties,
    );

    const properties = await this.processDocumentProperties(page.properties);

    return {
      notionId: page.id,
      notionDatabaseId: (page.parent as any).database_id,
      name: specialProperties.title,
      slug:
        specialProperties.slug ??
        compressObjectId(page.id) + '-' + kebabCase(specialProperties.title),
      url: page.url,
      cover: page.cover ? await this.handleNotionFile(page.cover) : undefined,
      icon: await this.handleIcon(page.icon),
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      properties: properties,
    };
  }

  private async handleSpecialProperties(
    properties: PageObjectResponse['properties'],
  ) {
    // find one with the "title" property
    const titleProperty = findPropertyOfType(
      Object.values(properties),
      'title',
    );

    return {
      title: titleProperty
        ? titleProperty.title.map((t) => t.plain_text).join('')
        : '',
      slug: getSlugFromProperties(properties),
    };
  }

  private async processDocumentProperties(
    properties: PageObjectResponse['properties'],
  ): Promise<NotionDocumentProperty[]> {
    const propertiesArray: NotionDocumentProperty[] = [];

    for (const [propertyName, propertyValue] of Object.entries(properties)) {
      const value = await this.processDocumentPropertyValue(propertyValue);

      // if the property starts with a "$", it's a special property and shouldn't be included in the properties array
      if (propertyName.startsWith('$')) {
        continue;
      }

      propertiesArray.push({
        notionId: propertyValue.id,
        name: propertyName,
        type: mapNotionPropertyTypeToPropertyType(propertyValue.type),
        value,
      } as NotionDocumentProperty);
    }

    return propertiesArray;
  }

  private async processDocumentPropertyValue(
    value: PageObjectResponse['properties'][string],
  ): Promise<any> {
    switch (value.type) {
      case 'number':
        return value.number;
      case 'url':
        return value.url;
      case 'select':
        return value.select?.name;
      case 'multi_select':
        return value.multi_select?.map((item) => item.name);
      case 'status':
        return value.status?.name;
      case 'date':
        return value.date ? dateResponseToNotionDate(value.date) : null;
      case 'email':
        return value.email;
      case 'phone_number':
        return value.phone_number;
      case 'checkbox':
        return value.checkbox;
      case 'files':
        return await this.handleNotionFiles(value.files as any);
      case 'created_by':
        return value.created_by.id;
      case 'created_time':
        return value.created_time;
      case 'last_edited_by':
        return value.last_edited_by.id;
      case 'last_edited_time':
        return value.last_edited_time;
      case 'formula':
        switch (value.formula.type) {
          case 'string':
            return value.formula.string;
          case 'number':
            return value.formula.number;
          case 'boolean':
            return value.formula.boolean;
          case 'date':
            return value.formula.date
              ? dateResponseToNotionDate(value.formula.date)
              : null;
        }
        break;
      case 'button':
        return undefined;
      case 'unique_id':
        return {
          prefix: value.unique_id.prefix,
          number: value.unique_id.number,
        };
      case 'verification':
        return value.verification?.state === 'expired'
          ? NotionVerificationStatus.Expired
          : value.verification?.state === 'verified'
            ? NotionVerificationStatus.Verified
            : NotionVerificationStatus.Unverified;
      case 'title':
        return this.mapRichText(value.title);
      case 'rich_text':
        return this.mapRichText(value.rich_text);
      case 'people':
        return value.people.map((p) => ({
          notionId: p.id,
        }));
      case 'relation':
        return value.relation.map((r) => r.id);
      case 'rollup':
        return undefined;
    }
  }

  private async getChildBlocks(blockOrPageId: string): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = [];

    // Process blocks in batches of 100, the maximum allowed by the Notion API
    let cursor: string | null = null;
    while (true) {
      let lastProcessedBlockType: NotionBlockType | null = null;

      try {
        const response = await this.notionClient.blocks.children.list({
          block_id: blockOrPageId,
          start_cursor: cursor ?? undefined,
        });

        const processedBlocks = await this.processNotionBlocksResponse(
          response.results as BlockObjectResponse[],
        );

        // This deals with the case where list blocks aren't grouped together because they fall across pagination boundaries
        const currentLastProcessedBlockType =
          processedBlocks[processedBlocks.length - 1]?.type;

        if (lastProcessedBlockType === currentLastProcessedBlockType) {
          const lastBlock = blocks[blocks.length - 1];
          const newBlock = processedBlocks[0];

          if (isAggregateBlock(lastBlock) && isAggregateBlock(newBlock)) {
            lastBlock.children.push(newBlock.children as any);
            // remove the first block from the new blocks
            processedBlocks.shift();
          }
        }

        // push the new blocks to the list of blocks
        blocks.push(...(processedBlocks as NotionBlock[]));

        if (!response.has_more) {
          break;
        }
        cursor = response.next_cursor;
        lastProcessedBlockType = currentLastProcessedBlockType;
      } catch (e) {
        // if 400 error - nothing found
        if (e.code === APIErrorCode.ObjectNotFound) {
          throw new Error('Not found');
        }
        if (e.code === APIErrorCode.RateLimited) {
          // TODO: Handle rate limiting
        }
        console.error(e);
      }
    }

    return blocks;
  }
}

export const buildNotionAPIConnector = (auth: string) =>
  new NotionAPIConnector(auth);
