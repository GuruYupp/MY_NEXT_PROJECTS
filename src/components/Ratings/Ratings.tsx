import { useEffect, useState, FC } from "react";
import DesktopRatings from "./DesktopRatings/DesktopRatings";
import MobileRatings from "./MobileRatings/MobileRatings";
import { RatingsPropsInterface } from "./ratingstype";

const Ratings: FC<RatingsPropsInterface> = (props) => {
  const [ratingsbarType, setRatingsbarType] = useState<
    "desktop" | "mobile" | ""
  >("desktop");

  useEffect(() => {
    showRatingsInDevice();
    window.addEventListener("resize", handleresizeEvent);
    return () => {
      window.removeEventListener("resize", handleresizeEvent);
    };
  }, []);

  const handleresizeEvent = () => {
    showRatingsInDevice();
  };

  const showRatingsInDevice = () => {
    if (window.innerWidth <= 760) {
      ratingsbarType !== "mobile" && setRatingsbarType("mobile");
    } else if (window.innerWidth > 760) {
      ratingsbarType !== "desktop" && setRatingsbarType("desktop");
    }
  };

  return ratingsbarType === "desktop" ? (
    <DesktopRatings {...props} />
  ) : (
    <MobileRatings {...props} />
  );
};

export default Ratings;
