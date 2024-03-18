import React, { FC, useState } from "react";
import { DetailsActionButtonPropsType } from "../../detailstypes";

const DetailsActionButton: FC<DetailsActionButtonPropsType> = (props) => {
  const { className, text,Image,type } = props;
  const [IconImage,setIconImage] = useState<string>(Image?.defaultImgurl || '')

  // const setIcon = ()=>{

  // }

  const handleActionButton = ()=>{
    switch(type){
      case "favorite":
        break;
      default:
        break;
    }
  }
  return (
    <span className={className} onClick={handleActionButton}>
      {IconImage && <img src={IconImage} alt={Image?.altText || ""} />}
      {text}
    </span>
  );
};

export default DetailsActionButton;
