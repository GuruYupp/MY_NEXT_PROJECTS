import { templateresponseInterface } from "@/shared";
import styles from "./ChannelOverlay.module.scss";
import { SyntheticEvent, useEffect, useRef } from "react";
import { getAbsolutPath } from "@/utils";
import getConfig from "next/config";
import Link from "next/link";
let appConfig = getConfig().publicRuntimeConfig.appconfig

interface ChannelOverlayTemplateProps{
  templateData: templateresponseInterface;
  closeModal: () => void;
}
export default function ChannelOverlayTemplate(props:ChannelOverlayTemplateProps) {

  const templateImageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null);
  const {templateData} = props
  const src = getAbsolutPath(templateData.image)


  useEffect(()=>{
    if(templateImageRef.current){
      const height = `${templateImageRef.current.clientWidth*0.5625}px`
      if(imageRef.current){
        imageRef.current.style.height = height
      }
    }
  },[])

  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute('src', appConfig.cardDefaultImage)
  }

  return (
  <div className={styles.channel_overlay} onClick={props.closeModal}>
      <div className={styles.channel_overlay_inner}>
        <div className={styles.channel_overlay_left_inner}>
          <div ref={templateImageRef}>
            <img
              src={src}
              alt="Picture of the author"
              loading="lazy"
              onError={handleImageonError}
              ref={imageRef}
            />
          </div>
        </div>
        <div className={styles.channel_overlay_right_inner}>
          <div className={styles.meta}>
            {templateData.shareName && <h2 className={styles.title}>
              {templateData.shareName}</h2>}
          </div>
          <div className={styles.buttons}>
            {templateData.show_signin === "true" && <Link href={`/${templateData.target_signin}`}>
              <span
                className={`${styles.btn} ${styles.signin_btn}`}
              >
                {templateData.signin}
              </span>
            </Link>}
            {templateData.show_favourite === "true" && <Link href={`/${templateData.target_favourite}`}>
              <span className={`${styles.btn} ${styles.favorite_btn}`}>
                <img src={`${appConfig.cloudpath + "/images/heart.svg"}`} alt="heart_svg"/>
               {templateData.favourite}
              </span>
            </Link>}
            {templateData.show_share === "true" &&
              <Link href={`/${templateData.target_share}`}>
                <span className={`${styles.btn} ${styles.share_btn}`}>
                  <img src={`${appConfig.cloudpath + "/images/share.svg"}`} alt="share_svg"/>
                  {templateData.share}
                </span>
              </Link>
            }
          </div>
        </div>
      </div>
  </div>
  );
}
