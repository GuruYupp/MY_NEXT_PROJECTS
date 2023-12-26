import { templateType, tvguidestateInterface } from "@/shared";
import { PropsWithChildren, useState, useEffect, useRef } from "react";
import styles from "./ProgramTab.module.scss";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import { ModalType } from "@/components/modals/modaltypes";
import Template from "@/components/templates/Template";

interface programTabProps {
  program: tvguidestateInterface["channelsData"][0]["programs"][0];
  channel_left?: number;
  setPaddingfromGuide?: (arg: () => void) => void;
}

function ProgramTab({
  program,
  channel_left,
  setPaddingfromGuide,
}: PropsWithChildren<programTabProps>): JSX.Element {
  const { template, target } = program;
  const programRef = useRef<HTMLDivElement>(null);
  const program_text_Ref = useRef<HTMLParagraphElement>(null);

  const [showModal, setShowModal] = useState<ModalType>("");
  const [templateCode, setTemplateCode] = useState<templateType>("")

  const showTemplateModal = (template: templateType) => {
    document.body.style.overflowY = "hidden";
    setTemplateCode(template);
    setShowModal("template")
  };

  const closeTemplateModal = () => {
    document.body.style.overflowY = "scroll";
    setTemplateCode("");
    setShowModal("");
  };

  const handleProgramClick = () => {
    if (template) {
      console.log(program)
      showTemplateModal(template);
    }
  };

  console.log('hello')
  
  useEffect(() => {
    if (programRef.current && program_text_Ref.current) {
      if (setPaddingfromGuide) {
        setPaddingfromGuide(setPaading);
      }
    }
  }, [channel_left])

  function setPaading() {
    if (programRef.current && channel_left) {
      if (programRef.current.getBoundingClientRect().left < channel_left) {
        if (program_text_Ref.current) {
          program_text_Ref.current.style.paddingLeft = `${channel_left - programRef.current.getBoundingClientRect().left}px`
        }
      } else {
        if (program_text_Ref.current) {
          program_text_Ref.current.style.paddingLeft = `0px`
        }
      }
    }
  }

  return (
    <>
      <div
        className={`${
          styles.title_wrapper + " " + (program.id === -1 && styles.no_program)
        }`}
        ref={programRef}
        onClick={handleProgramClick}
      >
        {" "}
        <p ref={program_text_Ref}>
          {program.display.title}
        </p>{" "}
      </div>
      {showModal &&
        template &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                console.log(modal);
                switch (modal) {
                  case "template":
                    return <Template closeModal={closeTemplateModal} template_code={templateCode} target_path={target.path} />
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
    </>
  );
}

export default ProgramTab;
