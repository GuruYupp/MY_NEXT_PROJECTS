export type UpdatedetailsFormType = {
  currentemail: string;
  newemail: string;
  currentnumber: string;
  newnumber: string;
};

export type UpdatedetailsPropsType={
  title1?:string;
  title2?:string;
  updatetype:"email" | "number"
  closeModal: () => void;
}

