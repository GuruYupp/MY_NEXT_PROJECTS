import React, { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { DetailsActionButtonPropsType } from "../../detailstypes";
import { getData } from "@/services/data.manager";
import { useAppDispatch } from "@/redux/hooks";
import { toogleLike } from "@/redux/feature/pageSlice/pageSlice";
import Toast from "@/components/toasts/Toast";
import { createPortal } from "react-dom";

const DetailsActionButton: FC<DetailsActionButtonPropsType> = (props) => {
  const { className, text, Image, type, btndata } = props;
  const [iconImage, setIconImage] = useState<string>(getinitalIcon());
  const [toastmsg, setToastMsg] = useState<string>("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);
  function getinitalIcon() {
    let imageurl = Image?.defaultImgurl || "";
    if (type === "favorite") {
      const { isFavourite } = props;
      if (isFavourite) {
        imageurl = Image?.selectedImgurl || "";
      }
    }
    return imageurl;
  }

  const checkisDepplink = (e: SyntheticEvent) => {
    if (btndata?.properties?.isDeeplinking === "true") {
      e.preventDefault();
      handleDeepLink({ path: btndata.target });
    }
  };

  const handleDeepLink = async (payload: unknown) => {
    try {
      let deeplinkResponse = await getData(
        "/service/api/v1/page/deeplink",
        payload,
      );
      if (deeplinkResponse.status === true) {
        let deeplinkUrl = deeplinkResponse.response.url;
        console.log(deeplinkUrl);
        if (deeplinkUrl) {
          window.open(deeplinkUrl);
        }
      }
    } catch (err) {}
  };

  const handleFavorite = async () => {
    try {
      let actionCode = -1;
      let target = "";
      if (type === "favorite") {
        const { isFavourite, targetpath } = props;
        actionCode = isFavourite ? 2 : 1;
        target = targetpath || "";
      }
      if (target && actionCode > 0) {
        let favoriteResult = await dispatch(
          toogleLike({ path: target || "", action: actionCode.toString() }),
        ).unwrap();
        if (favoriteResult.result.status === true) {
          let image =
            iconImage === Image?.selectedImgurl
              ? Image?.defaultImgurl
              : Image?.selectedImgurl;
          setIconImage(image || "");
          setToastMsg(favoriteResult.result.response.message);
          toastTimer.current = setTimeout(() => {
            setToastMsg("");
          }, 5000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleActionButton = (e: SyntheticEvent) => {
    switch (type) {
      case "favorite":
        handleFavorite();
        break;
      case "watchnow":
        checkisDepplink(e);
        break;
      case "trailer":
        checkisDepplink(e);
        break;
      default:
        break;
    }
  };
  return (
    <span className={className} onClick={handleActionButton}>
      {iconImage && <img src={iconImage} alt={Image?.altText || ""} />}
      {text}
      {toastmsg &&
        createPortal(
          <Toast message={toastmsg} duration={3000} />,
          document.body,
        )}
    </span>
  );
};

export default DetailsActionButton;
