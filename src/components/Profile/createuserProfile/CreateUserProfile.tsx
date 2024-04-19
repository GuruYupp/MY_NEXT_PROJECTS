import { useEffect, useRef, useState } from "react";
import styles from "./CreateUserProfile.module.scss";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import { useRouter } from "next/router";
import Emojis from "@/components/emojis/Emojis";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAbsolutPath } from "@/utils";
import Languages from "@/components/languages/Languages";
import { postData } from "@/services/data.manager";
import Toast from "@/components/toasts/Toast";
import { ModalType } from "@/components/modals/modaltypes";
import { emojiInterface } from "@/components/emojis/emojitypes";
import appConfig from "@/app.config";
import { useAppSelector } from "@/redux/hooks";
import ProfilePin from "@/components/profilepin/ProfilePin";
interface CreateUserProfileForm {
  name: string;
  isChildren: boolean;
  languages?: string;
}
let defaultprofileimg = `https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg`;
export default function CreateUserProfile() {
  const [showModal, setShowModal] = useState<ModalType>("");
  const [profileImg, setprofileImg] = useState<string>(defaultprofileimg);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastmsg, setToastMsg] = useState<string>("");
  const [pinerrmsg, setPinerrmsg] = useState<string>("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const { userDetails } = useAppSelector((state) => state.user);
  const masterProfile =
    userDetails?.profileParentalDetails?.filter(
      (profile) => profile.isMasterProfile,
    )[0] || {};

  const formRef = useRef<HTMLFormElement>(null);

  const { register, getValues, watch, setValue, handleSubmit } =
    useForm<CreateUserProfileForm>({
      mode: "onChange",
      defaultValues: {
        name: "",
        isChildren: false,
        languages: "",
      },
    });

  const watchisChildren = watch("isChildren");
  const watchprofilename = watch("name");
  const { replace } = useRouter();

  useEffect(() => {
    if (formRef.current)
      // formRef.current.addEventListener('submit', handleSubmit());
      return () => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        // if (formRef.current)
        // formRef.current.removeEventListener('submit', handleSubmit);
      };
  }, []);

  const handleChidrencheck = () => {
    setValue("isChildren", !getValues().isChildren);
  };

  function handlecloseModal() {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  }

  function handleProfileImage() {
    document.body.style.overflowY = "hidden";
    setShowModal("emojis");
  }

  function handleContinue() {
    if (
      getValues().languages?.length === 0 &&
      appConfig.profile.languages === true
    ) {
      setShowModal("languages");
      document.body.style.overflowY = "hidden";
    } else if (masterProfile?.addProfilePinEnable === true) {
      document.body.style.overflowY = "hidden";
      setShowModal("profilepin");
    } else {
      handleSubmit(onSubmit)();
    }
  }

  function handleCancel() {
    replace("/profiles/manage-user-profile");
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "emojis":
        data.map((emoji: emojiInterface) => {
          setprofileImg(emoji.imageUrl);
        });
        break;
      case "languages":
        let codes = data
          .filter((data: any) => data.isSelected)
          .map((data: any) => data.code);
        console.log("codes: ", codes);
        setValue("languages", codes.join(","));
        formRef.current?.dispatchEvent(new Event("submit"));
        break;
      case "profilepin":
        createProfile(data);
        break;
      default:
        break;
    }
  }

  const createProfile = async (passcode?: string) => {
    let payload: any = {
      profiles: [
        {
          image: profileImg,
          isMasterProfile: false,
          isChildren: getValues().isChildren,
          langs: getValues().languages,
          name: getValues().name,
        },
      ],
    };
    if (passcode) {
      payload.passCode = passcode;
    }
    const createprofileresponse = await postData(
      "/service/api/auth/create/user/profile",
      payload,
    );
    if (createprofileresponse.status === true) {
      if (
        createprofileresponse.response.message ===
        "RES_S_PROFILE_INSERTION_SUCCESS"
      ) {
        replace("/profiles/manage-user-profile");
      }
    } else if (createprofileresponse.status === false) {
      if (createprofileresponse.error?.code === -4) {
        if (createprofileresponse.error?.message) {
          setToastMsg(createprofileresponse.error?.message);
          setShowToast(true);
          toastTimer.current = setTimeout(() => {
            setToastMsg("");
            setShowToast(false);
          }, 5000);
        }
      }
    }
  };

  const onSubmit: SubmitHandler<CreateUserProfileForm> = async () => {
    createProfile();
  };

  return (
    <div className={`${styles.profileCreate_container}`}>
      <div className={`${styles.profileCreate_header}`}>Add Profile</div>
      <div className={`${styles.profileCreate_mobile_header}`}>
        <h3 className={`${styles.text}`}>
          <img
            src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/back-arrow.svg"
            alt="back"
          />
          Add Profile
        </h3>
      </div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.profileCreate_body}`}>
          <div className={`${styles.profile_img_container}`}>
            <img src={getAbsolutPath(profileImg)} alt="" />
            <img
              src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/edit-profile.svg`}
              alt=""
              className={`${styles.edit_icon}`}
              onClick={handleProfileImage}
            />
            {watchisChildren && (
              <span className={`${styles.children_label}`}>Children</span>
            )}
          </div>
          <div className={`${styles.profileCreate_edit_container}`}>
            <div className={`${styles.profileCreate_edit_container_inputs}`}>
              <div className={`${styles.inputs}`}>
                <div className={`${styles.name_input}`}>
                  <input
                    placeholder="profile name"
                    {...register("name", { required: true })}
                  />

                  {appConfig.profile.languages === true && (
                    <input
                      placeholder="profile name"
                      {...register("languages", { required: true })}
                      readOnly
                      style={{ display: "none" }}
                    />
                  )}
                </div>
                <div className={`${styles.check_input}`}>
                  <div className={`${styles.check_input_inner}`}>
                    <input type="checkbox" {...register("isChildren")} />
                    <div
                      className={`${styles.check_box} ${
                        watchisChildren ? styles.checked : ""
                      }`}
                      onClick={handleChidrencheck}
                    ></div>
                    <span
                      className={`${styles.label} ${
                        watchisChildren ? styles.checked : ""
                      }`}
                    >
                      children
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.profileCreate_footer}`}>
          <div className={`${styles.btns}`}>
            <button
              className={`${styles.btn} ${styles.cancel_btn}`}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`${styles.btn} ${styles.continue} ${
                watchprofilename ? styles.enable : styles.disable
              }`}
              onClick={handleContinue}
              disabled={!watchprofilename}
              type="button"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "emojis":
                    return (
                      <Emojis
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                      />
                    );
                  case "languages":
                    return (
                      <Languages
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                      />
                    );
                  case "profilepin":
                    return (
                      <ProfilePin
                        closeModal={handlecloseModal}
                        profileData={masterProfile}
                        sendDatatoComponent={getDataFromModal}
                        pinerrMsg={pinerrmsg}
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
      {showToast && createPortal(<Toast message={toastmsg} />, document.body)}
    </div>
  );
}
