import { useContext } from "react";
import {
  EditorPropsContext,
  PropsProviderProps,
} from "@easy-email-editor/components/Provider/PropsProvider";

export function useEditorProps<T extends PropsProviderProps>(): T & {
  mergeTagGenerate: NonNullable<PropsProviderProps["mergeTagGenerate"]>;
} {
  return useContext(EditorPropsContext) as any;
}
