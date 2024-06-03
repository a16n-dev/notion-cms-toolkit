import { NotionBlockType, NotionTopLevelBlock } from '../client/clientTypes.ts';

export type renderBlock<T extends NotionBlockType, O> = (
  block: Extract<NotionTopLevelBlock, { type: T }>,
) => O;
