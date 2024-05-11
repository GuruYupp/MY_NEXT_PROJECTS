import { profileRatingType } from "@/shared";

export interface ViewRestrictionSliceInterface {
  blockedContentstatus: "pending" | "idle" | "fulfilled" | "rejected";
  queryContentstatus: "pending" | "idle" | "fulfilled" | "rejected";
  blockedContents: { category: string; itemsMap: { [key: string]: string } }[];
  queryContents: {
    code: string;
    elemSubType: string;
    elemType: string;
    id: string;
    name: string;
  }[];
}

export interface TitleRestrictionsInterface
  extends Partial<ViewRestrictionSliceInterface> {
  handleSearch: (query: string) => void;
  handleSuggestion: (arg: {
    id: string;
    name: string;
    category: string;
  }) => void;
  handleRemoveContent: (id: string) => void;
}
