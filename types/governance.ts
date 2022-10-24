export type Officer = {
  _id: string;
  name?: string;
  role: string;
  vacant?: boolean;
  description?: string;
  hasEmail?: boolean;
};

export type Committee = {
  _id: string;
  title: string;
  description?: string;
  members: Officer[];
};

export type NonExecutiveOfficer = {
  _id: string;
  firstName: string;
  surname: string;
};

export type Document = {
  _key: string;
  name: string;
  url?: string;
  file?: string;
  fileOrLink: string;
};

export type DocumentGroup = {
  _key: string;
  groupTitle: string;
  resources: Document[];
};
