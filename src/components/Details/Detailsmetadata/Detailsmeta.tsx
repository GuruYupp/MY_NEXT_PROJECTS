import { useAppSelector } from '@/redux/hooks';
import styles from './Detailsmeta.module.scss';
import getfrompagedata, { DetailsButtonType } from '../getfrompagedata';
import { dataRowElementInterface } from '@/shared';
import { Fragment, memo } from 'react';
import Link from 'next/link';
import appConfig from '@/app.config';





function DetailsMetaContainer(){
    const { content, pageButtons, shareInfo } = useAppSelector(state => state.pageData.response)
    let buttonTypes: DetailsButtonType[] = ["signin", "trailer", "watch_latest_episode","watchnow","resume","startover"]
    let buttons: dataRowElementInterface[] = []

    let title = getfrompagedata(content, "title")?.data || "";

    // let partnerIcon = getfrompagedata(content,"partnerIcon")?.data || "";
    let subtitle = getfrompagedata(content, "subtitle")?.data || "";
    let pgrating = getfrompagedata(content, "pgrating")?.data || "";

    let cast = getfrompagedata(content, "cast")?.data || "";
    cast = cast.split('|').join(',');

    let description = getfrompagedata(content, "description")?.data || "";
    let imdbrating = getfrompagedata(content,"imdb")?.data || "";
    let rentbtn = getfrompagedata(content,"rent")?.data || "";

    buttonTypes.map((button) => {
        let btn = getfrompagedata(content, button)
        btn && buttons.push(btn)
    })
    
    return (
        <div className={`${styles.DetailsMeta_Container}`}>
            <div className={`${styles.title} ${styles.meta_row}`}>{title}</div>
            <div className={`${styles.subtitle} ${styles.meta_row}`}>
                {subtitle}

                <span className={`${styles.rating} ${styles.meta_row}`}>
                    {pgrating}
                </span>
                <span className={`${styles.break}`}>|</span>
                <span className={`${styles.imdb} ${styles.meta_row}`}>
                    <img src={`${appConfig.cloudpath + "/images/imdb.png"}`} alt="play" />
                    {imdbrating}
                </span>
            </div>
            <div className={`${styles.description} ${styles.meta_row}`}>
                {description}
            </div>
            {cast && <div className={`${styles.cast} ${styles.meta_row}`}>Cast & Crew : {cast}</div>}
            <div className={`${styles.details_footer}`}>
                <div className={`${styles.buttons}`}>
                    {buttons.length > 0 &&
                        buttons.map((btn: any, index: number) => (
                            <Fragment key={index}>
                                {btn.elementSubtype === "signin" && (
                                    <Link href={`${btn.target}`}>
                                        <span
                                            className={`${styles.btn} ${styles.signin_btn}`}
                                            key={index}
                                        >
                                            {btn.data}
                                        </span>
                                    </Link>
                                )}
                                {btn.elementSubtype === "watch_latest_episode" && (
                                    <Link href={`${btn.target}`}>
                                        <span
                                            className={`${styles.btn} ${styles.watch_now}`}
                                            key={index}
                                        >
                                            {btn.data}
                                        </span>
                                    </Link>
                                )}
                                {btn.elementSubtype === "resume" && (
                                    <Link href={`${btn.target}`} >
                                        <span className={`${styles.btn} ${styles.resume_btn}`}>
                                            <img src={`${appConfig.cloudpath + "/images/play-circle-outline.svg"}`} alt="play"/>
                                        {btn.data}
                                    </span>
                                     </Link>
                                )}
                                {btn.elementSubtype === "startover" && (
                                    <Link href={`${btn.target}`}>
                                    <span className={`${styles.btn} ${styles.favorite_btn}`}>
                                        {btn.data}
                                    </span>
                                    </Link>
                                )}
                                {btn.elementSubtype === "watchnow" && (
                                    <Link href={`${btn.target}`}>
                                        <span
                                            className={`${styles.btn} ${styles.watch_latest}`}
                                            key={index}
                                        >
                                            {btn.data}
                                        </span>
                                    </Link>
                                )}
                                {btn.elementSubtype === "trailer" && (
                                    <Link href={`${btn.target}`}>
                                        <span
                                            className={`${styles.btn} ${styles.trailer_btn}`} key={index}
                                        >
                                            <img src={`${appConfig.cloudpath + "/images/trailer-icon-web.svg"}`} alt="trailer"/>
                                            {btn.data}
                                        </span>
                                    </Link>
                                )}
                                
                            </Fragment>
                        ))}
                    {rentbtn && (<span className={`${styles.btn} ${styles.rent_btn}`}>
                        {rentbtn}
                    </span>)}
                    {pageButtons.showFavouriteButton && (
                        <span className={`${styles.btn} ${styles.favorite_btn}`}>
                            <img src={`${appConfig.cloudpath + "/images/heart.svg"}`} alt='heart'/>
                            Add to Favorite
                        </span>
                    )}
                    {shareInfo.isSharingAllowed && (
                        <span className={`${styles.btn} ${styles.share_btn}`}>
                            <img src={`${appConfig.cloudpath + "/images/share.svg"}`} alt="share"/>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

const MemoDetailsMetaContainer = memo(DetailsMetaContainer)

export default MemoDetailsMetaContainer