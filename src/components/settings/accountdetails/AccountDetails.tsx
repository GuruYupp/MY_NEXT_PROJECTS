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
    (state) => state.configs.systemFeatures,
  );
  const [showModal, setShowModal] = useState<ModalType>("");
  const [updateDetails, setUpdateDetails] = useState<
    Omit<UpdatedetailsPropsType, "closeModal">
  >({ updatetype: "email" });
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
        setUpdateDetails({
          updatetype: "email",
          title1: "Change Email Id",
          title2: "On changing Email you will be redirected to settings page",
        });
      }
      if (type === "mobile") {
        setUpdateDetails({
          updatetype: "number",
          title1: "Change Mobile Number",
          title2:
            "On changing your mobile number you will be redirected to settings page",
        });
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
        {appConfig.settings.personal && (
          <GenericAccountDetailsRow
            heading1="Personal Details"
            heading2="Change your Name, Age and Gender"
            actionbtntext="Edit"
            actionbtnhandle={handleEdit}
          />
        )}
        {appConfig.settings.email && (
          <GenericAccountDetailsRow
            details={{ label: "Email", value: userDetails?.email || "" }}
            actionbtnhandle={(e) => handleDetailchange(e, "email")}
            actionbtntext={
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
            actionbtnhandle={(e) => handleDetailchange(e, "mobile")}
            actionbtntext={
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
            actionbtnhandle={(e) => handleDetailchange(e, "password")}
            actionbtntext={
              appConfig.settings.changePasswordSupport === true ? "change" : ""
            }
          />
        )}
        {appConfig.settings.logout && (
          <GenericAccountDetailsRow
            heading1="Sign Out"
            heading2="You will be signed out from this device"
            actionbtntext="Sign Out"
            actionbtnhandle={handleSignOut}
          />
        )}
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "updatedetails":
                    return (
                      <UpdateDetails
                        {...updateDetails}
                        closeModal={handlecloseModal}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body,
        )}
    </Fragment>
  );
};

export default AccountDetails;
