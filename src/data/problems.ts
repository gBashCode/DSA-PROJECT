export interface Problem {
  id: string;
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
}

export const problems: Problem[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. Arrays & Hashing
  // ═══════════════════════════════════════════════════════════════
  { id: "1", topic: "Arrays & Hashing", title: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: "2", topic: "Arrays & Hashing", title: "Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: "3", topic: "Arrays & Hashing", title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
  { id: "4", topic: "Arrays & Hashing", title: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
  { id: "5", topic: "Arrays & Hashing", title: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: "6", topic: "Arrays & Hashing", title: "Product of Array Except Self", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "7", topic: "Arrays & Hashing", title: "Valid Sudoku", difficulty: "Medium", link: "https://leetcode.com/problems/valid-sudoku/" },
  { id: "8", topic: "Arrays & Hashing", title: "Longest Consecutive Sequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
  { id: "9", topic: "Arrays & Hashing", title: "Sort Colors", difficulty: "Medium", link: "https://leetcode.com/problems/sort-colors/" },
  { id: "10", topic: "Arrays & Hashing", title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { id: "11", topic: "Arrays & Hashing", title: "Encode and Decode Strings", difficulty: "Medium", link: "https://leetcode.com/problems/encode-and-decode-strings/" },
  { id: "12", topic: "Arrays & Hashing", title: "Insert Delete GetRandom O(1)", difficulty: "Medium", link: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },

  // ═══════════════════════════════════════════════════════════════
  // 2. Two Pointers
  // ═══════════════════════════════════════════════════════════════
  { id: "13", topic: "Two Pointers", title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: "14", topic: "Two Pointers", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: "15", topic: "Two Pointers", title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
  { id: "16", topic: "Two Pointers", title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: "17", topic: "Two Pointers", title: "4Sum", difficulty: "Medium", link: "https://leetcode.com/problems/4sum/" },
  { id: "18", topic: "Two Pointers", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  { id: "19", topic: "Two Pointers", title: "Move Zeroes", difficulty: "Easy", link: "https://leetcode.com/problems/move-zeroes/" },
  { id: "20", topic: "Two Pointers", title: "Is Subsequence", difficulty: "Easy", link: "https://leetcode.com/problems/is-subsequence/" },
  { id: "21", topic: "Two Pointers", title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },

  // ═══════════════════════════════════════════════════════════════
  // 3. Sliding Window
  // ═══════════════════════════════════════════════════════════════
  { id: "22", topic: "Sliding Window", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "23", topic: "Sliding Window", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "24", topic: "Sliding Window", title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: "25", topic: "Sliding Window", title: "Permutation in String", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
  { id: "26", topic: "Sliding Window", title: "Minimum Size Subarray Sum", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
  { id: "27", topic: "Sliding Window", title: "Maximum Average Subarray I", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-average-subarray-i/" },
  { id: "28", topic: "Sliding Window", title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "29", topic: "Sliding Window", title: "Sliding Window Maximum", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/" },

  // ═══════════════════════════════════════════════════════════════
  // 4. Stack
  // ═══════════════════════════════════════════════════════════════
  { id: "30", topic: "Stack", title: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "31", topic: "Stack", title: "Min Stack", difficulty: "Medium", link: "https://leetcode.com/problems/min-stack/" },
  { id: "32", topic: "Stack", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: "33", topic: "Stack", title: "Generate Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/generate-parentheses/" },
  { id: "34", topic: "Stack", title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "35", topic: "Stack", title: "Car Fleet", difficulty: "Medium", link: "https://leetcode.com/problems/car-fleet/" },
  { id: "36", topic: "Stack", title: "Asteroid Collision", difficulty: "Medium", link: "https://leetcode.com/problems/asteroid-collision/" },
  { id: "37", topic: "Stack", title: "Next Greater Element II", difficulty: "Medium", link: "https://leetcode.com/problems/next-greater-element-ii/" },
  { id: "38", topic: "Stack", title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id: "39", topic: "Stack", title: "Maximal Rectangle", difficulty: "Hard", link: "https://leetcode.com/problems/maximal-rectangle/" },

  // ═══════════════════════════════════════════════════════════════
  // 5. Binary Search
  // ═══════════════════════════════════════════════════════════════
  { id: "40", topic: "Binary Search", title: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/" },
  { id: "41", topic: "Binary Search", title: "Search a 2D Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: "42", topic: "Binary Search", title: "Koko Eating Bananas", difficulty: "Medium", link: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: "43", topic: "Binary Search", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: "44", topic: "Binary Search", title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "45", topic: "Binary Search", title: "Time Based Key-Value Store", difficulty: "Medium", link: "https://leetcode.com/problems/time-based-key-value-store/" },
  { id: "46", topic: "Binary Search", title: "Find Peak Element", difficulty: "Medium", link: "https://leetcode.com/problems/find-peak-element/" },
  { id: "47", topic: "Binary Search", title: "Search in Rotated Sorted Array II", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" },
  { id: "48", topic: "Binary Search", title: "Median of Two Sorted Arrays", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // ═══════════════════════════════════════════════════════════════
  // 6. Linked List
  // ═══════════════════════════════════════════════════════════════
  { id: "49", topic: "Linked List", title: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "50", topic: "Linked List", title: "Merge Two Sorted Lists", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "51", topic: "Linked List", title: "Linked List Cycle", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: "52", topic: "Linked List", title: "Linked List Cycle II", difficulty: "Medium", link: "https://leetcode.com/problems/linked-list-cycle-ii/" },
  { id: "53", topic: "Linked List", title: "Reorder List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/" },
  { id: "54", topic: "Linked List", title: "Remove Nth Node From End of List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: "55", topic: "Linked List", title: "Add Two Numbers", difficulty: "Medium", link: "https://leetcode.com/problems/add-two-numbers/" },
  { id: "56", topic: "Linked List", title: "Copy List with Random Pointer", difficulty: "Medium", link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: "57", topic: "Linked List", title: "Swap Nodes in Pairs", difficulty: "Medium", link: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
  { id: "58", topic: "Linked List", title: "Reverse Nodes in k-Group", difficulty: "Hard", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { id: "59", topic: "Linked List", title: "LRU Cache", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },
  { id: "60", topic: "Linked List", title: "Merge k Sorted Lists", difficulty: "Hard", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },

  // ═══════════════════════════════════════════════════════════════
  // 7. Trees
  // ═══════════════════════════════════════════════════════════════
  { id: "61", topic: "Trees", title: "Invert Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "62", topic: "Trees", title: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "63", topic: "Trees", title: "Same Tree", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/" },
  { id: "64", topic: "Trees", title: "Symmetric Tree", difficulty: "Easy", link: "https://leetcode.com/problems/symmetric-tree/" },
  { id: "65", topic: "Trees", title: "Subtree of Another Tree", difficulty: "Easy", link: "https://leetcode.com/problems/subtree-of-another-tree/" },
  { id: "66", topic: "Trees", title: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: "67", topic: "Trees", title: "Binary Tree Right Side View", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: "68", topic: "Trees", title: "Validate Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "69", topic: "Trees", title: "Kth Smallest Element in a BST", difficulty: "Medium", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: "70", topic: "Trees", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "71", topic: "Trees", title: "Path Sum III", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-iii/" },
  { id: "72", topic: "Trees", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { id: "73", topic: "Trees", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: "74", topic: "Trees", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { id: "75", topic: "Trees", title: "Vertical Order Traversal of a Binary Tree", difficulty: "Hard", link: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" },

  // ═══════════════════════════════════════════════════════════════
  // 8. Tries
  // ═══════════════════════════════════════════════════════════════
  { id: "76", topic: "Tries", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: "77", topic: "Tries", title: "Design Add and Search Words Data Structure", difficulty: "Medium", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id: "78", topic: "Tries", title: "Word Search II", difficulty: "Hard", link: "https://leetcode.com/problems/word-search-ii/" },

  // ═══════════════════════════════════════════════════════════════
  // 9. Heap / Priority Queue
  // ═══════════════════════════════════════════════════════════════
  { id: "79", topic: "Heap", title: "Kth Largest Element in a Stream", difficulty: "Easy", link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: "80", topic: "Heap", title: "Last Stone Weight", difficulty: "Easy", link: "https://leetcode.com/problems/last-stone-weight/" },
  { id: "81", topic: "Heap", title: "K Closest Points to Origin", difficulty: "Medium", link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: "82", topic: "Heap", title: "Task Scheduler", difficulty: "Medium", link: "https://leetcode.com/problems/task-scheduler/" },
  { id: "83", topic: "Heap", title: "Top K Frequent Words", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-words/" },
  { id: "84", topic: "Heap", title: "Reorganize String", difficulty: "Medium", link: "https://leetcode.com/problems/reorganize-string/" },
  { id: "85", topic: "Heap", title: "Find Median from Data Stream", difficulty: "Hard", link: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { id: "86", topic: "Heap", title: "Smallest Number in Infinite Set", difficulty: "Medium", link: "https://leetcode.com/problems/smallest-number-in-infinite-set/" },

  // ═══════════════════════════════════════════════════════════════
  // 10. Backtracking
  // ═══════════════════════════════════════════════════════════════
  { id: "87", topic: "Backtracking", title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { id: "88", topic: "Backtracking", title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
  { id: "89", topic: "Backtracking", title: "Permutations", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/" },
  { id: "90", topic: "Backtracking", title: "Subsets II", difficulty: "Medium", link: "https://leetcode.com/problems/subsets-ii/" },
  { id: "91", topic: "Backtracking", title: "Combination Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-ii/" },
  { id: "92", topic: "Backtracking", title: "Permutations II", difficulty: "Medium", link: "https://leetcode.com/problems/permutations-ii/" },
  { id: "93", topic: "Backtracking", title: "Word Search", difficulty: "Medium", link: "https://leetcode.com/problems/word-search/" },
  { id: "94", topic: "Backtracking", title: "Palindrome Partitioning", difficulty: "Medium", link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: "95", topic: "Backtracking", title: "Letter Combinations of a Phone Number", difficulty: "Medium", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { id: "96", topic: "Backtracking", title: "N-Queens", difficulty: "Hard", link: "https://leetcode.com/problems/n-queens/" },
  { id: "97", topic: "Backtracking", title: "Sudoku Solver", difficulty: "Hard", link: "https://leetcode.com/problems/sudoku-solver/" },

  // ═══════════════════════════════════════════════════════════════
  // 11. Graphs
  // ═══════════════════════════════════════════════════════════════
  { id: "98", topic: "Graphs", title: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
  { id: "99", topic: "Graphs", title: "Clone Graph", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/" },
  { id: "100", topic: "Graphs", title: "Max Area of Island", difficulty: "Medium", link: "https://leetcode.com/problems/max-area-of-island/" },
  { id: "101", topic: "Graphs", title: "Pacific Atlantic Water Flow", difficulty: "Medium", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: "102", topic: "Graphs", title: "Surrounded Regions", difficulty: "Medium", link: "https://leetcode.com/problems/surrounded-regions/" },
  { id: "103", topic: "Graphs", title: "Rotting Oranges", difficulty: "Medium", link: "https://leetcode.com/problems/rotting-oranges/" },
  { id: "104", topic: "Graphs", title: "Course Schedule", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule/" },
  { id: "105", topic: "Graphs", title: "Course Schedule II", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "106", topic: "Graphs", title: "Graph Valid Tree", difficulty: "Medium", link: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "107", topic: "Graphs", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { id: "108", topic: "Graphs", title: "Redundant Connection", difficulty: "Medium", link: "https://leetcode.com/problems/redundant-connection/" },
  { id: "109", topic: "Graphs", title: "Word Ladder", difficulty: "Hard", link: "https://leetcode.com/problems/word-ladder/" },

  // ═══════════════════════════════════════════════════════════════
  // 12. 1D Dynamic Programming
  // ═══════════════════════════════════════════════════════════════
  { id: "110", topic: "1D Dynamic Programming", title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "111", topic: "1D Dynamic Programming", title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
  { id: "112", topic: "1D Dynamic Programming", title: "House Robber II", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber-ii/" },
  { id: "113", topic: "1D Dynamic Programming", title: "Longest Palindromic Substring", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: "114", topic: "1D Dynamic Programming", title: "Palindromic Substrings", difficulty: "Medium", link: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: "115", topic: "1D Dynamic Programming", title: "Decode Ways", difficulty: "Medium", link: "https://leetcode.com/problems/decode-ways/" },
  { id: "116", topic: "1D Dynamic Programming", title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
  { id: "117", topic: "1D Dynamic Programming", title: "Maximum Product Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: "118", topic: "1D Dynamic Programming", title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
  { id: "119", topic: "1D Dynamic Programming", title: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: "120", topic: "1D Dynamic Programming", title: "Partition Equal Subset Sum", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id: "121", topic: "1D Dynamic Programming", title: "Perfect Squares", difficulty: "Medium", link: "https://leetcode.com/problems/perfect-squares/" },

  // ═══════════════════════════════════════════════════════════════
  // 13. 2D Dynamic Programming
  // ═══════════════════════════════════════════════════════════════
  { id: "122", topic: "2D Dynamic Programming", title: "Unique Paths", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/" },
  { id: "123", topic: "2D Dynamic Programming", title: "Longest Common Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: "124", topic: "2D Dynamic Programming", title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { id: "125", topic: "2D Dynamic Programming", title: "Target Sum", difficulty: "Medium", link: "https://leetcode.com/problems/target-sum/" },
  { id: "126", topic: "2D Dynamic Programming", title: "Interleaving String", difficulty: "Medium", link: "https://leetcode.com/problems/interleaving-string/" },
  { id: "127", topic: "2D Dynamic Programming", title: "Edit Distance", difficulty: "Medium", link: "https://leetcode.com/problems/edit-distance/" },
  { id: "128", topic: "2D Dynamic Programming", title: "Maximal Square", difficulty: "Medium", link: "https://leetcode.com/problems/maximal-square/" },
  { id: "129", topic: "2D Dynamic Programming", title: "Stone Game II", difficulty: "Medium", link: "https://leetcode.com/problems/stone-game-ii/" },
  { id: "130", topic: "2D Dynamic Programming", title: "Unique Paths II", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths-ii/" },
  { id: "131", topic: "2D Dynamic Programming", title: "Minimum Path Sum", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-path-sum/" },

  // ═══════════════════════════════════════════════════════════════
  // 14. Greedy
  // ═══════════════════════════════════════════════════════════════
  { id: "132", topic: "Greedy", title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: "133", topic: "Greedy", title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
  { id: "134", topic: "Greedy", title: "Jump Game II", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game-ii/" },
  { id: "135", topic: "Greedy", title: "Gas Station", difficulty: "Medium", link: "https://leetcode.com/problems/gas-station/" },
  { id: "136", topic: "Greedy", title: "Hand of Straights", difficulty: "Medium", link: "https://leetcode.com/problems/hand-of-straights/" },
  { id: "137", topic: "Greedy", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", link: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
  { id: "138", topic: "Greedy", title: "Partition Labels", difficulty: "Medium", link: "https://leetcode.com/problems/partition-labels/" },
  { id: "139", topic: "Greedy", title: "Valid Parenthesis String", difficulty: "Medium", link: "https://leetcode.com/problems/valid-parenthesis-string/" },

  // ═══════════════════════════════════════════════════════════════
  // 15. Intervals
  // ═══════════════════════════════════════════════════════════════
  { id: "140", topic: "Intervals", title: "Merge Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/" },
  { id: "141", topic: "Intervals", title: "Insert Interval", difficulty: "Medium", link: "https://leetcode.com/problems/insert-interval/" },
  { id: "142", topic: "Intervals", title: "Non-overlapping Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { id: "143", topic: "Intervals", title: "Meeting Rooms II", difficulty: "Medium", link: "https://leetcode.com/problems/meeting-rooms-ii/" },
  { id: "144", topic: "Intervals", title: "Minimum Interval to Include Each Query", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },

  // ═══════════════════════════════════════════════════════════════
  // 16. Math & Geometry
  // ═══════════════════════════════════════════════════════════════
  { id: "145", topic: "Math & Geometry", title: "Rotate Image", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { id: "146", topic: "Math & Geometry", title: "Spiral Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: "147", topic: "Math & Geometry", title: "Set Matrix Zeroes", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: "148", topic: "Math & Geometry", title: "Happy Number", difficulty: "Easy", link: "https://leetcode.com/problems/happy-number/" },
  { id: "149", topic: "Math & Geometry", title: "Plus One", difficulty: "Easy", link: "https://leetcode.com/problems/plus-one/" },
  { id: "150", topic: "Math & Geometry", title: "Pow(x, n)", difficulty: "Medium", link: "https://leetcode.com/problems/powx-n/" },
  { id: "151", topic: "Math & Geometry", title: "Multiply Strings", difficulty: "Medium", link: "https://leetcode.com/problems/multiply-strings/" },
  { id: "152", topic: "Math & Geometry", title: "Detect Squares", difficulty: "Medium", link: "https://leetcode.com/problems/detect-squares/" },

  // ═══════════════════════════════════════════════════════════════
  // 17. Bit Manipulation
  // ═══════════════════════════════════════════════════════════════
  { id: "153", topic: "Bit Manipulation", title: "Single Number", difficulty: "Easy", link: "https://leetcode.com/problems/single-number/" },
  { id: "154", topic: "Bit Manipulation", title: "Number of 1 Bits", difficulty: "Easy", link: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: "155", topic: "Bit Manipulation", title: "Counting Bits", difficulty: "Easy", link: "https://leetcode.com/problems/counting-bits/" },
  { id: "156", topic: "Bit Manipulation", title: "Reverse Bits", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-bits/" },
  { id: "157", topic: "Bit Manipulation", title: "Missing Number", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },
  { id: "158", topic: "Bit Manipulation", title: "Sum of Two Integers", difficulty: "Medium", link: "https://leetcode.com/problems/sum-of-two-integers/" },
  { id: "159", topic: "Bit Manipulation", title: "Reverse Integer", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-integer/" },
  { id: "160", topic: "Bit Manipulation", title: "Bitwise AND of Numbers Range", difficulty: "Medium", link: "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
  { id: "161", topic: "Bit Manipulation", title: "Single Number II", difficulty: "Medium", link: "https://leetcode.com/problems/single-number-ii/" },
  { id: "162", topic: "Bit Manipulation", title: "Single Number III", difficulty: "Medium", link: "https://leetcode.com/problems/single-number-iii/" },

  // ═══════════════════════════════════════════════════════════════
  // 18. Union Find
  // ═══════════════════════════════════════════════════════════════
  { id: "163", topic: "Union Find", title: "Redundant Connection", difficulty: "Medium", link: "https://leetcode.com/problems/redundant-connection/" },
  { id: "164", topic: "Union Find", title: "Graph Valid Tree", difficulty: "Medium", link: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "165", topic: "Union Find", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { id: "166", topic: "Union Find", title: "Longest Consecutive Sequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },

  // ═══════════════════════════════════════════════════════════════
  // 19. Topological Sort
  // ═══════════════════════════════════════════════════════════════
  { id: "167", topic: "Topological Sort", title: "Course Schedule", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule/" },
  { id: "168", topic: "Topological Sort", title: "Course Schedule II", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "169", topic: "Topological Sort", title: "Alien Dictionary", difficulty: "Hard", link: "https://leetcode.com/problems/alien-dictionary/" },
  { id: "170", topic: "Topological Sort", title: "Sequence Reconstruction", difficulty: "Medium", link: "https://leetcode.com/problems/sequence-reconstruction/" },

  // ═══════════════════════════════════════════════════════════════
  // 20. Miscellaneous Patterns
  // ═══════════════════════════════════════════════════════════════
  { id: "171", topic: "Miscellaneous", title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "172", topic: "Miscellaneous", title: "Fibonacci Number", difficulty: "Easy", link: "https://leetcode.com/problems/fibonacci-number/" },
  { id: "173", topic: "Miscellaneous", title: "N-th Tribonacci Number", difficulty: "Easy", link: "https://leetcode.com/problems/n-th-tribonacci-number/" },
  { id: "174", topic: "Miscellaneous", title: "Coin Change II", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change-ii/" },
  { id: "175", topic: "Miscellaneous", title: "Partition Equal Subset Sum", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id: "176", topic: "Miscellaneous", title: "Palindrome Partitioning", difficulty: "Medium", link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: "177", topic: "Miscellaneous", title: "Letter Combinations of a Phone Number", difficulty: "Medium", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { id: "178", topic: "Miscellaneous", title: "Generate Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/generate-parentheses/" },
  { id: "179", topic: "Miscellaneous", title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { id: "180", topic: "Miscellaneous", title: "Combination Sum IV", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-iv/" },
];
