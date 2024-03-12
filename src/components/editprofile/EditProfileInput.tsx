import { FC, forwardRef, useState } from "react";
import styles from "./EditProfile.module.scss";
import { Controller, UseControllerProps, useController } from "react-hook-form";
import { EditProfileFormType } from "./editprofiletypes";
import DatePicker from "react-datepicker";

const EditProfileInput: FC<UseControllerProps<EditProfileFormType>> = (
  props,
) => {
  const { field } = useController(props);

  const type = props.name === "age" ? "number" : "text";
  const placeholder =
    props.name === "name"
      ? "Name"
      : props.name === "age"
        ? "Age"
        : "Mobile Number";

  const readOnly = props.name === "number";

  return (
    <input
      className={`${styles.input}`}
      {...field}
      type={type}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
};

const DobInput = forwardRef<HTMLInputElement>(function Input(props, ref) {
  return <input {...props} className={`${styles.input}`} ref={ref} readOnly />;
});

interface DateInputProps {
  handleDate: (args: Date) => void;
}
export const EditProfileDateInput: FC<
  UseControllerProps<EditProfileFormType> & DateInputProps
> = (props) => {
  const { control, name, handleDate } = props;
  const [dob, setDob] = useState<Date | null>(null);

  const handleDatechange = (date: Date) => {
    setDob(date);
    handleDate(date);
  };

  const getMinimumDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 100;
    return new Date(year, today.getMonth(), today.getDate());
  };

  return (
    <Controller
      control={control}
      name={name}
      render={() => {
        return (
          <DatePicker
            closeOnScroll
            selected={dob}
            placeholderText="MM/DD/YYYY"
            dateFormat="MM/dd/yyyy"
            onChange={handleDatechange}
            customInput={<DobInput />}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            withPortal
            maxDate={new Date()}
            minDate={getMinimumDate()}
            isClearable
          />
        );
      }}
    />
  );
};

export const EditProfileRadioInput: FC<
  UseControllerProps<EditProfileFormType>
> = (props) => {
  const { defaultValue } = props;
  const { field } = useController(props);

  const getRadioLabel = () => {
    if (defaultValue === "M") return "male";
    if (defaultValue === "F") return "female";
    if (defaultValue === "O") return "others";
  };

  return (
    <div className={`${styles.radio_input_container}`}>
      <div className={`${styles.radio_input_inner}`}>
        <input
          className={`${styles.radio_input}`}
          {...field}
          type="radio"
          value={defaultValue}
          checked={field.value === defaultValue}
        />
        <span className={`${styles.radio_dot}`}></span>
      </div>
      <span className={`${styles.radio_label}`}>{getRadioLabel()}</span>
    </div>
  );
};

export default EditProfileInput;
