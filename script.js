import { bubble, selection, insertion } from "./scripts/funcs.algo.js";
import {
   selectionHandler,
   selectionDropdown,
   selectionInfos,
   selectionInput,
   filterValues,
   throttle,
} from "./scripts/funcs.utils.js";

const graphInfo = {
   sortSpeed: 500,
   graph: document.querySelector(".graph"),

   type: function () {
      const types = Array.from(document.querySelectorAll(".types"));
      return types.filter((type) => type.classList.contains("selected"));
   },
   speed: function () {
      const speeds = Array.from(document.querySelectorAll(".speeds"));
      return speeds.filter((speed) => speed.classList.contains("selected"))[0];
   },

   getPoints: function () {
      return Array.from(this.graph.children).map(
         (point) => point.querySelector("#text").textContent
      );
   },
};

function generateBar(values) {
   graphInfo.graph.innerHTML = "";

   values.forEach((point, index) => {
      const points = document.createElement("div");
      const height = 5 * point ? 5 * point : 0.8;
      points.className = "points";
      points.dataset.index = index;
      points.innerHTML = `
            <span id=text>${point}</span>
            <span id=bar style="height:${height}px;"></span>
         `;

      graphInfo.graph.append(points);
   });
}

function dataCustom(generate) {
   return function (event) {
      const input = event.currentTarget;
      const value = filterValues(input.value);
      generate(value);
   };
}

function dataRandom(generate) {
   return function (event) {
      const input = event.currentTarget;
      let points = [];
      for (let i = 0; i < input.value; i++) {
         points.push(Math.floor(Math.random() * 20));
      }
      generate(points);
   };
}

function sortPoints() {
   const values = graphInfo.getPoints();
   const algorithm = graphInfo.type();
   const speed = graphInfo.speed();
   
   graphInfo.sortSpeed = 500 * speed.dataset.speed

   switch (algorithm[0].dataset.type) {
      case "bubble":
         bubble(values);
         break;
      case "selection":
         selection(values);
         break;
      case "insertion":
         insertion(values);
         break;
      // case "merge":
      //    break;
      // case "quick":
      //    break;
   }
}

(function () {
   selectionInfos(graphInfo.type()[0].dataset.type);
   generateBar = throttle(generateBar, 2000);

   const dropdownBtn = document.querySelector(".dropdown-btn");
   const dropdownContainer = document.querySelector(".container-dropdown");
   const inputToggle = document.querySelector(".input-btn");
   const inputCustom = document.querySelector("#custom-value");
   const inputRandom = document.querySelector("#random-value");
   const sortBtn = document.querySelectorAll(".button");

   dropdownBtn.addEventListener("click", selectionDropdown);
   dropdownContainer.addEventListener("click", selectionHandler);
   inputToggle.addEventListener("click", selectionInput);
   inputCustom.addEventListener("input", dataCustom(generateBar));
   inputRandom.addEventListener("input", dataRandom(generateBar));
   sortBtn.forEach((btn) => {btn.addEventListener("click", sortPoints)});

})();

export { graphInfo };
