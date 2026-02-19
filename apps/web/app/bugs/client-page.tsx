"use client";

import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { useForm } from "@tanstack/react-form";
import { TRPCClientError } from "@trpc/client";
import { useQueryState } from "nuqs";
import { usePostHog } from "posthog-js/react";
import { BugReportSchema } from "@/app/bugs/BugReportSchema";
import Center from "@/components/stour/center";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useTrackFormStarted } from "@/hooks/useTrackFormStarted";
import { getErrorMessage, withServerValidation } from "@/lib/form";
import { scrollToSelector } from "@/lib/scrollToSelector";
import { trpc } from "@/lib/trpc/client";

const getUserAgent = () => {
  if (typeof window === "undefined") return null;

  return window.navigator.userAgent;
};

const formatIfStringIsParseableJSON = (string: string) => {
  try {
    return JSON.stringify(JSON.parse(string), null, 2);
  } catch {
    return string;
  }
};

export const BugsClientSide = () => {
  const [message] = useQueryState("message");

  const posthog = usePostHog();

  const { mutateAsync, error, data, status } = trpc.comms.bug.useMutation({
    onError: (error) => {
      if (error instanceof TRPCClientError && error.data?.zodError) return;

      posthog.capture("bug_report_api_error", {
        error_message: error.message,
      });
    },
    onMutate: () => posthog.capture("bug_report_submitted"),
    onSuccess: () => posthog.capture("bug_report_success"),
  });

  const additionalInformation = message
    ? formatIfStringIsParseableJSON(message)
    : "";

  const form = useForm({
    defaultValues: {
      description: "",
      email: "",
      name: "",
      userAgent: getUserAgent() || "Unknown",
      additionalInformation,
    },
    onSubmitInvalid: ({ formApi }) => {
      const fieldErrors = Object.fromEntries(
        Object.entries(formApi.state.fieldMeta)
          .filter(([, meta]) => meta.errors.length > 0)
          .map(([field, meta]) => [field, meta.errors.map(getErrorMessage)]),
      );

      posthog.capture("bug_report_validation_error", {
        error_details: fieldErrors,
        fields_with_errors: Object.keys(fieldErrors),
      });

      scrollToSelector('[aria-invalid="true"]');
    },
    validators: {
      onSubmit: BugReportSchema,
      onSubmitAsync: withServerValidation(mutateAsync),
    },
  });

  const hasTouchedFields = Object.values(form.state.fieldMeta).some(
    (meta) => meta.isTouched,
  );

  useTrackFormStarted("bug_report", hasTouchedFields);

  if (data && status === "success") {
    return (
      <Alert variant="success">
        <AlertTitle>Bug report sent</AlertTitle>
        <AlertDescription>
          Thank you for your report. We will investigate as soon as possible.
        </AlertDescription>
      </Alert>
    );
  }

  const disableFields = form.state.isSubmitting || form.state.isSubmitted;

  return (
    <>
      <div className="prose mx-auto pb-10">
        <p>
          This is a mechanism for reporting website bugs, which bypasses the
          (potentially buggy) main contact form.
        </p>
      </div>

      <form
        className="grid grid-cols-2 gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {({ state, handleBlur, handleChange, name }) => (
            <Input
              className="col-span-2 sm:col-span-1"
              disabled={disableFields}
              error={getErrorMessage(state.meta.errors[0])}
              id={name}
              label="Your name"
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              value={state.value}
            />
          )}
        </form.Field>

        <form.Field name="email">
          {({ state, handleBlur, handleChange, name }) => (
            <Input
              className="col-span-2 sm:col-span-1"
              disabled={disableFields}
              error={getErrorMessage(state.meta.errors[0])}
              id={name}
              inputMode="email"
              label="Your email"
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              value={state.value}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {({ state, handleBlur, handleChange, name }) => (
            <TextArea
              className="col-span-2"
              description="Describe what you were trying to do, what you expected to happen, and what actually happened."
              disabled={disableFields}
              error={getErrorMessage(state.meta.errors[0])}
              id={name}
              label="Description"
              minRows={3}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              value={state.value}
            />
          )}
        </form.Field>

        <fieldset className="col-span-2 grid gap-4 rounded-sm border bg-gray-50 p-2">
          <legend className="font-medium text-gray-700 text-xs">
            Included automatically
          </legend>

          <form.Field name="userAgent">
            {({ state, name }) => (
              <Input
                className="col-span-2"
                description="Any time you use the web, your browser identifies itself (not you) to websites using a user agent string. This is included automatically."
                disabled
                id={name}
                inputClassName="text-xs p-1.5 font-mono"
                label="User agent"
                required={false}
                type="text"
                value={state.value}
              />
            )}
          </form.Field>

          {form.state.values.additionalInformation && (
            <form.Field name="additionalInformation">
              {({ state, handleBlur, handleChange, name }) => (
                <TextArea
                  className="col-span-2"
                  description="The page you were on when you clicked the “Report a bug” link gave us some additional information. Delete it if you don’t want to include it."
                  disabled={disableFields}
                  id={name}
                  inputClassName="p-1.5 font-mono text-xs text-gray-600"
                  label="Additional information"
                  minRows={3}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  required={false}
                  value={state.value}
                />
              )}
            </form.Field>
          )}
        </fieldset>

        {error &&
          !(error instanceof TRPCClientError && error.data?.zodError) && (
            <ErrorMessage className="col-span-2" error={error} />
          )}

        <Center className="col-span-2">
          <Button
            disabled={form.state.isSubmitting}
            loading={form.state.isSubmitting}
            size="lg"
            type="submit"
            variant="secondary"
          >
            Send
          </Button>
        </Center>
      </form>

      <div className="prose mt-16 text-gray-500 text-sm">
        Alternatively, mail{" "}
        <Obfuscate email="webmaster@sudburyrowingclub.org.uk" />.
      </div>
    </>
  );
};
