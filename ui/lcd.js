// ui/lcd.js — LCD 32x16 pixel-perfect renderer

export class LCD {
  constructor(canvasId, scale = 10) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.width = 32;
    this.height = 16;
    this.scale = scale;

    this.canvas.width = this.width * scale;
    this.canvas.height = this.height * scale;

    this.ctx.imageSmoothingEnabled = false;

    this.clear();
  }

  clear() {
    this.ctx.fillStyle = "#cfd8c3";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  pixel(x, y, on = true) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.ctx.fillStyle = on ? "#000" : "#cfd8c3";
    this.ctx.fillRect(
      x * this.scale,
      y * this.scale,
      this.scale,
      this.scale
    );
  }

  sprite(x, y, data) {
    for (let j = 0; j < data.length; j++) {
      for (let i = 0; i < data[j].length; i++) {
        if (data[j][i]) {
          this.pixel(x + i, y + j, true);
        }
      }
    }
  }
}
