// ui/menu.js — V1 circular menu

export class Menu {
  constructor() {
    this.icons = ["MEAL", "GAME", "MEDICINE", "TOILET"];
    this.index = 0;
    this.active = true;
  }

  pressA() {
    this.index = (this.index + 1) % this.icons.length;
  }

  pressB(tama) {
    switch (this.current()) {
      case "MEAL": tama.feedMeal(); break;
      case "GAME": tama.playGame(); break;
      case "MEDICINE": tama.giveMedicine(); break;
      case "TOILET": tama.cleanPoop(); break;
    }
  }

  pressC() {
    // V1: C cancels / closes submenus (noop for now)
  }

  current() {
    return this.icons[this.index];
  }
}