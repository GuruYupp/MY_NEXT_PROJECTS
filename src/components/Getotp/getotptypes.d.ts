export type getotpModalType =
  | "Viewing Restrictions"
  | "Profile & Video Lock"
  | "Forgot Profile & Video Lock"
  | "Parental Controls"
  | "";

export type getotpHeadingsType = {
  [key: string]: { [key: string]: { [key: string]: string } };
};
