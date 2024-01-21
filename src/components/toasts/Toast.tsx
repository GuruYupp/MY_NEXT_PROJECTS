import { useEffect, useRef } from 'react';
import styles from './Toast.module.scss'
interface ToastProps{
  message:string;
}
const Toast = (props:ToastProps)=>{
  const { message, } = props;
  console.log(message);

  const toastRef = useRef<HTMLDivElement>(null)
  const toasttimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(()=>{
   setTimeout(()=>{
     toastRef.current?.classList.add(styles.animate)
   },1000)
    toasttimer.current = setTimeout(()=>{
      toastRef.current?.classList.remove(styles.animate)
    },2500)
    return()=>{
      if(toasttimer.current){
        clearTimeout(toasttimer.current)
      }
    }
  },[])
  
  return <div className={`${styles.toast}`} ref={toastRef}>
    <p className={`${styles.message}`}>{message}</p>
  </div>
}

export default Toast;