export type ForgotPasswordFormType = {
  email: string;
  number: string;
  newpassword: string;
  confirmpassword: string;
  otp: string;
};

export type resetPasswordformType = "verify" | "otpscreen" | "resetpassword";

export interface verifyOTPPropsInterface {
  formType: resetPasswordformType;
  handleFormType: (arg: resetPasswordformType) => void;
}
