export interface TestCase {
  input: string;
  expected: string;
  explanation?: string;
}

export interface IDEProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
    examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  hints: string[];
}

export const ideProblems: IDEProblem[] = [
  {
    id: "sum-two-numbers",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    topic: "Arrays",
    description: `Given an array of integers and a target value, find two numbers in the array that add up to the target. Return their indices as a pair [i, j] where i < j. Each input has exactly one solution, and you cannot use the same element twice.`,
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "2 + 7 = 9, so indices 0 and 1" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "2 + 4 = 6, so indices 1 and 2" },
      { input: "nums = [1, 5, 3, 7], target = 8", output: "[0, 3]", explanation: "1 + 7 = 8, so indices 0 and 3" },
    ],
    constraints: ["2 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6", "Exactly one valid answer exists"],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
    },
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[1,5,3,7], 8", expected: "[0,3]" },
      { input: "[1,2,3], 5", expected: "[1,2]" },
      { input: "[-1,-2,-3,-4,-5], -8", expected: "[2,4]" },
    ],
    hints: ["Try using a hash map to store complements", "For each number, check if target - num exists in the map"],
  },
  {
    id: "reverse-string",
    title: "Reverse Characters",
    difficulty: "Easy",
    topic: "Strings",
    description: `Given a string of characters, reverse the string in-place using O(1) extra memory. You cannot create a new string - modify the input directly.`,
    examples: [
      { input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']", explanation: "Reverse in-place" },
      { input: "s = ['H','a','n','n','a','h']", output: "['h','a','n','n','a','H']", explanation: "Reverse in-place" },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {\n  // Modify s in-place\n  \n}`,
      python: `def reverse_string(s):\n    # Modify s in-place\n    pass`,
    },
    testCases: [
      { input: "['h','e','l','l','o']", expected: "['o','l','l','e','h']" },
      { input: "['H','a','n','n','a','h']", expected: "['h','a','n','n','a','H']" },
      { input: "['a','b','c','d']", expected: "['d','c','b','a']" },
      { input: "['A']", expected: "['A']" },
    ],
    hints: ["Use two pointers, one from start and one from end", "Swap characters and move pointers inward"],
  },
  {
    id: "max-subarray",
    title: "Largest Sum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description: `Given an integer array, find the contiguous subarray which has the largest sum and return that sum. A subarray is a contiguous portion of the array.`,
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has sum 6" },
      { input: "nums = [1]", output: "1", explanation: "Single element is the largest subarray" },
      { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "Entire array has sum 23" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
      python: `def max_sub_array(nums):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[5,4,-1,7,8]", expected: "23" },
      { input: "[-1]", expected: "-1" },
      { input: "[-2,-1]", expected: "-1" },
    ],
    hints: ["Track the current sum and maximum sum", "If current sum becomes negative, reset it to 0"],
  },
  {
    id: "valid-parentheses",
    title: "Balanced Brackets",
    difficulty: "Easy",
    topic: "Stack",
    description: `Given a string containing only characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.`,
    examples: [
      { input: "s = '()'", output: "true" },
      { input: "s = '()[]{}'", output: "true" },
      { input: "s = '(]'", output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your solution here\n  \n}`,
      python: `def is_valid(s):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "'()'", expected: "true" },
      { input: "'()[]{}'", expected: "true" },
      { input: "'(]'", expected: "false" },
      { input: "'([)]'", expected: "false" },
      { input: "'{[]}'", expected: "true" },
    ],
    hints: ["Use a stack to track opening brackets", "When you see a closing bracket, check if it matches the top of the stack"],
  },
  {
    id: "merge-sorted",
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    topic: "Two Pointers",
    description: `Given two sorted arrays, merge them into a single sorted array. Return the merged array. Both input arrays are already sorted in ascending order.`,
    examples: [
      { input: "arr1 = [1,3,5], arr2 = [2,4,6]", output: "[1,2,3,4,5,6]" },
      { input: "arr1 = [1,2,3], arr2 = [4,5,6]", output: "[1,2,3,4,5,6]" },
      { input: "arr1 = [], arr2 = [1,2]", output: "[1,2]" },
    ],
    constraints: ["0 <= arr1.length, arr2.length <= 1000", "Arrays are sorted in ascending order"],
    starterCode: {
      javascript: `function mergeSorted(arr1, arr2) {\n  // Write your solution here\n  \n}`,
      python: `def merge_sorted(arr1, arr2):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "[1,3,5], [2,4,6]", expected: "[1,2,3,4,5,6]" },
      { input: "[1,2,3], [4,5,6]", expected: "[1,2,3,4,5,6]" },
      { input: "[], [1,2]", expected: "[1,2]" },
      { input: "[1], []", expected: "[1]" },
      { input: "[1,1,1], [2,2,2]", expected: "[1,1,1,2,2,2]" },
    ],
    hints: ["Use two pointers to traverse both arrays", "Compare elements and add the smaller one to the result"],
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    difficulty: "Easy",
    topic: "Recursion",
    description: `Calculate the nth Fibonacci number. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2) for n>1.`,
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1" },
      { input: "n = 4", output: "3", explanation: "F(4) = 3 (sequence: 0,1,1,2,3)" },
      { input: "n = 10", output: "55" },
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: {
      javascript: `function fibonacci(n) {\n  // Write your solution here\n  \n}`,
      python: `def fibonacci(n):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "0", expected: "0" },
      { input: "1", expected: "1" },
      { input: "2", expected: "1" },
      { input: "5", expected: "5" },
      { input: "10", expected: "55" },
      { input: "20", expected: "6765" },
    ],
    hints: ["Start with base cases F(0)=0 and F(1)=1", "Use iteration or memoization to avoid redundant calculations"],
  },
  {
    id: "binary-search",
    title: "Find in Sorted Array",
    difficulty: "Easy",
    topic: "Binary Search",
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not found, return -1. You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "All integers in nums are unique", "Array is sorted in ascending order"],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Write your solution here\n  \n}`,
      python: `def search(nums, target):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", expected: "4" },
      { input: "[-1,0,3,5,9,12], 2", expected: "-1" },
      { input: "[5], 5", expected: "0" },
      { input: "[1,2,3,4,5], 3", expected: "2" },
    ],
    hints: ["Use two pointers for left and right boundaries", "Calculate mid and compare with target"],
  },
  {
    id: "count-islands",
    title: "Count Islands",
    difficulty: "Medium",
    topic: "Graphs",
    description: `Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges are surrounded by water.`,
    examples: [
      { input: "grid = [['1','1','0'],['0','1','0'],['0','0','1']]", output: "2", explanation: "Two separate islands" },
      { input: "grid = [['1','1','1'],['1','1','1'],['1','1','1']]", output: "1", explanation: "One large island" },
    ],
    constraints: ["1 <= grid.length, grid[0].length <= 100", "grid[i][j] is '0' or '1'"],
    starterCode: {
      javascript: `function numIslands(grid) {\n  // Write your solution here\n  \n}`,
      python: `def num_islands(grid):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "[['1','1','0'],['0','1','0'],['0','0','1']]", expected: "2" },
      { input: "[['1','1','1'],['1','1','1'],['1','1','1']]", expected: "1" },
      { input: "[['1','0','1'],['0','1','0'],['1','0','1']]", expected: "5" },
    ],
    hints: ["Use DFS or BFS to explore each island", "Mark visited cells to avoid counting twice"],
  },
  {
    id: "longest-palindrome",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description: `Given a string s, return the longest palindromic substring in s. A palindrome reads the same backward as forward.`,
    examples: [
      { input: "s = 'babad'", output: "'bab'" , explanation: "'aba' is also valid" },
      { input: "s = 'cbbd'", output: "'bb'" },
    ],
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters"],
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Write your solution here\n  \n}`,
      python: `def longest_palindrome(s):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "'babad'", expected: "bab" },
      { input: "'cbbd'", expected: "bb" },
      { input: "'a'", expected: "a" },
      { input: "'racecar'", expected: "racecar" },
    ],
    hints: ["Expand around each character as potential center", "Check both odd and even length palindromes"],
  },
  {
    id: "coin-change",
    title: "Minimum Coins",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description: `Given a list of coin denominations and a target amount, find the minimum number of coins needed to make the amount. If it's not possible to make the amount, return -1.`,
    examples: [
      { input: "coins = [1,5,10,25], amount = 30", output: "2", explanation: "25 + 5 = 30 (2 coins)" },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "Cannot make 3 with only 2s" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Write your solution here\n  \n}`,
      python: `def coin_change(coins, amount):\n    # Write your solution here\n    pass`,
    },
    testCases: [
      { input: "[1,5,10,25], 30", expected: "2" },
      { input: "[2], 3", expected: "-1" },
      { input: "[1], 0", expected: "0" },
      { input: "[1,2,5], 11", expected: "3" },
    ],
    hints: ["Use dynamic programming", "dp[i] = minimum coins to make amount i"],
  },
];
