import { memo } from "react";

import getCardComponent from "./Cards/getCardComponent";
import { RootCardPropsInterface } from "./cardtype";

const Card = (props: RootCardPropsInterface): JSX.Element => {
  const { cardType } = props.cardDetails;

  return getCardComponent(cardType)(props);
};

const MemoCard = memo(Card);

export default MemoCard;
