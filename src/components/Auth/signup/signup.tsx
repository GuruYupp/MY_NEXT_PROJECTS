import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "@/components/Auth/signup/signup.module.scss";

interface FormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  MobileNumber: string;
}

export const SignUp = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };
  return (
    <div className={`${styles.signup_cont}`}>
      <div className={`${styles.signup_form}`}>
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.form}`}>
            <input
              type="text"
              id="firstName"
              placeholder="firstName"
              className={`${styles.input}`}
              {...register("firstName", {
                required: "First Name is required",
              })}
            />
            <p className={`${styles.error_msg}`}>{errors.firstName?.message}</p>
          </div>

          <div className={`${styles.form}`}>
            <input
              type="text"
              id="lastName"
              placeholder="lastName"
              className={`${styles.input}`}
              {...register("lastName", {
                required: "Last Name is required",
              })}
            />
            <p className={`${styles.error_msg}`}>{errors.lastName?.message}</p>
          </div>

          <div className={`${styles.form}`}>
            <input
              type="text"
              id="MobileNumber"
              className={`${styles.input}`}
              placeholder="Mobile Number"
              {...register("MobileNumber", {
                required: "MobileNumber is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid MobileNumber",
                },
              })}
            />
            <p className={`${styles.error_msg}`}>
              {errors.MobileNumber?.message}
            </p>
          </div>
          <div className={`${styles.form}`}>
            <input
              type="text"
              id="email"
              placeholder="email"
              className={`${styles.input}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <p className={`${styles.error_msg}`}>{errors.email?.message}</p>
          </div>

          <div className={`${styles.form}`}>
            <input
              type="password"
              id="password"
              placeholder="password"
              className={`${styles.input}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <p className={`${styles.error_msg}`}>{errors.password?.message}</p>
          </div>

          <button type="submit" className={`${styles.submit_button}`}>
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};
