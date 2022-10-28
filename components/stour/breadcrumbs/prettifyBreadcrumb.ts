const prettifyBreadcrumb = (string: string) =>
  string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");

export default prettifyBreadcrumb;
