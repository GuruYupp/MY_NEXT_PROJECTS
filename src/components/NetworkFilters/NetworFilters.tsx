import { useAppSelector } from "@/redux/hooks";
import styles from "./NetworkFilters.module.scss";
import { getAbsolutPath } from "@/utils";

interface NetworkFiltersProps {
  closeModal: () => void;
}

function NetworkFilters(props: NetworkFiltersProps) {
  const { systemConfigs } = useAppSelector((state) => state.configs);
  const { networks } = systemConfigs;

  return (
    <div onClick={props.closeModal} className={`${styles.filter_container}`}>
      <div className={`${styles.partners}`}>
        {networks &&
          networks.length > 0 &&
          networks.map((network, index) => {
            return (
              <div className={`${styles.partner}`} key={index}>
                <img src={getAbsolutPath(network.iconUrl)} alt="" />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default NetworkFilters;
