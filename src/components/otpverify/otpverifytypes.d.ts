import { ModalType } from "../modals/modaltypes";

export type OtpVerifyFormType = {
  otp: number;
};

export type OtpVerifydataType = {
  reference_key?: string;
  context?: "signup" | "signin" | "update_email" | "update_mobile";
  verification: "" | "email" | "mobile";
  message?: string;
  email?: string;
  number?: string;
  new_identifier?: string;
};

export type OtpVerifyPropsInterface = {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  verifydata: OtpVerifydataType;
  backgroundnone?: boolean;
};

export type verifyotptimerType = {
  resendTime: number;
  timerId: ReturnType<typeof setInterval> | undefined;
};
