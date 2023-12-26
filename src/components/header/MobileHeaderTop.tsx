import Link from "next/link";
import styles from "./header.module.scss";
import appConfig from "@/app.config";

export default function MobileHeaderTop(): JSX.Element {
  return (
      <div className={`${styles.mobile_header_top}`}>
        <div className={`${styles.logo}`}>
          <img
            src={`${appConfig.headerIconpath}`}
            width={85}
            height={30}
            alt="logo"
          />
        </div>
        <div className={`${styles.serach_icon}`}>
          <Link href="/search">
            <img
              src={`https://d2ivesio5kogrp.cloudfront.net/static/kandidtv/images/search-icon.svg`}
              alt="logo"
            />
          </Link>
        </div>
      </div>
  );
}
