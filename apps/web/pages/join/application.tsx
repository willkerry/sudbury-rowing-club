import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { BooleanRadioGroup } from "@/components/ui/boolean-radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "@/components/stour/link";
import { Button } from "@/components/ui/button";
import { Fieldset } from "@/components/ui/fieldset";
import { FormItemBoolean } from "@/components/ui/form/boolean";
import { FormItemLegal } from "@/components/ui/form/legal";
import { FormItemPhone } from "@/components/ui/form/phone";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { dateMask } from "@/lib/masks/date";
import { scrapeRatesTable } from "@/lib/scrapeRatesTable";
import { parse } from "@formkit/tempo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMaskito } from "@maskito/react";
import { AnimatePresence, motion } from "framer-motion";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import type { InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import britishRowing from "../../public/assets/logos/british-rowing.svg";

const calculateAge = (dobString: string) => {
  try {
    const date = parse(dobString, "DD/MM/YYYY");
    return Math.floor(
      (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365),
    );
  } catch (_e) {
    return undefined;
  }
};

export const getStaticProps = async () => {
  try {
    const rates = (await scrapeRatesTable()).filter(
      (rate) => !rate.Name.includes("Racking"),
    );

    return {
      props: {
        rates,
      },
    };
  } catch (_error) {
    return {
      props: {
        rates: null,
        error: "Failed to scrape rates",
      },
    };
  }
};

const CONDITION_KEYS = [
  "ASTHMA",
  "DIABETES",
  "BLACKOUTS",
  "BRONCHITIS",
  "EAR_PROBLEMS",
  "EPILEPSY",
  "CARDIO_VASCULAR_ISSUES",
  "MUSCULO_SKELETAL_ISSUES",
] as const;

const CONDITION_DISPLAY_NAMES: Record<(typeof CONDITION_KEYS)[number], string> =
  {
    ASTHMA: "Asthma",
    DIABETES: "Diabetes",
    BLACKOUTS: "Blackouts",
    BRONCHITIS: "Bronchitis",
    EAR_PROBLEMS: "Ear problems",
    EPILEPSY: "Epilepsy",
    CARDIO_VASCULAR_ISSUES:
      "Cardio-vascular issues, e.g. hypertension, fibrillation.",
    MUSCULO_SKELETAL_ISSUES: "Musculo-skeletal injuries, e.g. back pain.",
  } as const;

const DIGIT_REGEX = /^[0-9]+$/;

const ApplicationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string().superRefine((value, context) => {
    let date: Date;

    try {
      date = parse(value, "DD/MM/YYYY");
    } catch (_e) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
      });
      return false;
    }

    if (date.getTime() > new Date().getTime()) {
      context.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "Date of birth cannot be in the future",
      });
      return false;
    }

    return true;
  }),
  email: z.string().email(),
  parentEmail: z.string().email().optional(),
  address: z.string(),

  isExistingRower: z.boolean(),
  brMembershipNumber: z
    .string()
    .trim()
    .length(7, "Must be 7 digits")
    .refine((value) => value.match(REGEXP_ONLY_DIGITS), "Only digits allowed")
    .optional(),
  priRower: z
    .string()
    .regex(DIGIT_REGEX, "Must be a number")
    .transform(Number)
    .optional(),
  priSculler: z
    .string()
    .regex(DIGIT_REGEX, "Must be a number")
    .transform(Number)
    .optional(),
  priCox: z
    .string()
    .regex(DIGIT_REGEX, "Must be a number")
    .transform(Number)
    .optional(),

  membershipType: z.string(),
  paymentMethod: z.enum(["CHEQUE", "BANK_TRANSFER"]),

  emergencyContact1Name: z.string(),
  emergencyContact1Phone: z.string(),
  emergencyContact1OtherPhone: z.string().optional(),
  emergencyContact1Relationship: z.string(),
  emergencyContact2Name: z.string(),
  emergencyContact2Phone: z.string(),
  emergencyContact2OtherPhone: z.string().optional(),
  emergencyContact2Relationship: z.string(),

  healthConditions: z.array(z.string()),
  healthMedication: z.boolean(),
  healthOther: z.boolean(),
  healthDetails: z.string().optional(),
  healthConsent: z.boolean().refine((value) => value === true, "Required"),

  waterSafetySwim: z.boolean(),
  waterSafetyCapsize: z.boolean(),
  waterSafetyConsent: z.boolean().refine((value) => value === true, "Required"),

  photographyConsent: z.boolean(),

  communicationConsent: z
    .boolean()
    .refine((value) => value === true, "Communication consent is required."),
});

const ApplicationForm = ({
  rates,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const form = useForm<z.infer<typeof ApplicationSchema>>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      healthConditions: [],
    },
    mode: "onSubmit",
  });

  const [useUKPhoneNumbers, setUseUKPhoneNumbers] = useState(true);

  const dobRef = useMaskito({ options: dateMask });

  const dob = form.watch("dob");

  const age = calculateAge(dob);
  const isUnder19YearsOld = age ? age < 19 : false;

  const isExistingRower = form.watch("isExistingRower");

  const hasMedicalConditions = !!(
    form.watch("healthMedication") ||
    form.watch("healthOther") ||
    form.watch("healthConditions").length > 0
  );

  const filteredRates = rates?.filter((rate) => {
    if (isUnder19YearsOld)
      return (
        rate.Name.includes("Junior") ||
        rate.Name.includes("Cox") ||
        rate.Name.includes("Family") ||
        rate.Name.includes("Start")
      );

    return !rate.Name.includes("Junior");
  });

  const price = rates?.find(
    (rate) => rate.Name === form.watch("membershipType"),
  )?.Cost.Formatted;

  return (
    <Layout>
      <Container className="my-12 max-w-screen-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              window.alert("Submitted");
              console.log(values);
            })}
            className="flex flex-col gap-y-6"
          >
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dob"
              control={form.control}
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel required>Date of birth</FormLabel>
                  <FormControl>
                    <Input {...rest} onInput={onChange} ref={dobRef} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    <AnimatePresence>
                      {isUnder19YearsOld ? (
                        <motion.span>Member’s email</motion.span>
                      ) : (
                        <motion.span>Email</motion.span>
                      )}
                    </AnimatePresence>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AnimatePresence>
              {isUnder19YearsOld ? (
                <motion.div layout="position">
                  <FormField
                    name="parentEmail"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          Parent or guardian’s email
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Fieldset legend="Rowing history">
              <FormField
                name="isExistingRower"
                control={form.control}
                render={({ field }) => (
                  <FormItemBoolean
                    field={field}
                    label="Are you already an active or experienced rower?"
                  />
                )}
              />

              <AnimatePresence>
                {isExistingRower ? (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="divide-y overflow-hidden rounded-lg border shadow-lg"
                  >
                    <div className="p-2">
                      <Image
                        src={britishRowing}
                        alt="British Rowing"
                        height={20}
                      />
                    </div>
                    <div className="space-y-4 bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-2">
                      <FormField
                        name="brMembershipNumber"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel optional>
                              British Rowing membership number
                            </FormLabel>
                            <FormControl>
                              <InputOTP
                                maxLength={7}
                                {...field}
                                pattern={REGEXP_ONLY_DIGITS}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                  <InputOTPSlot index={6} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormDescription>
                              This is the seven digit number on your membership
                              card.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-x-6">
                        <FormField
                          name="priRower"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel optional>Rowing PRI</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  className="disambiguate tabular-nums"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name="priSculler"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel optional>Sculling PRI</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  className="disambiguate tabular-nums"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name="priCox"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel optional>Coxing PRI</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  className="disambiguate tabular-nums"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Fieldset>

            <Fieldset legend="Membership type">
              <FormField
                name="membershipType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Select a membership type</FormLabel>

                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {filteredRates?.map((rate) => (
                        <FormItem
                          key={rate.ID}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={rate.Name} />
                          </FormControl>
                          <FormLabel>{rate.Name}</FormLabel>
                          <FormMessage />
                        </FormItem>
                      ))}
                    </RadioGroup>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnimatePresence>
                {form.watch("membershipType") ? (
                  <motion.div
                    layout="position"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="prose prose-sm my-12">
                      <p>
                        Your chosen membership type requires a payment of{" "}
                        {price}. You may pay either by bank transfer, cheque, or
                        on <Link href="#">MyClubhouse</Link>.
                      </p>
                      <p>
                        Cheques should be made payable to:{" "}
                        <span className="-mx-px rounded border px-0.5 font-medium text-black tabular-nums">
                          Sudbury Rowing Club
                        </span>
                        .
                        <br />
                        Bank transfers to:{" "}
                        <span className="-mx-px rounded border px-0.5 font-medium text-black tabular-nums">
                          Sudbury Rowing Club, HSBC Bank, 40-41-64, 70055484
                        </span>
                        .
                      </p>
                    </div>

                    <FormField
                      name="paymentMethod"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Payment method</FormLabel>

                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="BANK_TRANSFER" />
                              </FormControl>
                              <FormLabel>
                                I will pay {price} by bank transfer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="CHEQUE" />
                              </FormControl>
                              <FormLabel>
                                I will provide a cheque{" "}
                                {price ? `for ${price}` : ""}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MYCLUBHOUSE" />
                              </FormControl>
                              <FormLabel>
                                I will pay {price} on{" "}
                                <Link href="#">MyClubhouse</Link> once my
                                membership begins
                              </FormLabel>
                            </FormItem>
                            <FormMessage />
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Fieldset>

            <Fieldset legend="Emergency contacts">
              <div className="prose prose-sm">
                <p>
                  Please provide details for two emergency contacts. These
                  contacts should be individuals we can reach out to in case of
                  any emergencies. Ensure that the contacts are readily
                  available and aware that you've listed them for this purpose.
                  Your safety is our priority, and having these details helps us
                  act swiftly if needed.
                </p>
              </div>

              <Button
                type="button"
                size="xs"
                onClick={() => setUseUKPhoneNumbers((v) => !v)}
              >
                {useUKPhoneNumbers
                  ? "Allow international phone numbers"
                  : "Undo allow international phone numbers"}
              </Button>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <FormField
                  name="emergencyContact1Name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>First contact’s name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="emergencyContact1Relationship"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        First contact’s relationship to you
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="emergencyContact1Phone"
                  control={form.control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <FormItemPhone
                      field={field}
                      required
                      label="First contact’s phone number"
                    />
                  )}
                />

                <FormField
                  name="emergencyContact1OtherPhone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItemPhone
                      field={field}
                      label="First contact’s other phone number"
                    />
                  )}
                />

                <hr className="col-span-2" />

                <FormField
                  name="emergencyContact2Name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Second contact’s name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="emergencyContact2Relationship"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        Second contact’s relationship to you
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="emergencyContact2Phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItemPhone
                      field={field}
                      required
                      label="Second contact’s phone number"
                    />
                  )}
                />

                <FormField
                  name="emergencyContact2OtherPhone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItemPhone
                      field={field}
                      label="Second contact’s other phone number"
                    />
                  )}
                />
              </div>
            </Fieldset>

            <Fieldset legend="Health">
              <div className="prose prose-sm">
                <p>
                  Rowing and its associated training can be a strenuous
                  activity. You should therefore be in good health and have no
                  medical or physical condition precluding heavy exercise. If
                  there is any doubt you should first consult your doctor.
                </p>

                <p>
                  Some conditions such as asthma and diabetes, for example, do
                  not prevent individuals participating in the sport, but you do
                  have a duty to declare any condition (or change in personal
                  health while a member of the club) that might put yourself or
                  others at risk.
                </p>
              </div>

              <FormField
                name="healthConditions"
                control={form.control}
                render={() => (
                  <FormItem className="pb-4">
                    <FormLabel>
                      Do you have any of the following health conditions?
                    </FormLabel>

                    {CONDITION_KEYS.map((condition) => (
                      <FormField
                        key={condition}
                        name="healthConditions"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem
                            key={condition}
                            className="flex flex-row items-start space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition)}
                                onCheckedChange={(checked) => {
                                  console.log(field.name, field.value, checked);
                                  if (checked) {
                                    field.onChange([...field.value, condition]);
                                    return;
                                  }

                                  field.onChange(
                                    field.value.filter(
                                      (value) => value !== condition,
                                    ),
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel>
                              {CONDITION_DISPLAY_NAMES[condition]}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="healthMedication"
                control={form.control}
                render={({ field }) => (
                  <FormItemBoolean
                    field={field}
                    required
                    label="Are you taking any medication?"
                  />
                )}
              />

              <FormField
                name="healthOther"
                control={form.control}
                render={({ field }) => (
                  <FormItemBoolean
                    field={field}
                    required
                    label="Do you know of any other medical reasons that might affect your ability to row or render you unfit for strenuous exercise?"
                  />
                )}
              />

              {hasMedicalConditions ? (
                <FormField
                  name="healthDetails"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please give further details</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        You indicated that your ability to row may be affected
                        by a medical condition. Please give further details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                name="healthConsent"
                control={form.control}
                render={({ field }) => (
                  <FormItemLegal
                    field={field}
                    label={`I consent to the data provided in this section being shared with coaches for the purposes of the delivery of ${
                      isUnder19YearsOld ? "my child’s" : "my"
                    } safe participation in club activity. These data will not be shared or processed for any other purpose.`}
                    description={
                      isUnder19YearsOld &&
                      "A parent or guardian must provide this consent."
                    }
                    required
                  />
                )}
              />
            </Fieldset>

            <Fieldset legend="Water safety">
              <div className="prose prose-sm">
                <p>
                  For your own safety it is important that you are a competent
                  swimmer. As a minimum you must be able to swim 100 metres in a
                  swimming costume and 50 metres in light clothing. If you
                  cannot meet this requirement you may still row, but must wear
                  a lifejacket or buoyancy aid at all times when in a boat.
                </p>
                <p>
                  The club will regularly hold swimming tests and training in
                  capsize procedures not only to demonstrate your competence,
                  but also your confidence under the water, swimming on your
                  front and back, and your ability to tread water.
                </p>
              </div>

              <FormField
                name="waterSafetySwim"
                control={form.control}
                render={({ field }) => (
                  <FormItemBoolean
                    field={field}
                    required
                    label="Can you meet the minimum swimming requirement?"
                  />
                )}
              />

              <FormField
                name="waterSafetyCapsize"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      Have you ever done a rowing/sculling capsize drill?
                    </FormLabel>
                    <FormControl>
                      <BooleanRadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="waterSafetyConsent"
                control={form.control}
                render={({ field }) => (
                  <FormItemLegal
                    field={field}
                    label={`I agree to inform the club of any change in swimming proficiency that may put ${
                      isUnder19YearsOld ? "my child" : "me"
                    } or others at risk.`}
                    description={
                      isUnder19YearsOld &&
                      "A parent or guardian must provide this consent."
                    }
                    required
                  />
                )}
              />
            </Fieldset>

            <Fieldset legend="Photography and video consent">
              <div className="prose prose-sm">
                <p>
                  Sudbury Rowing Club recognises the need to ensure the welfare
                  and safety of all its members and guests.
                </p>
                <p>
                  In accordance with the British Rowing child protection policy
                  and procedures, taking photographic, video or other images of
                  children without the consent of the parents/carers and
                  children is strictly forbidden.
                </p>
                <p>
                  Sudbury Rowing Club will take all possible steps to ensure
                  that any images for which permission has been given are used
                  solely for the purposes they are intended. If you become aware
                  that these images are being used inappropriately you should
                  inform the Club immediately.
                </p>
              </div>

              <FormField
                name="photographyConsent"
                control={form.control}
                render={({ field }) => (
                  <FormItemLegal
                    field={field}
                    label={
                      <>
                        I consent to Sudbury Rowing Club, or a photographer
                        appointed by the Club, photographing or videoing{" "}
                        {isUnder19YearsOld ? "my child’s" : "my"} involvement in
                        rowing during the period of{" "}
                        {isUnder19YearsOld ? "my child’s" : "my"} membership,
                        for the purposes of publicising and promoting the club
                        or sport, in print or via social media, for site
                        security or as a coaching aid.
                      </>
                    }
                    description={
                      isUnder19YearsOld &&
                      "A parent or guardian must provide this consent."
                    }
                    required
                  />
                )}
              />
            </Fieldset>

            <Fieldset legend="Communication preferences">
              <div className="prose prose-sm">
                <p>
                  Sudbury Rowing Club take the protection of the data that we
                  hold about you as a member seriously and will do everything
                  possible to ensure that data are collected, stored, processed,
                  maintained, cleansed and retained in accordance with current
                  and future UK data protection legislation.
                </p>
                <p>
                  Please read the full privacy statement carefully to see how
                  the club will treat the personal information that you provide
                  to us. We will take reasonable care to keep your information
                  secure and to prevent any unauthorised access.
                </p>
                <p>
                  To enable members to contact each other to organise outings
                  etc, an email facility, for which individual addresses are
                  hidden, is available to members and volunteers who help with
                  club activities.
                </p>
              </div>

              <FormField
                name="communicationConsent"
                control={form.control}
                render={({ field }) => (
                  <FormItemLegal
                    field={field}
                    label="I agree to receive communications by post, email and other digital means."
                    required
                  />
                )}
              />
            </Fieldset>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Container>
    </Layout>
  );
};

export default ApplicationForm;
