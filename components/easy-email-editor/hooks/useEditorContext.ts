import { useContext } from "react";
import { BlocksContext } from "@easy-email-editor/components/Provider/BlocksProvider";
import { IEmailTemplate } from "@easy-email-editor/typings";
import { useForm, useFormState } from "react-final-form";

export function useEditorContext() {
  const formState = useFormState<IEmailTemplate>();
  const helpers = useForm();
  const { initialized, setInitialized } = useContext(BlocksContext);

  const { content } = formState.values;
  return {
    formState,
    formHelpers: helpers,
    initialized,
    setInitialized,
    pageData: content,
  };
}
