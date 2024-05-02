import { JSDOM } from "jsdom";
import { z } from "zod";

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

export const CostExclTaxSchema = z.object({
  Value: z.number(),
  Formatted: z.string(),
  FormattedNoSymbol: z.string(),
});

export const TaxSchema = z.object({
  Value: z.number(),
  Formatted: z.string(),
  FormattedNoSymbol: z.string(),
});

export const EarlyPaymentCostExclTaxSchema = z.object({
  Value: z.union([z.number(), z.null()]),
  Formatted: z.union([z.null(), z.string()]),
  FormattedNoSymbol: z.union([z.null(), z.string()]),
});

export const JoiningFeeExclTaxSchema = z.object({
  Value: z.null(),
  Formatted: z.null(),
  FormattedNoSymbol: z.null(),
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

export const CostSchema = z.object({
  ExclTax: CostExclTaxSchema,
  Tax: TaxSchema,
  InclTax: CostExclTaxSchema,
  IsVATRegistered: z.boolean(),
  Formatted: z.string(),
});

export const EarlyPaymentCostSchema = z.object({
  ExclTax: EarlyPaymentCostExclTaxSchema,
  Tax: TaxSchema,
  InclTax: EarlyPaymentCostExclTaxSchema,
  IsVATRegistered: z.boolean(),
  Formatted: z.string(),
});
export const JoiningFeeSchema = z.object({
  ExclTax: JoiningFeeExclTaxSchema,
  Tax: TaxSchema,
  InclTax: JoiningFeeExclTaxSchema,
  IsVATRegistered: z.boolean(),
  Formatted: z.string(),
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

export const MembershipSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Description: z.string(),
  DescriptionWithValidity: z.string(),
  Category: CategorySchema,
  IsLinked: z.boolean(),
  LinkedCategories: z.array(RoleWhenActiveSchema),
  CanAutoAccept: z.boolean(),
  AdvertiseFromDate: z.null(),
  ValidFromDate: z.union([z.null(), z.string()]),
  ValidUntilDate: z.null(),
  ValidRangeDescription: z.union([z.null(), z.string()]),
  HasJoiningFee: z.boolean(),
  HasEarlyPaymentOption: z.boolean(),
  EarlyPaymentCost: EarlyPaymentCostSchema,
  EarlyPaymentDeadlineDays: z.union([z.number(), z.null()]),
  EarlyPaymentDeadlineDaysAbs: z.union([z.number(), z.null()]),
  EarlyPaymentOnRenewalsOnly: z.boolean(),
  JoiningFee: JoiningFeeSchema,
  Cost: CostSchema,
  RateCalc: RateCalcSchema,
  DurationDescription: z.string(),
  IsSubscriptionEligibleForGiftAid: z.boolean(),
  IsJoiningFeeEligibleForGiftAid: z.boolean(),
  TokenReward: z.number(),
  TokenExpiry: z.null(),
});

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
    JSON.parse(membershipData.textContent || ""),
  );
};

export const scrapeRatesTable = async () => {
  const membershipData = await scrapeMembershipData();

  console.log(membershipData.Groups[0].Memberships);

  return membershipData.Groups[0].Memberships;
};
