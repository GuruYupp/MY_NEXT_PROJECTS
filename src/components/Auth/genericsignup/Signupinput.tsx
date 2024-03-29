import { FC, forwardRef, useState } from "react";
import styles from "./Genericsignup.module.scss";
import { Controller, UseControllerProps, useController } from "react-hook-form";
import { SingnupFormType } from "./genericsignuptypes";
import DatePicker from "react-datepicker";

const DobInput = forwardRef<HTMLInputElement>(function Input(props, ref) {
  return <input {...props} className={`${styles.input}`} ref={ref} readOnly />;
});

interface DateInputProps {
  handleDate: (args: Date) => void;
}
export const DateInput: FC<
  UseControllerProps<SingnupFormType> & DateInputProps
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

export const RadioInput: FC<UseControllerProps<SingnupFormType>> = (props) => {
  const { defaultValue } = props;
  const { field } = useController(props);
  return (
    <div className={`${styles.radio_input_container}`}>
      <div className={`${styles.radio_input_inner}`}>
        <input
          className={`${styles.radio_input}`}
          {...field}
          type="radio"
          value={defaultValue}
        />
        <span className={`${styles.radio_dot}`}></span>
      </div>
      <span className={`${styles.radio_label}`}>{defaultValue}</span>
    </div>
  );
};
