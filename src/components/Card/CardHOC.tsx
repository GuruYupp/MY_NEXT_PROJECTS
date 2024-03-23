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
import { useAppDispatch } from "@/redux/hooks";
import {
  removeContinueWatching,
  toogleLike,
} from "@/redux/feature/pageSlice/pageSlice";
import { ModalType } from "../modals/modaltypes";
import Template from "../templates/Template";
import { RootCardPropsInterface, cardPropsInterface } from "./cardtype";
import CardLinkWrapper from "./CardLinkWrapper";

function CardHOC(CardComponent: ComponentType<cardPropsInterface>) {
  function CardWrapper(props: RootCardPropsInterface) {
    const { cardType, display, target, template } = props.cardDetails;
    // console.log(target)
    const { cardDetails } = props;

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
    // const button_target_path = getfromcarddata(props.cardDetails,"targetPath");

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

    const dispatch = useAppDispatch();

    const showTemplateModal = (template: templateType) => {
      document.body.style.overflowY = "hidden";
      setTemplateCode(template);
      setShowModal("template");
    };

    const closeTemplateModal = () => {
      document.body.style.overflowY = "scroll";
      setTemplateCode("");
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
          // window.removeEventListener('resize', setSectionconfigs);
          resizeObserver.disconnect();
        };
      }
      return;
    }, []);

    const templateHandler = () => {
      if (template) showTemplateModal(template);
    };

    const setImageHeight = () => {
      if (imageRef.current) {
        if (cardType === "promo_poster") return;
        const cardConfigs = cardDimentionsForResponsive(cardType);
        // console.log(imageRef.current.offsetWidth)
        imageRef.current.style.height = `${
          imageRef.current.offsetWidth * cardConfigs.cardRatio
        }px`;
      }
    };

    const handleLikeButton = (e: SyntheticEvent) => {
      e.preventDefault();
      console.log(isFavorite, "---,KKK");
      if (isFavorite) {
        let action = isFavorite.value === "true" ? "2" : "1";
        dispatch(
          toogleLike({
            path: cardDetails.target.path,
            action,
          }),
        );
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
          template &&
          createPortal(
            <Modal
              modalType={showModal}
              render={(modal) => {
                function getModal() {
                  switch (modal) {
                    case "template":
                      return (
                        <Template
                          closeModal={closeTemplateModal}
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
