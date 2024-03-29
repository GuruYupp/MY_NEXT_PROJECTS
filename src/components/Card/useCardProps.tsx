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
  };
  return allcardProps;
}

export default useGetCardProps;
