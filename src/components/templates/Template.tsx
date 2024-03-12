import { ReactNode, useEffect, useState } from "react";
import { default as clientCookie } from "js-cookie";
import { templateType, templateresponseInterface } from "@/shared";
import ChannelOverlayTemplate from "./channeloverlay/ChannelOverlay";
import TemplateSkeleton from "../shared/template_skeleton/TemplateSkeleton";
import { getData } from "@/services/data.manager";

interface TemplateProps {
  closeModal: () => void;
  children?: ReactNode;
  template_code: templateType;
  target_path: string;
}

export default function Template(props: TemplateProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [templateResponse, setTemplateResponse] =
    useState<templateresponseInterface>({});

  useEffect(() => {
    let mounted = false;
    //https://dishtv-api.revlet.net/service/api/v1/template/data?template_code=channel_overlay&path=ottchannels/play/news-x-1
    let params = {
      path: props.target_path,
      // eslint-disable-next-line camelcase
      template_code: props.template_code,
    };
    getData("service/api/v1/template/data", (params = params))
      .then((data) => {
        if (!mounted) return;
        if (data?.status == true) {
          console.log(data.response.data);
          setTemplateResponse(data.response.data);
          setLoading(false);
        } else if (data?.status == false && data?.error?.code == 401) {
          clientCookie.remove("boxId");
          clientCookie.remove("tenantCode");
          clientCookie.remove("sessionId");
          clientCookie.remove("isLoggedin");
          setLoading(false);
          window.location.reload();
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        props.closeModal();
      });
    return () => {
      mounted = true;
    };
  }, []);

  const renderTemplate = (template: templateType) => {
    switch (template) {
      case "channel_overlay":
        return (
          <ChannelOverlayTemplate
            templateData={templateResponse}
            closeModal={props.closeModal}
          />
        );
      case "tvguide_overlay":
        return (
          <ChannelOverlayTemplate
            templateData={templateResponse}
            closeModal={props.closeModal}
          />
        );
      default:
        return <div></div>;
    }
  };

  return !loading ? renderTemplate(props.template_code) : <TemplateSkeleton />;
}
