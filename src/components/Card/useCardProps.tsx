import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootCardPropsInterface, cardPropsInterface } from "./cardtype";
import {
  MutableRefObject,
  RefCallback,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  cardDimentionsForResponsive,
  debunceFunction,
  getAbsolutPath,
} from "@/utils";
import getfromcarddata, { getcardMarker } from "./getfromcarddata";
import { ModalType } from "../modals/modaltypes";
import { templateType } from "@/shared";
import {
  removeContinueWatching,
  toogleLike,
} from "@/redux/feature/pageSlice/pageSlice";

function useCardProps(props: RootCardPropsInterface): cardPropsInterface {
  const { cardType, display, target, template } = props.cardDetails;

  const { cardDetails } = props;

  const { isLoggedin } = useAppSelector((state) => state.user);

  const imageRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const cardImage = getAbsolutPath(cardDetails.display.imageUrl);
  const partnerIcon =
    cardDetails.display.partnerIcon &&
    getAbsolutPath(cardDetails.display.partnerIcon);
  const parentIcon =
    cardDetails.display.parentIcon &&
    getAbsolutPath(cardDetails.display.parentIcon);

  const showButton = getfromcarddata(props.cardDetails, "showButton");
  const buttonText = getfromcarddata(props.cardDetails, "ButtonText");

  const showFavoriteButton = getfromcarddata(
    props.cardDetails,
    "showFavouriteButton",
  );
  const isFavorite = getfromcarddata(props.cardDetails, "isFavourite");

  const showShareButton = getfromcarddata(props.cardDetails, "showShareButton");

  const seekMarker = getcardMarker(props.cardDetails, "seek");

  const leftOverTimeMarker = getcardMarker(props.cardDetails, "leftOverTime");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (imageRef.current) {
      setImageHeight();
      let debouncFunc = debunceFunction(setImageHeight, 50);
      const resizeObserver = new ResizeObserver(() => {
        debouncFunc();
      });
      resizeObserver.observe(imageRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
    return;
  }, []);

  const setImageHeight = () => {
    if (imageRef.current) {
      if (cardType === "promo_poster") return;
      const cardConfigs = cardDimentionsForResponsive(cardType);
      imageRef.current.style.height = `${
        imageRef.current.offsetWidth * cardConfigs.cardRatio
      }px`;
    }
  };

  const handleLikeButton = (e: SyntheticEvent) => {
    console.log("isLoggedin", isLoggedin);
    e.preventDefault();

    if (isLoggedin) {
      let action = isFavorite?.value === "true" ? "2" : "1";
      dispatch(
        toogleLike({
          path: cardDetails.target.path,
          action,
        }),
      );
    } else {
      // handleshowModal("genericmodal");
      // setGenericPopUpData({
      //   title: "Please sign in to use this and more such features",
      //   yesbuttonText: "Sign In",
      //   nobuttonText: "Cancel",
      // });
    }
  };

  const handleRemoveContinueWatching = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(removeContinueWatching(target.path));
  };

  const setcardImageRef: RefCallback<HTMLDivElement> = (node) => {
    if (node) {
      imageRef.current = node;
    }
  };

  let allcardProps: cardPropsInterface = {
    setcardImageRef,
    handleRemoveContinueWatching,
    handleLikeButton,
    leftOverTimeMarker,
    seekMarker,
    display,
    cardImage,
    parentIcon,
    partnerIcon,
    showButton,
    showFavoriteButton,
    showShareButton,
    buttonText,
  };
  return allcardProps;
}
