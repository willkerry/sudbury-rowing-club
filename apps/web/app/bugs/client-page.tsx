"use client";

import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { useForm } from "@tanstack/react-form";
import { TRPCClientError } from "@trpc/client";
import { useQueryState } from "nuqs";
import { usePostHog } from "posthog-js/react";
import { BugReportSchema } from "@/app/api/bug/BugReportSchema";
import Center from "@/components/stour/center";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Error as ErrorComponent } from "@/components/ui/error";
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
    onMutate: () => posthog.capture("bug_report_submitted"),
    onError: (error) => {
      if (error instanceof TRPCClientError && error.data?.zodError) return;

      posthog.capture("bug_report_api_error", {
        error_message: error.message,
      });
    },
    onSuccess: () => posthog.capture("bug_report_success"),
  });

  const additionalInformation = message
    ? formatIfStringIsParseableJSON(message)
    : "";

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      description: "",
      userAgent: getUserAgent() || "Unknown",
      additionalInformation,
    },
    validators: {
      onSubmit: BugReportSchema,
      onSubmitAsync: withServerValidation(mutateAsync),
    },
    onSubmitInvalid: ({ formApi }) => {
      const fieldErrors = Object.fromEntries(
        Object.entries(formApi.state.fieldMeta)
          .filter(([, meta]) => meta.errors.length > 0)
          .map(([field, meta]) => [field, meta.errors.map(getErrorMessage)]),
      );

      posthog.capture("bug_report_validation_error", {
        fields_with_errors: Object.keys(fieldErrors),
        error_details: fieldErrors,
      });

      scrollToSelector('[aria-invalid="true"]');
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
              disabled={disableFields}
              className="col-span-2 sm:col-span-1"
              id={name}
              label="Your name"
              error={getErrorMessage(state.meta.errors[0])}
              type="text"
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="email">
          {({ state, handleBlur, handleChange, name }) => (
            <Input
              disabled={disableFields}
              className="col-span-2 sm:col-span-1"
              id={name}
              label="Your email"
              error={getErrorMessage(state.meta.errors[0])}
              inputMode="email"
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {({ state, handleBlur, handleChange, name }) => (
            <TextArea
              className="col-span-2"
              disabled={disableFields}
              error={getErrorMessage(state.meta.errors[0])}
              id={name}
              minRows={3}
              label="Description"
              description="Describe what you were trying to do, what you expected to happen, and what actually happened."
              value={state.value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
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
                disabled
                id={name}
                value={state.value}
                label="User agent"
                type="text"
                className="col-span-2"
                inputClassName="text-xs p-1.5 font-mono"
                description="Any time you use the web, your browser identifies itself (not you) to websites using a user agent string. This is included automatically."
                required={false}
              />
            )}
          </form.Field>

          {form.state.values.additionalInformation && (
            <form.Field name="additionalInformation">
              {({ state, handleBlur, handleChange, name }) => (
                <TextArea
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  className="col-span-2"
                  inputClassName="p-1.5 font-mono text-xs text-gray-600"
                  disabled={disableFields}
                  id={name}
                  required={false}
                  minRows={3}
                  label="Additional information"
                  description="The page you were on when you clicked the “Report a bug” link gave us some additional information. Delete it if you don’t want to include it."
                />
              )}
            </form.Field>
          )}
        </fieldset>

        {error &&
          !(error instanceof TRPCClientError && error.data?.zodError) && (
            <ErrorComponent className="col-span-2" error={error} />
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
