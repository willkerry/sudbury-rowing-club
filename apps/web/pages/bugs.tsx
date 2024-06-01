import Input from "@/components/contact/fields/input";
import Error from "@/components/contact/views/error";
import Success from "@/components/contact/views/success";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Center from "@/components/stour/center";
import HeroTitle from "@/components/stour/hero/hero-title";
import { Button } from "@/components/ui/button";
import { makeShareImageURL } from "@/lib/og-image";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import cn from "clsx";
import { FORM_ERROR } from "final-form";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Field, Form } from "react-final-form";
import TextareaAutosize from "react-textarea-autosize";
import type { BugReport } from "./api/bug";

const getUserAgent = () => {
  if (typeof window === "undefined") return null;

  return window.navigator.userAgent;
};

const formatIfStringIsParseableJSON = (string: string) => {
  try {
    return JSON.stringify(JSON.parse(string), null, 2);
  } catch (_e) {
    return string;
  }
};

const Contact = () => {
  const { query } = useRouter();

  const userAgent = getUserAgent() || "Unknown";

  const message = query.message
    ? decodeURIComponent(query.message as string)
    : undefined;

  const additionalInformation = message
    ? formatIfStringIsParseableJSON(message)
    : undefined;

  return (
    <Layout>
      <NextSeo
        description="Report a bug"
        openGraph={{
          images: [{ url: makeShareImageURL("Report a bug 💩", true) }],
          title: "Report a bug",
        }}
        title="Report a bug"
      />
      <HeroTitle prose title="Report a bug 💩" color="transparent" />
      <Container className="max-w-lg py-12">
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
              return <Error error={submitErrors?.[FORM_ERROR]} />;

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
                      id="name"
                      input={input}
                      label="Your name"
                      meta={meta}
                      type="text"
                    />
                  )}
                </Field>

                <Field name="email">
                  {({ input, meta }) => (
                    <Input
                      disabled={disableFields}
                      id="email"
                      input={input}
                      label="Your email"
                      meta={meta}
                      type="email"
                    />
                  )}
                </Field>

                <Field name="description">
                  {({ input, meta }) => (
                    <div className="col-span-2">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label htmlFor="message">Description</label>
                      <p className="my-1 text-gray-900 text-sm">
                        Describe what you were trying to do, what you expected
                        to happen, and what actually happened.
                      </p>
                      <TextareaAutosize
                        {...input}
                        className={
                          meta.invalid && meta.touched ? "invalid" : ""
                        }
                        disabled={disableFields}
                        id="message"
                        minRows={3}
                        required
                      />
                    </div>
                  )}
                </Field>

                <fieldset className="col-span-2 grid gap-4 rounded border bg-gray-50 p-2">
                  <legend className="font-medium text-gray-700 text-xs">
                    Included automatically
                  </legend>

                  <Field name="userAgent">
                    {({ input, meta }) => (
                      <div className="col-span-2">
                        <Input
                          disabled
                          id="userAgent"
                          input={input}
                          label="User agent"
                          meta={meta}
                          type="text"
                          inputClassName="text-xs p-1.5 font-mono disabled:text-gray-500"
                          hint="Your browser always supplies it’s name, version number, and your operating system to us."
                        />
                      </div>
                    )}
                  </Field>

                  {additionalInformation && (
                    <Field name="additionalInformation">
                      {({ input, meta }) => (
                        <div className="col-span-2">
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                          <label htmlFor="additionalInformation">
                            Additional information
                          </label>
                          <TextareaAutosize
                            {...input}
                            className={cn(
                              "p-1.5 font-mono text-gray-600 text-xs",
                              meta.invalid && meta.touched ? "invalid" : "",
                            )}
                            disabled={disableFields}
                            id="additionalInformation"
                            minRows={3}
                            required
                          />
                          <p className="text-gray-700 text-xs">
                            The page you were on when you clicked the “Report a
                            bug” link gave us some additional information.
                            Delete it if you don’t want to include it.
                          </p>
                        </div>
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
            const errors: any = {};
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
      </Container>
    </Layout>
  );
};

export default Contact;
