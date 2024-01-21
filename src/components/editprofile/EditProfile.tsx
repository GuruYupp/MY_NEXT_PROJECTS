import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./EditProfile.module.scss";
import { EditProfileFormType } from "./editprofiletypes";
import EditProfileInput, {  EditProfileRadioInput } from "./EditProfileInput";
import { useAppSelector } from "@/redux/hooks";
import { DevTool } from "@hookform/devtools";
import { postData } from "@/services/data.manager";
import { useRouter } from "next/router";


const EditProfile = () => {
  const { userDetails } = useAppSelector((state) => state.user)
  const { formState, control,handleSubmit} = useForm<EditProfileFormType>({defaultValues:{gender:userDetails?.gender || ''}});

  const router = useRouter();

  // const handleDate = useCallback((date: Date) => {
  //   setValue("dob", date?.toString() || "", {
  //     shouldDirty: false,
  //   });
  // }, []);

  const isAtLeastOneFieldTouched = ()=> Object.keys(formState.touchedFields).length > 0
  

  const onSubmit: SubmitHandler<EditProfileFormType> = async (formData)=>{
    if(!isAtLeastOneFieldTouched()) return;
    const {age,name,gender} = formData
    let postData = {
      age:age.toString(),
      // eslint-disable-next-line camelcase
      first_name: name,
      // eslint-disable-next-line camelcase
      last_name: '',
      gender: gender
    }
    updateUserDetails(postData)
  }

  const updateUserDetails = async (payload:unknown)=>{
    let updateresponse = await postData("/service/api/auth/update/preference", payload)
    if(updateresponse.status === true){
      router.replace('/settings')
    }
  }

  const handleCancel = ()=>{
    router.replace('/settings')
  }


  return (
    <div className={`${styles.editprofile_container}`}>
      <div className={`${styles.editprofile_inner}`}>
        <p className={`${styles.title}`}>Enter your details</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.form_container}`}>
            <div className={`${styles.name_number_inputs}`}>
              <div className={`${styles.input_container}`}>
                <EditProfileInput
                  name="name"
                  rules={{
                    required: "This is required",
                    // validate: {
                    //   matchPattern: (v) => appConfig.authEmailPattern.test(v)
                    // },
                    // validate: (value, _formvalues) => {
                    //   if (!appConfig.authEmailPattern.test(value)) {
                    //     return "Enter a valid email address";
                    //   }
                    // },
                  }}
                  shouldUnregister={true}
                  control={control}
                  defaultValue={userDetails?.name}
                />
                {formState.errors.name && (
                  <p className={`${styles.input_error_msg}`}>
                    {formState.errors.name?.message}
                  </p>
                )}
              </div>

              <div className={`${styles.input_container}`}>
                <EditProfileInput
                  name="number"
                  // rules={{
                  //   required: "This is required",
                  //   // validate: {
                  //   //   matchPattern: (v) => appConfig.authEmailPattern.test(v)
                  //   // },
                  //   validate: (value, _formvalues) => {
                  //     if (!appConfig.authEmailPattern.test(value)) {
                  //       return "Enter a valid email address";
                  //     }
                  //   },
                  // }}
                  shouldUnregister={true}
                  control={control}
                  defaultValue={userDetails?.phoneNumber?.split('-')[1]}
                />
                {formState.errors.number && (
                  <p className={`${styles.input_error_msg}`}>
                    {formState.errors.number?.message}
                  </p>
                )}
              </div>
            </div>

            <div className={`${styles.input_container} ${styles.age_input_container}`}>
              <EditProfileInput
                name="age"
                rules={{
                  required: "This is required",
                  validate: (value, _formvalues) => {
                    if (value as number < 18) {
                      return "Age must be at least 18.";
                    }
                  },
                }}
                shouldUnregister={true}
                control={control}
                defaultValue={userDetails?.age || 0}
                
              />
              {formState.errors.age && (
                <p className={`${styles.input_error_msg}`}>
                  {formState.errors.age?.message}
                </p>
              )}
            </div>

            <div className={`${styles.radio_inputs}`}>
              <span className={`${styles.label}`}>Gender:</span>
              <EditProfileRadioInput
                control={control}
                name="gender"
                defaultValue="M"
                
              />
              <EditProfileRadioInput
                control={control}
                name="gender"
                defaultValue="F"
                
              />
              <EditProfileRadioInput
                control={control}
                name="gender"
                defaultValue="O"
                
              />
            </div>

            <div className={`${styles.editprofile_btns}`}>
              <button className={`${styles.btn} ${styles.cancel}`} onClick={handleCancel}>Cancel</button>
              <button type="submit" className={`${styles.btn} ${styles.submit}`}>Submit</button>
            </div>

            {/* <div
              className={`${styles.input_container} ${styles.dob_input_container}`}
            >
              <EditProfileDateInput
                control={control}
                name="dob"
                handleDate={handleDate}
              />
            </div> */}

          </div>
        </form>
        <p className={`${styles.info}`}>Note: The fields marked with * mark are mandatory.</p>
      </div>
      <DevTool control={control}/>
    </div>
  );
};

export default EditProfile;
