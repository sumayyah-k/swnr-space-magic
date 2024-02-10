export class SpelltSheet extends JournalTextPageSheet {
  get template() {
    return `../templates/spell-sheet-${
      this.isEditable ? "edit" : "view"
    }.html`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.description = {
      long: await TextEditor.enrichHTML(this.object.system.description.long, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object,
      }),
      short: await TextEditor.enrichHTML(this.object.system.description.short, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object,
      }),
    };
    return context;
  }
}
