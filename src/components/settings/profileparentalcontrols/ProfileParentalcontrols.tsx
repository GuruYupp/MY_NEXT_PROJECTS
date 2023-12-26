import { FC, useEffect, useState } from 'react';
import styles from './ProfileParentalcontrols.module.scss';
import ProfileParentalControlPanel from './profileparentalcontrolpanel/ProfileParentalControlPanel';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProfiles } from '@/redux/feature/userSlice/userSlice';

const ProfileParentalControls: FC = () => {
  const [activepanelindex, setActivePanelIndex] = useState<number>(-1);
  // const activePanelRef = useRef<HTMLDivElement>(null);
  const setActiveIndex = (index: number) => {
    setActivePanelIndex(index === activepanelindex ? -1 : index);
  };

  const { profiles } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, []);

  return (
    <div className={`${styles.controls_container}`}>
      {profiles.map((profile, index) => (
        <ProfileParentalControlPanel
          key={index}
          isActive={activepanelindex === index}
          setActiveIndex={setActiveIndex}
          panelIndex={index}
          profileId={profile.profileId}
        />
      ))}
    </div>
  );
};

export default ProfileParentalControls;
