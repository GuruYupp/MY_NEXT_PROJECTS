import styles from './Subscriptions.module.scss';
import { setActivepackages } from '@/redux/feature/userSlice/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getData } from '@/services/data.manager';
import { plansInterface } from '@/shared';
import { FC, useEffect } from 'react';

const NoPlansRow: FC = () => (
  <div className={`${styles.no_plans_row}`}>
    <h6 className={`${styles.heading1}`}>
      You do not have an active subscription
    </h6>
    <h6 className={`${styles.heading2}`}>Explore Subscription plans</h6>
  </div>
);

const PlansRow:FC<{plan:plansInterface}> = (props)=>{
  const {plan} = props
  return <div className={`${styles.no_plans_row}`}>
    <h6 className={`${styles.heading1}`}>
      {plan.name}  {plan.packageType} {plan.isCurrentlyActivePlan && '(Current Plan)'}
    </h6>
    <h6 className={`${styles.heading2}`}>{plan.currencySymbol}{plan.saleAmount} / {plan.packageType}</h6>
    <h6 className={`${styles.heading2}`}>{plan.message}</h6>
  </div>
}

const Subscriptions: FC = () => {
  const { activePackages } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const fetchPackages = async () => {
    let packages_response = await getData(
      '/service/api/auth/user/activepackages'
    );
    if (packages_response.status === true) {
      localStorage.setItem(
        'activePackages',
        JSON.stringify(packages_response.response)
      );
      dispatch(setActivepackages());
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className={`${styles.subscription_details_container}`}>
      <div className={`${styles.plans_container}`}>
        {activePackages.length === 0 && <NoPlansRow />}
        {activePackages.length > 0 && (activePackages.map((plan:plansInterface,index)=>{
          return <PlansRow key={index} plan={plan}/>
        })
        )}
        <div className={`${styles.plans_transaction}`}>
          <span className={`${styles.label}`}>Transaction History</span>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
