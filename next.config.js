const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/results",
        destination: "/regatta/results",
        permanent: true,
      },
      {
        source: "/results/:id*",
        destination: "https://results.sudburyrowingclub.org.uk/:id*",
        permanent: true,
      },
      {
        source: "/how-to-contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/safety-notices",
        destination: "/safety",
        permanent: true,
      },
      {
        source: "/history",
        destination: "/about/history",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      {
        source: "/course",
        destination: "/regatta/course",
        permanent: true,
      },
      {
        source: "/contact/:slug((?!how-to-find-us$).*)",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about/club-officers",
        destination: "/governance",
        permanent: true,
      },
      {
        source: "/praise",
        destination: "/regatta#feedback",
        permanent: true,
      },
      {
        source: "/club-kit",
        destination: "/members/kit",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/author/:slug",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/news/page/:slug",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/governance/club-constitution",
        destination: "/governance/constitution",
        permanent: true,
      },
      {
        source: "/regatta/find-the-regatta",
        destination: "/contact/how-to-find-us",
        permanent: true,
      },

      // Redirects for old news permalinks
      // Do not manually edit below this point
      {
        source: "/bedford-star-head-is-srcs-first-race-of-the-year",
        destination: "/news/bedford-star-head-is-srcs-first-race-of-the-year",
        permanent: true,
      },
      {
        source: "/fours-head-of-the-river-race-2021",
        destination: "/news/fours-head-of-the-river-race-2021",
        permanent: true,
      },
      {
        source: "/henley-sculls-head-race-2021",
        destination: "/news/henley-sculls-head-race-2021",
        permanent: true,
      },
      {
        source: "/norfolk-sculls-head",
        destination: "/news/norfolk-sculls-head",
        permanent: true,
      },
      {
        source: "/scullers-head-of-the-river-race",
        destination: "/news/scullers-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/season-race-report-2021",
        destination: "/news/season-race-report-2021",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-2021",
        destination: "/news/sudbury-regatta-2021",
        permanent: true,
      },
      {
        source: "/bob-howard-1935-2020",
        destination: "/news/bob-howard-1935-2020",
        permanent: true,
      },
      {
        source: "/2020-06-23-return-to-rowing",
        destination: "/news/2020-06-23-return-to-rowing",
        permanent: true,
      },
      {
        source: "/the-hungary-caterpillars",
        destination: "/news/the-hungary-caterpillars",
        permanent: true,
      },
      {
        source: "/here-and-there",
        destination: "/news/here-and-there",
        permanent: true,
      },
      {
        source: "/gt-ouse-marathon",
        destination: "/news/gt-ouse-marathon",
        permanent: true,
      },
      {
        source: "/portugal-rowing-tour",
        destination: "/news/portugal-rowing-tour",
        permanent: true,
      },
      {
        source: "/world-rowing-tour-2019",
        destination: "/news/world-rowing-tour-2019",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-2019",
        destination: "/news/sudbury-regatta-2019",
        permanent: true,
      },
      {
        source: "/br-junior-champs",
        destination: "/news/br-junior-champs",
        permanent: true,
      },
      { source: "/thank-you", destination: "/news/thank-you", permanent: true },
      {
        source: "/pcrc-junior-champs",
        destination: "/news/pcrc-junior-champs",
        permanent: true,
      },
      {
        source: "/hwr-st-ives-regatta",
        destination: "/news/hwr-st-ives-regatta",
        permanent: true,
      },
      {
        source: "/ips-src-at-hrr",
        destination: "/news/ips-src-at-hrr",
        permanent: true,
      },
      {
        source: "/peterborough-regatta",
        destination: "/news/peterborough-regatta",
        permanent: true,
      },
      {
        source: "/juniors-impress-at-the-national-schools-regatta",
        destination: "/news/juniors-impress-at-the-national-schools-regatta",
        permanent: true,
      },
      {
        source: "/lock-lintel-article",
        destination: "/news/lock-lintel-article",
        permanent: true,
      },
      {
        source: "/an-account-of-unforeseen-rowing-pleasure",
        destination: "/news/an-account-of-unforeseen-rowing-pleasure",
        permanent: true,
      },
      {
        source: "/ball-cup-south",
        destination: "/news/ball-cup-south",
        permanent: true,
      },
      {
        source: "/nottingham-masters",
        destination: "/news/nottingham-masters",
        permanent: true,
      },
      {
        source: "/sudbury-success-at-dorney-lake",
        destination: "/news/sudbury-success-at-dorney-lake",
        permanent: true,
      },
      {
        source: "/bedford-small-boats-head-2",
        destination: "/news/bedford-small-boats-head-2",
        permanent: true,
      },
      {
        source: "/good-friday-opening-2",
        destination: "/news/good-friday-opening-2",
        permanent: true,
      },
      {
        source: "/vets-head-of-the-river-race",
        destination: "/news/vets-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/norwich-head-and-head-of-the-east",
        destination: "/news/norwich-head-and-head-of-the-east",
        permanent: true,
      },
      {
        source: "/star-new-year-head-2",
        destination: "/news/star-new-year-head-2",
        permanent: true,
      },
      {
        source: "/pudding-races-2018",
        destination: "/news/pudding-races-2018",
        permanent: true,
      },
      {
        source: "/rowing-foundation-grant",
        destination: "/news/rowing-foundation-grant",
        permanent: true,
      },
      {
        source: "/ely-small-boats-head",
        destination: "/news/ely-small-boats-head",
        permanent: true,
      },
      {
        source: "/veteran-fours-head",
        destination: "/news/veteran-fours-head",
        permanent: true,
      },
      {
        source: "/norfolk-long-distance-sculls-2",
        destination: "/news/norfolk-long-distance-sculls-2",
        permanent: true,
      },
      {
        source: "/just-because",
        destination: "/news/just-because",
        permanent: true,
      },
      { source: "/2589", destination: "/news/2589", permanent: true },
      {
        source: "/sudbury-rowers-set-record-and-win-at-ely",
        destination: "/news/sudbury-rowers-set-record-and-win-at-ely",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-2018",
        destination: "/news/sudbury-regatta-2018",
        permanent: true,
      },
      {
        source: "/st-neots-2018",
        destination: "/news/st-neots-2018",
        permanent: true,
      },
      {
        source: "/national-rowing-junior-championships",
        destination: "/news/national-rowing-junior-championships",
        permanent: true,
      },
      {
        source: "/st-ives-and-henley-womens",
        destination: "/news/st-ives-and-henley-womens",
        permanent: true,
      },
      {
        source: "/national-masters",
        destination: "/news/national-masters",
        permanent: true,
      },
      {
        source: "/captains-update-9",
        destination: "/news/captains-update-9",
        permanent: true,
      },
      {
        source: "/peterborough-spring-and-national-schools",
        destination: "/news/peterborough-spring-and-national-schools",
        permanent: true,
      },
      {
        source: "/nottingham-city-regatta",
        destination: "/news/nottingham-city-regatta",
        permanent: true,
      },
      {
        source: "/ball-cup-2018",
        destination: "/news/ball-cup-2018",
        permanent: true,
      },
      {
        source: "/sudbury-go-to-henley",
        destination: "/news/sudbury-go-to-henley",
        permanent: true,
      },
      {
        source: "/junior-inter-regional-regatta-2",
        destination: "/news/junior-inter-regional-regatta-2",
        permanent: true,
      },
      {
        source: "/good-friday-news",
        destination: "/news/good-friday-news",
        permanent: true,
      },
      {
        source: "/veterans-head-of-the-river-race",
        destination: "/news/veterans-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/schools-head-2018",
        destination: "/news/schools-head-2018",
        permanent: true,
      },
      {
        source: "/norwich-head",
        destination: "/news/norwich-head",
        permanent: true,
      },
      {
        source: "/it-aint-all-bad",
        destination: "/news/it-aint-all-bad",
        permanent: true,
      },
      {
        source: "/star-new-year-head",
        destination: "/news/star-new-year-head",
        permanent: true,
      },
      {
        source: "/pudding-races-3",
        destination: "/news/pudding-races-3",
        permanent: true,
      },
      {
        source: "/the-scullers-head",
        destination: "/news/the-scullers-head",
        permanent: true,
      },
      {
        source: "/cambridge-winter-head-2",
        destination: "/news/cambridge-winter-head-2",
        permanent: true,
      },
      {
        source: "/pudding-races-2",
        destination: "/news/pudding-races-2",
        permanent: true,
      },
      {
        source: "/heads-we-win",
        destination: "/news/heads-we-win",
        permanent: true,
      },
      {
        source: "/pairs-head-of-the-river-race",
        destination: "/news/pairs-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/src-on-tour",
        destination: "/news/src-on-tour",
        permanent: true,
      },
      {
        source: "/annual-dinner-and-other-stories",
        destination: "/news/annual-dinner-and-other-stories",
        permanent: true,
      },
      {
        source: "/slipway-refurbishment",
        destination: "/news/slipway-refurbishment",
        permanent: true,
      },
      {
        source: "/team-building-day",
        destination: "/news/team-building-day",
        permanent: true,
      },
      {
        source: "/end-of-season-race-report",
        destination: "/news/end-of-season-race-report",
        permanent: true,
      },
      {
        source: "/great-ouse-marathon",
        destination: "/news/great-ouse-marathon",
        permanent: true,
      },
      {
        source: "/project-slipway",
        destination: "/news/project-slipway",
        permanent: true,
      },
      {
        source: "/st-neots-regatta-2",
        destination: "/news/st-neots-regatta-2",
        permanent: true,
      },
      {
        source: "/st-ives-regatta-2",
        destination: "/news/st-ives-regatta-2",
        permanent: true,
      },
      {
        source: "/peterborough-spring-regatta",
        destination: "/news/peterborough-spring-regatta",
        permanent: true,
      },
      {
        source: "/ball-cup-and-other-events",
        destination: "/news/ball-cup-and-other-events",
        permanent: true,
      },
      {
        source: "/success-for-our-adaptive-rowers",
        destination: "/news/success-for-our-adaptive-rowers",
        permanent: true,
      },
      {
        source: "/bedford-small-boats-head",
        destination: "/news/bedford-small-boats-head",
        permanent: true,
      },
      {
        source: "/masters-head-of-the-river-race",
        destination: "/news/masters-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/schools-head-of-the-river-race",
        destination: "/news/schools-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/womens-head-of-the-river-race",
        destination: "/news/womens-head-of-the-river-race",
        permanent: true,
      },
      {
        source: "/bedford-head",
        destination: "/news/bedford-head",
        permanent: true,
      },
      {
        source: "/bedford-eights-fours-head",
        destination: "/news/bedford-eights-fours-head",
        permanent: true,
      },
      {
        source: "/9-captains-rowing",
        destination: "/news/9-captains-rowing",
        permanent: true,
      },
      {
        source: "/british-indoor-rowing-championships",
        destination: "/news/british-indoor-rowing-championships",
        permanent: true,
      },
      {
        source: "/cambridge-winter-head",
        destination: "/news/cambridge-winter-head",
        permanent: true,
      },
      {
        source: "/trouble-at-tmill",
        destination: "/news/trouble-at-tmill",
        permanent: true,
      },
      {
        source: "/norwich-long-distance-sculls-2016",
        destination: "/news/norwich-long-distance-sculls-2016",
        permanent: true,
      },
      {
        source: "/end-year-report",
        destination: "/news/end-year-report",
        permanent: true,
      },
      {
        source: "/bedford-head-2016",
        destination: "/news/bedford-head-2016",
        permanent: true,
      },
      {
        source: "/rowing-foundation-grant-junior-sculling-blades",
        destination: "/news/rowing-foundation-grant-junior-sculling-blades",
        permanent: true,
      },
      {
        source: "/src-at-the-worlds",
        destination: "/news/src-at-the-worlds",
        permanent: true,
      },
      {
        source: "/fun-fenland-2016",
        destination: "/news/fun-fenland-2016",
        permanent: true,
      },
      {
        source: "/peterborough-summer-regatta-2016",
        destination: "/news/peterborough-summer-regatta-2016",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-2016-3",
        destination: "/news/sudbury-regatta-2016-3",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-2016-2",
        destination: "/news/sudbury-regatta-2016-2",
        permanent: true,
      },
      {
        source: "/sudbury-regatta-6th-august-2016",
        destination: "/news/sudbury-regatta-6th-august-2016",
        permanent: true,
      },
      {
        source: "/st-neots-regatta-2016",
        destination: "/news/st-neots-regatta-2016",
        permanent: true,
      },
      {
        source: "/national-junior-championships-2016",
        destination: "/news/national-junior-championships-2016",
        permanent: true,
      },
      {
        source: "/peterborough-junior-championships",
        destination: "/news/peterborough-junior-championships",
        permanent: true,
      },
      {
        source: "/st-ives-regatta",
        destination: "/news/st-ives-regatta",
        permanent: true,
      },
      {
        source: "/british-rowing-masters-championships-2016",
        destination: "/news/british-rowing-masters-championships-2016",
        permanent: true,
      },
      {
        source: "/rowing-from-the-air",
        destination: "/news/rowing-from-the-air",
        permanent: true,
      },
      {
        source: "/peterborough-spring-regatta-2016",
        destination: "/news/peterborough-spring-regatta-2016",
        permanent: true,
      },
      {
        source: "/ball-cup-2016",
        destination: "/news/ball-cup-2016",
        permanent: true,
      },
      {
        source: "/norwich-head-report-2016",
        destination: "/news/norwich-head-report-2016",
        permanent: true,
      },
      {
        source: "/club-unveils-new-equipment",
        destination: "/news/club-unveils-new-equipment",
        permanent: true,
      },
      {
        source: "/pudding-races-2015",
        destination: "/news/pudding-races-2015",
        permanent: true,
      },
      {
        source: "/head-report-21112015",
        destination: "/news/head-report-21112015",
        permanent: true,
      },
      {
        source: "/norfolk-long-distance-sculls-2015",
        destination: "/news/norfolk-long-distance-sculls-2015",
        permanent: true,
      },
      {
        source: "/src-end-of-year-report-2015",
        destination: "/news/src-end-of-year-report-2015",
        permanent: true,
      },
      {
        source: "/annual-dinner-2",
        destination: "/news/annual-dinner-2",
        permanent: true,
      },
      {
        source: "/captains-update-8",
        destination: "/news/captains-update-8",
        permanent: true,
      },
      {
        source: "/annual-dinner",
        destination: "/news/annual-dinner",
        permanent: true,
      },
      {
        source: "/official-regatta-photos",
        destination: "/news/official-regatta-photos",
        permanent: true,
      },
      {
        source: "/regatta-2014",
        destination: "/news/regatta-2014",
        permanent: true,
      },
      {
        source: "/junior-inter-regional-regatta",
        destination: "/news/junior-inter-regional-regatta",
        permanent: true,
      },
      {
        source: "/good-friday-opening",
        destination: "/news/good-friday-opening",
        permanent: true,
      },
      {
        source: "/horr-vets-head",
        destination: "/news/horr-vets-head",
        permanent: true,
      },
      {
        source: "/alton-water-spring-head",
        destination: "/news/alton-water-spring-head",
        permanent: true,
      },
      {
        source: "/pudding-races-2013",
        destination: "/news/pudding-races-2013",
        permanent: true,
      },
      {
        source: "/captains-update-7",
        destination: "/news/captains-update-7",
        permanent: true,
      },
      {
        source: "/rowtv-footage",
        destination: "/news/rowtv-footage",
        permanent: true,
      },
      {
        source: "/captains-update-6",
        destination: "/news/captains-update-6",
        permanent: true,
      },
      {
        source: "/sudbury-triumphs-in-early-regatta-season",
        destination: "/news/sudbury-triumphs-in-early-regatta-season",
        permanent: true,
      },
      {
        source: "/sudbury-juniors-dominate-olympic-course",
        destination: "/news/sudbury-juniors-dominate-olympic-course",
        permanent: true,
      },
      {
        source: "/captains-update-5",
        destination: "/news/captains-update-5",
        permanent: true,
      },
      {
        source: "/head-to-head",
        destination: "/news/head-to-head",
        permanent: true,
      },
      {
        source: "/lets-get-quizzical",
        destination: "/news/lets-get-quizzical",
        permanent: true,
      },
      {
        source: "/captains-update-4",
        destination: "/news/captains-update-4",
        permanent: true,
      },
      {
        source: "/pudding-races",
        destination: "/news/pudding-races",
        permanent: true,
      },
      {
        source: "/club-awards",
        destination: "/news/club-awards",
        permanent: true,
      },
      {
        source: "/regatta-filming",
        destination: "/news/regatta-filming",
        permanent: true,
      },
      {
        source: "/chairman-regatta-message",
        destination: "/news/chairman-regatta-message",
        permanent: true,
      },
      {
        source: "/sudbury-in-the-press",
        destination: "/news/sudbury-in-the-press",
        permanent: true,
      },
      {
        source: "/captains-update-3",
        destination: "/news/captains-update-3",
        permanent: true,
      },
      {
        source: "/captains-update-2",
        destination: "/news/captains-update-2",
        permanent: true,
      },
      {
        source: "/head-of-the-river",
        destination: "/news/head-of-the-river",
        permanent: true,
      },
      {
        source: "/captains-update",
        destination: "/news/captains-update",
        permanent: true,
      },
      {
        source: "/farewell-ted-deed",
        destination: "/news/farewell-ted-deed",
        permanent: true,
      },
      {
        source: "/head-of-the-river-2010",
        destination: "/news/head-of-the-river-2010",
        permanent: true,
      },
      {
        source: "/lea-regatta",
        destination: "/news/lea-regatta",
        permanent: true,
      },
      {
        source: "/bedford-star-head-22112009",
        destination: "/news/bedford-star-head-22112009",
        permanent: true,
      },
      {
        source: "/norfolk-long-distance-sculls",
        destination: "/news/norfolk-long-distance-sculls",
        permanent: true,
      },
      {
        source: "/bedford-small-boats-head-11th-october-2009",
        destination: "/news/bedford-small-boats-head-11th-october-2009",
        permanent: true,
      },
      {
        source: "/bedford-quarts",
        destination: "/news/bedford-quarts",
        permanent: true,
      },
      {
        source: "/st-neots-regatta-25th26th-june-2009",
        destination: "/news/st-neots-regatta-25th26th-june-2009",
        permanent: true,
      },
      {
        source: "/success-at-bedford-star",
        destination: "/news/success-at-bedford-star",
        permanent: true,
      },
      {
        source: "/inaugural-src-spring-head-to-head",
        destination: "/news/inaugural-src-spring-head-to-head",
        permanent: true,
      },
      {
        source: "/norwich-head-2009",
        destination: "/news/norwich-head-2009",
        permanent: true,
      },
      {
        source: "/swans-on-ice",
        destination: "/news/swans-on-ice",
        permanent: true,
      },
      {
        source: "/weather-impacts-play",
        destination: "/news/weather-impacts-play",
        permanent: true,
      },
      {
        source: "/what-the-hell-is-she-thinking",
        destination: "/news/what-the-hell-is-she-thinking",
        permanent: true,
      },
      {
        source: "/womens-quad-takes-the-thames",
        destination: "/news/womens-quad-takes-the-thames",
        permanent: true,
      },
      {
        source: "/heroic-efforts-from-sudburys-veteran-four",
        destination: "/news/heroic-efforts-from-sudburys-veteran-four",
        permanent: true,
      },
      {
        source: "/sunday-sessions",
        destination: "/news/sunday-sessions",
        permanent: true,
      },
      {
        source: "/learn-to-row-autumn-2008",
        destination: "/news/learn-to-row-autumn-2008",
        permanent: true,
      },
      {
        source: "/annual-dinner-2008",
        destination: "/news/annual-dinner-2008",
        permanent: true,
      },
      {
        source: "/200809-src-committee",
        destination: "/news/200809-src-committee",
        permanent: true,
      },
      {
        source: "/src-awarded-grant",
        destination: "/news/src-awarded-grant",
        permanent: true,
      },
      {
        source: "/sudbury-competes-at-the-head-of-the-river-fours",
        destination: "/news/sudbury-competes-at-the-head-of-the-river-fours",
        permanent: true,
      },
      {
        source: "/head-of-the-river-fours-2006",
        destination: "/news/head-of-the-river-fours-2006",
        permanent: true,
      },
      {
        source: "/peterborough-summer-regatta",
        destination: "/news/peterborough-summer-regatta",
        permanent: true,
      },
      {
        source: "/the-best-little-regatta-in-the-world",
        destination: "/news/the-best-little-regatta-in-the-world",
        permanent: true,
      },
      { source: "/st-neots", destination: "/news/st-neots", permanent: true },
      {
        source: "/jenny-spencer-wins-national-championships",
        destination: "/news/jenny-spencer-wins-national-championships",
        permanent: true,
      },
      {
        source: "/big-pots-from-bedford-quarts-regatta",
        destination: "/news/big-pots-from-bedford-quarts-regatta",
        permanent: true,
      },
      {
        source: "/richmond-regatta-late-victory-is-highlight-of-sunny-day",
        destination:
          "/news/richmond-regatta-late-victory-is-highlight-of-sunny-day",
        permanent: true,
      },
      {
        source: "/peterborough-spring-regatta-more-success-for-src",
        destination: "/news/peterborough-spring-regatta-more-success-for-src",
        permanent: true,
      },
      {
        source: "/playing-with-the-big-boys-at-bedford-amateur-regatta",
        destination:
          "/news/playing-with-the-big-boys-at-bedford-amateur-regatta",
        permanent: true,
      },
      {
        source: "/sudbury-triumphant-in-distant-leicester",
        destination: "/news/sudbury-triumphant-in-distant-leicester",
        permanent: true,
      },
      {
        source: "/mixed-fortunes-at-lea-spring-regatta",
        destination: "/news/mixed-fortunes-at-lea-spring-regatta",
        permanent: true,
      },
      {
        source: "/tideway-eights-vets-head-great-success-and-a-grand-day-out",
        destination:
          "/news/tideway-eights-vets-head-great-success-and-a-grand-day-out",
        permanent: true,
      },
      {
        source: "/cambridge-winter-league",
        destination: "/news/cambridge-winter-league",
        permanent: true,
      },
      {
        source: "/maidstone-small-boats-head",
        destination: "/news/maidstone-small-boats-head",
        permanent: true,
      },
      {
        source: "/kenneth-j-mills",
        destination: "/news/kenneth-j-mills",
        permanent: true,
      },
      {
        source: "/members-in-the-news-at-henley-royal-regatta",
        destination: "/news/members-in-the-news-at-henley-royal-regatta",
        permanent: true,
      },
      { source: "/new-boats", destination: "/news/new-boats", permanent: true },
      {
        source: "/horr-vhorr-2004",
        destination: "/news/horr-vhorr-2004",
        permanent: true,
      },
      {
        source: "/sudbury-upper-school-2004",
        destination: "/news/sudbury-upper-school-2004",
        permanent: true,
      },
      {
        source: "/norwich-head-2004",
        destination: "/news/norwich-head-2004",
        permanent: true,
      },
      {
        source: "/successful-weekend-at-st-neots-regatta",
        destination: "/news/successful-weekend-at-st-neots-regatta",
        permanent: true,
      },
      {
        source: "/bedford-quarts-regatta",
        destination: "/news/bedford-quarts-regatta",
        permanent: true,
      },
      {
        source: "/henley-royal-regatta-qualifiers",
        destination: "/news/henley-royal-regatta-qualifiers",
        permanent: true,
      },
      {
        source: "/henley-womens-regatta",
        destination: "/news/henley-womens-regatta",
        permanent: true,
      },
      {
        source: "/reading-amateur-regatta",
        destination: "/news/reading-amateur-regatta",
        permanent: true,
      },
      {
        source: "/veterans-head-of-the-river-race-2003",
        destination: "/news/veterans-head-of-the-river-race-2003",
        permanent: true,
      },
      {
        source: "/head-of-the-river-race-2003",
        destination: "/news/head-of-the-river-race-2003",
        permanent: true,
      },
      {
        source: "/womens-eights-head-15th-march",
        destination: "/news/womens-eights-head-15th-march",
        permanent: true,
      },
      {
        source: "/some-new-equipment",
        destination: "/news/some-new-equipment",
        permanent: true,
      },
      {
        source: "/tc_henleyhd03",
        destination: "/news/tc_henleyhd03",
        permanent: true,
      },
      {
        source: "/maidstone_sbh02",
        destination: "/news/maidstone_sbh02",
        permanent: true,
      },
      {
        source: "/antony-moule-coaches-2002-award",
        destination: "/news/antony-moule-coaches-2002-award",
        permanent: true,
      },
      {
        source: "/maidstone-small-boats-head-2",
        destination: "/news/maidstone-small-boats-head-2",
        permanent: true,
      },
      {
        source: "/wallingford-head-2002",
        destination: "/news/wallingford-head-2002",
        permanent: true,
      },
      {
        source: "/time-trials",
        destination: "/news/time-trials",
        permanent: true,
      },
      { source: "/hrr2002", destination: "/news/hrr2002", permanent: true },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
