import { bubble, selection, insertion } from "./scripts/funcs.algo.js";
import {
   selectionHandler,
   selectionDropdown,
   selectionInfos,
   selectionInput,
   filterValues,
   throttle,
   debounce,
} from "./scripts/funcs.utils.js";

const graphInfo = {
   type: function () {
      const types = Array.from(document.querySelectorAll(".types"));
      return types.filter((type) => type.classList.contains("selected"));
   },

   graph: document.querySelector(".graph"),
   input: document.querySelector("#input"),
   dataPoints: [],
};

function generateBar(event) {
   graphInfo.graph.innerHTML = "";
   let values = filterValues(event.value);
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

function sortType() {
   const values = filterValues(graphInfo.input.value);
   const selectedType = graphInfo.type();

   switch (selectedType[0].dataset.type) {
      case "bubble":
         bubble(values);
         break;
      case "selection":
         selection(values);
         break;
      case "insertion":
         insertion(values);
         break;
      case "merge":
         // merge(values)
         break;
      case "quick":
         // quick(values)
         break;
      default:
         console.log("None");
   }
}

(function () {
   const dropdownBtn = document.querySelector(".dropdown-btn");
   const dropdownContainer = document.querySelector(".container-dropdown");
   const inputToggle = document.querySelector('.input-btn');
   
   // const start = document.querySelector("#start");
   // const input = document.querySelector("#input")

   selectionInfos(graphInfo.type()[0].dataset.type);
   dropdownBtn.addEventListener("click", selectionDropdown);
   dropdownContainer.addEventListener("click", selectionHandler);
   inputToggle.addEventListener("click", selectionInput)

   // start.addEventListener("click", sortType);
   // input.addEventListener("input", throttle(generateBar, 2000));
})();
