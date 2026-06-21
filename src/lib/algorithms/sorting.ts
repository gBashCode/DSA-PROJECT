export interface SortStep {
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  sorted?: number[];
  pivot?: number;
  range?: [number, number];
  description?: string;
}

export type SortAlgorithmName = "bubble" | "insertion" | "selection" | "merge" | "quick" | "heap";

export const ALGORITHM_INFO: Record<
  SortAlgorithmName,
  { name: string; time: string; space: string; stable: boolean; description: string }
> = {
  bubble: {
    name: "Bubble Sort",
    time: "O(n\u00B2)",
    space: "O(1)",
    stable: true,
    description:
      "Repeatedly walks through the array, compares adjacent elements, and swaps them if they are in the wrong order. Large elements \u2018bubble\u2019 to the end with each pass.",
  },
  insertion: {
    name: "Insertion Sort",
    time: "O(n\u00B2)",
    space: "O(1)",
    stable: true,
    description:
      "Builds the sorted array one element at a time. For each element, it shifts larger elements to the right and inserts the current element into its correct position.",
  },
  selection: {
    name: "Selection Sort",
    time: "O(n\u00B2)",
    space: "O(1)",
    stable: false,
    description:
      "Divides the array into sorted and unsorted regions. Finds the minimum element from the unsorted region and places it at the end of the sorted region.",
  },
  merge: {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)",
    stable: true,
    description:
      "Divides the array in half recursively until single elements remain, then merges sorted halves back together in order.",
  },
  quick: {
    name: "Quick Sort",
    time: "O(n log n) avg",
    space: "O(log n)",
    stable: false,
    description:
      "Picks a pivot element, partitions the array so smaller elements go left and larger go right, then recursively sorts each partition.",
  },
  heap: {
    name: "Heap Sort",
    time: "O(n log n)",
    space: "O(1)",
    stable: false,
    description:
      "Builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end, shrinking the heap each time.",
  },
};

export const sortGenerators: Record<SortAlgorithmName, (arr: number[]) => Generator<SortStep>> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...array], comparing: [j, j + 1], sorted: [...sorted] };

      if (array[j] > array[j + 1]) {
        yield {
          array: [...array],
          swapping: [j, j + 1],
          sorted: [...sorted],
        };

        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        yield { array: [...array], sorted: [...sorted] };
      }
    }

    sorted.unshift(n - i - 1);

    if (!swapped) {
      for (let k = 0; k < n; k++) {
        sorted.push(k);
      }
      sorted.sort((a, b) => a - b);
      break;
    }
  }

  if (sorted.length === 0) {
    for (let k = 0; k < n; k++) {
      sorted.push(k);
    }
  }

  yield { array: [...array], sorted: [...sorted] };
}

export function* insertionSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [0];

  yield { array: [...array], sorted: [0] };

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    yield {
      array: [...array],
      comparing: [i, j],
      sorted: [...sorted],
    };

    while (j >= 0 && array[j] > key) {
      yield {
        array: [...array],
        swapping: [j, j + 1],
        sorted: [...sorted],
      };

      array[j + 1] = array[j];
      j--;

      yield { array: [...array], sorted: [...sorted] };

      if (j >= 0) {
        yield {
          array: [...array],
          comparing: [j, j + 1],
          sorted: [...sorted],
        };
      }
    }

    array[j + 1] = key;
    sorted.push(i);
    sorted.sort((a, b) => a - b);

    yield { array: [...array], sorted: [...sorted] };
  }

  yield { array: [...array], sorted: Array.from({ length: n }, (_, i) => i) };
}

export function* selectionSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      array: [...array],
      comparing: [minIdx, i + 1],
      sorted: [...sorted],
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...array],
        comparing: [minIdx, j],
        sorted: [...sorted],
      };

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      yield {
        array: [...array],
        swapping: [i, minIdx],
        sorted: [...sorted],
      };

      [array[i], array[minIdx]] = [array[minIdx], array[i]];

      yield { array: [...array], sorted: [...sorted] };
    }

    sorted.push(i);
  }

  sorted.push(n - 1);
  yield { array: [...array], sorted: [...sorted] };
}

export function* mergeSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const sorted: number[] = [];

  function* merge(
    left: number,
    mid: number,
    right: number
  ): Generator<SortStep> {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      yield {
        array: [...array],
        comparing: [left + i, mid + 1 + j],
        sorted: [...sorted],
      };

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }

      yield { array: [...array], sorted: [...sorted] };
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      yield { array: [...array], sorted: [...sorted] };
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      yield { array: [...array], sorted: [...sorted] };
      j++;
      k++;
    }
  }

  function* mergeSortHelper(
    left: number,
    right: number
  ): Generator<SortStep> {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    yield* mergeSortHelper(left, mid);
    yield* mergeSortHelper(mid + 1, right);
    yield* merge(left, mid, right);
  }

  yield* mergeSortHelper(0, array.length - 1);

  yield {
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
  };
}

export function* quickSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const sorted: number[] = [];

  function* partition(low: number, high: number): Generator<SortStep, number> {
    const pivot = array[high];

    yield {
      array: [...array],
      pivot: high,
      sorted: [...sorted],
    };

    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield {
        array: [...array],
        comparing: [j, high],
        pivot: high,
        sorted: [...sorted],
      };

      if (array[j] < pivot) {
        i++;

        if (i !== j) {
          yield {
            array: [...array],
            swapping: [i, j],
            pivot: high,
            sorted: [...sorted],
          };

          [array[i], array[j]] = [array[j], array[i]];

          yield {
            array: [...array],
            pivot: high,
            sorted: [...sorted],
          };
        }
      }
    }

    if (i + 1 !== high) {
      yield {
        array: [...array],
        swapping: [i + 1, high],
        pivot: high,
        sorted: [...sorted],
      };

      [array[i + 1], array[high]] = [array[high], array[i + 1]];

      yield {
        array: [...array],
        pivot: i + 1,
        sorted: [...sorted],
      };
    }

    sorted.push(i + 1);
    sorted.sort((a, b) => a - b);

    return i + 1;
  }

  function* quickSortHelper(
    low: number,
    high: number
  ): Generator<SortStep> {
    if (low >= high) {
      if (low === high) {
        sorted.push(low);
        sorted.sort((a, b) => a - b);
      }
      return;
    }

    const pi: number = yield* partition(low, high);

    yield* quickSortHelper(low, pi - 1);
    yield* quickSortHelper(pi + 1, high);
  }

  yield* quickSortHelper(0, array.length - 1);

  yield {
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
  };
}

export function* heapSort(arr: number[]): Generator<SortStep> {
  const array = [...arr];
  const n = array.length;
  const sorted: number[] = [];

  function* heapify(
    size: number,
    root: number
  ): Generator<SortStep> {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield {
        array: [...array],
        comparing: [left, largest],
        sorted: [...sorted],
      };

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      yield {
        array: [...array],
        comparing: [right, largest],
        sorted: [...sorted],
      };

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      yield {
        array: [...array],
        swapping: [root, largest],
        sorted: [...sorted],
      };

      [array[root], array[largest]] = [array[largest], array[root]];

      yield { array: [...array], sorted: [...sorted] };

      yield* heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    yield {
      array: [...array],
      swapping: [0, i],
      sorted: [...sorted],
    };

    [array[0], array[i]] = [array[i], array[0]];

    sorted.push(i);

    yield { array: [...array], sorted: [...sorted] };

    yield* heapify(i, 0);
  }

  sorted.push(0);

  yield { array: [...array], sorted: [...sorted] };
}
