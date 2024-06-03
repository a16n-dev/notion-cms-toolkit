import {
  NotionBlock,
  NotionBlockType,
  NotionRichText,
} from '../client/clientTypes.ts';

export type transformBlockFn<T extends NotionBlockType, O> = (
  block: Extract<NotionBlock, { type: T }>,
  ctx: {
    transformChildren: (blocks: NotionBlock[]) => O;
    transformRichText: (richText: NotionRichText) => O;
  },
) => O;

// A map of block types to their respective renderers
export type TransformBlockFnMap<O> = {
  [K in NotionBlockType]?: transformBlockFn<K, O>;
};

export type BlockTransformer<O> = {
  transform(blocks: NotionBlock[]): O;
  fns: TransformBlockFnMap<O>;
  consolidateFn: (result: O[]) => O;
};

export interface createBlockTransformerOptions<O> {
  transformFns: TransformBlockFnMap<O>;
  consolidateFn: (result: O[]) => O;
  transformRichText: (richText: NotionRichText) => O;
  extend?: BlockTransformer<O>;
}

export const createBlockTransformer = <O>(
  opts: createBlockTransformerOptions<O>,
): BlockTransformer<O> => {
  const transformFns = { ...opts.extend?.fns, ...opts.transformFns };

  const transform = (blocks: NotionBlock[]) => {
    const output: O[] = [];

    blocks.forEach((block) => {
      const renderer = transformFns[block.type];
      if (renderer) {
        output.push(
          renderer(block as any, {
            transformChildren: (blocks) => transform(blocks),
            transformRichText: opts.transformRichText,
          }),
        );
      } else {
        console.warn(
          `Encountered block type "${block.type}" without a designated transform function, skipping...`,
        );
      }
    });

    return opts.consolidateFn(output);
  };
  return {
    fns: transformFns,
    consolidateFn: opts.consolidateFn,
    transform,
  };
};
