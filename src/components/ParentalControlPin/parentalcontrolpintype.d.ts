import { subprofileInterface } from "@/shared";
import { ModalType } from "../modals/modaltypes";

export interface ParentalControlpinModalpropsInterface {
  closeModal: (isCancel?: boolean) => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  profileData: subprofileInterface;
}
