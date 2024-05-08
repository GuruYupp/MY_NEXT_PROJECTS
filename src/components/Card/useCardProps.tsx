import { RootCardPropsInterface, cardPropsInterface } from "./cardtype";
import { getAbsolutPath } from "@/utils";
import getfromcarddata, { getcardMarker } from "./getfromcarddata";

function useGetCardProps(
  props: RootCardPropsInterface,
): Partial<cardPropsInterface> {
  const { cardDetails } = props;
  const { display } = cardDetails;

  const cardImage = getAbsolutPath(cardDetails.display.imageUrl);
  const partnerIcon =
    cardDetails.display.partnerIcon &&
    getAbsolutPath(cardDetails.display.partnerIcon);
  const parentIcon =
    cardDetails.display.parentIcon &&
    getAbsolutPath(cardDetails.display.parentIcon);

  const showButton = getfromcarddata(cardDetails, "showButton");
  const buttonText = getfromcarddata(cardDetails, "ButtonText");

  const showFavoriteButton = getfromcarddata(
    cardDetails,
    "showFavouriteButton",
  );
  const isFavorite = getfromcarddata(cardDetails, "isFavourite");

  const showShareButton = getfromcarddata(cardDetails, "showShareButton");

  const seekMarker = getcardMarker(cardDetails, "seek");

  const leftOverTimeMarker = getcardMarker(cardDetails, "leftOverTime");

  const badgeMarker = getcardMarker(cardDetails, "badge");

  let allcardProps = {
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
    isFavorite,
    badgeMarker,
  };
  return allcardProps;
}

export default useGetCardProps;
