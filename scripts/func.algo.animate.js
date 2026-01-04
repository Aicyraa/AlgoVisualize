// comparing, swapping
var sortCompareTime = 1000;
var sortSwapTime = 50;

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
   setTimeout(styleCurrentRemove, sortCompareTime);
   setTimeout(styleSpecialRemove, sortCompareTime * 2);
}

function sortSwap(idxA, idxB) {

   if (idxA > idxB) [idxA, idxB] = [idxB, idxA];
   if (idxA == idxB) return;

   const grapgContainer = document.querySelector(".graph");

   function getOrder() {
      // returns the updated order specially after swapping
      return [...document.querySelectorAll(".points")];
   }

   function getPosition() {
      // get position for animation
      const A = elmtA.getBoundingClientRect();
      const B = elmtB.getBoundingClientRect();
      return [A.left, B.left];
   }

   function swap() {
      // swapping element
      let points1 = getOrder()
      grapgContainer.insertBefore(elmtA, elmtB.nextSibling);
      let points2 = getOrder()
      let newEl = points2[idxA]
      grapgContainer.insertBefore(elmtB, getOrder()[idxA]);   
      let points3 = getOrder()
   }

   function animate() {
      elmtA.style.transform = `translateX(${elmtA_BP1 - elmtA_AP2}px)`;
      elmtB.style.transform = `translateX(${elmtB_BP1 - elmtB_AP2}px)`;

      setTimeout(() => {
         [elmtA, elmtB].forEach((elmt) => {
            elmt.classList.add("swap");
            elmt.style.transform = `translateX(0px)`;
         });
      }, sortSwapTime);

      setTimeout(() => {
         [elmtA, elmtB].forEach((elmt) => {
            elmt.classList.remove("swap");
         });
      }, sortSwapTime + 50);
   }

   let elmtA = getOrder()[idxA];
   let elmtB = getOrder()[idxB];
   let [elmtA_BP1, elmtB_BP1] = getPosition();
   swap()
   let [elmtA_AP2, elmtB_AP2] = getPosition();
   animate()
}
export { sortCompare, sortSwap, sortCompareTime, sortSwapTime };
