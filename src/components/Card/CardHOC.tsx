import {
  cardDimentionsForResponsive,
  getAbsolutPath,
  debunceFunction,
} from "@/utils";
import {
  ComponentType,
  MutableRefObject,
  RefCallback,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { templateType } from "@/shared";
import Modal from "../modals/Modal";
import { createPortal } from "react-dom";
import getfromcarddata, { getcardMarker } from "./getfromcarddata";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeContinueWatching,
  toogleLike,
} from "@/redux/feature/pageSlice/pageSlice";
import { ModalType } from "../modals/modaltypes";
import Template from "../templates/Template";
import { RootCardPropsInterface, cardPropsInterface } from "./cardtype";
import CardLinkWrapper from "./CardLinkWrapper";
import { dispayInterface as genericpopupdispayInterface } from "../Genericmodal/genericmodaltype";
import GenericModal from "../Genericmodal/GenericModal";

function CardHOC(CardComponent: ComponentType<cardPropsInterface>) {
  function CardWrapper(props: RootCardPropsInterface) {
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

    const showShareButton = getfromcarddata(
      props.cardDetails,
      "showShareButton",
    );

    const seekMarker = getcardMarker(props.cardDetails, "seek");

    const leftOverTimeMarker = getcardMarker(props.cardDetails, "leftOverTime");

    const [showModal, setShowModal] = useState<ModalType>("");
    const [templateCode, setTemplateCode] = useState<templateType>("");
    const [genericPopUpData, setGenericPopUpData] =
      useState<genericpopupdispayInterface>({});

    const dispatch = useAppDispatch();

    const handleshowModal = (modal: ModalType, template?: templateType) => {
      document.body.style.overflowY = "hidden";
      setShowModal(modal);
      template && setTemplateCode(template);
    };

    const handleCloseModal = () => {
      document.body.style.overflowY = "scroll";
      templateCode && setTemplateCode("");
      setShowModal("");
    };

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

    const templateHandler = () => {
      if (template) {
        handleshowModal("template", template);
      }
    };

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
        handleshowModal("genericmodal");
        setGenericPopUpData({
          title: "Please sign in to use this and more such features",
          yesbuttonText: "Sign In",
          nobuttonText: "Cancel",
        });
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

    return (
      <>
        <CardLinkWrapper
          targetPath={target.path}
          templateHandler={templateHandler}
          template={template}
        >
          <CardComponent {...allcardProps} />
        </CardLinkWrapper>
        {showModal &&
          createPortal(
            <Modal
              modalType={showModal}
              render={(modal) => {
                function getModal() {
                  switch (modal) {
                    case "genericmodal":
                      return (
                        <GenericModal
                          displayData={genericPopUpData}
                          closeModal={handleCloseModal}
                        />
                      );
                    case "template":
                      return (
                        <Template
                          closeModal={handleCloseModal}
                          template_code={templateCode}
                          target_path={target.path}
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
      </>
    );
  }
  return CardWrapper;
}

export default CardHOC;
