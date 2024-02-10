import { filterSkillsBySystem } from "./utils.js";
import { MageMagicAddon } from "./MageMagicAddon.js";
import { MageConfig } from "./MageConfig.js";
// import { SpellModel } from "./SpellModel.js";
// import { SpellSheet } from "./SpellSheet.js";

Hooks.once("init", () => {
  CONFIG.debug.hooks = true;
  // Object.assign(CONFIG.Item.dataModels, {
  //   "mage_magic_addon.spell": SpellModel,
  // });
  // DocumentSheetConfig.registerSheet(
  //   Item,
  //   "mage_magic_addon",
  //   SpellSheet,
  //   {
  //     types: ["mage_magic_addon.spell"],
  //     makeDefault: true,
  //   }
  // );
  //   MageMagicAddon.initialize();
});

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  try {
    registerPackageDebugFlag(MageMagicAddon.ID);
  } catch (e) {
    console.error(e);
  }
});

Hooks.on("controlToken", (tokens, html) => {
  const controlledTokens = canvas?.tokens?.controlled ?? [];
  MageMagicAddon.log(true, tokens);
  if (controlledTokens && controlledTokens.length == 1) {
    var token = controlledTokens[0];
    var magicSkills = token.document.actor.items.contents.filter((i) =>
      filterSkillsBySystem(token, i)
    );
    if (magicSkills.length > 0) {
      document
        .querySelector(".mage-hotbar-button")
        ?.removeAttribute("disabled", false);
      return;
    }
  }

  document.querySelector(".mage-hotbar-button")?.setAttribute("disabled", "");
});

/**
 * Add the button to open the modal to the end of the hotbar
 */
Hooks.on("renderHotbar", (playerList, html) => {
  const actionBar = html.find("#action-bar");
  const tooltip = game.i18n.localize("MAGE.button-title");

  actionBar.append(
    `<button
            type='button'
            class='mage-hotbar-button bar-controls'
            title='${tooltip}'
            disabled="true"
        >
            <i class='fas fa-wand-sparkles'></i>
        </button>`
  );

  html.on("click", ".mage-hotbar-button", (event) => {
    try {
      new MageConfig().render(true, { userId: game.userId });
    } catch (e) {
      console.error(e);
    }
  });
});
