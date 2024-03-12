import styles from "./footer.module.scss";
import Link from "next/link";
import { memo } from "react";
import appConfig from "@/app.config";
function Footer(): JSX.Element {
  return (
    <div>
      <div className={`${styles.footer_container}`}>
        <div className={`${styles.footerDivider}`}>
          <div className={`${styles.footerLeft}`}>
            {/* <img src={`${appConfig.cloudpath}/images/RD_Footer_image.png`} alt="footerImg" /> */}
            <p>
              ©2019 Watcho. All Rights Reserved. www.watcho.com or abbreviated
              Watcho is an online video streaming service where visitors can
              access a variety of films, web series, Live TV serials, user
              generated content, etc., for which viewing rights are given by
              content copyright holders. Watcho and all related channel and
              programming logos are service marks of, and all related
              programming audio-visuals and elements are the property of Dish
              Infra Services Private Limited.
            </p>
          </div>
          <div className={`${styles.footerRight}`}>
            {/* <h2>Watch YuppTV anywhere anytime</h2> */}
            {/* <p >Download our top-rated app, made just for you!<br/> It’s free, easy and smart.</p> */}
            <div className={`${styles.deviceList_1}`}>
              <span>TV App's</span>
              <ul>
                <li>
                  <Link
                    target="_blank"
                    href="https://play.google.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="androidtv"
                      src={`${appConfig.cloudpath}/images/multi-device-android-tv.png`}
                    />
                  </Link>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://play.google.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="androidtv"
                      src={`${appConfig.cloudpath}/images/multi-device-fire-tv.png`}
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://channelstore.roku.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="rokutv"
                      src={`${appConfig.cloudpath}/images/roku-tv.png`}
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://itunes.apple.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="apple"
                      src={`${appConfig.cloudpath}/images/multi-device-apple-tv.png`}
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://itunes.apple.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="apple"
                      src={`${appConfig.cloudpath}/images/multi-device-apple-tv.png`}
                    />
                  </a>
                </li>
                {/* <li>
                                <a target="_blank" href="https://us.lgappstv.com/main/tvapp" rel="noopener noreferrer">
                                    <img alt="lgtv" src={`${appConfig.cloudpath}/images/multi-device-lg.png`}/ ></a>
                            </li>
                            <li>
                                <a target="_blank" href="https://www.samsung.com/in/apps/galaxy-store/" rel="noopener noreferrer">
                                    <img alt="samsung" src={`${appConfig.cloudpath}/images/multi-device-samsung.png`}/></a>
                            </li> */}
              </ul>
            </div>

            <div className={`${styles.deviceList_1}`}>
              <span>mobile apps</span>
              <ul>
                <li>
                  <a
                    target="_blank"
                    href="https://itunes.apple.com/"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="iosapp"
                      src={`${appConfig.cloudpath}/images/multi-device-ios-2.png`}
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="http://ottapps.revlet.net/apps/android/yvs/YVS_V0.1.apk"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="android-mobile"
                      src={`${appConfig.cloudpath}/images/multi-device-android-mobile.png`}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.bottomLinks}`}>
        <div className={`${styles.bottomLeft}`}>
          <ul>
            <li>
              <a>Privacy Policy</a>
            </li>
            <li>
              <a>Terms & Conditions</a>
            </li>
            <li>
              <a>Help Center</a>
            </li>
            <li>
              <a>Contact Us</a>
            </li>
          </ul>
        </div>
        <div className={`${styles.bottomRight}`}>
          <ul>
            <li>Connect with us :</li>
            <li>
              <a>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/ott-facebook-follow.svg"
                  alt="facebook"
                />
              </a>
            </li>
            <li>
              <a>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/ott-instagram-follow.svg"
                  alt="instagram"
                />
              </a>
            </li>
            <li>
              <a>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/ott-twitter-follow.svg"
                  alt="twitter"
                />
              </a>
            </li>
            <li>
              <a>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/ott-linkedin-follow.svg"
                  alt="linkedin"
                />
              </a>
            </li>
            <li>
              <a>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/ott-youtube-follow.svg"
                  alt="youtube"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const MemoFooter = memo(Footer);

export default MemoFooter;
