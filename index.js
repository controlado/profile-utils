import { addRoutines } from "../controladoUtils";
import * as requests from "./requests";

/**
 * @author balaclava
 * @name profile-utils
 * @link https://github.com/controlado/profile-utils
 * @description Utilities for your profile! 🐧
 */

export const plugin = {
  "name": "Profile Utils",
  "url": "https://github.com/controlado/profile-utils",
  "version": "1.0.0",
};

async function setupInvisibleBanner() {
  const bannerContainer = document.querySelector("lol-regalia-profile-v2-element")?.
      shadowRoot.querySelector("lol-regalia-banner-v2-element")?.
      shadowRoot.querySelector("div");
  if (!bannerContainer || bannerContainer.hasAttribute("invisible-banner-setup")) { return; }

  bannerContainer.setAttribute("invisible-banner-setup", "true");
  bannerContainer.addEventListener("mouseenter", () => bannerContainer.style.opacity = "0.5");
  bannerContainer.addEventListener("mouseleave", () => bannerContainer.style.opacity = "1");
  bannerContainer.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences();
    playerPreferences.bannerAccent = playerPreferences.bannerAccent === "2" ? "1" : "2";
    await requests.updatePlayerPreferences(playerPreferences);
  });
}

async function setupBadgesFunctions() {
  const badgesContainer = document.querySelector("div > div.challenge-banner-token-container");
  if (!badgesContainer || badgesContainer.hasAttribute("copy-badges-setup")) { return; }

  badgesContainer.setAttribute("copy-badges-setup", "true");
  badgesContainer.addEventListener("mouseenter", () => badgesContainer.style.opacity = "0.5");
  badgesContainer.addEventListener("mouseleave", () => badgesContainer.style.opacity = "1");
  badgesContainer.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences();
    if (playerPreferences.challengeIds.length) {
      const firstBadge = playerPreferences.challengeIds[0];
      playerPreferences.challengeIds = Array(3).fill(firstBadge);
      await requests.updatePlayerPreferences(playerPreferences);
    }
  });
  badgesContainer.addEventListener("contextmenu", async () => {
    const playerPreferences = await requests.getPlayerPreferences();
    if (playerPreferences.challengeIds.length) {
      playerPreferences.challengeIds = [];
      await requests.updatePlayerPreferences(playerPreferences);
    }
  });
}

async function setupRanksFunctions() {
  const profileElement = document.querySelector("lol-social-avatar > lol-uikit-radial-progress");
  if (!profileElement || profileElement.hasAttribute("ranks-setup")) { return; }

  const rankGenerator = function* () {
    const ranks = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
    while (true) {
      for (let rank of ranks) {
        yield rank;
      }
    }
  }();
  profileElement.setAttribute("ranks-setup", "true");
  profileElement.addEventListener("contextmenu", async () => {
    const requestBody = { lol: { rankedLeagueTier: rankGenerator.next().value } };
    await requests.request("PUT", "/lol-chat/v1/me", { body: requestBody });
  });
}

async function setupFunctions() {
  await Promise.all([
    setupInvisibleBanner(),
    setupBadgesFunctions(),
    setupRanksFunctions(),
  ]);
}

async function initPlugin() {
  console.debug(`${plugin.name}: Report bugs to Balaclava#1912`);
  addRoutines(setupFunctions);
}

window.addEventListener("load", initPlugin);
