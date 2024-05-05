import { templateType } from "@/shared";
import { ReactNode } from "react";

export type ModalType =
  | "network_filter"
  | "languages"
  | "emojis"
  | "template"
  | "signout"
  | "getotp"
  | "otpverify"
  | "updatedetails"
  | "mobileratings"
  | "profilepin"
  | "genericmodal"
  | "parentalcontrolpin"
  | "";

export interface ModalPropsInterface {
  withWrapper?: boolean;
  modalType: ModalType;
  render: (arg: ModalType) => ReactNode;
}
