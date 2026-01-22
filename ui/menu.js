// ui/menu.js — Menu & boutons A/B/C (V1)

export class Menu {
  constructor() {
    this.icons = [
      "MEAL",
      "SNACK",
      "LIGHT",
      "GAME",
      "MEDICINE",
      "TOILET",
      "STATUS",
      "DISCIPLINE"
    ];

    this.index = 0;
    this.active = false;
  }

  pressA() {
    this.index = (this.index + 1) % this.icons.length;
  }

  pressB(tama) {
    const icon = this.icons[this.index];

    switch (icon) {
      case "MEAL":
        tama.feedMeal();
        break;
      case "SNACK":
        tama.feedSnack();
        break;
      case "GAME":
        tama.playGame();
        break;
      case "MEDICINE":
        tama.giveMedicine();
        break;
      case "TOILET":
        tama.cleanPoop();
        break;
      case "DISCIPLINE":
        tama.disciplineAction();
        break;
      case "LIGHT":
        tama.toggleLight();
        break;
      case "STATUS":
        // affichage géré plus tard
        break;
    }
  }

  pressC() {
    // pour l’instant : pas d’état secondaire
  }

  currentIcon() {
    return this.icons[this.index];
  }
}
