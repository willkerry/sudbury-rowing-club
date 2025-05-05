"use client";

import type { BugReport } from "@/app/api/bug/route";
import ErrorView from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Center from "@/components/stour/center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { FORM_ERROR } from "final-form";
import { useQueryState } from "nuqs";
import { Field, Form } from "react-final-form";

const getUserAgent = () => {
  if (typeof window === "undefined") return null;

  return window.navigator.userAgent;
};

const formatIfStringIsParseableJSON = (string: string) => {
  try {
    return JSON.stringify(JSON.parse(string), null, 2);
  } catch (_error) {
    return string;
  }
};

export const BugsClientSide = () => {
  const [message] = useQueryState("message");

  const userAgent = getUserAgent() || "Unknown";

  const additionalInformation = message
    ? formatIfStringIsParseableJSON(message)
    : undefined;

  return (
    <>
      <div className="prose mx-auto pb-10">
        <p>
          This is a mechanism for reporting website bugs, which bypasses the
          (potentially buggy) main contact form.
        </p>
      </div>

      <Form<BugReport>
        initialValues={{
          email: "",
          description: "",
          name: "",
          userAgent,
          additionalInformation,
        }}
        onSubmit={async (values) => {
          const response = await fetch("/api/bug", {
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          if (response.ok) return Promise.resolve();

          const error = await response.text();

          return Promise.resolve({
            [FORM_ERROR]: `${response.status} ${error}`,
          });
        }}
        render={({
          handleSubmit,
          submitting,
          pristine,
          submitSucceeded,
          submitFailed,
          hasValidationErrors,
          submitErrors,
        }) => {
          if (submitFailed)
            return <ErrorView error={submitErrors?.[FORM_ERROR]} />;

          if (submitSucceeded) return <Success />;

          const disableSubmission =
            pristine || submitting || submitSucceeded || hasValidationErrors;
          const disableFields = submitting || submitSucceeded;

          return (
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <Field name="name">
                {({ input, meta }) => (
                  <Input
                    disabled={disableFields}
                    className="col-span-2 sm:col-span-1"
                    id="name"
                    {...input}
                    label="Your name"
                    error={meta.invalid && meta.touched ? meta.error : ""}
                    type="text"
                  />
                )}
              </Field>

              <Field name="email">
                {({ input, meta }) => (
                  <Input
                    disabled={disableFields}
                    className="col-span-2 sm:col-span-1"
                    id="email"
                    {...input}
                    label="Your email"
                    error={meta.invalid && meta.touched ? meta.error : ""}
                    type="email"
                  />
                )}
              </Field>

              <Field name="description">
                {({ input, meta }) => (
                  <TextArea
                    {...input}
                    className="col-span-2"
                    disabled={disableFields}
                    error={meta.invalid && meta.touched ? meta.error : ""}
                    id="message"
                    minRows={3}
                    required
                    label="Description"
                    description="Describe what you were trying to do, what you expected to happen, and what actually happened."
                  />
                )}
              </Field>

              <fieldset className="col-span-2 grid gap-4 rounded-sm border bg-gray-50 p-2">
                <legend className="font-medium text-gray-700 text-xs">
                  Included automatically
                </legend>

                <Field name="userAgent">
                  {({ input }) => (
                    <Input
                      disabled
                      id="userAgent"
                      {...input}
                      label="User agent"
                      type="text"
                      className="col-span-2"
                      inputClassName="text-xs p-1.5 font-mono"
                      description="Any time you use the web, your browser identifies itself (not you) to websites using a user agent string. This is included automatically."
                      required={false}
                    />
                  )}
                </Field>

                {additionalInformation && (
                  <Field name="additionalInformation">
                    {({ input }) => (
                      <TextArea
                        {...input}
                        className="col-span-2"
                        inputClassName="p-1.5 font-mono text-xs text-gray-600"
                        disabled={disableFields}
                        id="additionalInformation"
                        required={false}
                        minRows={3}
                        label="Additional information"
                        description="The page you were on when you clicked the “Report a bug” link gave us some additional information. Delete it if you don’t want to include it."
                      />
                    )}
                  </Field>
                )}
              </fieldset>

              <Center className="col-span-2">
                <Button
                  id="message"
                  disabled={disableSubmission}
                  loading={submitting}
                  size="lg"
                  type="submit"
                  variant="secondary"
                >
                  Send
                </Button>
              </Center>
            </form>
          );
        }}
        validate={(values) => {
          const errors: {
            name?: string;
            email?: string;
            description?: string;
          } = {};
          if (!values.name) errors.name = "Required";
          if (!values.email) errors.email = "Required";
          if (!values.description) errors.description = "Required";
          return Object.keys(errors).length ? errors : undefined;
        }}
      />

      <div className="prose mt-16 text-gray-500 text-sm">
        Alternatively, mail{" "}
        <Obfuscate email="webmaster@sudburyrowingclub.org.uk" />.
      </div>
    </>
  );
};
