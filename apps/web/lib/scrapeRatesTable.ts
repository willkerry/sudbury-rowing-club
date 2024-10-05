import { JSDOM } from "jsdom";
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
  Name: z.null(),
  Description: z.null(),
  Icon: z.null(),
  Colour: z.null(),
  SeasonStartDate: z.null(),
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
  MinimumAge: z.union([z.number(), z.null()]),
  MaximumAge: z.union([z.number(), z.null()]),
  GenderIDs: z.array(z.any()),
  Gender: z.null(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsLinked: z.boolean(),
  StartDate: z.string(),
  EndDate: z.string(),
  DurationUnits: z.union([z.null(), z.string()]),
  Duration: z.union([z.number(), z.null()]),
  DurationFormatted: z.string(),
  IsTemporary: z.boolean(),
  RequiresApproval: z.boolean(),
  Section: SectionSchema,
  CoreCategories: z.array(z.any()),
  CoreCategoryIDs: z.array(z.any()),
  AddOnOptions: z.array(z.any()),
  IsGroup: z.boolean(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  GroupNameTerm: z.null(),
  FormID: z.null(),
  Restrictions: z.union([z.null(), z.string()]),
});

export const CategorySchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Description: z.string(),
  RoleWhenActive: RoleWhenActiveSchema,
  MinimumAge: z.union([z.number(), z.null()]),
  MaximumAge: z.union([z.number(), z.null()]),
  GenderIDs: z.array(z.any()),
  Gender: z.null(),
  IsAvailableAtAll: z.boolean(),
  IsAvailableToNewApplicants: z.boolean(),
  IsAvailableToNewApplicantsOnly: z.boolean(),
  IsLinked: z.boolean(),
  StartDate: z.string(),
  EndDate: z.string(),
  DurationUnits: z.union([z.null(), z.string()]),
  Duration: z.union([z.number(), z.null()]),
  DurationFormatted: z.string(),
  IsTemporary: z.boolean(),
  RequiresApproval: z.boolean(),
  Section: SectionSchema,
  CoreCategories: z.array(CoreCategorySchema),
  CoreCategoryIDs: z.array(z.number()),
  AddOnOptions: z.array(z.any()),
  IsGroup: z.boolean(),
  GroupsCanHaveNames: z.boolean(),
  GroupsRequireNames: z.boolean(),
  GroupNameTerm: z.union([z.null(), z.string()]),
  FormID: z.null(),
  Restrictions: z.union([z.null(), z.string()]),
});

const BaseMembershipSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Description: z.string(),
  DescriptionWithValidity: z.string(),
  Category: CategorySchema,
  IsLinked: z.boolean(),
  LinkedCategories: z.array(RoleWhenActiveSchema),
  CanAutoAccept: z.boolean(),
  AdvertiseFromDate: z.any(),
  ValidFromDate: z.union([z.null(), z.string()]),
  ValidUntilDate: z.any(),
  ValidRangeDescription: z.union([z.null(), z.string()]),
  HasJoiningFee: z.boolean(),
  /** Should be a discriminated union, but the schema is already using the
   * HasEarlyPaymentOption boolean as a discriminant */
  JoiningFee: NullableCostSchema,
  Cost: CostSchema,
  RateCalc: RateCalcSchema,
  DurationDescription: z.string().transform(parseAndReformatDates),
  IsSubscriptionEligibleForGiftAid: z.boolean(),
  IsJoiningFeeEligibleForGiftAid: z.boolean(),
  TokenReward: z.any(),
  TokenExpiry: z.any(),
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
  Sections: z.array(z.any()),
  HorseMemberships: z.array(z.any()),
});

export const MyClubhouseMembershipSchema = z.object({
  Groups: z.array(GroupSchema),
  ShowEarlyPaymentCost: z.boolean(),
  ShowJoiningFee: z.boolean(),
  ShowVATLabel: z.boolean(),
  ShowTokenReward: z.boolean(),
  AreDiscountsAvailable: z.boolean(),
  Discounts: z.array(z.any()),
});

const MYCLUBHOUSE_RATES_URL =
  "https://sudburyrowingclub.myclubhouse.co.uk/Register/MembershipCategories";

const scrapeMembershipData = async () => {
  const dom = await JSDOM.fromURL(MYCLUBHOUSE_RATES_URL);
  const { window } = dom;
  const { document } = window;
  const membershipData = document.querySelector("#membership-data");

  if (!membershipData) {
    throw new Error("Could not find table element");
  }

  return MyClubhouseMembershipSchema.parse(
    JSON.parse(membershipData.textContent ?? ""),
  );
};

export const scrapeRatesTable = async () => {
  const membershipData = await scrapeMembershipData();

  return membershipData.Groups[0].Memberships;
};
