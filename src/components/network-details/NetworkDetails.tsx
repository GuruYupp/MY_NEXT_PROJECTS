import Sections from "../Sections/Sections";
import styles from "./NetworksDetails.module.scss"
import { getAbsolutPath } from "@/utils";
import { useAppSelector } from "@/redux/hooks";

export default function NetworkDetails(){
  const {content} = useAppSelector(state=>state.pageData.response)
  
  let partner_bgImage;
  console.log(content)
  content.map((content) => {
    if (content.contentCode === "patner_info") {
      content?.content?.dataRows?.map((data: any) => {
        data?.elements.map((element: any) => {
          if (element.elementSubtype === "bgImage"){
            partner_bgImage = getAbsolutPath(element.data)
          }
        })
      })
    }
  })

  
  return (
    <div className={`${styles.networkdetails_container}`}>
      {
        (partner_bgImage) && <div className={`${styles.partner_banner_Image}`}>
          <img src={partner_bgImage} alt=""/>
        </div>
      }
    <Sections/>
    </div>
  )
}