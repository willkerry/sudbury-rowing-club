const prettifyBreadcrumb = (string: string) =>
  string
    .replace("stourtoys", "StourToys")
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");

export default prettifyBreadcrumb;
