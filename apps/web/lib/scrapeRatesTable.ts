import { smartQuotes } from "@sudburyrc/helpers";
import { Browser } from "happy-dom";
import { z } from "zod";

const parseAndReformatDates = (input: string): string => {
  const dateRegex =
    /(\d{1,2})\/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;

  return input.replace(dateRegex, (_, day, month) => {
    const date = new Date(`${month} ${day}, ${new Date().getFullYear()}`);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  });
};

export const RoleWhenActiveSchema = z.object({
  ID: z.number(),
  Name: z.string(),
});

export const SectionSchema = z.object({
  Colour: z.unknown(),
  Description: z.unknown(),
  Icon: z.unknown(),
  IconAndName: z.string(),
  IconWithColour: z.string(),
  ID: z.number(),
  IsDefined: z.boolean(),
  Label: z.string(),
  Name: z.unknown(),
  SeasonStartDate: z.unknown(),
});

const TaxSchema = z.object({
  Formatted: z.string(),
  FormattedNoSymbol: z.string(),
  Value: z.number(),
});

const NullableTaxSchema = z.object({
  Formatted: z.string().nullable(),
  FormattedNoSymbol: z.string().nullable(),
  Value: z.number().nullable(),
});

const CostSchema = z.object({
  ExclTax: TaxSchema,
  Formatted: z.string(),
  InclTax: TaxSchema,
  IsVATRegistered: z.boolean(),
  Tax: TaxSchema,
});

const NullableCostSchema = z.object({
  ExclTax: NullableTaxSchema,
  Formatted: z.string().nullable(),
  InclTax: NullableTaxSchema,
  IsVATRegistered: z.boolean().nullable(),
  Tax: NullableTaxSchema,
});

export const RateCalcSchema = z.object({
  ID: z.number(),
  Name: z.union([z.null(), z.string()]),
});

export const CoreCategorySchema = z.object({
  AddOnOptions: z.array(z.unknown()),
  CoreCategories: z.array(z.unknown()),
  CoreCategoryIDs: z.array(z.unknown()),
  Description: z.string(),
  Duration: z.number().nullable(),
  DurationFormatted: z.string(),
  DurationUnits: z.string().nullable(),
  EndDate: z.string(),
  FormID: z.unknown(),
  Gender: z.unknown(),
  GenderIDs: z.array(z.unknown()),
  GroupNameTerm: z.string().nullable(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  ID: z.number(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsGroup: z.boolean(),
  IsLinked: z.boolean(),
  IsTemporary: z.boolean(),
  MaximumAge: z.number().nullable(),
  MinimumAge: z.number().nullable(),
  Name: z.string(),
  RequiresApproval: z.boolean(),
  Restrictions: z.string().nullable(),
  RoleWhenActive: RoleWhenActiveSchema,
  Section: SectionSchema,
  StartDate: z.string(),
});

export const CategorySchema = z.object({
  AddOnOptions: z.array(z.unknown()),
  CoreCategories: z.array(CoreCategorySchema),
  CoreCategoryIDs: z.array(z.number()),
  Description: z.string(),
  Duration: z.number().nullable(),
  DurationFormatted: z.string(),
  DurationUnits: z.string().nullable(),
  EndDate: z.string(),
  FormID: z.unknown(),
  Gender: z.unknown(),
  GenderIDs: z.array(z.unknown()),
  GroupNameTerm: z.string().nullable(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  ID: z.number(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsGroup: z.boolean(),
  IsLinked: z.boolean(),
  IsTemporary: z.boolean(),
  MaximumAge: z.number().nullable(),
  MinimumAge: z.number().nullable(),
  Name: z.string(),
  RequiresApproval: z.boolean(),
  Restrictions: z.string().nullable(),
  RoleWhenActive: RoleWhenActiveSchema,
  Section: SectionSchema,
  StartDate: z.string(),
});

const BaseMembershipSchema = z.object({
  AdvertiseFromDate: z.unknown(),
  CanAutoAccept: z.boolean(),
  Category: CategorySchema,
  Cost: CostSchema,
  Description: z.string().transform(smartQuotes),
  DescriptionWithValidity: z.string().transform(smartQuotes),
  DurationDescription: z.string().transform(parseAndReformatDates),
  HasJoiningFee: z.boolean(),
  ID: z.number(),
  IsJoiningFeeEligibleForGiftAid: z.boolean(),
  IsLinked: z.boolean(),
  IsSubscriptionEligibleForGiftAid: z.boolean(),
  JoiningFee: NullableCostSchema,
  LinkedCategories: z.array(RoleWhenActiveSchema),
  Name: z.string().transform(smartQuotes),
  RateCalc: RateCalcSchema,
  TokenExpiry: z.unknown(),
  TokenReward: z.unknown(),
  ValidFromDate: z.string().nullable(),
  ValidRangeDescription: z.string().nullable(),
  ValidUntilDate: z.unknown(),
});

const MembershipSchema = z.discriminatedUnion("HasEarlyPaymentOption", [
  BaseMembershipSchema.extend({
    HasEarlyPaymentOption: z.literal(false),
  }),
  BaseMembershipSchema.extend({
    EarlyPaymentCost: CostSchema,
    EarlyPaymentDeadlineDays: z.number(),
    EarlyPaymentDeadlineDaysAbs: z.number(),
    EarlyPaymentOnRenewalsOnly: z.boolean(),
    HasEarlyPaymentOption: z.literal(true),
  }),
]);

export const GroupSchema = z.object({
  HorseMemberships: z.array(z.unknown()),
  Memberships: z.array(MembershipSchema),
  Sections: z.array(z.unknown()),
  Title: z.string(),
  ValidFrom: z.coerce.date(),
});

export const MyClubhouseMembershipSchema = z.object({
  AreDiscountsAvailable: z.boolean(),
  Discounts: z.array(z.unknown()),
  Groups: z.array(GroupSchema),
  ShowEarlyPaymentCost: z.boolean(),
  ShowJoiningFee: z.boolean(),
  ShowTokenReward: z.boolean(),
  ShowVATLabel: z.boolean(),
});

const MYCLUBHOUSE_RATES_URL =
  "https://sudburyrowingclub.myclubhouse.co.uk/Register/MembershipCategories";

const scrapeMembershipData = async () => {
  const browser = new Browser();
  const page = browser.newPage();

  await page.goto(MYCLUBHOUSE_RATES_URL, { timeout: 5000 });

  const membershipData =
    page.mainFrame.document.querySelector("#membership-data");

  if (!membershipData) {
    throw new Error("Could not find table element");
  }

  const parsedData = MyClubhouseMembershipSchema.parse(
    JSON.parse(membershipData.textContent ?? ""),
  );

  await browser.close();

  return parsedData;
};

export const scrapeRatesTable = async (): Promise<
  | {
      status: "success";
      data: z.infer<typeof MembershipSchema>[];
    }
  | {
      status: "error";
      message: string;
    }
> => {
  try {
    const membershipData = await scrapeMembershipData();

    return { data: membershipData.Groups[0].Memberships, status: "success" };
  } catch {
    return {
      message:
        "We’re temporarily unable to display current membership rates – please check back soon or contact us for information.",
      status: "error",
    };
  }
};
