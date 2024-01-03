import { client } from "./client";

export function handleAudioStream(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    if (element.textContent == "Disable Audio") {
      await client.localPeer.disableAudio();
      element.textContent = "Enable Audio";
    } else {
      await client.localPeer.enableAudio();
      element.textContent = "Disable Audio";
    }
  });
}

export function handleVideoStream(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    const videoRef = document.querySelector("#videoRef") as HTMLVideoElement;

    if (videoRef.srcObject) {
      client.localPeer.disableVideo();
      element.textContent = "Enable Video";
      return;
    }

    const stream = (await client.localPeer.enableVideo()) as MediaStream;

    videoRef.srcObject = stream;
    videoRef.onloadedmetadata = async () => {
      console.warn("videoCard() | Metadata loaded...");
      try {
        await videoRef.play();
        element.textContent = "Disable Video";
      } catch (error) {
        console.error(error);
      }
    };

    videoRef.onerror = () => {
      console.error("videoCard() | Error is hapenning...");
    };
  });
}

export function handleScreenStream(element: HTMLButtonElement) {
  element.addEventListener("click", async () => {
    const screenRef = document.querySelector("#screenRef") as HTMLVideoElement;

    if (screenRef.srcObject) {
      client.localPeer.stopScreenShare();
      screenRef.srcObject = null;
      element.textContent = "Share Screen";
      return;
    }

    const stream = (await client.localPeer.startScreenShare()) as MediaStream;

    console.log("stream", stream);

    screenRef.srcObject = stream;
    screenRef.onloadedmetadata = async () => {
      console.warn("videoCard() | Metadata loaded...");
      try {
        await screenRef.play();
        element.textContent = "Stop Sharing";
      } catch (error) {
        console.error(error);
      }
    };

    screenRef.onerror = () => {
      console.error("videoCard() | Error is hapenning...");
    };
  });
}
