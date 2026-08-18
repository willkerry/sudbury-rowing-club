# Hourly forecast from MET Norway

**Date:** 2026-08-18
**Status:** Approved, awaiting implementation plan

## Problem

The `/safety` page shows a seven-day forecast built from Open-Meteo daily
aggregates: one row of seven columns, each with a WMO condition word, a
min–max temperature range and a Beaufort force. Daily aggregates are the wrong
resolution for rowers. A day whose maximum is force 5 may be flat calm at 6am
and unrowable by noon, and the current UI cannot express that.

MET Norway's Locationforecast 2.0 returns hourly data for the same location.
This document specifies replacing the data source and the UI.

## What the API actually returns

Measured against `locationforecast/2.0/complete` at the club location on
2026-08-18. Numbers below describe that response and are representative rather
than guaranteed.

- 88 timeseries entries spanning roughly 9.5 days.
- Hourly resolution for approximately the first 60 hours, then 6-hourly.
- Per entry, `data.instant.details` carries air temperature, wind speed in m/s,
  wind bearing in degrees, cloud area fraction, fog area fraction, dew point,
  relative humidity, pressure and UV index.
- `data.next_1_hours` and `data.next_6_hours` each carry a `summary.symbol_code`
  such as `partlycloudy_day`, plus `details.precipitation_amount`.
  `next_6_hours` additionally carries `air_temperature_max` and
  `air_temperature_min`.

### Fields that are absent at this location

`wind_speed_of_gust`, `probability_of_precipitation` and
`probability_of_thunder` appear in MET's published schema but are produced only
by their Nordic high-resolution model. At Sudbury they are absent. This is
accepted: the current Open-Meteo implementation does not surface gusts either,
so nothing is lost relative to today.

### Terms of service obligations

Taken from https://api.met.no/doc/TermsOfService.

1. **Identification.** Every request must carry a `User-Agent` naming the
   application or domain plus contact details. We will send
   `sudburyrowingclub.org.uk webmaster@sudburyrowingclub.org.uk`, which matches
   MET's own documented example format.
2. **Coordinate precision.** Requests with five or more decimal places receive
   `403 Forbidden`. `CLUB_LOCATION` is currently `52.033997, 0.727634` — six
   decimals — so coordinates must be truncated to `52.034, 0.7276` before being
   placed in the query string.
3. **Caching.** Responses must be cached. Clients must send `If-Modified-Since`
   with the exact previous `Last-Modified` value, and must not re-request before
   the `Expires` time.
4. **Attribution.** CC BY 4.0 requires visible credit with a link to the
   licence.
5. **Rate limit.** 20 requests per second, which our caching keeps us far below.

## Retirement

| Artefact | Fate |
| --- | --- |
| `packages/api/src/queries/fetch-forecast.ts` | Deleted, including the 28-literal `ZWeatherCode` union and `ForecastResponse` |
| `ForecastResponse`, `WeatherCodeNumber`, `fetchWeatherForecast` exports in `packages/api/src/index.ts` | Removed |
| `apps/web/lib/get-weather-forecast.ts` | Deleted, including both WMO code→string maps and `getMetOfficeURL` |
| `apps/web/components/icons/weather-icons.tsx` | Deleted. Already unreferenced |
| `react-icons` in `apps/web/package.json` | Removed. `weather-icons.tsx` was its only consumer |

Retained unchanged:

- `lib/helpers/convertBearingToCardinal.ts` and its tests. Still needed for wind
  direction.
- `lib/helpers/convertKphToBeaufort.ts` and its tests. MET reports m/s; callers
  multiply by 3.6 and reuse this helper rather than introducing a second
  Beaufort table.

## Package: `@sudburyrc/weathericons`

MET publish their icon set at `github.com/metno/weathericons` under MIT: 83 SVGs
in a flat `weather/svg/` directory, named to match `symbol_code` exactly,
including `_day`, `_night` and `_polartwilight` variants. `weather/legend.csv`
maps each base symbol to English descriptions.

A new workspace package follows the `@sudburyrc/blue` shape — tsdown build,
`dist/index.mjs` main, `dist/index.d.mts` types, React 19 peer dependency,
`@sudburyrc/tsconfig`.

```
packages/weathericons/
  vendor/            git submodule → metno/weathericons
  scripts/generate.ts
  src/generated/     generated, gitignored
  src/weather-icon.tsx
  src/index.ts
  svgr.config.mjs
```

Generation runs `@svgr/cli` 8.1 over `vendor/weather/svg/*.svg`, then emits a
barrel, a `SymbolCode → ComponentType` lookup, and a `symbolDescriptions` record
parsed from `legend.csv`.

### Build integration

Generation is never invoked by hand. It is a Turbo task that other tasks depend
on, so a plain `pnpm build`, `pnpm dev` or `pnpm type-check` always produces
current icons.

A `generate` task is added to `turbo.json` with `outputs: ["src/generated/**"]`.
Within this package, `build` and `type-check` both declare
`dependsOn: ["generate"]`. Packages with no `generate` script are unaffected.

The dependency matters because `src/generated/` is gitignored. Turbo currently
caches only `dist/**`; were generation merely chained inside the `build` script,
a build cache hit would restore `dist/` while leaving `src/generated/` empty,
and `type-check` — which has no `dependsOn` and reads source — would then fail on
a clean checkout. Making `generate` a first-class cached task with its own
outputs removes that failure mode.

Turbo's default inputs cover the tracked submodule pointer, so bumping the
submodule changes the hash and correctly invalidates the `generate` cache.

`legend.csv` is keyed by *base* symbol — `clearsky`, `fair`, `partlycloudy` —
without the `_day`, `_night` or `_polartwilight` suffix. The description lookup
therefore strips the variant suffix before matching, so `partlycloudy_night`
resolves to "Partly cloudy".

### The ID collision, and why `prefixIds` is mandatory

These SVGs are not self-contained. They define internal `<symbol>`, `<mask>` and
gradient elements with fixed identifiers and reference them via
`xlink:href="#cloud"` and `fill="url(#sun-glow-grad)"`. Those identifiers repeat
across files: `id="cloud"` appears in 80 of the 83 icons, `id="cloud_3_18_1_1_5"`
in 57, `id="snowflake"` and `id="raindrop"` in 48 each, `id="sun"`,
`id="sun-inner-grad"` and `id="sun-glow-grad"` in 42 each.

Inlined into one document, every such reference resolves to the first matching
element in the DOM. A single icon on screen looks correct; a strip of 24 renders
wrong. The SVGR configuration must therefore enable SVGO with the `prefixIds`
plugin so each icon's identifiers are namespaced. This is a correctness
requirement, not an optimisation.

### The `WeatherIcon` component

The package's public surface for rendering is a single component, so consumers
never touch the lookup or the generated modules:

```tsx
<WeatherIcon symbol={slot.symbol} className="size-6" />
```

It resolves `symbol` through the generated lookup, applies
`symbolDescriptions` as the accessible name, and forwards `className` and other
SVG props. An unrecognised symbol renders nothing rather than throwing, so a
symbol MET adds upstream degrades to a gap rather than a crashed page.

This keeps `forecast.tsx` free of any icon mapping and means changes to the icon
set never touch the web app.

### Bundle weight, and why the lookup is eager

The component resolves icons through a static lookup rather than dynamic
`import()`. Measured on the vendored files:

| | Gzipped | Extra requests |
| --- | --- | --- |
| 8 typical icons as separate lazy chunks | 9,201 B | 8 |
| The same 8 in one chunk | 1,978 B | 0 |
| All 83 in one chunk | 6,103 B | 0 |

Eagerly shipping the entire set costs less than lazily loading eight of them.
Eighty of the 83 files embed the same base64 PNG cloud texture: inside one chunk
gzip deduplicates it to almost nothing, but split across chunks each carries its
own copy. Code splitting here would also introduce a request waterfall and icons
appearing after paint, in a strip that renders up to 24 at once.

Lazy loading would be the right instinct for a heavier icon set. For this one
the measurement inverts it, so the lookup stays eager and the component stays
synchronous.

### Submodule consequences

Fresh clones and CI checkouts need `--recurse-submodules`. Vercel clones public
HTTPS submodules automatically. The `README` and any contributor docs must say
so, because the failure mode — an empty `vendor/` and a codegen step that emits
an empty barrel — is confusing.

`SymbolCode` is derived from the vendored filenames rather than hand-written, so
a symbol MET adds upstream surfaces as a type error at the lookup rather than a
blank square at runtime.

## Data layer

### Fetching

`packages/api/src/queries/fetch-locationforecast.ts` replaces the Open-Meteo
query. It owns the User-Agent, the 4-decimal coordinate truncation, and
conditional-request handling. It returns the parsed body together with the
`Last-Modified` and `Expires` header values, because the caching layer above it
needs both.

On a `304 Not Modified` it signals that the caller should reuse its cached
value rather than returning a body.

### Caching

`safety.forecast` in `apps/web/lib/trpc/routers/safety.ts` keeps its current
shape — a `rateLimitedProcedure` wrapping `cached` — with two changes:

- The flat `ttl: 60 * 60 * 12` is replaced by a TTL derived from the `Expires`
  header, floored at 10 minutes and capped at 1 hour. In practice MET returns an
  `Expires` roughly 30 minutes ahead.
- The cache entry stores the `Last-Modified` value alongside the parsed days, so
  revalidation can send `If-Modified-Since` and treat a 304 as a cheap refresh
  of the existing entry.

The existing Vercel KV adapter in `lib/server/cached.ts` is unchanged.

### Shape returned to the client

The procedure returns days, not raw timeseries.

```ts
type ForecastSlot = {
  time: Date;
  span: 1 | 6;
  symbol: SymbolCode;
  temperature: number;
  precipitation: number;
  wind: { beaufort: number; direction: CardinalDirection };
  fog: number;
};

type ForecastDay = { date: string; slots: ForecastSlot[] };
```

`temperature` is the instant air temperature in whole °C. `precipitation` is
millimetres over the slot's span, taken from `next_1_hours` or `next_6_hours` as
appropriate. `fog` is `fog_area_fraction` as a percentage. `date` is an
ISO `YYYY-MM-DD` date in Europe/London.

`span` carries the resolution of each slot. This is the mechanism by which the
coarse days degrade gracefully: the third day is genuinely mixed, hourly until
roughly 07:00 and 6-hourly thereafter, so the UI renders slots at width
proportional to `span` and needs no separate code path for coarse days.

### Timezone

MET returns UTC instants. Grouping into days uses `Intl.DateTimeFormat` pinned
to `Europe/London`. Under British Summer Time the 23:00 local slot falls on the
following UTC date, so grouping on the raw ISO string would misfile an hour
every summer evening. Hour labels are likewise formatted in Europe/London rather
than the browser's zone, since the forecast describes a fixed physical location.

## User interface

The forecast becomes its own card on `/safety`, below the river status card and
outside the page's `max-w-prose` constraint. `app/safety/(landing)/layout.tsx`
currently wraps everything in a single `max-w-prose` container; the forecast
card needs to sit outside it while the status card and prose content stay
within.

```
┌────────────────────────────────────────────────────────────┐
│ FORECAST                                                   │
├────────────────────────────────────────────────────────────┤
│  Today   Wed   Thu   Fri   SAT   SUN   Mon   Tue   Wed  ›  │
├────────────────────────────────────────────────────────────┤
│   18    19    20    21    22    23    00    01    02   →   │
│   ☁     ☁     ☁     ◑     ●     ●     ●     ●     ●        │
│  22°   21°   19°   18°   17°   17°   16°   16°   15°       │
│  0.1    ·     ·     ·     ·    0.2   0.4    ·     ·        │
│  3↖   3↖   2↖   2←   2←   1←   1←   1↙   2↙      │
└────────────────────────────────────────────────────────────┘
  Forecast data from MET Norway (CC BY 4.0). Icons by Yr (MIT).
```

Rows, top to bottom: hour, condition icon, temperature, precipitation in mm,
Beaufort force with a direction arrow.

### Day tabs

Every available day is offered, roughly nine. Saturday and Sunday are visually
emphasised, since weekend outings are the common planning case.

No tab primitive exists in `components/ui`, so one is installed with
`pnpm dlx shadcn@latest add tabs`. `apps/web/components.json` is already
configured (default style, `gray` base colour, `cssVariables: false`), so the
component lands at `components/ui/tabs.tsx` and picks up the existing `cn`
utility.

Two mandatory follow-ups after installing, matching every other file in
`components/ui`:

- **Strip all `dark:` classes.** The site is light-mode only and no existing
  `components/ui` file carries them.
- **Remove shadcn's opinionated tight tracking.** No existing `components/ui`
  file sets `tracking-*`; the default typography is left to do its job.

The tab list is horizontally scrollable, since nine days will not fit at narrow
widths.

### Default day and scroll position

The selected day defaults to today, except after 20:00 Europe/London when it
defaults to tomorrow. The motivating case is that at 21:00 nobody is planning to
row at 23:00; they are planning the morning.

On today, the strip scrolls to the current hour on mount. All 24 hours remain
reachable by scrolling — no hours are hidden.

### Warning markers

The existing red `TriangleAlertIcon` treatment is retained but applied per slot
rather than per day:

- Beaufort force ≥ 6
- Temperature > 30 °C or < 4 °C
- `fog_area_fraction` ≥ 40%

Fog is included because it is a genuine hazard on the river and MET provides it
hourly. It renders only as a marker, not as its own always-visible row.

### Coarse slots

Slots with `span: 6` are labelled with their local start time and occupy six
times the width of an hourly slot. The change in resolution therefore reads
visually and needs no explanatory text.

### Outbound links

Per-slot and per-day outbound links are dropped; `getMetOfficeURL` goes with
them. The existing card footer links to EA Floods and Met Office warnings are
untouched.

### Attribution

A muted line beneath the forecast card credits both licences:

> Forecast data from MET Norway, licensed CC BY 4.0. Weather icons by Yr, MIT.

with links to met.no, the CC BY 4.0 deed, and the icons repository.

## Testing

Vitest, consistent with the rest of the repository. A real API response is
captured as a fixture so parsing and grouping are tested against actual data
rather than a hand-written approximation.

- Zod parse of the fixture succeeds. `next_1_hours` and `next_6_hours` are both
  optional in the schema: entries beyond the hourly window legitimately lack the
  former, and the final entry lacks both. A slot with neither is discarded
  rather than throwing.
- Grouping assigns slots to the correct Europe/London day across a BST midnight.
- A day containing both 1-hour and 6-hour slots produces one `ForecastDay` with
  mixed `span` values in chronological order.
- `Expires` header maps to a TTL, with the 10-minute floor and 1-hour cap
  applied at the boundaries.
- Default day selection returns today at 19:59 and tomorrow at 20:01, evaluated
  in Europe/London.
- m/s to Beaufort conversion agrees with the existing `convertKphToBeaufort`
  boundaries.
- Coordinates in the request URL carry at most four decimal places.

`@sudburyrc/weathericons` is tested separately:

- Every `symbol_code` in the fixture resolves to a component.
- Two icons rendered into one document share no element identifiers, which is
  the regression test for the `prefixIds` requirement above.
- `WeatherIcon` renders nothing for an unrecognised symbol rather than throwing.
- `WeatherIcon` exposes the `legend.csv` description as its accessible name,
  including for a `_night` variant, which covers the suffix-stripping lookup.

## Out of scope

- Wind gusts and precipitation probability, unavailable at this location.
- Sunrise and sunset times, which would need MET's separate Sunrise API.
- Any change to `safety.status`, `get-safety-status.ts` or the flood data.
