// tama-core.js — Tamagotchi V1 core (logic only)

export const Stage = {
  EGG: "EGG",
  BABY: "BABY",
  CHILD: "CHILD",
  TEEN: "TEEN",
  ADULT: "ADULT",
  DEAD: "DEAD",
};

export class TamaV1 {
  constructor(nowMinute = 0) {
    // Time
    this.nowMinute = nowMinute;     // horloge logique (minutes)
    this.ageMinutes = 0;

    // Life
    this.stage = Stage.EGG;

    // Core stats (V1)
    this.hunger = 4;        // 0–4
    this.happiness = 4;     // 0–4
    this.discipline = 50;   // 0–100
    this.careMistakes = 0; // 0–15+

    this.poopCount = 0;
    this.isSick = false;
    this.isSleeping = false;

    // Attention / care mistake tracking
    this.attentionFlag = false;
    this.lastAttentionMinute = null;

    // Death latch
    this.isDead = false;
  }

  // ======= TICK (1 minute) =======
  tick(minutes = 1) {
    for (let i = 0; i < minutes; i++) {
      if (this.isDead) return;

      this.nowMinute++;
      this.ageMinutes++;

      this._evolveByAge();

      // Natural decay every 30 minutes
      if (this.ageMinutes % 30 === 0) {
        this.hunger = Math.max(0, this.hunger - 1);
        this.happiness = Math.max(0, this.happiness - 1);
        this.poopCount += 1;
      }

      // Trigger attention if critical
      if ((this.hunger === 0 || this.happiness === 0) && !this.attentionFlag) {
        this.attentionFlag = true;
        this.lastAttentionMinute = this.nowMinute;
      }

      // Care mistake if ignored for ~15 minutes
      if (
        this.attentionFlag &&
        this.lastAttentionMinute !== null &&
        this.nowMinute - this.lastAttentionMinute >= 15
      ) {
        this._addCareMistake();
        this.attentionFlag = false;
        this.lastAttentionMinute = null;
      }

      // Sickness rules (V1-style)
      if (this.poopCount >= 4 || this.hunger === 0) {
        this.isSick = true;
      }

      // Death conditions
      if (this.careMistakes >= 10 || (this.isSick && this.hunger === 0)) {
        this._die();
        return;
      }
    }
  }

  // ======= ACTIONS (UI will call these) =======
  feedMeal() {
    if (this.isDead) return;
    this.hunger = Math.min(4, this.hunger + 1);
    this.poopCount += 1;
    this._clearAttention();
  }

  feedSnack() {
    if (this.isDead) return;
    this.happiness = Math.min(4, this.happiness + 1);
    this.discipline = Math.max(0, this.discipline - 2); // snacks hurt discipline
    this._clearAttention();
  }

  playGame() {
    if (this.isDead) return;
    this.happiness = Math.min(4, this.happiness + 1);
    this._clearAttention();
  }

  cleanPoop() {
    if (this.isDead) return;
    this.poopCount = 0;
  }

  giveMedicine() {
    if (this.isDead) return;
    if (this.isSick) {
      // V1 may require 1–2 uses; we model 1 successful use for now
      this.isSick = false;
    }
  }

  disciplineAction() {
    if (this.isDead) return;
    if (this.attentionFlag) {
      this.discipline = Math.min(100, this.discipline + 10);
      this._clearAttention();
    }
  }

  toggleLight() {
    if (this.isDead) return;
    this.isSleeping = !this.isSleeping;
  }

  // ======= INTERNALS =======
  _clearAttention() {
    this.attentionFlag = false;
    this.lastAttentionMinute = null;
  }

  _addCareMistake() {
    this.careMistakes += 1;
    this.discipline = Math.max(0, this.discipline - 5);
  }

  _evolveByAge() {
    // Strict V1 timing
    if (this.stage === Stage.EGG && this.ageMinutes >= 5) {
      this.stage = Stage.BABY;
    } else if (this.stage === Stage.BABY && this.ageMinutes >= 60) {
      this.stage = Stage.CHILD;
    } else if (this.stage === Stage.CHILD && this.ageMinutes >= 1440) {
      this.stage = Stage.TEEN;
    } else if (this.stage === Stage.TEEN && this.ageMinutes >= 2880) {
      this.stage = Stage.ADULT;
    }
  }

  _die() {
    this.isDead = true;
    this.stage = Stage.DEAD;
  }

  // ======= DEBUG SNAPSHOT (for tests) =======
  snapshot() {
    return {
      nowMinute: this.nowMinute,
      ageMinutes: this.ageMinutes,
      stage: this.stage,
      hunger: this.hunger,
      happiness: this.happiness,
      discipline: this.discipline,
      careMistakes: this.careMistakes,
      poopCount: this.poopCount,
      isSick: this.isSick,
      isSleeping: this.isSleeping,
      attentionFlag: this.attentionFlag,
      isDead: this.isDead,
    };
  }
}
