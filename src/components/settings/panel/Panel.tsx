import { FC, ReactNode, useState } from 'react';
import styles from './Panel.module.scss';
interface PanelPropsInterface {
  title?: string;
  toggle?: boolean;
  defaultopen?: boolean;
  render: () => ReactNode;
  headerrightbutton?: {
    text: string;
  };
}

const Panel: FC<PanelPropsInterface> = ({
  title,
  render,
  toggle = true,
  defaultopen = false,
  headerrightbutton = undefined,
}) => {
  const expandDefault = () => {
    if (toggle === true) {
      if (defaultopen === true) return true;
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
        {headerrightbutton && (
          <button className={`${styles.btn}`}>
            {headerrightbutton.text}
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
