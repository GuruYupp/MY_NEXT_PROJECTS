import { ModalType } from "../modals/modaltypes";

export interface dispayInterface {
  title?: string;
  subtitle1?: string;
  yesbuttonText?: string;
  nobuttonText?: string;
  primarybtn?: "yesbutton" | "nobutton";
}

export interface GenericModalPropsInterface {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  displayData: dispayInterface;
}
