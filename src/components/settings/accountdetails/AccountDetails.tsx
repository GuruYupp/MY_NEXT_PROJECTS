import { FC, Fragment, useState } from "react";
import styles from "./AccountDetails.module.scss";
import { useAppSelector } from "@/redux/hooks";
import appConfig from "@/app.config";
import { useRouter } from "next/router";
import GenericAccountDetailsRow from "./GenericAccountDetailsRow/GenericAccountDetailsRow";
import { ModalType } from "@/components/modals/modaltypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import UpdateDetails from "@/components/updatedetails/UpdateDetails";
import { UpdatedetailsPropsType } from "@/components/updatedetails/updatedetailstypes";

const AccountDetails: FC = () => {
  const { userDetails } = useAppSelector((state) => state.user);
  const { globalsettings } = useAppSelector(
    (state) => state.configs.systemFeatures
  );
  const [showModal, setShowModal] = useState<ModalType>("");
  const [updateDetails, setUpdateDetails] = useState<Omit<UpdatedetailsPropsType,"closeModal">>({updatetype:"email"});
  const router = useRouter();
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.replace("/settings/edit-profile");
  };
  const handleSignOut = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleDetailchange = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (type === "password") {
      router.push("/change-password");
    } else {
      document.body.style.overflowY = "hidden";
      if (type === "email") {
        setUpdateDetails({ updatetype: "email", title1: "Change Email Id", title2:"On changing Email you will be redirected to settings page"});
      }
      if (type === "mobile") {
        setUpdateDetails({ updatetype: "number", title1: "Change Mobile Number", title2: "On changing your mobile number you will be redirected to settings page" });
      }
      setShowModal("updatedetails");
    }
  };
  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  // function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
  //   const { from, data } = Modaldata;
  //   switch (from) {
  //     case "languages":
  //       break;
  //     default:
  //       break;
  //   }
  // }
  return (
    <Fragment>
      <div className={`${styles.account_details_container}`}>
        <GenericAccountDetailsRow
          heading1="Personal Details"
          heading2="Change your Name, Age and Gender"
          action_btn_text="Edit"
          action_btn_handle={handleEdit}
        />
        {appConfig.settings.email && (
          <GenericAccountDetailsRow
            details={{ label: "Email", value: userDetails?.email || "" }}
            action_btn_handle={(e) => handleDetailchange(e, "email")}
            action_btn_text={
              globalsettings?.fields?.changeEmailSupport === "true"
                ? "change"
                : ""
            }
          />
        )}
        {appConfig.settings.mobile && (
          <GenericAccountDetailsRow
            details={{
              label: "Mobile Number",
              value: userDetails?.phoneNumber || "",
            }}
            action_btn_handle={(e) => handleDetailchange(e, "mobile")}
            action_btn_text={
              globalsettings?.fields?.changeMobileSupport === "true"
                ? "update"
                : ""
            }
          />
        )}
        {appConfig.settings.password && (
          <GenericAccountDetailsRow
            details={{
              label: "Password",
              value: "******",
            }}
            action_btn_handle={(e) => handleDetailchange(e, "password")}
            action_btn_text={
              appConfig.settings.changePasswordSupport === true ? "change" : ""
            }
          />
        )}
        <GenericAccountDetailsRow
          heading1="Sign Out"
          heading2="You will be signed out from this device"
          action_btn_text="Sign Out"
          action_btn_handle={handleSignOut}
        />
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "updatedetails":
                    return <UpdateDetails {...updateDetails} closeModal={handlecloseModal}/>;
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
    </Fragment>
  );
};

export default AccountDetails;
