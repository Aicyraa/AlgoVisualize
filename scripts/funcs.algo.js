import { sleep } from "./funcs.utils.js";

var sortCompareTime = 800;
var sortSwapTime = 50;

async function bubble(arr) {
   let sorted = [];
   let n = arr.length;

   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
         sortCompare([], j, j + 1);
         await sleep(sortCompareTime);

         if (arr[j] > arr[j + 1]) {
            sortSwap(j, j + 1);
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
         }
      }
      sorted.push(n - i - 1);
      sortCompare(sorted);
   }
   return arr;
}

async function selection(arr) {
   let sorted = [];
   let n = arr.length;
   for (let i = 0; i < n - 1; i++) {
      let smallest = arr[i];
      let index = 0;
      for (let j = i; j < n; j++) {
         sortCompare([], false, i, index);
         await sleep(sortCompareTime);
         if (smallest >= arr[j]) {
            index = j;
            smallest = arr[j];
         }
      }
      arr[index] = arr[i];
      arr[i] = smallest;
      // sortCompare([], index, i)

      sorted.push(i);
      sortCompare(sorted);
   }

   return arr;
}

function insertion(arr) {
   let n = arr.length;
   [2, 2, 5, 3, 7, 1];
   for (let i = 0; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j > 0 && temp < arr[j - 1]) {
         arr[j] = arr[j - 1];
         j -= 1;
      }
      arr[j] = temp;
   }
   return arr;
}

// comparing, swapping

function sortCompare(sorted = [], idxA, idxB, idxSpecial) {
   const points = document.querySelectorAll("#bar");
   function styleAdd() {
      points.forEach((point, index) => {
         if (sorted.includes(index)) {
            point.classList.add("sorted");
         } else if (index == idxA || index == idxB) {
            point.classList.add("current");
         } else if (idxSpecial == index) {
            point.classList.add("correct-value");
         }
      });
   }
   function styleRemove() {
      points.forEach((point) => {
         point.classList.remove("current");
      });
   }
   styleAdd();
   setTimeout(styleRemove, sortCompareTime);
}

function sortSwap(idxA, idxB) {
   /* 
   1. Record current positions of bars (getBoundingClientRect)
   2. Swap the bars in theDOM instantly
   3. Measure new positions   
   4. Apply a transform: translateX(...) to visually move them back
   5. Let CSS transition move them into place
   */
   const points = document.querySelectorAll(".points");

   let elmtA, elmtB, elmtParent;
   let elmtA_Before, elmtA_After;
   let elmtB_Before, elmtB_After;

   if (idxA === idxB) return;
   else if (idxA > idxB) [idxA, idxB] = [idxB, idxA];
   elmtA = points[idxA];
   elmtB = points[idxB];
   elmtParent = elmtA.parentNode;

   function swap() {
      elmtParent.insertBefore(elmtA, elmtB.nextSibling);
      elmtParent.insertBefore(elmtB, elmtA);
   }

   function position() {
      const A = elmtA.getBoundingClientRect();
      const B = elmtB.getBoundingClientRect();
      return [A.left, B.left];
   }

   // inverse transform
   // checks if A > B
   // if true; A shoud inverse to left side
   // otherwise A should inverse to right side
   function animate() {
      // debugger

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

export { bubble, selection, insertion };
