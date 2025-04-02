
import { useEffect } from "react";
import "./PixelGrid.css";

function PixelGridBackground() {
  useEffect(() => {
    (function () {
      const svg = document.getElementById("pixel-svg");
      const container = document.getElementById("pixel-container");
      const g = svg.querySelector("g");
      const themeSelector = document.getElementById("themes");
      let WIDTH, COLS, ROWS, TOTAL, CENTERX, CENTERY;
      let gridIsBuilding = false;

      function setWindowValues() {
        const minFactor = Math.min(svg.clientWidth, svg.clientHeight);
        WIDTH = minFactor > 1200 ? 65 : minFactor > 950 ? 55 : minFactor > 750 ? 45 : 35;
        COLS = Math.floor(svg.clientWidth / WIDTH);
        ROWS = Math.floor(svg.clientHeight / WIDTH);
        TOTAL = (COLS + 1) * (ROWS + 1);
        CENTERX = Math.floor(COLS / 2);
        CENTERY = Math.floor(ROWS / 2);
      }

      
      const themes = {
        ArkStarmap: {
          key: "ArkStarmap",
          url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1197275/sky4.jpg",
          base: "rgba(48, 69, 95, 0.45)",
          solid1: "rgba(48, 69, 95, 0.55)",
          solid2: "rgba(48, 69, 95, 0.65)",
          solid3: "rgba(48, 69, 95, 0.75)",
          time1: 100,
          time2: 200,
          time3: 900,
          func: ArkStarmap
        },
       
      };

      themeSelector.addEventListener("change", () => buildGrid());
      async function buildGrid(doDelay = true) {
        setWindowValues();
        if (doDelay) await delay(2000);
        let theme = themes[themeSelector.value];
        g.innerHTML = "";
        g.style = "";
        g.style.fill = theme.base;
        container.style.backgroundImage = theme.url ? `url('${theme.url}')` : "";
        buildBoxes(theme.base, theme.gutter);
        theme.func();
      }
      window.onload = () => buildGrid(false);

      
      function ArkStarmap() {
        const arc = themes.ArkStarmap;
        const BATCHES = 30;
        for (let i = 0; i < BATCHES; i++) {
          oneSquare(arc.solid1, arc.time1);
          oneSquare(arc.solid3, arc.time1);
          oneSquare(arc.solid2, arc.time3);
        }
        quadRunner(arc.solid3, arc.time1);
        quadRunner(arc.solid3, arc.time2);
        quadRunner(arc.solid2, arc.time3);

        async function oneSquare(solid, time) {
          if (gridIsBuilding || themeSelector.value !== "ArkStarmap") return;
          const randomPoint = getRandomPoint();
          const target = getTarget(randomPoint.row, randomPoint.col);
          target.setAttribute("fill", solid);
          await delay(time);
          target.setAttribute("fill", arc.base);
          oneSquare(solid, time);
        }
        async function quadRunner(color, time) {
          if (gridIsBuilding || themeSelector.value !== "ArkStarmap") return;
          const randomPoint = getRandomPoint();
          const row = randomPoint.row;
          const col = randomPoint.col;
          const t1 = getTarget(row, col);
          const t2 = getTarget(row, col + 1);
          const t3 = getTarget(row + 1, col);
          const t4 = getTarget(row + 1, col + 1);
          t1 && t1.setAttribute("fill", color);
          t2 && t2.setAttribute("fill", color);
          t3 && t3.setAttribute("fill", color);
          t4 && t4.setAttribute("fill", color);
          await delay(time);
          t1 && t1.setAttribute("fill", arc.base);
          t2 && t2.setAttribute("fill", arc.base);
          t3 && t3.setAttribute("fill", arc.base);
          t4 && t4.setAttribute("fill", arc.base);
          quadRunner(color, time);
        }
      }

      function buildBoxes(color, gutter = 1) {
        for (let col = 0; col <= COLS; col++) {
          for (let row = 0; row <= ROWS; row++) {
            const x = WIDTH * col;
            const y = WIDTH * row;
            drawSquare(row, col, x, y, WIDTH - gutter, WIDTH - gutter, color);
          }
        }
      }

      function Point(row, col) {
        this.row = parseInt(row);
        this.col = parseInt(col);
      }

      function getRandomPoint() {
        const row = Math.floor(Math.random() * (ROWS + 1));
        const col = Math.floor(Math.random() * (COLS + 1));
        return new Point(row, col);
      }

      function getRandomMove(from, xRando = Math.random(), yRando = Math.random()) {
        let xMove = xRando > 0.66 ? 1 : xRando > 0.33 ? 0 : -1;
        let yMove = yRando > 0.66 ? 1 : yRando > 0.33 ? 0 : -1;
        if (from.row + yMove > ROWS) yMove = 0;
        if (from.row + yMove < 0) yMove = 0;
        if (from.col + xMove < 0) xMove = 0;
        if (from.col + xMove > COLS) xMove = 0;
        return new Point(from.row + yMove, from.col + xMove);
      }

      function getTarget(row, col) {
        return document.querySelector(`rect[col='${col}'][row='${row}']`);
      }

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      function drawSquare(row, col, x, y, w, h, color) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("row", row);
        rect.setAttribute("col", col);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        g.appendChild(rect);
      }
    })();
  }, []);

  return (
    <div id="pixel-container">
      <div id="pixel-controls">
        <h1 id="marquee">Pixel-Grid</h1>
        Preset:{" "}
        <select id="themes">
          <option value="ArkStarmap">Ark Starmap</option>
        </select>
      </div>
      <svg id="pixel-svg">
        <g></g>
      </svg>
    </div>
  );
}

export default PixelGridBackground;
