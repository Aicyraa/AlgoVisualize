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
}

async function selection(arr) {
   // first element always has the "current" class
   // hindi tama ung pag swap bandang gitna
   // issue
   const last = n - i - 1;
   let sorted = [];
   let n = arr.length;

   for (let i = 0; i < n; i++) {
      let bigIdx = 0;
      for (let j = 0; j < n - i; j++) {
         sortCompare([], j, undefined, index);
         await sleep(sortCompareTime + 1000);

         if (arr[j] >= arr[bigIdx]) {
            bigIdx = j;
         }
      }

      // swapping the bigIdx to last and vice versa
      sortSwap(bigIdx, last);
      arr[bigIdx] = arr[last];
      arr[last] = arr[bigIdx];

      // pushing the last index to the sorted array
      sorted.push(n - i - 1);
      sortCompare(sorted);
      await sleep(sortCompareTime - 500);
   }
   console.log(arr);
   return arr;
}

function insertion(arr) {
   let n = arr.length;
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

function merge(arr) {
   // divides the array into N sublist, where the sublist must contain only 1 element
   // takes the 2 singleton array and merge them
   // consider the first element of both 2 sublist
   // the element who has the first lesser value become the new element
}

// comparing, swapping

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
   setTimeout(styleSpecialRemove, sortCompareTime);
}

function sortSwap(idxA, idxB) {
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

export { bubble, selection, insertion };
