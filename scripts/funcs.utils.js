function selectionHandler(event) {
   const types = document.querySelectorAll(".types");
   const current = event.target;

   if (current.dataset.type == undefined) {
      return;
   } else {
      types.forEach((element) => {
         element.classList.remove("selected");
      });
      selectionInfos(current.dataset.type);
      current.classList.add("selected");
   }
}

function selectionDropdown() {
   document.querySelector(".container-selection").classList.toggle("show");
   document.querySelector(".dropdown-btn").classList.toggle("show");
}

function selectionInfos(topicChoice) {
   const infos = {
      bubble: {
         topic: "Bubble Sort",
         desc: "Bubble Sort repeatedly steps through a list, compares adjacent elements, and swaps them if they are in the wrong order. Each pass pushes the largest remaining element toward its final position at the end of the list. The algorithm continues until a full pass completes with no swaps, indicating the list is sorted. It is simple to understand but inefficient for large datasets due to its quadratic time complexity.",
      },
      selection: {
         topic: "Selection Sort",
         desc: "Selection Sort divides the list into a sorted and an unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and swaps it with the first unsorted element, expanding the sorted region by one. The number of comparisons is fixed regardless of input order, making its performance predictable but inefficient for large lists. It minimizes swaps but still runs in quadratic time.",
      },
      insertion: {
         topic: "Insertion Sort",
         desc: "Insertion Sort builds the sorted list one element at a time by taking the next element and inserting it into its correct position within the already sorted portion. Elements in the sorted region are shifted as needed to make room. It performs efficiently on small datasets or nearly sorted data. In the worst case, its time complexity is quadratic.",
      },
      merge: {
         topic: "Merge Sort",
         desc: "Merge Sort follows a divide-and-conquer strategy by recursively splitting the list into smaller sublists until each contains one element. These sublists are then merged back together in sorted order. The algorithm guarantees consistent performance regardless of input order and runs in linearithmic time. It requires additional memory for merging.",
      },
      quick: {
         topic: "Quick Sort",
         desc: "Quick Sort selects a pivot element and partitions the list so that elements smaller than the pivot come before it and larger elements come after. It then recursively sorts the partitions. On average, it runs in linearithmic time and is one of the fastest practical sorting algorithms. However, poor pivot selection can degrade performance to quadratic time.",
      },
   };

   document.querySelector(".graph").innerHTML = ""
   document.querySelector("#details-topic").textContent = infos[`${topicChoice}`].topic;
   document.querySelector("#details-desc").textContent = infos[`${topicChoice}`].desc;
}

function filterValues(rawValue) {
   const pattern = /^[0-9]+$/;
   const values = rawValue.split(",");
   return values
      .filter((value) => pattern.test(value))
      .map((value) => Number(value));
}

function throttle(func, ms) {
   let isWaiting = false;

   return function (event) {
      if (isWaiting) return;
      isWaiting = true;
      func.call(event, this);
      setTimeout(() => {
         func.call(event, this);
         isWaiting = false;
      }, ms);
   };
}

function debounce(func, ms) {
   let reference;
   return function (event) {
      clearTimeout(reference);
      reference = setTimeout(() => {
         func.call(event, this);
      }, ms);
   };
}

function sleep(ms) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

export {
   selectionHandler,
   selectionDropdown,
   selectionInfos,
   filterValues,
   throttle,
   debounce,
   sleep,
};
