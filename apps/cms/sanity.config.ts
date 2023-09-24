import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { table } from "@sanity/table";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import schemas from "./schemas/schema";
import { UsersIcon } from "@sanity/icons";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";
import { dashboardTool } from "@sanity/dashboard";

export default defineConfig({
  title: "Sudbury Rowing Club",
  projectId: "gvxge7ps",
  dataset: "production",
  plugins: [
    deskTool({
      structure: (S, context) => {
        return S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Safety Status")
              .child(
                S.document()
                  .schemaType("safetyStatus")
                  .documentId("safetyStatus")
              ),

            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Regatta Settings")
              .child(
                S.document()
                  .schemaType("regattaSettings")
                  .documentId("1af70bac-279d-486d-9c87-cfb4de0b6964")
              ),
            orderableDocumentListDeskItem({
              type: "officers",
              title: "Club Officers",
              icon: UsersIcon,
              S,
              context,
            }),

            ...S.documentTypeListItems().filter(
              (listItem) =>
                ![
                  "safetyStatus",
                  "regattaSettings",
                  "siteSettings",
                  "officers",
                ].includes(listItem.getId() as string)
            ),
          ]);
      },
    }),

    visionTool(),
    table(),
    dashboardTool({
      widgets: [vercelWidget()],
    }),
  ],

  schema: {
    types: schemas as any,
  },
});
