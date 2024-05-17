import { MageMagicAddon } from "./MageMagicAddon.js";

const SWNRSkillList = ["Know Magic", "Use Magic"];
const MTASkillList = ["Gnosis", "Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time"];

export function filterSkillsBySystem(token, i) {
    if (token.document.actor.constructor.name == "SWNRCharacterActor") {
        return (
          i.type == "skill" &&
          [...SWNRSkillList, ...MTASkillList].indexOf(i.name) != -1
        );
    }

    return false;
}

export function validateSkillsExist(token, ) {
  if (token.document.actor.constructor.name == "SWNRCharacterActor") {
    var skills = token.document.actor.items.contents.filter((i) =>
      filterSkillsBySystem(token, i)
    );

    return skills.length == SWNRSkillList.length;
  }

  return false;
}

export async function isArcanist(actor) {
  //Check if they have an active form marked as arcanist
  const activeForm = await actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTOR_ACTIVE_FORM);
  if (activeForm) {
    const activeFormData = actor.items.contents.find(i => i.id == activeForm);
    if (activeFormData) {
      const activeFormCasterType = await activeFormData.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ITEM_FOCUS_CASTER_TYPE);
      if (activeFormCasterType && activeFormCasterType == 'arcanist') {
        return true;
      }
    }
  }
  // Check if they have the arcanist class
  return (
    actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        i.name.toLowerCase().trim() == "arcanist"
    ) != -1
  );
}
export async function isMagister(actor) {
    //Check if they have an active form marked as magister
  const activeForm = await actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTOR_ACTIVE_FORM);
  if (activeForm) {
    const activeFormData = actor.items.contents.find(i => i.id == activeForm);
    if (activeFormData) {
      const activeFormCasterType = await activeFormData.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ITEM_FOCUS_CASTER_TYPE);
      if (activeFormCasterType && activeFormCasterType == 'magister') {
        return true;
      }
    }
  }
  // Check if they have the magister class
  return (
    actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        ["magister", "pacter", "rectifier", "war mage"].indexOf(
          i.name.toLowerCase().trim()
        ) != -1
    ) != -1
  );
}

export function isMtAMage(actor) {
  return (
    actor.items.contents.findIndex(
      (i) => i.type == "class" && i.name.toLowerCase().trim() == "mage"
    ) != -1
  );
}

export async function isSwNMage(actor) {
  return await isArcanist(actor) || await isMagister(actor);
}

export function isPsychic(actor) {
  return actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        ["Psychic", "Partial Psychic"].indexOf(i.name) != -1
    ) != -1;
}