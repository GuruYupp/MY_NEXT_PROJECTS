import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from '../header.module.scss';
import { SyntheticEvent } from 'react';
import Link from 'next/link';
import { subprofileInterface } from '@/shared';
import { getData, postData } from '@/services/data.manager';
import { useRouter } from 'next/router';
import {
  updateActiveProfile,
  updateUserDetails,
} from '@/redux/feature/userSlice/userSlice';
export default function ProfileMenus() {
  const { systemFeatures } = useAppSelector((state) => state.configs);
  const { userDetails, activeProfile } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const { replace } = useRouter();

  const handleprofileImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute(
      'src',
      'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg'
    );
  };

  function LoadHelpCenter() {
    if (userDetails) {
      window.open(
        `https://web-qa.watcho.com/contact-us?a_t=${userDetails?.authToken}&sid=${userDetails?.externalUserId}&mno=${userDetails?.phoneNumber}`
      );
    }
  }

  function goToFaq() {
    window.open('https://faq.watcho.com/');
  }

  function handleSignout() {
    document.body.style.overflowY = 'hidden';
    // setShowModal("signout");
  }

  function handleSelectProfile(profile: subprofileInterface) {
    if (profile.isProfileLockActive === true) {
    } else {
      switchSelectedProfile(profile);
    }
  }

  function switchSelectedProfile(profile: subprofileInterface) {
    postData('/service/api/auth/activate/user/profile', {
      profileId: profile.profileId,
    }).then((data) => {
      if (data.status === true) {
        getData('/service/api/auth/user/info').then((data) => {
          if (data.status === true) {
            localStorage.setItem('userDetails', JSON.stringify(data.response));
            localStorage.setItem('activeProfile', JSON.stringify(profile));
            dispatch(updateUserDetails(data.response));
            dispatch(updateActiveProfile(profile));
          }
        });
      }
    });
  }

  function hadleExitProfile() {
    localStorage.setItem('activeProfile', '');
    replace('/profiles/select-user-profile');
  }

  return (
    <div className={`${styles.profile_box}`}>
      {systemFeatures?.userprofiles?.fields?.is_userprofiles_supported ===
        'true' && (
        <>
          <span className={`${styles.profile_img}`}>
            <img
              src={
                (activeProfile && activeProfile?.imageUrl) ||
                'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg'
              }
              onError={handleprofileImageonError}
              alt="profile"
            />
          </span>
          <span className={`${styles.profile_name}`}>
            {activeProfile && activeProfile?.name}
          </span>
        </>
      )}
      <div className={`${styles.profile_menu}`}>
        <ul>
          <li>
            <Link href={'/favorites'}>My Favorites</Link>
          </li>
          <li>
            <Link href={'/settings'}>Account Settings</Link>
          </li>
          <li className={`${styles.divider}`}></li>
          <li onClick={LoadHelpCenter}>Help & Support</li>
          <li onClick={goToFaq}>FAQ</li>
          <li onClick={handleSignout}>Sign Out</li>
        </ul>
        <ul>
          {userDetails &&
            userDetails.profileParentalDetails?.map(
              (profile, index: number) => {
                return (
                  profile.profileId !== userDetails.profileId && (
                    <li
                      className={`${styles.menu_profile}`}
                      key={index}
                      onClick={() => handleSelectProfile(profile)}
                    >
                      <span className={`${styles.menu_profile_img}`}>
                        <img
                          src={
                            (profile && profile?.imageUrl) ||
                            'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg'
                          }
                          onError={handleprofileImageonError}
                          alt="profile"
                        />
                      </span>
                      <span className={`${styles.menu_profile_name}`}>{profile && profile?.name}</span>
                      {profile?.isProfileLockActive && (
                        <img
                          src={`https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/lock-icon.svg`}
                          alt=""
                          className={`${styles.lock_icon}`}
                        />
                      )}
                    </li>
                  )
                );
              }
            )}
          <li className={`${styles.divider}`}></li>
          <li onClick={hadleExitProfile}>Exit Profile</li>
          <li>
            <Link href={`/profiles/manage-user-profile`}>Manage Profile</Link>{' '}
          </li>
        </ul>
      </div>
    </div>
  );
}
