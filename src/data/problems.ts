export interface Problem {
  id: string;
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
}

export const problems: Problem[] = [
  // ═══════════════════════════════════════════════════════════════
  // EASY PROBLEMS (75)
  // ═══════════════════════════════════════════════════════════════

  // Arrays & Hashing
  { id: "1", topic: "Arrays & Hashing", title: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: "2", topic: "Arrays & Hashing", title: "Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: "3", topic: "Arrays & Hashing", title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },

  // Two Pointers
  { id: "11", topic: "Two Pointers", title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: "12", topic: "Two Pointers", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  { id: "13", topic: "Two Pointers", title: "Move Zeroes", difficulty: "Easy", link: "https://leetcode.com/problems/move-zeroes/" },
  { id: "14", topic: "Two Pointers", title: "Is Subsequence", difficulty: "Easy", link: "https://leetcode.com/problems/is-subsequence/" },

  // Sliding Window
  { id: "20", topic: "Sliding Window", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "21", topic: "Sliding Window", title: "Maximum Average Subarray I", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-average-subarray-i/" },

  // Stack
  { id: "28", topic: "Stack", title: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },

  // Binary Search
  { id: "38", topic: "Binary Search", title: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/" },

  // Linked List
  { id: "47", topic: "Linked List", title: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "48", topic: "Linked List", title: "Merge Two Sorted Lists", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "49", topic: "Linked List", title: "Linked List Cycle", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/" },

  // Trees
  { id: "59", topic: "Trees", title: "Invert Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "60", topic: "Trees", title: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "61", topic: "Trees", title: "Same Tree", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/" },
  { id: "62", topic: "Trees", title: "Symmetric Tree", difficulty: "Easy", link: "https://leetcode.com/problems/symmetric-tree/" },
  { id: "63", topic: "Trees", title: "Subtree of Another Tree", difficulty: "Easy", link: "https://leetcode.com/problems/subtree-of-another-tree/" },

  // Heap
  { id: "77", topic: "Heap", title: "Kth Largest Element in a Stream", difficulty: "Easy", link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: "78", topic: "Heap", title: "Last Stone Weight", difficulty: "Easy", link: "https://leetcode.com/problems/last-stone-weight/" },

  // 1D Dynamic Programming
  { id: "104", topic: "1D Dynamic Programming", title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },

  // Math & Geometry
  { id: "139", topic: "Math & Geometry", title: "Happy Number", difficulty: "Easy", link: "https://leetcode.com/problems/happy-number/" },
  { id: "140", topic: "Math & Geometry", title: "Plus One", difficulty: "Easy", link: "https://leetcode.com/problems/plus-one/" },

  // Bit Manipulation
  { id: "147", topic: "Bit Manipulation", title: "Single Number", difficulty: "Easy", link: "https://leetcode.com/problems/single-number/" },
  { id: "148", topic: "Bit Manipulation", title: "Number of 1 Bits", difficulty: "Easy", link: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: "149", topic: "Bit Manipulation", title: "Counting Bits", difficulty: "Easy", link: "https://leetcode.com/problems/counting-bits/" },
  { id: "150", topic: "Bit Manipulation", title: "Reverse Bits", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-bits/" },
  { id: "151", topic: "Bit Manipulation", title: "Missing Number", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },

  // ═══════════════════════════════════════════════════════════════
  // MEDIUM PROBLEMS (85)
  // ═══════════════════════════════════════════════════════════════

  // Arrays & Hashing
  { id: "4", topic: "Arrays & Hashing", title: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
  { id: "5", topic: "Arrays & Hashing", title: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: "6", topic: "Arrays & Hashing", title: "Product of Array Except Self", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "7", topic: "Arrays & Hashing", title: "Valid Sudoku", difficulty: "Medium", link: "https://leetcode.com/problems/valid-sudoku/" },
  { id: "8", topic: "Arrays & Hashing", title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { id: "9", topic: "Arrays & Hashing", title: "Encode and Decode Strings", difficulty: "Medium", link: "https://leetcode.com/problems/encode-and-decode-strings/" },
  { id: "10", topic: "Arrays & Hashing", title: "Insert Delete GetRandom O(1)", difficulty: "Medium", link: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },

  // Two Pointers
  { id: "15", topic: "Two Pointers", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: "16", topic: "Two Pointers", title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
  { id: "17", topic: "Two Pointers", title: "4Sum", difficulty: "Medium", link: "https://leetcode.com/problems/4sum/" },
  { id: "18", topic: "Two Pointers", title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },

  // Sliding Window
  { id: "22", topic: "Sliding Window", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "23", topic: "Sliding Window", title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: "24", topic: "Sliding Window", title: "Permutation in String", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
  { id: "25", topic: "Sliding Window", title: "Minimum Size Subarray Sum", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-size-subarray-sum/" },

  // Stack
  { id: "29", topic: "Stack", title: "Min Stack", difficulty: "Medium", link: "https://leetcode.com/problems/min-stack/" },
  { id: "30", topic: "Stack", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: "31", topic: "Stack", title: "Generate Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/generate-parentheses/" },
  { id: "32", topic: "Stack", title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "33", topic: "Stack", title: "Car Fleet", difficulty: "Medium", link: "https://leetcode.com/problems/car-fleet/" },
  { id: "34", topic: "Stack", title: "Asteroid Collision", difficulty: "Medium", link: "https://leetcode.com/problems/asteroid-collision/" },
  { id: "35", topic: "Stack", title: "Next Greater Element II", difficulty: "Medium", link: "https://leetcode.com/problems/next-greater-element-ii/" },

  // Binary Search
  { id: "39", topic: "Binary Search", title: "Search a 2D Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: "40", topic: "Binary Search", title: "Koko Eating Bananas", difficulty: "Medium", link: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: "41", topic: "Binary Search", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: "42", topic: "Binary Search", title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "43", topic: "Binary Search", title: "Time Based Key-Value Store", difficulty: "Medium", link: "https://leetcode.com/problems/time-based-key-value-store/" },
  { id: "44", topic: "Binary Search", title: "Find Peak Element", difficulty: "Medium", link: "https://leetcode.com/problems/find-peak-element/" },
  { id: "45", topic: "Binary Search", title: "Search in Rotated Sorted Array II", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" },

  // Linked List
  { id: "50", topic: "Linked List", title: "Linked List Cycle II", difficulty: "Medium", link: "https://leetcode.com/problems/linked-list-cycle-ii/" },
  { id: "51", topic: "Linked List", title: "Reorder List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/" },
  { id: "52", topic: "Linked List", title: "Remove Nth Node From End of List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: "53", topic: "Linked List", title: "Add Two Numbers", difficulty: "Medium", link: "https://leetcode.com/problems/add-two-numbers/" },
  { id: "54", topic: "Linked List", title: "Copy List with Random Pointer", difficulty: "Medium", link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: "55", topic: "Linked List", title: "Swap Nodes in Pairs", difficulty: "Medium", link: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
  { id: "57", topic: "Linked List", title: "LRU Cache", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },

  // Trees
  { id: "64", topic: "Trees", title: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: "65", topic: "Trees", title: "Binary Tree Right Side View", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: "66", topic: "Trees", title: "Validate Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "67", topic: "Trees", title: "Kth Smallest Element in a BST", difficulty: "Medium", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: "68", topic: "Trees", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "69", topic: "Trees", title: "Path Sum III", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-iii/" },
  { id: "70", topic: "Trees", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },

  // Tries
  { id: "74", topic: "Tries", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: "75", topic: "Tries", title: "Design Add and Search Words Data Structure", difficulty: "Medium", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },

  // Heap
  { id: "79", topic: "Heap", title: "K Closest Points to Origin", difficulty: "Medium", link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: "80", topic: "Heap", title: "Task Scheduler", difficulty: "Medium", link: "https://leetcode.com/problems/task-scheduler/" },
  { id: "81", topic: "Heap", title: "Top K Frequent Words", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-words/" },
  { id: "82", topic: "Heap", title: "Reorganize String", difficulty: "Medium", link: "https://leetcode.com/problems/reorganize-string/" },
  { id: "84", topic: "Heap", title: "Smallest Number in Infinite Set", difficulty: "Medium", link: "https://leetcode.com/problems/smallest-number-in-infinite-set/" },

  // Backtracking
  { id: "85", topic: "Backtracking", title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { id: "86", topic: "Backtracking", title: "Subsets II", difficulty: "Medium", link: "https://leetcode.com/problems/subsets-ii/" },
  { id: "87", topic: "Backtracking", title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
  { id: "88", topic: "Backtracking", title: "Combination Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-ii/" },
  { id: "89", topic: "Backtracking", title: "Permutation in String", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
  { id: "90", topic: "Backtracking", title: "Permutations", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/" },
  { id: "91", topic: "Backtracking", title: "Permutations II", difficulty: "Medium", link: "https://leetcode.com/problems/permutations-ii/" },
  { id: "92", topic: "Backtracking", title: "Word Search", difficulty: "Medium", link: "https://leetcode.com/problems/word-search/" },
  { id: "93", topic: "Backtracking", title: "Palindrome Partitioning", difficulty: "Medium", link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: "94", topic: "Backtracking", title: "Letter Combinations of a Phone Number", difficulty: "Medium", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },

  // Graphs
  { id: "97", topic: "Graphs", title: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
  { id: "98", topic: "Graphs", title: "Max Area of Island", difficulty: "Medium", link: "https://leetcode.com/problems/max-area-of-island/" },
  { id: "99", topic: "Graphs", title: "Clone Graph", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/" },
  { id: "100", topic: "Graphs", title: "Pacific Atlantic Water Flow", difficulty: "Medium", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: "101", topic: "Graphs", title: "Surrounded Regions", difficulty: "Medium", link: "https://leetcode.com/problems/surrounded-regions/" },
  { id: "102", topic: "Graphs", title: "Rotting Oranges", difficulty: "Medium", link: "https://leetcode.com/problems/rotting-oranges/" },

  // 1D Dynamic Programming
  { id: "105", topic: "1D Dynamic Programming", title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
  { id: "106", topic: "1D Dynamic Programming", title: "House Robber II", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber-ii/" },
  { id: "107", topic: "1D Dynamic Programming", title: "Longest Palindromic Substring", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: "108", topic: "1D Dynamic Programming", title: "Palindromic Substrings", difficulty: "Medium", link: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: "109", topic: "1D Dynamic Programming", title: "Decode Ways", difficulty: "Medium", link: "https://leetcode.com/problems/decode-ways/" },
  { id: "110", topic: "1D Dynamic Programming", title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
  { id: "111", topic: "1D Dynamic Programming", title: "Maximum Product Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: "112", topic: "1D Dynamic Programming", title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
  { id: "113", topic: "1D Dynamic Programming", title: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: "114", topic: "1D Dynamic Programming", title: "Partition Equal Subset Sum", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id: "115", topic: "1D Dynamic Programming", title: "Perfect Squares", difficulty: "Medium", link: "https://leetcode.com/problems/perfect-squares/" },

  // 2D Dynamic Programming
  { id: "116", topic: "2D Dynamic Programming", title: "Unique Paths", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/" },
  { id: "117", topic: "2D Dynamic Programming", title: "Longest Common Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: "118", topic: "2D Dynamic Programming", title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { id: "119", topic: "2D Dynamic Programming", title: "Target Sum", difficulty: "Medium", link: "https://leetcode.com/problems/target-sum/" },
  { id: "120", topic: "2D Dynamic Programming", title: "Interleaving String", difficulty: "Medium", link: "https://leetcode.com/problems/interleaving-string/" },
  { id: "121", topic: "2D Dynamic Programming", title: "Edit Distance", difficulty: "Medium", link: "https://leetcode.com/problems/edit-distance/" },
  { id: "122", topic: "2D Dynamic Programming", title: "Maximal Square", difficulty: "Medium", link: "https://leetcode.com/problems/maximal-square/" },
  { id: "123", topic: "2D Dynamic Programming", title: "Stone Game II", difficulty: "Medium", link: "https://leetcode.com/problems/stone-game-ii/" },
  { id: "124", topic: "2D Dynamic Programming", title: "Unique Paths II", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths-ii/" },
  { id: "125", topic: "2D Dynamic Programming", title: "Minimum Path Sum", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-path-sum/" },

  // Greedy
  { id: "126", topic: "Greedy", title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: "127", topic: "Greedy", title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
  { id: "128", topic: "Greedy", title: "Jump Game II", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game-ii/" },
  { id: "129", topic: "Greedy", title: "Gas Station", difficulty: "Medium", link: "https://leetcode.com/problems/gas-station/" },
  { id: "130", topic: "Greedy", title: "Hand of Straights", difficulty: "Medium", link: "https://leetcode.com/problems/hand-of-straights/" },
  { id: "131", topic: "Greedy", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", link: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
  { id: "132", topic: "Greedy", title: "Partition Labels", difficulty: "Medium", link: "https://leetcode.com/problems/partition-labels/" },
  { id: "133", topic: "Greedy", title: "Valid Parenthesis String", difficulty: "Medium", link: "https://leetcode.com/problems/valid-parenthesis-string/" },

  // Intervals
  { id: "134", topic: "Intervals", title: "Merge Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/" },
  { id: "135", topic: "Intervals", title: "Insert Interval", difficulty: "Medium", link: "https://leetcode.com/problems/insert-interval/" },
  { id: "136", topic: "Intervals", title: "Non-overlapping Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { id: "137", topic: "Intervals", title: "Meeting Rooms II", difficulty: "Medium", link: "https://leetcode.com/problems/meeting-rooms-ii/" },

  // Math & Geometry
  { id: "141", topic: "Math & Geometry", title: "Rotate Image", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { id: "142", topic: "Math & Geometry", title: "Spiral Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: "143", topic: "Math & Geometry", title: "Set Matrix Zeroes", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: "144", topic: "Math & Geometry", title: "Pow(x, n)", difficulty: "Medium", link: "https://leetcode.com/problems/powx-n/" },
  { id: "145", topic: "Math & Geometry", title: "Multiply Strings", difficulty: "Medium", link: "https://leetcode.com/problems/multiply-strings/" },
  { id: "146", topic: "Math & Geometry", title: "Detect Squares", difficulty: "Medium", link: "https://leetcode.com/problems/detect-squares/" },

  // Bit Manipulation
  { id: "152", topic: "Bit Manipulation", title: "Sum of Two Integers", difficulty: "Medium", link: "https://leetcode.com/problems/sum-of-two-integers/" },
  { id: "153", topic: "Bit Manipulation", title: "Reverse Integer", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-integer/" },
  { id: "154", topic: "Bit Manipulation", title: "Bitwise AND of Numbers Range", difficulty: "Medium", link: "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
  { id: "155", topic: "Bit Manipulation", title: "Single Number II", difficulty: "Medium", link: "https://leetcode.com/problems/single-number-ii/" },
  { id: "156", topic: "Bit Manipulation", title: "Single Number III", difficulty: "Medium", link: "https://leetcode.com/problems/single-number-iii/" },

  // Union Find
  { id: "157", topic: "Union Find", title: "Redundant Connection", difficulty: "Medium", link: "https://leetcode.com/problems/redundant-connection/" },
  { id: "158", topic: "Union Find", title: "Graph Valid Tree", difficulty: "Medium", link: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "159", topic: "Union Find", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },

  // Topological Sort
  { id: "160", topic: "Topological Sort", title: "Course Schedule", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule/" },
  { id: "161", topic: "Topological Sort", title: "Course Schedule II", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "163", topic: "Topological Sort", title: "Sequence Reconstruction", difficulty: "Medium", link: "https://leetcode.com/problems/sequence-reconstruction/" },

  // Matrix
  { id: "164", topic: "Matrix", title: "Rotate Image", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { id: "165", topic: "Matrix", title: "Spiral Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: "166", topic: "Matrix", title: "Set Matrix Zeroes", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: "167", topic: "Matrix", title: "Search a 2D Matrix II", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
  { id: "168", topic: "Matrix", title: "Diagonal Traverse", difficulty: "Medium", link: "https://leetcode.com/problems/diagonal-traverse/" },

  // ═══════════════════════════════════════════════════════════════
  // HARD PROBLEMS (13)
  // ═══════════════════════════════════════════════════════════════

  // Two Pointers
  { id: "19", topic: "Two Pointers", title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },

  // Sliding Window
  { id: "26", topic: "Sliding Window", title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "27", topic: "Sliding Window", title: "Sliding Window Maximum", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/" },

  // Stack
  { id: "36", topic: "Stack", title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id: "37", topic: "Stack", title: "Maximal Rectangle", difficulty: "Hard", link: "https://leetcode.com/problems/maximal-rectangle/" },

  // Binary Search
  { id: "46", topic: "Binary Search", title: "Median of Two Sorted Arrays", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // Linked List
  { id: "56", topic: "Linked List", title: "Reverse Nodes in k-Group", difficulty: "Hard", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { id: "58", topic: "Linked List", title: "Merge k Sorted Lists", difficulty: "Hard", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },

  // Trees
  { id: "71", topic: "Trees", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: "72", topic: "Trees", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { id: "73", topic: "Trees", title: "Vertical Order Traversal of a Binary Tree", difficulty: "Hard", link: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" },

  // Tries
  { id: "76", topic: "Tries", title: "Word Search II", difficulty: "Hard", link: "https://leetcode.com/problems/word-search-ii/" },

  // Heap
  { id: "83", topic: "Heap", title: "Find Median from Data Stream", difficulty: "Hard", link: "https://leetcode.com/problems/find-median-from-data-stream/" },

  // Backtracking
  { id: "95", topic: "Backtracking", title: "N-Queens", difficulty: "Hard", link: "https://leetcode.com/problems/n-queens/" },
  { id: "96", topic: "Backtracking", title: "Sudoku Solver", difficulty: "Hard", link: "https://leetcode.com/problems/sudoku-solver/" },

  // Graphs
  { id: "103", topic: "Graphs", title: "Word Ladder", difficulty: "Hard", link: "https://leetcode.com/problems/word-ladder/" },

  // Intervals
  { id: "138", topic: "Intervals", title: "Minimum Interval to Include Each Query", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },

  // Topological Sort
  { id: "162", topic: "Topological Sort", title: "Alien Dictionary", difficulty: "Hard", link: "https://leetcode.com/problems/alien-dictionary/" },

  // Advanced Patterns
  { id: "169", topic: "Advanced Patterns", title: "LFU Cache", difficulty: "Hard", link: "https://leetcode.com/problems/lfu-cache/" },
  { id: "170", topic: "Advanced Patterns", title: "Median of Two Sorted Arrays", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { id: "171", topic: "Advanced Patterns", title: "Regular Expression Matching", difficulty: "Hard", link: "https://leetcode.com/problems/regular-expression-matching/" },
  { id: "172", topic: "Advanced Patterns", title: "Longest Valid Parentheses", difficulty: "Hard", link: "https://leetcode.com/problems/longest-valid-parentheses/" },
  { id: "173", topic: "Advanced Patterns", title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
];
