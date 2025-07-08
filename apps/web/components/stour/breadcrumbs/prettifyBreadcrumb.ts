export const prettifyBreadcrumb = (string: string) =>
  string
    .replace("stourtoys", "StourToys")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");
