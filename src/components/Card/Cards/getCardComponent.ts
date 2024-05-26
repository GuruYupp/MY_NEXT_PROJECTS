import { typeofcardType } from "@/shared";
import RollerPoster from "./RollerPoster/RollerPoster";
import OverlayIconPoster from "./OverlayIconPoster/OverlayIconPoster";
import OverlayPoster from "./OverlayPoster/OverlayPoster";
import ContentPoster from "./ContentPoster/ContentPoster";
import SheetPoster from "./SheetPoster/SheetPoster";
import CirclePoster from "./CirclePoster/CirclePoster";
import SquarePoster from "./SquarePoster/SquarePoster";
import ExpandPoster from "./ExpandPoster/ExpandPoster";
import ExpandsPoster from "./ExpandsPoster/ExpandsPoster";
import ExpandRollerPoster from "./ExpandRollerPoster/ExpandRollerPoster";
import PromoPoster from "./PromoPoster/PromoPoster";
import ExpandActionPoster from "./ExpandActionPoster/ExpandActionPoster";
import LivePoster from "./LivePoster/LivePoster";

function getCardComponent(cardType: typeofcardType) {
  switch (cardType) {
    case "roller_poster":
      return RollerPoster;
    case "overlayIcon_poster":
      return OverlayIconPoster;
    case "overlay_poster":
      return OverlayPoster;
    case "content_poster":
      return ContentPoster;
    case "sheet_poster":
      return SheetPoster;
    case "circle_poster":
      return CirclePoster;
    case "square_poster":
      return SquarePoster;
    case "expand_poster":
      return ExpandPoster;
    case "expands_poster":
      return ExpandsPoster;
    case "expand_roller_poster":
      return ExpandRollerPoster;
    case "promo_poster":
      return PromoPoster;
    case "expand_action_poster":
      return ExpandActionPoster;
    case "live_poster":
      return LivePoster;
    default:
      return OverlayPoster;
  }
}

export default getCardComponent;
