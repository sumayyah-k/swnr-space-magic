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

export function validateSkillsExist(token) {
  if (token.document.actor.constructor.name == "SWNRCharacterActor") {
    var skills = token.document.actor.items.contents.filter((i) =>
      filterSkillsBySystem(token, i)
    );

    return skills.length == SWNRSkillList.length;
  }

  return false;
}

export async function getActorClasses(actor) {
   //Check if they have an active form marked as arcanist
  var classes = [];
  const activeForm = await actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTOR_ACTIVE_FORM);
  if (activeForm) {
    const activeFormData = actor.items.contents.find(i => i.id == activeForm);
    if (activeFormData) {
      const activeFormCasterType = await activeFormData.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ITEM_FOCUS_CASTER_TYPE);
      if (activeFormCasterType) {
        classes.push({
          name: activeFormCasterType,
          type: 'class'
        });
      }
    }
  } else {
    classes = actor.items.contents.filter((i) => i.type == "class");
  }
  return classes;
}

export async function isArcanist(actor) {
  // Check if they have the arcanist class
  const classes = await getActorClasses(actor);
  return (
    classes.findIndex(
      (i) =>
        [
          "arcanist",
          "partial arcanist",
        ].indexOf(i.name.toLowerCase().trim()) != -1
    ) != -1
  );
}
export async function isMagister(actor) {
  const classes = await getActorClasses(actor);
  return (
    classes.findIndex(
      (i) =>
        [
          "magister",
          "pacter",
          "rectifier",
          "war mage",
          "partial magister",
          "partial pacter",
          "partial rectifier",
          "partial war mage",
        ].indexOf(i.name.toLowerCase().trim()) != -1
    ) != -1
  );
}

export async function isMtAMage(actor) {
  const classes = await getActorClasses(actor);
  return (
    classes.findIndex(
      (i) => [
          "mage",
          "proximi",
        ].indexOf(i.name.toLowerCase().trim()) != -1
    ) != -1
  );
}

export async function isSwNMage(actor) {
  return await isArcanist(actor) || await isMagister(actor);
}

export async function isPsychic(actor) {
  const classes = await getActorClasses(actor);
  return classes.findIndex(
      (i) =>
        i.type == "class" &&
        ["Psychic", "Partial Psychic"].indexOf(i.name) != -1
    ) != -1;
}
