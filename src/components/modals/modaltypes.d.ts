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
  | "";


export interface ModalPropsInterface {
  modalType: ModalType;
  render: (arg: ModalType) => ReactNode
}