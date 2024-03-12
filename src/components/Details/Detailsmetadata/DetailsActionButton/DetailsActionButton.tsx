import React, { FC } from "react";
import { DetailsActionButtonPropsType } from "../../detailstypes";

const DetailsActionButton: FC<DetailsActionButtonPropsType> = (props) => {
  const { className, text } = props;
  // const [IconImage,setIconImage] = useState<string>(Image?.defaultImgurl || '')

  // const setIcon = ()=>{

  // }

  // const handleActionButton = (e: MouseEvent, type: DetailsActionButtonPropsType["type"])=>{
  //   switch(type){
  //     case "favorite":
  //       break;
  //     default:
  //       break;
  //   }
  // }
  return (
    <span className={className}>
      {/* {IconImage && <img src={IconImage} alt={Image?.altText} />} */}
      {text}
    </span>
  );
};

export default DetailsActionButton;
