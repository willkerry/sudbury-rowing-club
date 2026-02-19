import { dashboardTool } from "@sanity/dashboard";
import { UsersIcon } from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { table } from "@sanity/table";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";
import schemas from "./schemas/schema";

const config = defineConfig({
  dataset: "production",
  projectId: "gvxge7ps",
  title: "Sudbury Rowing Club",
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("News")
              .child(
                S.list()
                  .title("News")
                  .items([
                    S.listItem()
                      .title("News")
                      .child(S.documentTypeList("news").title("News")),
                    S.listItem()
                      .title("Member’s notices")
                      .child(
                        S.documentTypeList("members").title("Member’s notices"),
                      ),
                    S.listItem()
                      .title("Authors")
                      .child(S.documentTypeList("author").title("Authors")),
                  ]),
              ),

            S.listItem()
              .title("Governance")
              .child(
                S.list()
                  .title("Governance")
                  .items([
                    orderableDocumentListDeskItem({
                      icon: UsersIcon,
                      title: "Club Officers",
                      type: "officers",
                      S,
                      context,
                    }),
                    S.listItem()
                      .title("Vice presidents")
                      .child(
                        S.documentTypeList("vicePresidents").title(
                          "Vice presidents",
                        ),
                      ),
                    S.listItem()
                      .title("Trustees")
                      .child(S.documentTypeList("trustees").title("Trustees")),
                    S.listItem()
                      .title("Committees")
                      .child(
                        S.documentTypeList("committees").title("Committees"),
                      ),

                    S.listItem()
                      .title("Minutes")
                      .child(S.documentTypeList("minutes").title("Minutes")),
                  ]),
              ),

            S.listItem()
              .title("Regatta")
              .child(
                S.list()
                  .title("Regatta")
                  .items([
                    S.listItem()
                      .title("Regatta Settings")
                      .child(
                        S.document()
                          .schemaType("regattaSettings")
                          .documentId("1af70bac-279d-486d-9c87-cfb4de0b6964"),
                      ),
                    S.listItem()
                      .title("Regattas")
                      .child(S.documentTypeList("regattas").title("Regattas")),
                  ]),
              ),

            S.listItem()
              .title("Safety")
              .child(
                S.list()
                  .title("Safety")
                  .id("safety_list")
                  .items([
                    S.listItem()
                      .title("Safety Status")
                      .child(
                        S.document()
                          .schemaType("safetyStatus")
                          .documentId("safetyStatus"),
                      ),
                    S.listItem()
                      .title("Safety")
                      .id("safety_documents")
                      .child(S.documentTypeList("safety").title("Safety")),
                  ]),
              ),

            S.listItem()
              .title("Meta")
              .child(
                S.list()
                  .title("Meta")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .child(
                        S.document()
                          .schemaType("siteSettings")
                          .documentId("siteSettings"),
                      ),
                    S.listItem()
                      .title("People")
                      .child(S.documentTypeList("person").title("People")),
                    S.listItem()
                      .title("Forwarders")
                      .child(
                        S.documentTypeList("forwarders").title("Forwarders"),
                      ),
                  ]),
              ),

            ...S.documentTypeListItems().filter(
              (listItem) =>
                ![
                  "author",
                  "committees",
                  "forwarders",
                  "minutes",
                  "members",
                  "news",
                  "officers",
                  "regattas",
                  "regattaSettings",
                  "person",
                  "safety",
                  "safetyStatus",
                  "siteSettings",
                  "trustees",
                  "vicePresidents",
                ].includes(listItem.getId() as string),
            ),
          ]),
    }),

    visionTool(),
    table(),
    dashboardTool({
      widgets: [vercelWidget()],
    }),
  ],

  schema: {
    types: schemas,
  },
});

export default config;
