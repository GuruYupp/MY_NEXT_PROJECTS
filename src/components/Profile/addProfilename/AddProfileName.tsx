import { useAppSelector } from "@/redux/hooks";
import styles from "./AddProfileName.module.scss";
import { useForm } from "react-hook-form";
import { FormEvent } from "react";
import { getData, postData } from "@/services/data.manager";
import { useRouter } from "next/router";

interface AddProfileNameForm {
  name: string;
}
function AddProfileName() {
  const { userDetails } = useAppSelector((state) => state.user);
  const {systemConfigs:{contentLanguages}} = useAppSelector((state)=>state.configs)
  const {replace} = useRouter()

  const { register, formState,watch ,getValues} = useForm<AddProfileNameForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const watch_name = watch("name")

 
  const getMasterProfile = ()=>{
    return userDetails?.profileParentalDetails?.filter((profile)=>profile.isMasterProfile)
  }

  const getSelectedLangs = ()=>{
    let codes:string[] = []
    contentLanguages?.map((lang)=>{
      codes.push(lang.code)
    })
    return codes
  }

  const handleSubmit = async (e:FormEvent)=>{
    e.preventDefault()
    let MatserProfile = getMasterProfile() || [];
    let post_data = {
      'profileName': `${getValues().name}`,
      'profileId': MatserProfile[0]?.profileId,
      'isChildren': MatserProfile[0]?.isChildren,
      "isProfileLockActive": MatserProfile[0].isProfileLockActive,
      "langs": getSelectedLangs().join(',')
    }

    const add_profile_res = await postData('/service/api/auth/update/user/profile',post_data)
    if(add_profile_res.status === true){
      const user_info = await getData("/service/api/auth/user/info")
      if (user_info.status === true) {
        localStorage.setItem("userDetails", JSON.stringify(user_info.response));
        replace("/profiles/select-user-profile");
      }
    }

  }

  return (
    <div className={`${styles.add_profile_container}`}>
      <div className={`${styles.add_profile_inner}`}>
        <div className={`${styles.header}`}>
          <h3 className={`${styles.title}`}>Name Your Profile</h3>
          <p className={`${styles.subtitle}`}>
            What would you like to be called?
          </p>
        </div>
        <div className={`${styles.body}`}>
          <form onSubmit={handleSubmit}>
            <div className={`${styles.input_container}`}>
              <label className={`${styles.label}`}>Your profile Name</label>
              <input {...(register("name",{required:true,minLength:4}))} />
            </div>
            <div className={`${styles.messages}`}>
              {(formState.errors.name?.type === "required") && <span className={`${styles.error}`}>name is required</span>}
              {(formState.errors.name?.type === "minLength") && <span className={`${styles.error}`}>name should be minumum 4 letters</span>}
            </div>
            
            <button
              type="submit"
              className={`${styles.continue_btn}`}
              disabled={(!watch_name || watch_name.length<4)}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProfileName;
