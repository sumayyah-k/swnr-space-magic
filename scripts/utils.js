const SWNRSkillList = ["Know Magic", "Use Magic"];

export function filterSkillsBySystem(token, i) {
    if (token.document.actor.constructor.name == "SWNRCharacterActor") {
        return i.type == "skill" && SWNRSkillList.indexOf(i.name) != -1;
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