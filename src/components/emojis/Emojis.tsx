import styles from "./Emojis.module.scss";
import { useCallback, useEffect, useReducer } from "react";
import { getData } from "@/services/data.manager";
import { useRouter } from "next/router";
import Emoji from "./Emoji";
import { addEmojis, emojisReducer, selectEmoji } from "./emojisSlice";
import { emojiInterface } from './emojitypes'
import { ModalType } from "../modals/modaltypes";

interface EmojisProps {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType, data: any }) => void;
}

function Emojis(props: EmojisProps) {
  const { sendDatatoComponent,closeModal } = props
  const {reload} = useRouter()
  const [state, dispatch] = useReducer(emojisReducer, emojisReducer.getInitialState())
  useEffect(()=>{
    getEmojis()
  },[])

  const getEmojis = async ()=>{
    try{
      let res = await getData("/service/api/auth/get/user/emojis")
      if (res.status === true) {
          dispatch(addEmojis(res.response.userEmojis))    
      }
      else {
        if (res.error?.message === "RES_ERROR_INVALID_SESSION") {
          localStorage.clear();
          reload();
        }
      }
    }
    catch(err){
      console.log(err)
    }
    
  }

  const handleSelectEmoji = useCallback((emoji:emojiInterface)=>{
    dispatch(selectEmoji(emoji))
  },[state.emojis])

  const handleChange = ()=>{
    if (sendDatatoComponent){
      let selectedemoji = state.emojis.filter((emoji)=>emoji.selected)
      sendDatatoComponent({from:"emojis",data:selectedemoji})
    }
    closeModal()
  }

  return (
    <div className={`${styles.emojis_container}`}>
      <div className={`${styles.emojis_header}`}>
        <p className={`${styles.username}`}></p>
        <p className={`${styles.heading}`}>Choose Your Profile Picture</p>
      </div>
      <div className={`${styles.emojis_body}`}>
        <div className={`${styles.emojis}`}>
          <div className={`${styles.emojis_inner}`}>
            {state.emojis.map((useremoji, index) => {
              return (<Emoji emoji={useremoji} handleSelectEmoji={handleSelectEmoji} key={index} />)
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.emojis_footer}`}>
        <div className={`${styles.emojis_btns}`}>
          <button className={`${styles.btn}`} onClick={closeModal}>Cancel</button>
          <button className={`${styles.btn}`} onClick={handleChange} disabled={state.selectCount === 0}>Change</button>
        </div>
      </div>
    </div>
  );
}

export default Emojis;
