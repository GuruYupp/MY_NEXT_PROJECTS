/* eslint-disable camelcase */
import getfrompagedata from "../Details/getfrompagedata";
import { pageState } from "@/shared";
import { getAbsolutPath } from "@/utils";

interface playerPageMeta {
  title: string;
  subtitle: string;
  description: string;
  content_img: string;
  tvguide: string;
  tvguide_target: string;
  pgrating: string;
  cast: string
}

export function getPlayerpageMeta(content: pageState["response"]["content"]): playerPageMeta {
  let title = getfrompagedata(content, "title")?.data || "";
  let subtitle = getfrompagedata(content, "subtitle")?.data || "";
  let description = getfrompagedata(content, "description")?.data || "";
  description = description
    ? description
    : getfrompagedata(content, "")?.data || "";

  let content_img = getfrompagedata(content, "image")?.data || "";
  content_img = content_img ? getAbsolutPath(content_img) : "";

  let tvguide = getfrompagedata(content, "tvguide")?.data || "";
  let tvguide_target = getfrompagedata(content, "tvguide")?.target || "";

  let pgrating = getfrompagedata(content, "pgrating")?.data || "";

  let cast = getfrompagedata(content, "cast")?.data || "";
  cast = cast.split("|").join(",");
  return { title, subtitle, description, content_img, tvguide, tvguide_target, pgrating, cast }
}