import utils from "../_utils"
import * as requests from "./requests"

/**
 * @author
 * Nome: Yan Gabriel    
 * Discord: Balaclava#1912 (854886148455399436)    
 * GitHub: https://github.com/controlado
 */

export const plugin = {
  "name": "Profile Utils",
  "url": "https://github.com/controlado/profile-utils",
  "version": "1.0.0",
}

async function setupInvisibleBanner() {
  const container = document.querySelector("div > lol-regalia-profile-v2-element")?.shadowRoot.querySelector("div > lol-regalia-banner-v2-element").shadowRoot.querySelector("div")
  if (!container || container.hasAttribute("invisible-banner-setup")) { return }

  container.setAttribute("invisible-banner-setup", "true")
  container.addEventListener("mouseenter", () => { container.style.opacity = "0.5" })
  container.addEventListener("mouseleave", () => { container.style.opacity = "1" })
  container.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences()
    playerPreferences.bannerAccent = playerPreferences.bannerAccent === "2" ? "1" : "2"
    await requests.updatePlayerPreferences(playerPreferences)
  })
}

async function setupCopyBadges() {
  const container = document.querySelector("div > div.challenge-banner-token-container")
  if (!container || container.hasAttribute("copy-badges-setup")) { return }

  container.setAttribute("copy-badges-setup", "true")
  container.addEventListener("mouseenter", () => { container.style.opacity = "0.5" })
  container.addEventListener("mouseleave", () => { container.style.opacity = "1" })
  container.addEventListener("click", async () => {
    const playerPreferences = await requests.getPlayerPreferences()

    if (!playerPreferences.challengeIds.length) {
      console.debug(`${plugin.name}: The player does not have a defined badge.`)
      return
    }

    const firstBadge = playerPreferences.challengeIds[0]
    playerPreferences.challengeIds = Array(3).fill(firstBadge)
    await requests.updatePlayerPreferences(playerPreferences)
  })
  container.addEventListener("contextmenu", async () => {
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
    setupCopyBadges()
  ]
  await Promise.all(toSetup)
}

async function initPlugin() {
  console.debug(`${plugin.name}: feito com carinho pelo Balaclava#1912`)
  utils.routineAddCallback(onMutation, [".rcp-fe-lol-profiles-main"])
}

window.addEventListener("load", initPlugin)
