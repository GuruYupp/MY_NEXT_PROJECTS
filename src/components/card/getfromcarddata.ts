import { cardInterface } from "@/shared"

export type cardhoverType = "showButton" | "ButtonText" | "showFavouriteButton" | "isFavourite" | "showShareButton" | "showButton" | "showShareButton" | "targetPath"

export default function getfromcarddata(
  content: cardInterface,
  type: cardhoverType
): cardInterface["hover"]["elements"][0] | undefined {
  let res;
  content.hover.elements.map((element)=>{
    if(element.key === type){
      res = element
    }
  })
  return res;
}