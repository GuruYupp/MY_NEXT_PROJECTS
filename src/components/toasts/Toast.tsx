import { useEffect, useRef } from "react";
import styles from "./Toast.module.scss";
interface ToastProps {
  message: string;
  opendelay?: number;
  duration?: number;
}
const Toast = (props: ToastProps) => {
  const { message, duration = 2500, opendelay = 500 } = props;
  console.log(message);

  const toastRef = useRef<HTMLDivElement>(null);
  const toasttimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setTimeout(() => {
      toastRef.current?.classList.add(styles.animate);
    }, opendelay);
    toasttimer.current = setTimeout(() => {
      toastRef.current?.classList.remove(styles.animate);
    }, duration);
    return () => {
      if (toasttimer.current) {
        clearTimeout(toasttimer.current);
      }
    };
  }, []);

  return (
    <div className={`${styles.toast}`} ref={toastRef}>
      <p className={`${styles.message}`}>{message}</p>
    </div>
  );
};

export default Toast;
