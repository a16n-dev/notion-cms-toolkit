import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import {
  NotionBlock,
  NotionBlockType,
  NotionBulletedListBlock,
  NotionNumberedListBlock,
  NotionToDoListBlock,
} from '../../sharedTypes/notionBlockTypes.ts';

export const getSlugFromProperties = (
  properties: PageObjectResponse['properties'],
) => {
  const slugProperty = properties['$slug'];

  if (slugProperty && slugProperty.type === 'url') {
    return slugProperty.url ?? undefined;
  } else {
    return undefined;
  }
};

export const filterBlocksByType = <T extends NotionBlockType>(
  blocks: NotionBlock[],
  type: T,
) =>
  blocks.filter((block) => block.type === type) as Extract<
    NotionBlock,
    { type: T }
  >[];

const aggregateBlockTypes = [
  NotionBlockType.ToDoList,
  NotionBlockType.NumberedList,
  NotionBlockType.BulletedList,
] as const;

export const isAggregateBlock = (
  block: NotionBlock,
): block is
  | NotionToDoListBlock
  | NotionBulletedListBlock
  | NotionNumberedListBlock => aggregateBlockTypes.includes(block.type as any);

export const blockTypesWithChildren = [
  NotionBlockType.Heading1,
  NotionBlockType.Heading2,
  NotionBlockType.Heading3,
  NotionBlockType.Paragraph,
  NotionBlockType.Table,
  NotionBlockType.Column,
  NotionBlockType.BulletedListItem,
  NotionBlockType.NumberedListItem,
  NotionBlockType.ToDoListItem,
  NotionBlockType.Quote,
  NotionBlockType.Toggle,
  NotionBlockType.Template,
  NotionBlockType.SyncedBlock,
  NotionBlockType.Callout,
] as const;

export const findPropertyOfType = <
  T extends PageObjectResponse['properties'][string]['type'],
>(
  properties: PageObjectResponse['properties'][string][],
  type: T,
):
  | Extract<
      PageObjectResponse['properties'][string],
      {
        type: T;
      }
    >
  | undefined => {
  return properties.find((value) => value.type === type) as any;
};

export const removeNullUndefinedFromArray = <T>(
  arr: (T | null | undefined)[],
): T[] => arr.filter((a) => a !== undefined && a !== null) as T[];

export const compressObjectId = (uuid: string) => {
  const hex = uuid.replace(/-/g, '');

  const timestampHex = hex.substring(4, 8);
  const randomHex = hex.substring(15, 18);
  const counterHex = hex.substring(21, 24);

  const newHex = timestampHex + randomHex + counterHex;

  // for the timestamp, take just the 2 last hex digits

  // for the random, just take

  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let binaryString = '';

  // Convert hex to binary string
  for (let i = 0; i < newHex.length; i++) {
    const binary = parseInt(newHex[i], 16).toString(2).padStart(4, '0');
    binaryString += binary;
  }

  let base32String = '';

  // Convert binary string to base32 string
  for (let i = 0; i < binaryString.length; i += 5) {
    const chunk = binaryString.substring(i, i + 5).padEnd(5, '0');
    const index = parseInt(chunk, 2);
    base32String += base32Chars[index];
  }

  return base32String.toLowerCase();
};
