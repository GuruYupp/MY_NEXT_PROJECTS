import styles from "./shared.module.scss";
function Skeleton(skeleton: string) {
  switch (skeleton) {
    case "carousel":
      return (
        <div className={`${styles.carousel_skeleton}`}>
          <div className={`${styles.shimmer}`}></div>
        </div>
      );

    case "card":
      return <div className="card_skeleton"></div>;

    default:
      return <></>;
  }
}

export default Skeleton;
