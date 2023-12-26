import styles from './Settings.module.scss';
import AccountDetails from '@/components/settings/accountdetails/AccountDetails';
import ActiveScreens from '@/components/settings/activescreens/ActiveScreens';
import Panel from '@/components/settings/panel/Panel';
import Subscriptions from '@/components/settings/subscriptions/Subscriptions';
import ProfileParentalControls from '@/components/settings/profileparentalcontrols/ProfileParentalcontrols';
import UserSettings from './usersettings/UserSettings';

function Settings() {
  return (
    <div className={`${styles.settings_page}`}>
      <div className={`${styles.settings_container}`}>
        <div className={`${styles.settings_inner_container}`}>
          <div className={`${styles.settings_details_container}`}>
            <div className={`${styles.settings_details_inner}`}>
              <Panel
                title="Account Details"
                default_open={true}
                render={() => <AccountDetails />}
              />
              <Panel
                title="Active Screens & Devices"
                render={() => <ActiveScreens />}
                header_right_button={{ text: 'Activate Tv' }}
              />
              <Panel
                title="Subscription"
                toggle={false}
                render={() => <Subscriptions />}
                header_right_button={{ text: 'Explore Plans' }}
              />
              <Panel title="User Settings" render={() => <UserSettings />} />
              <Panel
                title="Profile & Parental Controls"
                render={() => <ProfileParentalControls />}
                toggle={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
