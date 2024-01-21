import styles from './Settings.module.scss';
import AccountDetails from '@/components/settings/accountdetails/AccountDetails';
import ActiveScreens from '@/components/settings/activescreens/ActiveScreens';
import Panel from '@/components/settings/panel/Panel';
import Subscriptions from '@/components/settings/subscriptions/Subscriptions';
import ProfileParentalControls from '@/components/settings/profileparentalcontrols/ProfileParentalcontrols';
import UserSettings from './usersettings/UserSettings';
import { useAppSelector } from '@/redux/hooks';

function Settings() {
  const {systemFeatures,systemConfigs} = useAppSelector(state=>state.configs)

  const isProfileSettingsEnabled = () => (systemFeatures?.userprofiles && systemFeatures?.userprofiles?.fields.is_userprofiles_supported == 'true')
  return (
    <div className={`${styles.settings_page}`}>
      <div className={`${styles.settings_container}`}>
        <div className={`${styles.settings_inner_container}`}>
          <div className={`${styles.settings_details_container}`}>
            <div className={`${styles.settings_details_inner}`}>
              <Panel
                title="Account Details"
                defaultopen={true}
                render={() => <AccountDetails />}
              />
              <Panel
                title="Active Screens & Devices"
                render={() => <ActiveScreens />}
                headerrightbutton={{ text: 'Activate Tv' }}
              />
              {systemConfigs?.configs?.showPackages === 'true' && (<Panel
                title="Subscription"
                toggle={false}
                render={() => <Subscriptions />}
                headerrightbutton={{ text: 'Explore Plans' }}
              />)}
              
              <Panel title="User Settings" render={() => <UserSettings />} />
              {isProfileSettingsEnabled() && <Panel
                title="Profile & Parental Controls"
                render={() => <ProfileParentalControls />}
                toggle={false}
              />}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
