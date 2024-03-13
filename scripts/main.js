import { filterSkillsBySystem } from "./utils.js";
import { MageMagicAddon } from "./MageMagicAddon.js";
import { MageConfig } from "./MageConfig.js";
import MageActorSheet from "./Sheets/MageActorSheet.js";
import MageItemSheet from "./Sheets/MageItemSheet.js";

async function preloadTemplates() {
  const list = await fetch("modules/swnr-space-magic/scripts/templates.json");
  const files = await list.json();
  await loadTemplates(files.filter((t) => t.includes("fragment")));
}

Hooks.once("init", async () => {
  CONFIG.debug.hooks = true;
  Actors.registerSheet(MageMagicAddon.ID, MageActorSheet);
  Items.registerSheet(MageMagicAddon.ID, MageItemSheet);

  await preloadTemplates();

  $(document).on('click', '.swnr-mta-collapse-wrap', function (e) {
    e.currentTarget.classList.toggle('swnr-mta-collapse-expanded');
    console.log('swnr-mage', 'collapse-click', e)
  })
});

// Hooks.once('setup', function () {
//   // 
  
// })

Hooks.once("ready", () => {
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-equals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-not-equal", function (arg1, arg2, options) {
    return arg1 != arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-contains", function (needle, haystack, options) {
    needle = Handlebars.escapeExpression(needle);
    haystack = Handlebars.escapeExpression(haystack);
    console.log('swnr-mage', 'contains', needle, haystack, haystack.indexOf(needle) != -1)
    return haystack.indexOf(needle) != -1 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-gt", function (arg1, arg2, options) {
    return arg1 > arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-lt", function (arg1, arg2, options) {
    return arg1 < arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-gte", function (arg1, arg2, options) {
    return arg1 >= arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper(MageMagicAddon.ID + "-if-lte", function (arg1, arg2, options) {
    return arg1 <= arg2 ? options.fn(this) : options.inverse(this);
  });
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
// Hooks.on("renderHotbar", (playerList, html) => {
//   const actionBar = html.find("#action-bar");
//   const tooltip = game.i18n.localize("MAGE.button-title");

//   actionBar.append(
//     `<button
//             type='button'
//             class='mage-hotbar-button bar-controls'
//             title='${tooltip}'
//             disabled="true"
//         >
//             <i class='fas fa-wand-sparkles'></i>
//         </button>`
//   );

//   html.on("click", ".mage-hotbar-button", (event) => {
//     try {
//       new MageConfig(null, {
//         userId: game.userId,
//         tabs: [
//           {
//             navSelector: ".magic-casting-spells-nav",
//             contentSelector: ".magic-casting-spell-level-panels",
//             initial: "spell-level-1",
//           },
//         ],
//       }).render(true);
//     } catch (e) {
//       console.error(e);
//     }
//   });

//   html.on("click", ".swnr-mage-improvised-spellcasting-btn", (event) => {
//     console.log('swnr-mage', 'open improvised spellcast meny', event);
//   });
// });
