import { sleep } from "./funcs.utils.js";

async function bubble(arr) {
   let sorted = [];
   let n = arr.length;

   for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
         sortCompare([], j, j + 1);
         await sleep(1000);

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
         console.log(smallest);
         await sleep(1000);
         if (smallest >= arr[j]) {
            index = j;
            smallest = arr[j];
         }
      }
      arr[index] = arr[i];
      arr[i] = smallest;
      sorted.push(i);
      sortCompare(sorted);
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
         // point.classList.remove("correct-value");
      });
   }
   styleAdd();
   setTimeout(styleRemove, 1000);
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
   // A 4
   // B 1
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

   // function transformBefore() {
   //     elmtA.style.transform = `translateX(${elmtA_Before}px)`
   //     elmtB.style.transform = `translateX(${elmtB_Before}px)`
   // }

   // function transformInverse() {
   //    elmtA.style.transform = `translateX(${elmtA_Before - elmtA_After}px)`
   //    elmtB.style.transform = `translateX(${elmtB_Before - elmtB_After}px)`
   // }

   [elmtA_Before, elmtB_Before] = position();
   swap();
   [elmtA_After, elmtB_After] = position();
   // transformBefore();

   // console.log(elmtA_Before, elmtA_After);
   // console.log(elmtB_Before, elmtB_After);
}

export { bubble, selection };
