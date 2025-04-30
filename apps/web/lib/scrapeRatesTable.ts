import { smartQuotes } from "@sudburyrc/helpers";
import { Browser } from "happy-dom";
import { z } from "zod";

const parseAndReformatDates = (input: string): React.ReactNode => {
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
  ID: z.number(),
  Name: z.unknown(),
  Description: z.unknown(),
  Icon: z.unknown(),
  Colour: z.unknown(),
  SeasonStartDate: z.unknown(),
  IsDefined: z.boolean(),
  IconWithColour: z.string(),
  IconAndName: z.string(),
  Label: z.string(),
});

const TaxSchema = z.object({
  Value: z.number(),
  Formatted: z.string(),
  FormattedNoSymbol: z.string(),
});

const NullableTaxSchema = z.object({
  Value: z.number().nullable(),
  Formatted: z.string().nullable(),
  FormattedNoSymbol: z.string().nullable(),
});

const CostSchema = z.object({
  ExclTax: TaxSchema,
  Tax: TaxSchema,
  InclTax: TaxSchema,
  IsVATRegistered: z.boolean(),
  Formatted: z.string(),
});

const NullableCostSchema = z.object({
  ExclTax: NullableTaxSchema,
  Tax: NullableTaxSchema,
  InclTax: NullableTaxSchema,
  IsVATRegistered: z.boolean().nullable(),
  Formatted: z.string().nullable(),
});

export const RateCalcSchema = z.object({
  ID: z.number(),
  Name: z.union([z.null(), z.string()]),
});

export const CoreCategorySchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Description: z.string(),
  RoleWhenActive: RoleWhenActiveSchema,
  MinimumAge: z.number().nullable(),
  MaximumAge: z.number().nullable(),
  GenderIDs: z.array(z.unknown()),
  Gender: z.unknown(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsLinked: z.boolean(),
  StartDate: z.string(),
  EndDate: z.string(),
  DurationUnits: z.string().nullable(),
  Duration: z.number().nullable(),
  DurationFormatted: z.string(),
  IsTemporary: z.boolean(),
  RequiresApproval: z.boolean(),
  Section: SectionSchema,
  CoreCategories: z.array(z.unknown()),
  CoreCategoryIDs: z.array(z.unknown()),
  AddOnOptions: z.array(z.unknown()),
  IsGroup: z.boolean(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  GroupNameTerm: z.string().nullable(),
  FormID: z.unknown(),
  Restrictions: z.string().nullable(),
});

export const CategorySchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Description: z.string(),
  RoleWhenActive: RoleWhenActiveSchema,
  MinimumAge: z.number().nullable(),
  MaximumAge: z.number().nullable(),
  GenderIDs: z.array(z.unknown()),
  Gender: z.unknown(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsLinked: z.boolean(),
  StartDate: z.string(),
  EndDate: z.string(),
  DurationUnits: z.string().nullable(),
  Duration: z.number().nullable(),
  DurationFormatted: z.string(),
  IsTemporary: z.boolean(),
  RequiresApproval: z.boolean(),
  Section: SectionSchema,
  CoreCategories: z.array(CoreCategorySchema),
  CoreCategoryIDs: z.array(z.number()),
  AddOnOptions: z.array(z.unknown()),
  IsGroup: z.boolean(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  GroupNameTerm: z.string().nullable(),
  FormID: z.unknown(),
  Restrictions: z.string().nullable(),
});

const BaseMembershipSchema = z.object({
  ID: z.number(),
  Name: z.string().transform(smartQuotes),
  Description: z.string().transform(smartQuotes),
  DescriptionWithValidity: z.string().transform(smartQuotes),
  Category: CategorySchema,
  IsLinked: z.boolean(),
  LinkedCategories: z.array(RoleWhenActiveSchema),
  CanAutoAccept: z.boolean(),
  AdvertiseFromDate: z.unknown(),
  ValidFromDate: z.string().nullable(),
  ValidUntilDate: z.unknown(),
  ValidRangeDescription: z.string().nullable(),
  HasJoiningFee: z.boolean(),
  JoiningFee: NullableCostSchema,
  Cost: CostSchema,
  RateCalc: RateCalcSchema,
  DurationDescription: z.string().transform(parseAndReformatDates),
  IsSubscriptionEligibleForGiftAid: z.boolean(),
  IsJoiningFeeEligibleForGiftAid: z.boolean(),
  TokenReward: z.unknown(),
  TokenExpiry: z.unknown(),
});

const MembershipSchema = z.discriminatedUnion("HasEarlyPaymentOption", [
  BaseMembershipSchema.extend({
    HasEarlyPaymentOption: z.literal(false),
  }),
  BaseMembershipSchema.extend({
    HasEarlyPaymentOption: z.literal(true),
    EarlyPaymentCost: CostSchema,
    EarlyPaymentDeadlineDays: z.number(),
    EarlyPaymentDeadlineDaysAbs: z.number(),
    EarlyPaymentOnRenewalsOnly: z.boolean(),
  }),
]);

export const GroupSchema = z.object({
  Title: z.string(),
  ValidFrom: z.coerce.date(),
  Memberships: z.array(MembershipSchema),
  Sections: z.array(z.unknown()),
  HorseMemberships: z.array(z.unknown()),
});

export const MyClubhouseMembershipSchema = z.object({
  Groups: z.array(GroupSchema),
  ShowEarlyPaymentCost: z.boolean(),
  ShowJoiningFee: z.boolean(),
  ShowVATLabel: z.boolean(),
  ShowTokenReward: z.boolean(),
  AreDiscountsAvailable: z.boolean(),
  Discounts: z.array(z.unknown()),
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

    return { status: "success", data: membershipData.Groups[0].Memberships };
  } catch (_) {
    return {
      status: "error",
      message:
        "We’re temporarily unable to display current membership rates – please check back soon or contact us for information.",
    };
  }
};
