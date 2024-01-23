import { AdvancedType, BasicType } from "@easy-email-core";

export function isButtonBlock(blockType: any) {
  return blockType === BasicType.BUTTON || blockType === AdvancedType.BUTTON;
}
