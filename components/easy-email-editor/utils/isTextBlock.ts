import { AdvancedType, BasicType } from "@easy-email-core";

export function isTextBlock(blockType: any) {
  return blockType === BasicType.TEXT || blockType === AdvancedType.TEXT;
}
