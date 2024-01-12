import { FC, ReactNode, useState } from 'react';
import styles from './Panel.module.scss';
interface PanelPropsInterface {
  title?: string;
  toggle?: boolean;
  default_open?: boolean;
  render: () => ReactNode;
  header_right_button?: {
    text: string;
  };
}

const Panel: FC<PanelPropsInterface> = ({
  title,
  render,
  toggle = true,
  default_open = false,
  header_right_button = undefined,
}) => {
  const expandDefault = () => {
    if (toggle === true) {
      if (default_open === true) return true;
      else return false;
    } else if (toggle === false) {
      return true;
    }
    return false;
  };

  const [expand, setExpand] = useState<boolean>(expandDefault());

  const handlePanelClick = () => {
    if (!toggle) return;
    setExpand(!expand);
  };

  return (
    <div className={`${styles.pannel}`} onClick={handlePanelClick}>
      <h2
        className={`${styles.title} ${expand ? styles.expand : ''} ${
          toggle ? styles.show_arrow : styles.hide_arrow
        }`}
      >
        {title || 'Panel title'}
        {header_right_button && (
          <button className={`${styles.btn}`}>
            {header_right_button.text}
          </button>
        )}
      </h2>
      <div
        className={`${styles.pannel_data_container} ${
          expand ? styles.expand : ''
        }`}
      >
        {render()}
      </div>
    </div>
  );
};

export default Panel;
