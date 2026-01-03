// comparing, swapping
var sortCompareTime = 800;
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

   // style add
   styleAdd();
   // currect class remove after sortCompareTime
   setTimeout(styleCurrentRemove, sortCompareTime);
   // currect class remove after sortCompareTime
   setTimeout(styleSpecialRemove, sortCompareTime * 2);
}

function sortSwap(idxA, idxB) {
   // need to improve para tumugma sa selection
   const points = document.querySelectorAll(".points");

   let elmtA, elmtB, elmtParent;
   let elmtA_Before, elmtA_After;
   let elmtB_Before, elmtB_After;

   // for easy logic, the first index must be the first element
   if (idxA === idxB) return;
   else if (idxA > idxB) [idxA, idxB] = [idxB, idxA];

   elmtA = points[idxA];
   elmtB = points[idxB];
   elmtParent = elmtA.parentNode;

   // for swapping element
   function swap() {
      // tama ung value from the selection algoritm 
      // pero d tugma ung index ng array from selection sa visual na nakikita ng user
      // same index with the same value dapat pero same index different value ang nangyar
      elmtParent.insertBefore(elmtA, elmtB.nextSibling);
      elmtParent.insertBefore(elmtB, elmtA);
   }

   // for getting the before and after position
   function position() {
      const A = elmtA.getBoundingClientRect();
      const B = elmtB.getBoundingClientRect();
      return [A.left, B.left];
   }

   // applying the visual animation after the script
   function animate() {
      elmtA.style.transform = `translateX(${elmtA_Before - elmtA_After}px)`;
      elmtB.style.transform = `translateX(${elmtB_Before - elmtB_After}px)`;
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
      }, sortSwapTime + 100);
   }

   [elmtA_Before, elmtB_Before] = position();
   swap();
   [elmtA_After, elmtB_After] = position();
   animate();
}

export { sortCompare, sortSwap, sortCompareTime, sortSwapTime };
