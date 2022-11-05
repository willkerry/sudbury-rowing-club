import S from "@sanity/desk-tool/structure-builder";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { MdPeople } from "react-icons/md";

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Safety Status")
        .child(
          S.document().schemaType("safetyStatus").documentId("safetyStatus")
        ),
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
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
        icon: MdPeople,
      }),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "safetyStatus",
            "regattaSettings",
            "siteSettings",
            "officers",
          ].includes(listItem.getId())
      ),
    ]);
