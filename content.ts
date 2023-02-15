import { domToJpeg, domToPng } from "modern-screenshot";
const PNG = "PNG";
const JPG = "JPG"
const MD = "Markdown";
const JSON = "JSON";

const init = async () => {
  await waitForElm("#b_sydConvCont > cib-serp");
  const whole = getWhole();
  const main = getMain();
  document.querySelector("#b_sydConvCont > cib-serp").shadowRoot.querySelector("#cib-conversation-main").shadowRoot.querySelector("#cib-chat-main > cib-welcome-container");
  main
    .querySelector("cib-welcome-container")
    .remove();

  const feedbackGroup = whole
    .querySelector("cib-serp-feedback")
    .shadowRoot
    .querySelector("div.root");
  const feedbackButton = feedbackGroup.querySelector("#fbpgbt");
  console.log(feedbackButton);

  addButtonGroups(feedbackGroup, feedbackButton);
};

const getWhole = () => {
  return document
    .querySelector("#b_sydConvCont > cib-serp")
    .shadowRoot;
};

const getMain = () => {
  return getWhole()
    .querySelector("#cib-conversation-main")
    .shadowRoot
    .querySelector("#cib-chat-main");
};

const waitForElm = (selector) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};

const addButtonGroups = (actionsArea, WaitingButton) => {
  // TODO: 5 change css, 并排
  addButton(actionsArea, WaitingButton, PNG);
  addButton(actionsArea, WaitingButton, JPG);
  // TODO: add markdown
};

const addButton = (actionsArea, WaitingButton, type) => {
  const downloadButton = WaitingButton.cloneNode(true);
  downloadButton.id = `${type}-download-button`;
  downloadButton.innerText = type;

  const getOnClickByType = (type) => {
    if (type === PNG) {
      return forPNG;
    } else if (type === JPG) {
      return forJPG;
    } else if (type === MD) {
      return forMD;
    } else if (type === JSON) {
      return forJSON;
    }
  };
  downloadButton.onclick = getOnClickByType(type);
  actionsArea.appendChild(downloadButton);
};

const forImage = async (func, type, way='newTab') => {
  const main = <HTMLElement> getMain();
  const dataURL = await func(main, {
    backgroundColor: "rgb(217, 230, 249)"
  });
  if (way === 'newTab') {
    requestAnimationFrame(() => {
      const binaryData = atob(dataURL.split("base64,")[1]);
      const data = [];
      for (let i = 0; i < binaryData.length; i++) {
        data.push(binaryData.charCodeAt(i));
      }
      const blob = new Blob(
        [new Uint8Array(data)],
        { type: `image/${type}`});
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    });
  } else {
    const link = document.createElement('a');
    link.download = `my-image-name.${type}`;
    link.href = dataURL;
    link.click();
    link.remove();
  }
}
const forPNG = async () => {
  forImage(domToPng, "png" )
};

const forJPG = async () => {
  forImage(domToJpeg, "jpeg" )
}

const forMD = () => {

};

const forJSON = () => {

};

init();
