import { useState } from "react";

interface OptionsInterface {
  [key: string]: string;
}

type selectedValueType = OptionsInterface[keyof OptionsInterface];

interface CustomSelectProps {
  selectedValue: selectedValueType;
  options: OptionsInterface;
  changeSelectedValue: () => void;
}

function CustomSelect(props: CustomSelectProps) {
  const { selectedValue, options, changeSelectedValue } = props;
  const [showoptions, setShowOptions] = useState<boolean>(false);
  return (
    <div>
      <span
        onClick={() => {
          setShowOptions(!showoptions);
        }}
      >
        {selectedValue}
      </span>
      {showoptions && (
        <ul>
          {Object.entries(options).map(([value], index) => {
            return (
              <li key={index} onClick={() => changeSelectedValue()}>
                {value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
