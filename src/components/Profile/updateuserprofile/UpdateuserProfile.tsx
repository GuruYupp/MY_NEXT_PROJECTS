import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import styles from './UpdateuserProfile.module.scss';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import Modal from '@/components/modals/Modal';
import Getotp from '@/components/Getotp/Getotp';
import Languages from '@/components/languages/Languages';
import { getAbsolutPath } from '@/utils';
import Emojis from '@/components/emojis/Emojis';
import { ModalType } from '@/components/modals/modaltypes';
import { emojiInterface } from '@/components/emojis/emojitypes';
import appConfig from '@/app.config';

interface UpdateuserProfileForm {
  profileName: string;
  languagesVisible?: string;
  languagesHidden?: string;
}

export default function UpdateuserProfile() {
  const { query } = useRouter();
  const { userDetails } = useAppSelector((state) => state.user);
  const defaultprofileimg =
    'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg';
  let Profile = userDetails?.profileParentalDetails?.filter(
    (profile) => profile.profileId?.toString() === query.userId
  )[0];

  const [profileImg, setprofileImg] = useState<string>(Profile?.imageUrl || '');

  const [showModal, setShowModal] = useState<ModalType>('');

  const getDefaultProfileLangs = () => {
    if (Profile) {
      const { langs } = Profile;
      return langs || '';
    }
    return '';
  };

  const { register, getValues, setValue } = useForm<UpdateuserProfileForm>({
    mode: 'onChange',
    defaultValues: {
      profileName: Profile?.name || '',
      languagesVisible: getDefaultProfileLangs()
        .split(',')
        .slice(0, 3)
        .join(','),
      languagesHidden: getDefaultProfileLangs(),
    },
  });

  const handlecloseModal = () => {
    document.body.style.overflowY = 'scroll';
    setShowModal('');
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case 'languages':
        let codes = data
          .filter((data: any) => data.isSelected)
          .map((data: any) => data.code);
        setValue('languagesVisible', codes.slice(0, 3).join(','));
        setValue('languagesHidden', codes.join(','));
        break;
      case 'emojis':
        data.map((emoji: emojiInterface) => {
          setprofileImg(emoji.imageUrl);
        });
        break;
      default:
        break;
    }
  }

  function editLanguage() {
    document.body.style.overflowY = 'hidden';
    setShowModal('languages');
  }

  function handleMaturityEdit() {
    document.body.style.overflowY = 'hidden';
    setShowModal('getotp');
  }

  function handleProfileImage() {
    document.body.style.overflowY = 'hidden';
    setShowModal('emojis');
  }

  const getLanguages = ()=>{
    return getValues().languagesHidden || ""
  }

  return (
    <div className={`${styles.profileUpdate_container}`}>
      <div className={`${styles.profileUpdate_header}`}>Edit Profile</div>
      <div className={`${styles.profileUpdate_mobile_header}`}>
        <h3 className={`${styles.text}`}>
          <img
            src="https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/back-arrow.svg"
            alt="back"
          />
          Edit Profile
        </h3>
      </div>
      <form>
        <div className={`${styles.profileUpdate_body}`}>
          <div className={`${styles.profile_img_container}`}>
            <img
              src={`${
                profileImg ? getAbsolutPath(profileImg) : defaultprofileimg
              }`}
              alt=""
            />
            <img
              src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/edit-profile.svg`}
              alt=""
              className={`${styles.edit_icon}`}
              onClick={handleProfileImage}
            />
          </div>
          <div className={`${styles.profile_edit_container}`}>
            <div className={`${styles.profile_edit_container_inputs}`}>
              <label>
                <input {...register('profileName')} />
                <span className={`${styles.lable_title}`}>Profile Name</span>
              </label>
              {
                appConfig.profile.languages === true && (<label>
                  <input
                    {...register('languagesVisible')}
                    readOnly
                    onClick={editLanguage}
                  />
                  <input
                    {...register('languagesHidden')}
                    readOnly
                    onClick={editLanguage}
                    style={{ display: 'none' }}
                  />
                  <span className={`${styles.lable_title}`}>Language</span>
                  {(getLanguages().split(',')?.length > 3) && (
                    <span className={`${styles.more_langs}`}>
                      <span className={`${styles.text}`}>
                        +{getLanguages().split(',').length - 3}{' '}
                        more...
                      </span>
                    </span>
                  )}
                </label>)
              }
            
            </div>
            <div className={`${styles.profile_edit_container_btns}`}>
              <div className={`${styles.heading}`}>Maturity Settings:</div>
              <div className={`${styles.btns}`}>
                <button
                  className={`${styles.btn} ${styles.adult_btn}`}
                  disabled
                >
                  {Profile && Profile.profileRating || "All maturity Ratings"}
                </button>
                <button
                  className={`${styles.btn}`}
                  type="button"
                  onClick={() => handleMaturityEdit()}
                >
                  Edit
                </button>
              </div>
              <div className={`${styles.subtitle}`}>
                Show titles of {Profile && Profile.profileRating} for this
                profile
              </div>
              {Profile &&
                Profile.isMasterProfile &&
                Profile.isProfileLockActive && (
                  <div className={`${styles.profile_locK_container}`}>
                    <p>
                      <img
                        src="https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/profile-lock.svg"
                        alt="profile lock"
                        className={`${styles.lock_icon}`}
                      ></img>
                      <span className={`${styles.text}`}> Profile Lock</span>
                      <span className={`${styles.text} ${styles.lock_enable}`}>
                        {' '}
                        OFF
                      </span>
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className={`${styles.profileUpdate_footer}`}>
          <div className={`${styles.btns}`}>
            <button className={`${styles.btn}`} type="button">
              Cancel
            </button>
            {Profile && !Profile.isMasterProfile && (
              <button className={`${styles.btn}`} type="button">
                Delete Profile
              </button>
            )}

            <button
              className={`${styles.btn} ${styles.save_btn}`}
              type="submit"
            >
              Save
            </button>
          </div>
        </div>

        <div className={`${styles.profileUpdate_mobile_footer}`}>
          {Profile && Profile.isMasterProfile && (
            <div className={`${styles.delete}`}>
              <button className={`${styles.btn}`}>
                <img
                  src="https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/delete-icon.svg"
                  alt="delete"
                ></img>
                Delete Profile
              </button>
            </div>
          )}
          <div className={`${styles.btns}`}>
            <button className={`${styles.btn}`}>Cancel</button>
            <button className={`${styles.btn} ${styles.save_btn}`}>Save</button>
          </div>
        </div>
      </form>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                console.log(modal);
                switch (modal) {
                  case 'getotp':
                    return <Getotp closeModal={handlecloseModal} type='Viewing Restrictions' profileData={Profile} isPasswordOtp={appConfig.profile.type === "password"}/>;
                  case 'languages':
                    return (
                      <Languages
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        profileData={Profile}
                      />
                    );
                  case 'emojis':
                    return (
                      <Emojis
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
    </div>
  );
}
