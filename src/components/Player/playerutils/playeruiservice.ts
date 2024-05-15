import $ from "jquery";

type ButtonTypes = "startover" | "nextepisode" | "skipintro";

export const getForwardIcon = () => {
  try {
    //get rewind icon
    let rewindIcon = $(
      ".jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-rewind",
    );
    let forwardIcon = rewindIcon.clone();
    forwardIcon.removeClass("jw-icon-rewind");
    forwardIcon.addClass("jw-icon-forward");
    forwardIcon.attr("aria-label", "Forward 10 Seconds");
    forwardIcon.html("");
    forwardIcon.css({
      "background-image":
        'url("https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/forwardIcon.svg")',
      height: "37px",
      width: "37px",
      "background-size": "contain",
    });
    //playerOBj.addButton("https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/forwardIcon.svg", "Forward 10 Seconds", ()=>{console.log('FastF')}  , "fastButton", "fastBtn")
    forwardIcon.insertAfter(rewindIcon);
    return forwardIcon;
  } catch (err) {
    console.log(err);
  }
};

export const ChangeRewindIcon = () => {
  try {
    let rewindIcon = $(
      ".jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-rewind",
    );
    let existSVG = rewindIcon.children("svg");
    let path = existSVG.children("path");
    path.css({
      display: "none",
    });
    existSVG.css({
      "background-image":
        'url("https://d2ivesio5kogrp.cloudfront.net/static/yvs/images/rewind-24px.svg")',
      "background-size": "contain",
      "background-repeat": "no-repeat",
    });
  } catch (err) {
    console.log(err);
  }
};

const checkandcreateButtonWrapper = () => {
  let playeroverylay = $(".jw-overlays.jw-reset");
  let buttonsWrapper = playeroverylay.children(".jw-buttonswrapper");
  if (buttonsWrapper.length === 0) {
    buttonsWrapper = $('<div class="jw-buttonswrapper"></div>');
    buttonsWrapper.append('<div class="jw-btns-container"></div>');
    playeroverylay.append(buttonsWrapper);
  }
  return true;
};

export const hideButtons = () => {
  try {
    $(".jw-buttonswrapper").hide();
  } catch (err) {
    console.log(err);
  }
};

export const showButtons = () => {
  try {
    $(".jw-buttonswrapper").show();
  } catch (err) {
    console.log(err);
  }
};

export const togglePlayerButton = (
  type: ButtonTypes,
  action: "show" | "hide",
) => {
  const hide = (selector: string) => {
    $(selector).hide();
  };
  const show = (selector: string) => {
    $(selector).show();
  };
  try {
    action === "show" && show(`.jw-player-btn-${type}`);
    action === "hide" && hide(`.jw-player-btn-${type}`);
  } catch (err) {
    console.log(err);
  }
};

export const createButton = (type: ButtonTypes, text: string) => {
  try {
    if (checkandcreateButtonWrapper()) {
      let buttonsContainer = $(".jw-btns-container");
      let button = $(
        `<button class="jw-player-btn jw-player-btn-${type}">${text}</button>`,
      );
      buttonsContainer.prepend(button);
      return button;
    }
  } catch (err) {
    console.log(err);
  }
};
