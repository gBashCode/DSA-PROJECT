export interface Problem {
  id: string;
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
}

export const problems: Problem[] = [
  // Arrays & Hashing
  {
    id: "1",
    topic: "Arrays & Hashing",
    title: "Two Sum",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: "2",
    topic: "Arrays & Hashing",
    title: "Contains Duplicate",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    id: "3",
    topic: "Arrays & Hashing",
    title: "Valid Anagram",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    id: "4",
    topic: "Arrays & Hashing",
    title: "Group Anagrams",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/group-anagrams/",
  },
  {
    id: "5",
    topic: "Arrays & Hashing",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
  },
  {
    id: "6",
    topic: "Arrays & Hashing",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    id: "7",
    topic: "Arrays & Hashing",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-consecutive-sequence/",
  },

  // Two Pointers
  {
    id: "8",
    topic: "Two Pointers",
    title: "Valid Palindrome",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-palindrome/",
  },
  {
    id: "9",
    topic: "Two Pointers",
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
  },
  {
    id: "10",
    topic: "Two Pointers",
    title: "3Sum",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/3sum/",
  },
  {
    id: "11",
    topic: "Two Pointers",
    title: "Container With Most Water",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    id: "12",
    topic: "Two Pointers",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/trapping-rain-water/",
  },

  // Sliding Window
  {
    id: "13",
    topic: "Sliding Window",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: "14",
    topic: "Sliding Window",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: "15",
    topic: "Sliding Window",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/minimum-window-substring/",
  },
  {
    id: "16",
    topic: "Sliding Window",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/sliding-window-maximum/",
  },

  // Stack
  {
    id: "17",
    topic: "Stack",
    title: "Valid Parentheses",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: "18",
    topic: "Stack",
    title: "Min Stack",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/min-stack/",
  },
  {
    id: "19",
    topic: "Stack",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
  },
  {
    id: "20",
    topic: "Stack",
    title: "Generate Parentheses",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/generate-parentheses/",
  },
  {
    id: "21",
    topic: "Stack",
    title: "Daily Temperatures",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/daily-temperatures/",
  },
  {
    id: "22",
    topic: "Stack",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
  },

  // Binary Search
  {
    id: "23",
    topic: "Binary Search",
    title: "Binary Search",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/binary-search/",
  },
  {
    id: "24",
    topic: "Binary Search",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/search-a-2d-matrix/",
  },
  {
    id: "25",
    topic: "Binary Search",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/koko-eating-bananas/",
  },
  {
    id: "26",
    topic: "Binary Search",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  },
  {
    id: "27",
    topic: "Binary Search",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  },

  // Linked List
  {
    id: "28",
    topic: "Linked List",
    title: "Reverse Linked List",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/reverse-linked-list/",
  },
  {
    id: "29",
    topic: "Linked List",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    id: "30",
    topic: "Linked List",
    title: "Linked List Cycle",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/linked-list-cycle/",
  },
  {
    id: "31",
    topic: "Linked List",
    title: "Reorder List",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/reorder-list/",
  },
  {
    id: "32",
    topic: "Linked List",
    title: "LRU Cache",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/lru-cache/",
  },

  // Trees
  {
    id: "33",
    topic: "Trees",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/invert-binary-tree/",
  },
  {
    id: "34",
    topic: "Trees",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  },
  {
    id: "35",
    topic: "Trees",
    title: "Same Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/same-tree/",
  },
  {
    id: "36",
    topic: "Trees",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    id: "37",
    topic: "Trees",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/validate-binary-search-tree/",
  },
  {
    id: "38",
    topic: "Trees",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
  },

  // Heap
  {
    id: "39",
    topic: "Heap",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
  },
  {
    id: "40",
    topic: "Heap",
    title: "Task Scheduler",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/task-scheduler/",
  },
  {
    id: "41",
    topic: "Heap",
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/find-median-from-data-stream/",
  },

  // Backtracking
  {
    id: "42",
    topic: "Backtracking",
    title: "Subsets",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/subsets/",
  },
  {
    id: "43",
    topic: "Backtracking",
    title: "Combination Sum",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/combination-sum/",
  },
  {
    id: "44",
    topic: "Backtracking",
    title: "Permutations",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/permutations/",
  },
  {
    id: "45",
    topic: "Backtracking",
    title: "N-Queens",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/n-queens/",
  },

  // Graphs
  {
    id: "46",
    topic: "Graphs",
    title: "Number of Islands",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    id: "47",
    topic: "Graphs",
    title: "Clone Graph",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/clone-graph/",
  },
  {
    id: "48",
    topic: "Graphs",
    title: "Course Schedule",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/course-schedule/",
  },
  {
    id: "49",
    topic: "Graphs",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
  },
  {
    id: "50",
    topic: "Graphs",
    title: "Word Ladder",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/word-ladder/",
  },

  // Dynamic Programming
  {
    id: "51",
    topic: "Dynamic Programming",
    title: "Climbing Stairs",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    id: "52",
    topic: "Dynamic Programming",
    title: "House Robber",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/house-robber/",
  },
  {
    id: "53",
    topic: "Dynamic Programming",
    title: "Coin Change",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/coin-change/",
  },
  {
    id: "54",
    topic: "Dynamic Programming",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-increasing-subsequence/",
  },
  {
    id: "55",
    topic: "Dynamic Programming",
    title: "Word Break",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/word-break/",
  },
  {
    id: "56",
    topic: "Dynamic Programming",
    title: "Unique Paths",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/unique-paths/",
  },
  {
    id: "57",
    topic: "Dynamic Programming",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-common-subsequence/",
  },
  {
    id: "58",
    topic: "Dynamic Programming",
    title: "Edit Distance",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/edit-distance/",
  },

  // Greedy
  {
    id: "59",
    topic: "Greedy",
    title: "Maximum Subarray",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: "60",
    topic: "Greedy",
    title: "Jump Game",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/jump-game/",
  },
  {
    id: "61",
    topic: "Greedy",
    title: "Gas Station",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/gas-station/",
  },
  {
    id: "62",
    topic: "Greedy",
    title: "Hand of Straights",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/hand-of-straights/",
  },

  // Intervals
  {
    id: "63",
    topic: "Intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/merge-intervals/",
  },
  {
    id: "64",
    topic: "Intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/non-overlapping-intervals/",
  },
  {
    id: "65",
    topic: "Intervals",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/meeting-rooms-ii/",
  },

  // Math & Bit Manipulation
  {
    id: "66",
    topic: "Math & Bit Manipulation",
    title: "Single Number",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/single-number/",
  },
  {
    id: "67",
    topic: "Math & Bit Manipulation",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/number-of-1-bits/",
  },
  {
    id: "68",
    topic: "Math & Bit Manipulation",
    title: "Counting Bits",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/counting-bits/",
  },
  {
    id: "69",
    topic: "Math & Bit Manipulation",
    title: "Reverse Bits",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/reverse-bits/",
  },
  {
    id: "70",
    topic: "Math & Bit Manipulation",
    title: "Missing Number",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/missing-number/",
  },
  {
    id: "71",
    topic: "Math & Bit Manipulation",
    title: "Rotate Image",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/rotate-image/",
  },
  {
    id: "72",
    topic: "Math & Bit Manipulation",
    title: "Spiral Matrix",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/spiral-matrix/",
  },
  {
    id: "73",
    topic: "Math & Bit Manipulation",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/set-matrix-zeroes/",
  },
];
