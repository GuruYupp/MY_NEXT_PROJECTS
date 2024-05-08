import { subprofileInterface } from "@/shared";
import { ReactNode } from "react";
import { activeScreenInterface } from "./activescreens/activescreensSlice";

export interface ProfileParentalControlPanelProps {
  toggle?: boolean;
  default_open?: boolean;
  isActive: boolean;
  setActiveIndex: (index: number) => void;
  panelIndex: number;
  profileId: subprofileInterface["profileId"];
}

export interface ProfileParentalControlDataProps {
  controlType: "Language" | "Viewing Restrictions" | "Profile & Video Lock";
  contentData: string;
  actionText?: string;
  clickHandler?: (arg: ProfileParentalControlDataProps["controlType"]) => void;
}

export interface PanelPropsInterface {
  title?: string;
  toggle?: boolean;
  defaultopen?: boolean;
  render: () => ReactNode;
  headerrightbutton?: {
    text: string;
  };
}

export interface ActiveScreenProps {
  activeScreen: activeScreenInterface;
}

export interface GenericAccountDetailsRowprops {
  heading1?: string;
  heading2?: string;
  actionbtntext?: string;
  details?: { label: string; value: string };
  actionbtnhandle?: (...args: any) => void;
}
