import { ModalType } from "../modals/modaltypes"

export type OtpVerifyFormType = {
  otp: number
}

export type OtpVerifydataType={
  reference_key?:string
  context?: "signup"
  verification: "" | "email" | "number"
  message?: string
  email?: string
  number?: string
}

export type OtpVerifyPropsInterface = {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType, data: any }) => void;
  verifydata: OtpVerifydataType
}

export type verifyotptimerType = {
  resendTime: number;
  timerId: ReturnType<typeof setInterval> | undefined;
};