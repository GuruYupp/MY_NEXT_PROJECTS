import { getAbsolutPath } from "@/utils";
import styles from "./Emojis.module.scss";
import { emojiInterface } from "./emojitypes";

type emojiType = emojiInterface & { selected: boolean };

interface EmojiProps {
  emoji: emojiType;
  handleSelectEmoji: (arg: emojiInterface) => void;
}

function Emoji(props: EmojiProps) {
  const { emoji, handleSelectEmoji } = props;
  const { imageUrl } = emoji;

  const handleClick = () => {
    handleSelectEmoji(props.emoji);
  };
  return (
    <div
      className={`${styles.emoji} ${emoji.selected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <img
        src={getAbsolutPath(imageUrl)}
        alt="emoji"
        className={`${styles.emoji_img}`}
      />
      <img
        src={
          "https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/emoji_selected.png"
        }
        alt="select_emoji"
        className={`${styles.select_icon}`}
      />
      <span className={`${styles.select_msg}`}>Selected</span>
    </div>
  );
}

export default Emoji;
