// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

import news from "./news";
import officers from "./officers";
import richText from "./richText";
import figure from "./figure";
import committees from "./committees";
import vicePresidents from "./vicePresidents";
import trustees from "./trustees";
import safety from "./safety";
import regattas from "./regattas";
import members from "./members";
import authors from "./author";
import safetyStatus from "./safety-status";
import regattaSettings from "./regattaSettings";
import quote from "./quote";
import note from "./note";
import minutes from "./minutes";
import siteSettings from "./siteSettings";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    news,
    officers,
    richText,
    figure,
    quote,
    committees,
    minutes,
    vicePresidents,
    trustees,
    safety,
    regattas,
    members,
    authors,
    siteSettings,
    safetyStatus,
    regattaSettings,
    note,
  ]),
});
