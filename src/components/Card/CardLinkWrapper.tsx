import React, { FC, SyntheticEvent } from "react";
import { CardlinkWrapperPropsInterface } from "./cardtype";
import Link from "next/link";

const CardLinkWrapper: FC<CardlinkWrapperPropsInterface> = (props) => {
  const templateHandlerWrapper = (e: SyntheticEvent) => {
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
};

export default CardLinkWrapper;
