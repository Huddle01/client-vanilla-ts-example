import {
  handleAudioStream,
  handleScreenStream,
  handleVideoStream,
} from "./handleStream";
import "./style.css";
import { client } from "./client";
import { handleEvents } from "./handleEvents";

let token = "";
let roomId = "";
let displayName = "";

const appElement = document.querySelector("#app");

if (appElement) {
  appElement.innerHTML = `
<div class="flex flex-col items-center justify-center p-4">
<div class="flex">
    <input
      placeholder="Room ID"
      id="roomId"
      type="text"
      class="border-2 border-blue-400 rounded-lg p-2 mx-2 bg-black text-white"
    />

    <input
      placeholder="Access Token"
      id="accessToken"
      type="text"
      class="border-2 border-blue-400 rounded-lg p-2 mx-2 bg-black text-white"
    />

    <input
      placeholder="Display Name"
      id="displayName"
      type="text"
      class="border-2 border-blue-400 rounded-lg p-2 mx-2 bg-black text-white"
    />

    <button
      type="button"
      id="joinRoom"
      class="bg-blue-500 p-2 mx-2 rounded-lg"
    >
      Join Room
    </button>

    <button
      class="bg-blue-500 p-2 mx-2 rounded-lg"
      id="video"
    >
    Enable Video
    </button>
    <button
      class="bg-blue-500 p-2 mx-2 rounded-lg"
      id="audio"
    >
    Enable Audio
    </button>
    <button
      class="bg-blue-500 p-2 mx-2 rounded-lg"
      id="screen"
    >
    Share Screen
    </button>
</div>

      <div class="flex-1 items-center flex flex-col mt-8">
        <div class="flex gap-2">
          <div class="w-1/2 mx-auto border-2 rounded-xl border-blue-400 object-contain">
            <video
              id="videoRef"
              autoPlay
              class="aspect-video"
              muted
            />
          </div>
          <div class="w-1/2 mx-auto border-2 rounded-xl border-blue-400 object-contain">
            <video
              id="screenRef"
              class="aspect-video"
              autoPlay
              muted
            />
          </div>
        </div>
        
      </div>
      <div id="remotePeers" class="flex flex-col gap-2 mt-4">
        </div>
      </div>

`;
}

let roomIdElement = document.querySelector("#roomId") as HTMLInputElement;
let accessTokenElement = document.querySelector(
  "#accessToken"
) as HTMLInputElement;
let displayNameElement = document.querySelector(
  "#displayName"
) as HTMLInputElement;
let joinRoomElement = document.querySelector("#joinRoom") as HTMLButtonElement;

roomIdElement.addEventListener("change", (e) => {
  roomId = (e.target as HTMLInputElement).value;
});

accessTokenElement.addEventListener("change", (e) => {
  token = (e.target as HTMLInputElement).value;
});

displayNameElement.addEventListener("change", (e) => {
  displayName = (e.target as HTMLInputElement).value;
});

joinRoomElement.addEventListener("click", async () => {
  const room = await client.joinRoom({
    roomId,
    token,
  });
  room.updateMetadata({
    displayName: displayName,
  });
  document.querySelectorAll("input").forEach((input) => {
    input.hidden = true;
  });
  joinRoomElement.hidden = true;
});

handleEvents();

handleVideoStream(document.querySelector("#video") as HTMLButtonElement);

handleScreenStream(document.querySelector("#screen") as HTMLButtonElement);

handleAudioStream(document.querySelector("#audio") as HTMLButtonElement);

client.room.on("new-peer-joined", () => {
  client.room.remotePeers.forEach((peer) => {
    // metadata
    console.log(peer.metadata);
    // role
    console.log(peer.role);
  });
});
