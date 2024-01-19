import styles from "./card.module.scss";
import {
  cardDimentionsForResponsive,
  getAbsolutPath,
  debunceFunction,
} from "@/utils";
import {
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import appConfig from "@/app.config";
import Link from "next/link";
import { cardInterface, templateType, typeofcardType } from "@/shared";
import Modal from "../modals/Modal";
import { createPortal } from "react-dom";
import getfromcarddata, { getcardMarker } from "./getfromcarddata";
import { useAppDispatch } from "@/redux/hooks";
import { removeContinueWatching, toogleLike } from "@/redux/feature/pageSlice/pageSlice";
import { ModalType } from "../modals/modaltypes";
import Template from "../templates/Template";



interface linkWrapperProps {
  targetPath: string;
  children?: ReactNode;
  templateHandler?: (e: MouseEvent<HTMLAnchorElement>) => void;
  template?: templateType;
}

function CardLinkWrapper(props: linkWrapperProps) {
  const templateHandlerWrapper = (e: MouseEvent<HTMLAnchorElement>) => {
    if (props.template && props.templateHandler) {
      e.preventDefault();
      props.templateHandler(e);
    }
  };
  return (
    <Link href={props.targetPath} onClick={templateHandlerWrapper}>
      {props.children}
    </Link>
  );
}

interface cardprops {
  cardDetails: cardInterface;
}
const Card = (props: cardprops): JSX.Element => {
  const { cardType, display, target, template } = props.cardDetails;
  // console.log(target)
  const { cardDetails } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const src = getAbsolutPath(cardDetails.display.imageUrl);
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
    "showFavouriteButton"
  );
  const isFavorite = getfromcarddata(props.cardDetails, "isFavourite");

  const showShareButton = getfromcarddata(props.cardDetails, "showShareButton");

  const seekMarker = getcardMarker(props.cardDetails,"seek")

  const leftOverTimeMarker = getcardMarker(props.cardDetails,"leftOverTime");

  const [showModal, setShowModal] = useState<ModalType>("");
  const [templateCode,setTemplateCode] = useState<templateType>("")
  
  const dispatch = useAppDispatch();

  const showTemplateModal = (template: templateType) => {
    document.body.style.overflowY = "hidden";
    setTemplateCode(template);
    setShowModal("template")
  };

  const closeTemplateModal = () => {
    document.body.style.overflowY = "scroll";
    setTemplateCode("");
    setShowModal("")
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
    return
  }, []);

  const templateHandler = () => {
    if (template) showTemplateModal(template);
  };

  const setImageHeight = () => {
    if (imageRef.current) {
      if(cardType === "promo_poster") return;
      const cardConfigs = cardDimentionsForResponsive(cardType);
      // console.log(imageRef.current.offsetWidth)
      imageRef.current.style.height = `${imageRef.current.offsetWidth * cardConfigs.cardRatio
        }px`;
    }
  };

  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };

  const handleLikeButton = (e:MouseEvent,isFavorite:string='')=>{
    e.preventDefault()
    if(isFavorite){
    let action = isFavorite === "true" ? "2" :"1";
    dispatch(toogleLike({
      path:cardDetails.target.path,
      action
    }))
    }
  }

  const handleRemoveContinueWatching = (e:MouseEvent)=>{
    e.preventDefault();
    dispatch(removeContinueWatching(target.path))
  }

  const renderCard = (cardType: typeofcardType) => {
    switch (cardType) {
      case "roller_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
          <div className={`${styles.expand_roller_poster}`}>
            <div className={`${styles.img_container}`} ref={imageRef}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
            <div className={`${styles.bottom}`}>
              <div className={`${styles.card_info}`}>
                {display.title && (
                  <div className={`${styles.card_title}`}>{display.title}</div>
                )}
                {/* {display.subtitle1 && (
                <div className={`${styles.card_subtitle}`}>{display.subtitle1}</div>
            )} */}
              </div>
            </div>
          </div>
          </CardLinkWrapper>
        );
      case "overlayIcon_poster":
        return (
          <div className={`${styles.overlay_poster}`} ref={cardRef}>
            <div className={`${styles.img_container}`} ref={imageRef}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
            <div className={`${styles.bottom}`}>
              <div className={`${styles.card_info}`}>
                {display.title && (
                  <div className={`${styles.card_title}`}>{display.title}</div>
                )}
                {display.subtitle1 && (
                  <div className={`${styles.card_subtitle}`}>
                    {display.subtitle1}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "overlay_poster":
        return (
          <div className={`${styles.overlay_poster}`} ref={cardRef}>
            <div className={`${styles.img_container}`} ref={imageRef}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
              {partnerIcon && (
                <img
                  src={partnerIcon}
                  className={`${styles.partner_icon}`}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              )}
            </div>
            <div className={`${styles.bottom}`}>
              <div className={`${styles.card_info}`}>
                {display.title && (
                  <div className={`${styles.card_title}`}>{display.title}</div>
                )}
                {display.subtitle1 && (
                  <div className={`${styles.card_subtitle}`}>
                    {display.subtitle1}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "content_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.content_poster}`} ref={cardRef}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="partner icon"
                  loading="lazy"
                  onError={handleImageonError}
                />
                <div className={`${styles.close_icon}`} onClick={handleRemoveContinueWatching}>
                  <img
                    src={`${appConfig.staticImagesPath}close-icon.svg`}
                    alt="close icon"
                    loading="lazy"
                  />
                </div>
                
                {partnerIcon && (
                  <img
                    src={partnerIcon}
                    className={`${styles.partner_icon}`}
                    alt="Picture of the author"
                    loading="lazy"
                    onError={handleImageonError}
                  />
                )}
                {leftOverTimeMarker && (<span className={`${styles.leftover_duration}`}>{leftOverTimeMarker.value}</span>)}
                {seekMarker && (
                  <div className={`${styles.seek}`}>
                    <div className={`${styles.seek_inner_relative}`}>
                      <div className={`${styles.seek_status_bar}`} style={{width:`${Number(seekMarker.value) * 100}%`}}></div>
                    </div>
                  </div>
                )}
                <div className={`${styles.gradient}`}></div>
              </div>
              <div className={`${styles.bottom}`}>
                <div className={`${styles.card_info}`}>
                  {parentIcon && (
                    <div className={`${styles.channel_logo}`}>
                      <img
                        src={parentIcon}
                        className={`${styles.partner_icon}`}
                        alt="Picture of the author"
                        loading="lazy"
                        onError={handleImageonError}
                      />
                    </div>
                  )}
                  <div className={`${styles.meta_data}`}>
                    {display.title && (
                      <div className={`${styles.card_title}`}>
                        {display.title}
                      </div>
                    )}
                    {display.subtitle1 && (
                      <div className={`${styles.card_subtitle}`}>
                        {display.subtitle1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardLinkWrapper>
        );
      case "sheet_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.sheet_poster}`}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  onError={handleImageonError}
                  loading="lazy"
                />
              </div>
              <div className={`${styles.bottom}`}>
                <div className={`${styles.card_info}`}>
                  {display.title && (
                    <div className={`${styles.card_title}`}>
                      {display.title}
                    </div>
                  )}
                  {display.subtitle1 && (
                    <div className={`${styles.card_subtitle}`}>
                      {display.subtitle1}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardLinkWrapper>
        );
      case "circle_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.circle_poster}`} ref={cardRef}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              </div>
              {/* <div className={`${styles.bottom}`}>
            <div className={`${styles.card_info}`}>
              {display.title && (
                <div className={`${styles.card_title}`}>{display.title}</div>
              )}
              {display.subtitle1 && (
                <div className={`${styles.card_subtitle}`}>{display.subtitle1}</div>
              )}
            </div>
          </div> */}
            </div>
          </CardLinkWrapper>
        );
      case "square_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.square_poster}`} ref={cardRef}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              </div>
              {/* <div className={`${styles.bottom}`}>
            <div className={`${styles.card_info}`}>
              {display.title && (
                <div className={`${styles.card_title}`}>{display.title}</div>
              )}
              {display.subtitle1 && (
                <div className={`${styles.card_subtitle}`}>{display.subtitle1}</div>
              )}
            </div>
          </div> */}
            </div>
          </CardLinkWrapper>
        );
      case "expand_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.expand_poster}`} ref={cardRef}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              </div>
              <div className={`${styles.bottom}`}>
                <div className={`${styles.card_info}`}>
                  {parentIcon && (
                    <div className={`${styles.channel_logo}`}>
                      <img
                        src={parentIcon}
                        className={`${styles.partner_icon}`}
                        alt="Picture of the author"
                        loading="lazy"
                        onError={handleImageonError}
                      />
                    </div>
                  )}
                  <div className={`${styles.meta_data}`}>
                    {display.title && (
                      <div className={`${styles.card_title}`}>
                        {display.title}
                      </div>
                    )}
                    {display.subtitle1 && (
                      <div className={`${styles.card_subtitle}`}>
                        {display.subtitle1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardLinkWrapper>
        );
      case "expands_poster":
        return (
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            <div className={`${styles.expands_poster}`} ref={cardRef}>
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
                {partnerIcon && (
                  <img
                    src={partnerIcon}
                    className={`${styles.partner_icon}`}
                    alt="Picture of the author"
                    loading="lazy"
                    onError={handleImageonError}
                  />
                )}
              </div>
              <div className={`${styles.bottom}`}>
                <div className={`${styles.card_info}`}>
                  {display.title && (
                    <div className={`${styles.card_title}`}>
                      {display.title}
                    </div>
                  )}
                  {display.subtitle1 && (
                    <div className={`${styles.card_subtitle}`}>
                      {display.subtitle1}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${styles.hover_info}`}>
                <div className={`${styles.buttons}`}>
                  {showButton && (
                    // <Link href={button_target_path?.value || "#"}>
                    <button
                      className={
                        `${styles.default_btn} ` +
                        (showButton.value === "play"
                          ? `${styles.play_btn}`
                          : "")
                      }
                    >
                      {buttonText && buttonText.value}
                    </button>
                    // </Link>
                  )}

                  {showFavoriteButton &&
                    showFavoriteButton.value === "true" && (
                      <button
                        className={`${styles.like_btn}`}
                        onClick={(e) => handleLikeButton(e, isFavorite?.value)}
                      >
                        {isFavorite?.value === "true" ? (
                          <img
                            src={`${
                              appConfig.cloudpath +
                              "/images/favorite-active.svg"
                            }`}
                            alt="favorite"
                          />
                        ) : (
                          <img
                            src={`${appConfig.cloudpath + "/images/heart.svg"}`}
                            alt="favorite"
                          />
                        )}
                      </button>
                    )}

                  {showShareButton && showShareButton.value === "true" && (
                    <button className={`${styles.like_btn}`}>
                      <img
                        src={`${appConfig.cloudpath + "/images/share.svg"}`}
                        alt="share"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardLinkWrapper>
        );
      case "expand_roller_poster":
        return (
          <div className={`${styles.expand_roller_poster}`}>
          <CardLinkWrapper
            targetPath={target.path}
            template={template}
            templateHandler={templateHandler}
          >
            {/* <div className={`${styles.expand_roller_poster}`}> */}
              <div className={`${styles.img_container}`} ref={imageRef}>
                <img
                  src={src}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
                {partnerIcon && (
                  <img
                    src={partnerIcon}
                    className={`${styles.partner_icon}`}
                    alt="Picture of the author"
                    loading="lazy"
                    onError={handleImageonError}
                  />
                )}
              </div>
              <div className={`${styles.bottom}`}>
                <div className={`${styles.card_info}`}>
                  {display.title && (
                    <div className={`${styles.card_title}`}>
                      {display.title}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${styles.hover_info}`}>
                {display.subtitle1 && (
                  <div className={`${styles.card_subtitle}`}>
                    {display.subtitle1}
                  </div>
                )}
                <div className={`${styles.buttons}`}>
                  {showButton && (
                    // <Link href={button_target_path?.value || "#"}>
                    <button
                      className={
                        `${styles.default_btn} ` +
                        (showButton.value === "play"
                          ? `${styles.play_btn}`
                          : "")
                      }
                    >
                      {buttonText && buttonText.value}
                    </button>
                    // </Link>
                  )}

                  {showFavoriteButton &&
                    showFavoriteButton.value === "true" && (
                    <button
                      className={`${styles.like_btn}`}
                      onClick={(e) => handleLikeButton(e, isFavorite?.value)}
                    >
                      {isFavorite?.value === "true" ? (
                        <img
                          src={`${appConfig.cloudpath +
                            "/images/favorite-active.svg"
                            }`}
                          alt="favorite"
                        />
                      ) : (
                        <img
                          src={`${appConfig.cloudpath + "/images/heart.svg"}`}
                          alt="favorite"
                        />
                      )}
                    </button>
                    )}

                  {showShareButton && showShareButton.value === "true" && (
                    <button className={`${styles.like_btn}`}>
                      <img
                        src={`${appConfig.cloudpath + "/images/share.svg"}`} alt="share"
                      />
                    </button>
                  )}
                </div>
              </div>
            {/* </div> */}
          </CardLinkWrapper>
          </div>
        );
      case "promo_poster":
        return (
          <div className={`${styles.promo_poster}`} ref={cardRef}>
            <div className={`${styles.img_container}`} ref={imageRef}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className={`${styles.overlay_poster}`} ref={cardRef}>
            <div className={`${styles.img_container}`} ref={imageRef}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
            <div className={`${styles.bottom}`}>
              <div className={`${styles.card_info}`}>
                {display.title && (
                  <div className={`${styles.card_title}`}>{display.title}</div>
                )}
                {display.subtitle1 && (
                  <div className={`${styles.card_subtitle}`}>
                    {display.subtitle1}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderCard(cardType)}
      {showModal &&
        template &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "template":
                    return <Template closeModal={closeTemplateModal} template_code={templateCode} target_path={target.path}/>
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )} 
    </>
  );
}

const MemoCard = memo(Card)

export default MemoCard
