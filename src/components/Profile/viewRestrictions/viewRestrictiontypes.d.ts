import { profileRatingType, subprofileInterface } from "@/shared";

export interface viewRestrictionInterface{
    profileRationgsstatus:"pending"|"idle"|"fulfilled"|"rejected",
    blockedContentstatus:"pending"|"idle"|"fulfilled"|"rejected",
    queryContentstatus:"pending"|"idle"|"fulfilled"|"rejected",
    profileRationgs:profileRatingType[],
    activeProfileRatingIndex:number,
    activeProfileRating:profileRatingType,
    blockedContents:{category:string;itemsMap:{ [key: string]: string}}[],
    queryContents:{code:string;elemSubType:string;elemType:string;id:string;name:string}[],
}

export interface DesktopRatingsInterface extends Partial<viewRestrictionInterface>{
    ratingClick:(args:viewRestrictionInterface["activeProfileRatingIndex"])=>void
}

export interface MobileRatingsInterface extends DesktopRatingsInterface{
    Profile:subprofileInterface
}

export interface BottomRatingsInterface extends MobileRatingsInterface{ 
    closeModal: () => void;
}

export interface TitleRestrictionsInterface extends Partial<viewRestrictionInterface>{
    handleSearch:(query:string)=>void
    handleSuggestion:(arg:{id:string,name:string,category:string})=>void
    handleRemoveContent:(id:string)=>void
}
