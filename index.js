import { addRoutines } from "../controladoUtils"
import * as requests from "./requests"

/**
 * @name profile-utils
 * @author feminismo (balaclava)
 * @description Utilities for your profile! 🐧
 * @link https://github.com/controlado/profile-utils
 */

export const plugin = {
  "name": "Profile Utils",
  "url": "https://github.com/controlado/profile-utils",
  "version": "1.0.0",
}

async function setupInvisibleBanner() {
  const bannerContainer = document.querySelector("div > lol-regalia-profile-v2-element")?.shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div")
  if (!bannerContainer || bannerContainer.hasAttribute("invisible-banner-setup")) { return }

  bannerContainer.setAttribute("invisible-banner-setup", "true")
  bannerContainer.addEventListener("mouseenter", () => { bannerContainer.style.opacity = "0.5" })
  bannerContainer.addEventListener("mouseleave", () => { bannerContainer.style.opacity = "1" })
  bannerContainer.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences()
    playerPreferences.bannerAccent = playerPreferences.bannerAccent === "2" ? "1" : "2"
    await requests.updatePlayerPreferences(playerPreferences)
  })
}

async function setupBadgesFunctions() {
  const badgesContainer = document.querySelector("div > div.challenge-banner-token-container")
  if (!badgesContainer || badgesContainer.hasAttribute("copy-badges-setup")) { return }

  badgesContainer.setAttribute("copy-badges-setup", "true")
  badgesContainer.addEventListener("mouseenter", () => { badgesContainer.style.opacity = "0.5" })
  badgesContainer.addEventListener("mouseleave", () => { badgesContainer.style.opacity = "1" })
  badgesContainer.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences()

    if (!playerPreferences.challengeIds.length) {
      console.debug(`${plugin.name}: The player does not have a defined badge.`)
      return
    }

    const firstBadge = playerPreferences.challengeIds[0]
    playerPreferences.challengeIds = Array(3).fill(firstBadge)
    await requests.updatePlayerPreferences(playerPreferences)
  })
  badgesContainer.addEventListener("contextmenu", async () => {
    const playerPreferences = await requests.getPlayerPreferences()

    if (!playerPreferences.challengeIds.length) {
      console.debug(`${plugin.name}: The player badges are already empty.`)
      return
    }

    playerPreferences.challengeIds = []
    await requests.updatePlayerPreferences(playerPreferences)
  })
}

async function onMutation() {
  const toSetup = [
    setupInvisibleBanner(),
    setupBadgesFunctions()
  ]
  await Promise.all(toSetup)
}

async function initPlugin() {
  console.debug(`${plugin.name}: Report bugs to Balaclava#1912`)
  addRoutines(onMutation)
}

window.addEventListener("load", initPlugin)
