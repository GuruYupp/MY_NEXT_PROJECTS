import style from "./Modal.module.scss";
import { ModalPropsInterface } from "./modaltypes";



// export type ModalType =
// 	| "network_filter"
// 	| "languages"
// 	| "emojis"
// 	| "template"
// 	| "signout"
// 	| "getotp"
// 	| "";


// export interface ModalPropsInterface {
// 	modalType: ModalType;
// 	render: (arg: ModalType)=>ReactNode
// }

function Modal(props: ModalPropsInterface) {
	const {render,modalType} = props;
	const renderModal = (modelType: string) => {
		switch (modelType) {
			case "network_filter":
				return (
					<div className={`${style.filter_modal}`}>
						{render(modalType)}
					</div>
				);
			case "languages":
				return (
					<div className={`${style.languages_modal}`}>
						{render(modalType)}
					</div>
				);
			case "emojis":
				return (
					<div className={`${style.emojis_modal}`}>
						{render(modalType)}
					</div>
				);
			case "template":
				return (
					<div className={`${style.template_modal}`}>
						{render(modalType)}
					</div>
				);
			case "getotp":
				return (
					<div className={`${style.otp_modal}`}>
						{render(modalType)}
					</div>
				);
			case "signout":
				return (
					<div className={`${style.template_modal}`}>
						{render(modalType)}
					</div>
				);
			default:
				return <></>;
		}
	};
	return (
		<div className={`${style.modal_container}`}>{renderModal(props.modalType)}</div>
	);
}


export default Modal;
