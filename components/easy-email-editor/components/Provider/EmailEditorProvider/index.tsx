import React, { useEffect, useMemo, useState } from "react";
import { IEmailTemplate } from "@easy-email-editor/typings";
import {
  overrideErrorLog,
  restoreErrorLog,
} from "@easy-email-editor/utils/logger";
import { Config, FormApi, FormState } from "final-form";
import arrayMutators from "final-form-arrays";
import setFieldTouched from "final-form-set-field-touched";
import { Form, useField, useForm, useFormState } from "react-final-form";
import { BlocksProvider } from "..//BlocksProvider";
import { FocusBlockLayoutProvider } from "../FocusBlockLayoutProvider";
import { HoverIdxProvider } from "../HoverIdxProvider";
import { LanguageProvider } from "../LanguageProvider";
import { PreviewEmailProvider } from "../PreviewEmailProvider";
import { PropsProvider, PropsProviderProps } from "../PropsProvider";
import { RecordProvider } from "../RecordProvider";
import { ScrollProvider } from "../ScrollProvider";

export interface EmailEditorProviderProps<T extends IEmailTemplate = any>
  extends Omit<PropsProviderProps, "children"> {
  data: T;
  children: (
    props: FormState<T>,
    helper: FormApi<IEmailTemplate, Partial<IEmailTemplate>>
  ) => React.ReactNode;
  onSubmit?: Config<IEmailTemplate, Partial<IEmailTemplate>>["onSubmit"];
  validationSchema?: Config<
    IEmailTemplate,
    Partial<IEmailTemplate>
  >["validate"];
}

export const EmailEditorProvider = <T extends any>(
  props: EmailEditorProviderProps & T
) => {
  const { data, children, onSubmit = () => {}, validationSchema } = props;

  const initialValues = useMemo(() => {
    return {
      subject: data.subject,
      subTitle: data.subTitle,
      content: data.content,
    };
  }, [data]);

  useEffect(() => {
    overrideErrorLog();
    return () => {
      restoreErrorLog();
    };
  }, []);

  if (!initialValues.content) return null;

  return (
    <Form<IEmailTemplate>
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validate={validationSchema}
      mutators={{ ...arrayMutators, setFieldTouched: setFieldTouched as any }}
      subscription={{ submitting: true, pristine: true }}
    >
      {() => (
        <>
          <PropsProvider {...props}>
            <LanguageProvider locale={props.locale}>
              <PreviewEmailProvider>
                <RecordProvider>
                  <BlocksProvider>
                    <HoverIdxProvider>
                      <ScrollProvider>
                        <FocusBlockLayoutProvider>
                          <FormWrapper children={children} />
                        </FocusBlockLayoutProvider>
                      </ScrollProvider>
                    </HoverIdxProvider>
                  </BlocksProvider>
                </RecordProvider>
              </PreviewEmailProvider>
            </LanguageProvider>
          </PropsProvider>
          <RegisterFields />
        </>
      )}
    </Form>
  );
};

function FormWrapper({
  children,
}: {
  children: EmailEditorProviderProps["children"];
}) {
  const data = useFormState<IEmailTemplate>();
  const helper = useForm<IEmailTemplate>();
  return <>{children(data, helper)}</>;
}

// final-form bug https://github.com/final-form/final-form/issues/169

const RegisterFields = React.memo(() => {
  const { touched } = useFormState<IEmailTemplate>();
  const [touchedMap, setTouchedMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (touched) {
      Object.keys(touched)
        .filter((key) => touched[key])
        .forEach((key) => {
          setTouchedMap((obj) => {
            obj[key] = true;
            return { ...obj };
          });
        });
    }
  }, [touched]);

  return (
    <>
      {Object.keys(touchedMap).map((key) => {
        return <RegisterField key={key} name={key} />;
      })}
    </>
  );
});

function RegisterField({ name }: { name: string }) {
  useField(name);
  return <></>;
}
