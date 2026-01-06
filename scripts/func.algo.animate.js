// comparing, swapping
var sortSpeed = 300;
var sortSwapTime = 50;
var swapCount = 1;

function sortCompare(sorted = [], idxA, idxB, idxSpecial) {
   const points = document.querySelectorAll("#bar");
   function styleAdd() {
      // check which index is provided, and apply the corresponding class
      points.forEach((point, index) => {
         if (sorted.includes(index)) {
            point.classList.add("sorted");
         } else if (idxSpecial == index) {
            // correct-value must stay until there is another biggest value
            point.classList.add("correct-value");
         } else if (index == idxA || index == idxB) {
            point.classList.add("current");
         }
      });
   }

   // remove the class "current" each call
   function styleCurrentRemove() {
      points.forEach((point) => {
         point.classList.remove("current");
      });
   }

   // remove the class "correct-value"
   // but this should be remove only after another correct value is provided
   function styleSpecialRemove() {
      points.forEach((point) => {
         point.classList.remove("correct-value");
      });
   }

   styleAdd();
   setTimeout(styleCurrentRemove, sortSpeed);
   setTimeout(styleSpecialRemove, sortSpeed * 4);
}

async function sortSwap(idxA, idxB) {
   if (idxA > idxB) [idxA, idxB] = [idxB, idxA];
   if (idxA == idxB) return;

   const grapgContainer = document.querySelector(".graph");

   function getOrder() {
      // Force fresh DOM query
      return Array.from(grapgContainer.children).filter((el) =>
         el.classList.contains("points")
      );
   }

   function getPosition(element) {
      return element.getBoundingClientRect().left;
   }

   function swap() {
      // get the position before swapping
      let posA_before = getPosition(elmtA);
      let posB_before = getPosition(elmtB);

      if (idxB - idxA === 1) {
         grapgContainer.insertBefore(elmtB, elmtA);
      } else {
         const nextA = elmtA.nextSibling;
         const nextB = elmtB.nextSibling;
         grapgContainer.insertBefore(elmtA, nextB);
         grapgContainer.insertBefore(elmtB, nextA);
      }

      // get the position after swapping
      let posA_after = getPosition(elmtA);
      let posB_after = getPosition(elmtB);

      return [posA_before, posB_before, posA_after, posB_after];
   }

   function animate(posA_before, posB_before, posA_after, posB_after) {
      elmtA.style.transform = `translateX(${posA_before - posA_after}px)`;
      elmtB.style.transform = `translateX(${posB_before - posB_after}px)`;

      setTimeout(() => {
         [elmtA, elmtB].forEach((elmt) => {
            elmt.classList.add("swap");
            elmt.style.transform = `translateX(0px)`;
         });
      }, sortSwapTime);
      4, 2, 19, 3, 12, 14, 1, 3, 4, 2;

      setTimeout(() => {
         [elmtA, elmtB].forEach((elmt) => {
            elmt.classList.remove("swap");
         });
      }, sortSwapTime + 50);
   }

   // Get FRESH order
   let order = getOrder();
   let elmtA = order[idxA];
   let elmtB = order[idxB];
   let positons = swap();
   animate(...positons);
}

function sortStatusLog(countSwap, logMessage) {
   // wala pang reset ng swap counter
   // dapat "done" ang lalabag pag tapos ng loop
   const statusIdentifier = document.querySelector("#status");
   const status = document.querySelector("#status-value");
   const count = document.querySelector("#swap-count");

   if (countSwap == "swap") {
      count.textContent = swapCount++;
   } else if (countSwap == "reset") {
      swapCount = 1;
      setTimeout(() => {
         count.textContent = "";
      }, 1500);
   }

   if (logMessage) {
      statusIdentifier.textContent = logMessage.status;
      status.innerHTML = logMessage.value;
   }
}

export { sortCompare, sortSwap, sortStatusLog, sortSpeed, sortSwapTime };
