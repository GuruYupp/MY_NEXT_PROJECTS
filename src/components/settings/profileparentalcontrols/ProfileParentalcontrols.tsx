import { FC, useEffect, useState } from "react";
import styles from "./ProfileParentalcontrols.module.scss";
import ProfileParentalControlPanel from "./profileparentalcontrolpanel/ProfileParentalControlPanel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProfiles } from "@/redux/feature/userSlice/userSlice";
import UserParentalControlPanel from "./userparentalcontrolpanel/UserParentalControlPanel";

const ProfileParentalControls: FC = () => {
  const [activepanelindex, setActivePanelIndex] = useState<number>(-1);
  // const activePanelRef = useRef<HTMLDivElement>(null);
  const setActiveIndex = (index: number) => {
    setActivePanelIndex(index === activepanelindex ? -1 : index);
  };

  const { profiles } = useAppSelector((state) => state.user);
  const { systemFeatures } = useAppSelector((state) => state.configs);
  const dispatch = useAppDispatch();

  const isProfileSettingsEnabled = () =>
    systemFeatures?.userprofiles &&
    systemFeatures?.userprofiles?.fields.is_userprofiles_supported == "true";

  useEffect(() => {
    dispatch(fetchProfiles());
  }, []);

  return (
    <div className={`${styles.controls_container}`}>
      {isProfileSettingsEnabled() &&
        profiles.map((profile, index) => (
          <ProfileParentalControlPanel
            key={index}
            isActive={activepanelindex === index}
            setActiveIndex={setActiveIndex}
            panelIndex={index}
            profileId={profile.profileId}
          />
        ))}
      {!isProfileSettingsEnabled() && (
        <UserParentalControlPanel
          isActive={true}
          setActiveIndex={setActiveIndex}
          toggle={false}
          panelIndex={0}
        />
      )}
    </div>
  );
};

export default ProfileParentalControls;
