import { Red } from "/storage/clientmodules/Red.js";
import { Blue } from "/storage/clientmodules/Blue.js";
import { Purple } from "/storage/clientmodules/Purple.js";

const Loader = new Red();
const blue = new Blue("/");

//Loading stuff
var Overlay = Loader.StoreHTML(
  `
  <div class="chatbox-container">
  <div class="close">
    <button id="chatbox-close">
      X
    </button>
  </div>
  <div class="chatbox">
  </div>
  <div class="interactable">
    <textarea id="prompt"></textarea>
    <button id="submit">GO</button>
  </div>
</div>
  `
);

const chatButton = document.querySelector("#chat");

chatButton.addEventListener("click", async (e) => {
  await Loader.LoadHTML(document.body, Overlay);
  blue.Store(document.body, "stop", "true");

  //Runtime variables
  const divWrapper = document.querySelector(`.red-${Overlay}`);
  const chatboxContainer = divWrapper.querySelector(`.chatbox-container`);
  const chatbox = chatboxContainer.querySelector(".chatbox");
  const closeButton = chatboxContainer
    .querySelector(`.close`)
    .querySelector(`#chatbox-close`);
  const submitButton = chatboxContainer
    .querySelector(`.interactable`)
    .querySelector(`#submit`);
  const promptArea = chatboxContainer
    .querySelector(`.interactable`)
    .querySelector(`#prompt`);
  chatboxContainer.style.animation = `fadechat 0.3s`;

  //Load all the messages
  let messageHistory =
    JSON.parse(localStorage.getItem("message_history")) || [];

  for (let i = 0; i < messageHistory.length; i++) {
    if (i % 2 !== 0) {
      console.log(i);
      let aiDiv = document.createElement("div");
      aiDiv.className = "ai";
      let aiText = document.createElement("p");
      aiText.innerText = messageHistory[i];
      aiDiv.appendChild(aiText); // Append the text to the div
      chatbox.appendChild(aiDiv);
    } else {
      let humanDiv = document.createElement("div");
      humanDiv.className = "human";
      let humanText = document.createElement("p");
      humanText.innerText = messageHistory[i];
      humanDiv.appendChild(humanText); // Append the text to the div
      chatbox.appendChild(humanDiv);
    }
  }

  //Runtime Functions

  closeButton.addEventListener("click", async (e) => {
    Loader.DeleteHTML(document.body, Overlay);
  });

  submitButton.addEventListener("click", async (e) => {
    const input = promptArea.value;

    let inputHistory = JSON.parse(localStorage.getItem("input_history")) || [];
    let responseHistory =
      JSON.parse(localStorage.getItem("response_history")) || [];
    let messageHistory =
      JSON.parse(localStorage.getItem("message_history")) || [];

    fetch(`/api/use?input=${input}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: inputHistory,
        responseHistory: responseHistory,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const generatedResponse = data.generated_text;

        responseHistory.push(generatedResponse); // Add the generated response to the response history
        inputHistory.push(input); // Add the user input to the input history
        messageHistory.push(input);
        messageHistory.push(generatedResponse);
        let humanDiv = document.createElement("div");
        humanDiv.className = "human";
        let humanText = document.createElement("p");
        humanText.innerText = input;
        humanDiv.appendChild(humanText); // Append the text to the div
        chatbox.appendChild(humanDiv);

        let aiDiv = document.createElement("div");
        aiDiv.className = "ai";
        let aiText = document.createElement("p");
        aiText.innerText = generatedResponse;
        aiDiv.appendChild(aiText); // Append the text to the div
        chatbox.appendChild(aiDiv);

        localStorage.setItem("input_history", JSON.stringify(inputHistory));
        localStorage.setItem(
          "response_history",
          JSON.stringify(responseHistory)
        ); // Store the updated response history in localStorage
        localStorage.setItem("message_history", JSON.stringify(messageHistory));

        console.log("Generated Response: ", generatedResponse);
        console.log("Updated Response History: ", responseHistory);

        // Perform other actions with the generated response as needed
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
