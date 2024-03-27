import { cardInterface, typeofcardType } from "@/shared";
import styles from "./SuggestionCard.module.scss";
import { SyntheticEvent } from "react";
import { getAbsolutPath } from "@/utils";
import appConfig from "@/app.config";
import Link from "next/link";

interface SuggestionCardprops {
  cardDetails: cardInterface;
}

export default function SuggestionCard(
  props: SuggestionCardprops,
): JSX.Element {
  const { cardType, display, target } = props.cardDetails;
  const { cardDetails } = props;
  const src = getAbsolutPath(cardDetails.display.imageUrl);
  // const partnerIcon =
  //   cardDetails.display.partnerIcon &&
  //   getAbsolutPath(cardDetails.display.partnerIcon);
  const parentIcon =
    cardDetails.display.parentIcon &&
    getAbsolutPath(cardDetails.display.parentIcon);
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.videosuggestionDefaultImg);
  };

  const renderCard = (cardType: typeofcardType) => {
    switch (cardType) {
      case "expands_poster":
        return (
          <div className={`${styles.suggestionCard_container}`}>
            <div className={`${styles.suggestionCard_Img}`}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
            <div className={`${styles.suggestionCard_meta}`}>
              {display.title && (
                <div className={`${styles.suggestionCard_title}`}>
                  {display.title}
                </div>
              )}
              {display.subtitle1 && (
                <div className={`${styles.suggestionCard_subtitle}`}>
                  {display.subtitle1}
                </div>
              )}
            </div>
            <div className={`${styles.suggestionCard_logo}`}>
              {parentIcon && (
                <img
                  src={parentIcon}
                  className={`${styles.partner_icon}`}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className={`${styles.suggestionCard_container}`}>
            <div className={`${styles.suggestionCard_Img}`}>
              <img
                src={src}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
            <div className={`${styles.suggestionCard_meta}`}>
              {display.title && (
                <div className={`${styles.suggestionCard_title}`}>
                  {display.title}
                </div>
              )}
              {display.subtitle1 && (
                <div className={`${styles.suggestionCard_subtitle}`}>
                  {display.subtitle1}
                </div>
              )}
            </div>
            <div className={`${styles.suggestionCard_logo}`}>
              {parentIcon && (
                <img
                  src={parentIcon}
                  className={`${styles.partner_icon}`}
                  alt="Picture of the author"
                  loading="lazy"
                  onError={handleImageonError}
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Link href={target.path}>{renderCard(cardType)}</Link>
    </>
  );
}
