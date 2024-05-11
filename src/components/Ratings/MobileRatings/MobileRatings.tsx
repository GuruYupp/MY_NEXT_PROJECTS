import React, { FC, Fragment, useState } from "react";
import styles from "./MobileRatings.module.scss";
import Modal from "@/components/modals/Modal";
import BottomRatings from "./BottomRatings/BottomRatings";
import { createPortal } from "react-dom";
import { ModalType } from "@/components/modals/modaltypes";
import { MobileRatingsInterface } from "../ratingstype";
import RatingsHOC from "../RatingsHOC";

const MobileRatingsWrapped: FC<MobileRatingsInterface> = (props) => {
  const [showModal, setShowModal] = useState<ModalType>("");
  const handleClick = () => {
    setShowModal("mobileratings");
  };

  const handlecloseModal = () => {
    setShowModal("");
  };

  return (
    <Fragment>
      <div
        className={`${styles.mobile_ratings_container}`}
        onClick={handleClick}
      >
        Select Rating ALL MATURITY RATINGS
        <span className={`${styles.arrow}`}></span>
      </div>
      {showModal &&
        createPortal(
          <Modal
            withWrapper={false}
            modalType={showModal}
            render={() => {
              return <BottomRatings {...props} closeModal={handlecloseModal} />;
            }}
          />,
          document.body,
        )}
    </Fragment>
  );
};

const MobileRatings = RatingsHOC(MobileRatingsWrapped);
export default MobileRatings;
