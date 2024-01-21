import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/router"
import styles from './ViewRestrictions.module.scss'
import { getAbsolutPath } from "@/utils"

function ViewRestrictions(){
  const {query,back} = useRouter()
  const { enableRestrictionpage } = useAppSelector((state)=>state.pagerestrictions)
  const { userDetails } = useAppSelector((state) => state.user);
  const defaultprofileimg =
    'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg';
  let Profile = userDetails?.profileParentalDetails?.filter(
    (profile) => profile.profileId?.toString() === query.userId
  )[0];
  if(enableRestrictionpage === false){
    back()
  }
  return <div className={`${styles.parenatal_container}`}>
    <div className={`${styles.inner}`}>
      <div className={`${styles.header}`}>Viewing Restrictions</div>
      <div className={`${styles.body}`}>
        <div className={`${styles.left}`}>
          <div className={`${styles.profile_icon}`}>
            <img
              src={`${Profile?.imageUrl ? getAbsolutPath(Profile.imageUrl) : defaultprofileimg}`}
              alt=""
            />
          </div>
        </div>
        <div className={`${styles.right}`}>
          <p className={`${styles.heading}`}>Profile Maturity Ratings for {Profile?.name}</p>
          <p className={`${styles.subheading}`}>
            Show all titles of rated <span className={`${styles.rating}`}>'{Profile?.profileRating}'</span> for this profile.
          </p>
          {/* restriction pins */}
          <div className={`${styles.restrictionContainer}`}>
            <p className={`${styles.heading}`}>Title Restrictions for {Profile?.name}</p>
            <p className={`${styles.subheading}`}>
              Don’t show specific titles for this profile regardless of Maturity Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default ViewRestrictions