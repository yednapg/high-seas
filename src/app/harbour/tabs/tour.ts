import Shepherd, { Tour } from "shepherd.js";
import "./shepherd.css";
import { offset } from "@floating-ui/dom";

const waitForElement = (
  selector: string,
  callback = () => {},
): Promise<Element> => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector)!);
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        callback();
        resolve(document.querySelector(selector)!);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  console.log(document.cookie);
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const t = new Shepherd.Tour({
  useModalOverlay: true,
  keyboardNavigation: false,
  defaultStepOptions: {
    scrollTo: false,
    modalOverlayOpeningPadding: 4,
    floatingUIOptions: { middleware: [offset(16)] },
    classes: "shadow-md bg-purple-dark",
  },
});

let hasSetUp = false;
export function tour() {
  const shouldSkip = sessionStorage.getItem("tutorial.skip");
  if (shouldSkip) {
    return;
  }

  if (!hasSetUp) {
    setupSteps(t);
    hasSetUp = true;
  }

  console.log(t.steps);

  sessionStorage.setItem("tutorial", "true");
  t.start();
}

let signal, controller;

function setupSteps(tourManager: Tour) {
  controller = new AbortController();
  signal = controller.signal;

  tourManager.on("show", (e) => {
    if (e.step.id === "ts-draft-field-submit") {
      setCookie("tour-step", "ts-staged-ship-0");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") e.preventDefault();
  });

  const steps = [
    {
      id: "ts-draft-button",
      text: "Let's create a new ship!",
      attachTo: {
        element: "button#start-ship-draft",
        on: "top",
      },
      beforeShowPromise: () => waitForElement("button#start-ship-draft"),
      advanceOn: {
        selector: "button#start-ship-draft",
        event: "click",
      },
    },
    {
      id: "ts-new-ship-explanation",
      text: "This is where you'll enter the info for the project you want to ship.",
      attachTo: {
        element: "#new-ship-form-container-card",
        on: "top",
      },
      beforeShowPromise: () => waitForElement("#new-ship-form-container-card"),
      floatingUIOptions: { middleware: [offset(16)] },
      buttons: [
        {
          text: "Understood",
          action: () => {
            controller.abort();
            tourManager.next();
          },
        },
      ],
    },
    {
      id: "ts-draft-field-repo",
      text: "The first step in creating a new ship is linking a git repo. To get you going, we're going to ship the <span style='color: #ec3750;'>Hack Club site</span> repo!<br />The git repo link is<br /><br /><div style='display: flex; flex-direction: column; border-radius: 0.5rem; border: 2px solid #eaeaea; cursor: pointer;' onClick=\"navigator.clipboard.writeText('https://github.com/hackclub/site');document.getElementById('hc-site-repo-copy-button').textContent='Copied!';\"><pre style='background: #eaeaea; padding: 0.5rem; overflow-x: auto; font-size: 0.8em;'><code>https://github.com/hackclub/site</code></pre><button style='width: 100%; padding: 0.5rem' id='hc-site-repo-copy-button'>Click to copy</button></div><br />Try pasting that into the field over there!",
      attachTo: {
        element: "#repo-field",
        on: "top",
      },
      beforeShowPromise: () => {
        return new Promise((r) => {
          document
            .querySelector("#repo-field")!
            .addEventListener(
              "input",
              ({ target }: { target: HTMLInputElement }) => {
                if (target.value.trim() === "https://github.com/hackclub/site")
                  tourManager.next();
              },
            );
          r();
        });
      },
    },
    {
      id: "ts-draft-field-title",
      text: "Every Ship needs a name! [Insert funny quip].<br /><br />We're going to name this one \"<span style='color: #ec3750;font-style: italic;'>Hack Club site</span>\"! Try typing that into the field over there.",
      attachTo: {
        element: "#title-field",
        on: "top",
      },
      beforeShowPromise: () => {
        return new Promise((r) => {
          const f: HTMLInputElement = document.querySelector("input#title")!;
          f.focus();
          f.addEventListener(
            "input",
            ({ target }: { target: HTMLInputElement }) => {
              if (target.value.trim().toLowerCase() === "hack club site") {
                f.blur();
                tourManager.next();
              }
            },
          );
          r();
        });
      },
    },
    {
      id: "ts-draft-field-project",
      text: "Next, we need to link your coding time with the Ship. Remember that extension you installed?<br /><br />For the sake of time, select <span style='color: #ec3750;'>hack-club-site</span>.<br /><br />When you start coding for real, your actual projects will magically appear here! Cool top?",
      attachTo: {
        element: "#project-field",
        on: "top",
      },
      beforeShowPromise: () => {
        return new Promise((r) => {
          controller = new AbortController();
          signal = controller.signal;

          const wakatimeProjectNameField: HTMLInputElement =
            document.querySelector("input#wakatime-project-name")!;

          document.body.addEventListener(
            "click",
            () => {
              // The timeout is because at the time of click, the value is not set.
              setTimeout(() => {
                console.log("body was clicked"); // Keep this to make sure the event listener is removed
                if (
                  wakatimeProjectNameField.value.trim().toLowerCase() ===
                  "hack-club-site"
                )
                  tourManager.next();
              }, 10);
            },
            { signal },
          );
          r();
        });
      },
    },
    {
      id: "ts-draft-field-readme",
      text: "The first step in creating a new ship is linking a git repo. To get you going, we're going to ship the <span style='color: #ec3750;'>Hack Club site</span> repo!<br />The git repo link is<br /><br /><div style='display: flex; flex-direction: column; border-radius: 0.5rem; border: 2px solid #eaeaea; cursor: pointer;' onClick=\"navigator.clipboard.writeText('https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md');document.getElementById('hc-site-readme-copy-button').textContent='Copied!';\"><pre style='background: #eaeaea; padding: 0.8rem; overflow-x: auto; font-size: 0.5em;'><code>https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md</code></pre><button style='width: 100%; padding: 0.5rem' id='hc-site-readme-copy-button'>Click to copy</button></div><br />Paste it into the <code>README</code> field!",
      attachTo: {
        element: "#readme-field",
        on: "top",
      },
      beforeShowPromise: () => {
        return new Promise((r) => {
          controller.abort();

          const f: HTMLInputElement = document.querySelector("#readme-field")!;

          f.addEventListener(
            "input",
            ({ target }: { target: HTMLInputElement }) => {
              if (
                target.value.trim() ===
                "https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md"
              ) {
                f.blur();
                tourManager.next();
              }
            },
          );
          r();
        });
      },
    },
    {
      id: "ts-draft-field-deployment",
      text: "Here, we'll put a link to your deployed project so people can actually test out and play with it!<br /><br />In this case, the Hack Club site can be found at;<br /><br /><div style='display: flex; flex-direction: column; border-radius: 0.5rem; border: 2px solid #eaeaea; cursor: pointer;' onClick=\"navigator.clipboard.writeText('https://hackclub.com');document.getElementById('hc-site-deployment-copy-button').textContent='Copied!';\"><pre style='background: #eaeaea; padding: 0.8rem; overflow-x: auto; font-size: 0.5em;'><code>https://hackclub.com</code></pre><button style='width: 100%; padding: 0.5rem' id='hc-site-deployment-copy-button'>Click to copy</button></div>",
      attachTo: {
        element: "#deployment-field",
        on: "top",
      },
      beforeShowPromise: () => {
        return new Promise((r) => {
          const f: HTMLInputElement =
            document.querySelector("#deployment-field")!;
          f.addEventListener(
            "input",
            ({ target }: { target: HTMLInputElement }) => {
              if (target.value.trim() === "https://hackclub.com") {
                f.blur();
                tourManager.next();
              }
            },
          );
          r();
        });
      },
    },
    {
      id: "ts-draft-field-screenshot",
      text: "Finally, we want to add a photo of our project, so others can get the vibe of it at a glance.<br /><br />I've provided one for you this time, but when you ship your own Ship for real, you'll need to upload a screenshot yourself!",
      attachTo: {
        element: "#screenshot-field",
        on: "top",
      },
      buttons: [
        {
          text: "Aye aye!",
          action: () => {
            document.querySelector("input#screenshot_url")!.value =
              "https://cloud-g94jve4yq-hack-club-bot.vercel.app/0cca0381f-7e1c-485f-a533-31340b1245d6_1_105_c.jpeg";
            tourManager.next();
          },
        },
      ],
    },
    {
      id: "ts-draft-field-submit",
      text: "Go ahead and submit your ship!",
      attachTo: {
        element: "#new-ship-submit",
        on: "top",
      },
      advanceOn: {
        selector: "#new-ship-submit",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-0",
      text: "Let's have a look at the draft ship you just created!",
      attachTo: {
        element: "#staged-ships-container",
        on: "top",
      },
      beforeShowPromise: () =>
        waitForElement("#staged-ships-container", () => {
          controller = new AbortController();
          signal = controller.signal;

          document
            .querySelector("button#ship-ship")!
            .addEventListener("click", (e) => e.stopPropagation(), { signal });
        }),
      advanceOn: {
        selector: "#staged-ships-container",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-card",
      text: "Here's your Ship",
      attachTo: {
        element: "#selected-ship-card",
        on: "top",
      },
      beforeShowPromise: () => {
        controller.abort(); // Abort the button#ship-ship blocker

        return waitForElement("#selected-ship-card", () => {
          controller = new AbortController();
          signal = controller.signal;

          document
            .querySelector("#selected-ship-card-parent")!
            .addEventListener("click", (e) => e.stopPropagation(), { signal });
        });
      },
      buttons: [
        {
          text: "Next",
          action: () => {
            controller.abort();
            tourManager.next();
          },
        },
      ],
    },
    {
      id: "ts-staged-ship-play",
      text: "Here you can try out the Ship",
      attachTo: {
        element: "#selected-ship-play-button",
        on: "top",
      },
      advanceOn: {
        selector: "#selected-ship-play-button",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-repo",
      text: "Here you can view the associated GitHub repo!",
      attachTo: {
        element: "#selected-ship-repo-button",
        on: "top",
      },
      advanceOn: {
        selector: "#selected-ship-repo-button",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-edit",
      text: "Here you can edit some of your Ship's details",
      attachTo: {
        element: "#selected-ship-edit-button",
        on: "top",
      },
      advanceOn: {
        selector: "#selected-ship-edit-button",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-edit-title",
      text: "Try editing the name of the ship. Let's rename this Ship to \"<span style='color: #ec3750;'>Hack Club's Awesome Website</span>\"",
      attachTo: {
        element: "form#selected-ship-edit-form input#title",
        on: "top",
      },
      beforeShowPromise: () => {
        return waitForElement(
          "form#selected-ship-edit-form input#title",
          () => {
            const f: HTMLInputElement = document.querySelector(
              "form#selected-ship-edit-form input#title",
            )!;
            f.focus();
            f.addEventListener(
              "input",
              ({ target }: { target: HTMLInputElement }) => {
                if (
                  target.value.trim().toLowerCase() ===
                  "hack club's awesome website"
                ) {
                  f.blur();
                  tourManager.next();
                }
              },
            );
          },
        );
      },
    },
    {
      id: "ts-staged-ship-edit-save",
      text: "Now save it!",
      attachTo: {
        element: "form#selected-ship-edit-form button#submit",
        on: "top",
      },
      advanceOn: {
        selector: "form#selected-ship-edit-form button#submit",
        event: "click",
      },
    },
    {
      id: "ts-staged-ship-edit-finale",
      text: "Great! The new name suits our project perfectly.<br /><br />Now let's head to the Wonderdome to vote on some projects.",
      buttons: [
        {
          text: "Let's go!",
          action: () => {
            setCookie("tour-step", "ts-vote-left");
            window.location.href = "/thunderdome";
          },
        },
      ],
    },
    // {
    //   id: "ts-vote-intro",
    //   text: "Welcome to the Wonderdome, where you'll vote on projects!<br /><br />All you need to do is pick which project you think is better, and explain why.<br /><br />Remember to check out the live link to test it out, and the repo to look at the code!<br /><br /><b>[Ominously]</b> I'll know if you don't check the links...",
    //   buttons: [
    //     {
    //       text: "Next",
    //       action: tourManager.next,
    //     },
    //   ],
    // },
    {
      id: "ts-vote-left",
      text: "Here we have one project<br /><br />Check out the live version by clicking on the <i>Live demo</i> button.",
      attachTo: {
        element: "#voting-project-left",
        on: "top",
      },
      beforeShowPromise: () => {
        // return new Promise((r) => setTimeout(r, 3_000));
        return waitForElement("#voting-project-left");
      },
      buttons: [{ text: "ok", action: tourManager.next }],
      advanceOn: {
        selector: "button",
        event: "click",
      },
    },
    {
      id: "ts-vote-reason-submit",
      text: "You can now submit your vote! Explain why it's better than the other project (make sure you write over 10 words!)",
      attachTo: {
        element: "#voting-reason-container-parent",
        on: "top",
      },
      beforeShowPromise: () => {
        return waitForElement("#voting-reason-container");
      },
      advanceOn: {
        selector: "button#submit-vote",
        event: "click",
      },
    },
    {
      id: "ts-vote-reason-finale",
      text: "Awesome! Let's head to the shop",
      focusedElBeforeOpen: false,
      buttons: [
        {
          text: "ok",
          action: () => {
            setCookie("tour-step", "ts-shop-welcome");
            location.href = "/shop";
          },
        },
      ],
    },
    {
      id: "ts-shop-welcome",
      text: "Welcome to the shop!",
      buttons: [
        {
          text: "ok",
          action: tourManager.next,
        },
      ],
    },
  ];

  const currentStepId = getCookie("tour-step");

  if (currentStepId) {
    const currentStepIndex = steps.findIndex(
      (step) => step.id === currentStepId,
    );
    if (currentStepIndex !== -1) {
      steps.splice(0, currentStepIndex);
    }
  }

  tourManager.addSteps(steps);
}
