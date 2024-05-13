import { SRCEvent } from "@sudburyrc/api";

type IcalEvent = {
  BEGIN: "VEVENT";
  UID: string;
  DTSTAMP: string;
  DTSTART: string;
  SUMMARY: string;
  DESCRIPTION: string;
  LOCATION: string;
  URL: string;
  STATUS: string;
  END: "VEVENT";
};

type IcalDocument = {
  BEGIN: "VCALENDAR";
  VERSION: "2.0";
  PRODID: string;
  X_WR_CALNAME: string;
  X_WR_TIMEZONE: string;
  X_WR_CALDESC: string;
  END: "VCALENDAR";
};

export default class IcalBuilder {
  private static readonly DEFAULT_DOCUMENT: IcalDocument & {
    eventSlot: number;
  } = {
    BEGIN: "VCALENDAR",
    VERSION: "2.0",
    PRODID: "",
    X_WR_CALNAME: "",
    X_WR_TIMEZONE: "",
    X_WR_CALDESC: "",
    eventSlot: 0,
    END: "VCALENDAR",
  };

  private static readonly SEPARATOR = "//";

  private document = IcalBuilder.DEFAULT_DOCUMENT;

  private events: IcalEvent[] = [];

  constructor(name: string, timezone: string, description: string) {
    this.document.PRODID = IcalBuilder._formatId(name);
    this.document.X_WR_CALNAME = name;
    this.document.X_WR_TIMEZONE = timezone;
    this.document.X_WR_CALDESC = description;
  }

  private static _formatProperty(key: string, value: string | number): string {
    return `${key.replace(/_/g, "-")}:${value}`;
  }

  private static _formatDay(date: Date): string {
    const dateString = this._formatDate(date);

    return dateString.split("T")[0];
  }

  private static _formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "");
  }

  private static _formatId(input: string): string {
    const prefix = `-${IcalBuilder.SEPARATOR}`;
    const id = input.replace(/\s/g, IcalBuilder.SEPARATOR);
    const suffix = `${IcalBuilder.SEPARATOR}EN`;

    return `${prefix}${id}${suffix}`;
  }

  private static _stringifyObject(
    object: Record<string, any>,
    events: string,
  ): string {
    return Object.entries(object)
      .map(([key, value]) => {
        if (key === "eventSlot") return events;

        return IcalBuilder._formatProperty(key, value);
      })
      .join("\n");
  }

  addEvent(event: SRCEvent): void {
    this.events.push({
      BEGIN: "VEVENT",
      UID: event.id,
      DTSTAMP: IcalBuilder._formatDate(new Date(event.startDate)),
      DTSTART: IcalBuilder._formatDay(new Date(event.startDate)),
      SUMMARY: event.competition,
      DESCRIPTION: event.notes ?? "",
      LOCATION: event.region,
      URL: event.url ?? "",
      STATUS: event.notes?.toLowerCase().includes("cancelled")
        ? "CANCELLED"
        : "CONFIRMED",
      END: "VEVENT",
    });
  }

  set(SRCEvents: SRCEvent[]): void {
    SRCEvents.map((event) => this.addEvent(event));
  }

  stringify(): string {
    return IcalBuilder._stringifyObject(this.document, this.stringifyEvents());
  }

  private stringifyEvents(): string {
    return this.events
      .map((event) => IcalBuilder._stringifyObject(event, ""))
      .join("\n")
      .concat("\n");
  }
}
