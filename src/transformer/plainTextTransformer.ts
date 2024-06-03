import { createBlockTransformer } from './createBlockTransformer.ts';

import { NotionRichText } from '../client/clientTypes.ts';

export const renderRichTextToString = (richText: NotionRichText) =>
  richText.map((text) => text.text).join('');

/**
 * A transformer for converting Notion blocks to a plain text representation
 */
export const plainTextTransformer = createBlockTransformer<string>({
  transformRichText: renderRichTextToString,
  transformFns: {
    paragraph(block, ctx) {
      return ctx.transformRichText(block.content.richText);
    },
    heading1(block, ctx) {
      return ctx.transformRichText(block.content.richText);
    },
    heading2(block, ctx) {
      return ctx.transformRichText(block.content.richText);
    },
    heading3(block, ctx) {
      return ctx.transformRichText(block.content.richText);
    },
    audio(block, ctx) {
      return `Audio File (${ctx.transformRichText(block.content.caption)}) `;
    },
    video(block, ctx) {
      return `Video File (${ctx.transformRichText(block.content.caption)}) `;
    },
    image(block, ctx) {
      return `Image  (${ctx.transformRichText(block.content.caption)}) `;
    },
    bulletedList(block, ctx) {
      return block.children
        .map(
          (child) =>
            ` - ${ctx.transformRichText(child.content.richText)}${ctx.transformChildren([child])}`,
        )
        .join('\n');
    },
    bulletedListItem(block, ctx) {
      return `${ctx.transformRichText(block.content.richText)}`;
    },
    numberedList(block, ctx) {
      return block.children
        .map(
          (child, i) =>
            ` ${i + 1}. ${ctx.transformRichText(child.content.richText)}${ctx.transformChildren([child])}`,
        )
        .join('\n');
    },
    toDoList(block, ctx) {
      return block.children
        .map(
          (child) =>
            ` ${child.content.checked ? '[x]' : '[ ]'} ${ctx.transformChildren([child])}`,
        )
        .join('\n');
    },
  },
  consolidateFn: (result) => result.join('\n'),
});
