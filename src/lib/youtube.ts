export interface YouTubeVideo {
  title: string;
  url: string;
  channel: string;
}

export const patternVideos: Record<string, YouTubeVideo[]> = {
  hashing: [
    { title: "Hash Tables Explained - Computerphile", url: "https://www.youtube.com/watch?v=KyUTuwz_b7Q", channel: "Computerphile" },
    { title: "HashMap in Java - Full Course", url: "https://www.youtube.com/watch?v=RBSGKlAvoGI", channel: "freeCodeCamp" },
  ],
  "two-pointers": [
    { title: "Two Pointers Technique - LeetCode", url: "https://www.youtube.com/watch?v=UFgnE0YVxVY", channel: "NeetCode" },
    { title: "Two Pointer Pattern - Striver", url: "https://www.youtube.com/watch?v=UXDSeD9mN7o", channel: "take U forward" },
  ],
  "sliding-window": [
    { title: "Sliding Window Technique - LeetCode", url: "https://www.youtube.com/watch?v=KdpinPFZhHs", channel: "NeetCode" },
    { title: "Sliding Window Maximum - Striver", url: "https://www.youtube.com/watch?v=3QIJIY1aX0g", channel: "take U forward" },
  ],
  "prefix-sum": [
    { title: "Prefix Sum - LeetCode", url: "https://www.youtube.com/watch?v=5VhRWOaMEjI", channel: "NeetCode" },
  ],
  "binary-search": [
    { title: "Binary Search - LeetCode", url: "https://www.youtube.com/watch?v=GU7DvgHMCuI", channel: "NeetCode" },
    { title: "Binary Search on Arrays - Striver", url: "https://www.youtube.com/watch?v=DUeSwGDmflg", channel: "take U forward" },
  ],
  "sorting-comparators": [
    { title: "Sorting Algorithms Explained", url: "https://www.youtube.com/watch?v=kPRA0W1kECg", channel: "NeetCode" },
    { title: "Custom Sort in Java", url: "https://www.youtube.com/watch?v=h8JFE8sBhQY", channel: "take U forward" },
  ],
  stack: [
    { title: "Stack Data Structure - Full Course", url: "https://www.youtube.com/watch?v=I4i-ELHFOYk", channel: "freeCodeCamp" },
    { title: "Valid Parentheses - LeetCode", url: "https://www.youtube.com/watch?v=WTzJhfb8GzI", channel: "NeetCode" },
  ],
  recursion: [
    { title: "Recursion for Beginners - Striver", url: "https://www.youtube.com/watch?v=yVdKa_ytkrs", channel: "take U forward" },
    { title: "Recursion Explained - Computerphile", url: "https://www.youtube.com/watch?v=k7-N8R0-KY4", channel: "Computerphile" },
  ],
  "linked-list": [
    { title: "Linked List Data Structure", url: "https://www.youtube.com/watch?v=HjR2H5aFNWg", channel: "NeetCode" },
    { title: "Linked Lists - Full Course", url: "https://www.youtube.com/watch?v=gn4JMe-dTYA", channel: "freeCodeCamp" },
  ],
  "fast-slow-pointers": [
    { title: "Fast & Slow Pointers - LeetCode", url: "https://www.youtube.com/watch?v=7K32KoGf1XY", channel: "NeetCode" },
    { title: "Cycle Detection - Floyd's Algorithm", url: "https://www.youtube.com/watch?v=PvrxKxOa3QY", channel: "take U forward" },
  ],
  "monotonic-stack": [
    { title: "Monotonic Stack - LeetCode", url: "https://www.youtube.com/watch?v=KdpinPFZhHs", channel: "NeetCode" },
    { title: "Next Greater Element - Striver", url: "https://www.youtube.com/watch?v=WX0b6jDkvXII", channel: "take U forward" },
  ],
  "queue-deque": [
    { title: "Queue Data Structure - Full Course", url: "https://www.youtube.com/watch?v=M6GStUSva7s", channel: "freeCodeCamp" },
  ],
  heap: [
    { title: "Heap Data Structure - Striver", url: "https://www.youtube.com/watch?v=HqPJFQs2HGU", channel: "take U forward" },
    { title: "Priority Queue in Java", url: "https://www.youtube.com/watch?v=wGbAxCrB9Ks", channel: "NeetCode" },
  ],
  "merge-intervals": [
    { title: "Merge Intervals - LeetCode", url: "https://www.youtube.com/watch?v=2JzRBPFYbDg", channel: "NeetCode" },
  ],
  trie: [
    { title: "Trie Data Structure - Striver", url: "https://www.youtube.com/watch?v=dBGUmUQWHja", channel: "take U forward" },
    { title: "Implement Trie - LeetCode", url: "https://www.youtube.com/watch?v=oL6mkyHFhvs", channel: "NeetCode" },
  ],
  "binary-tree-dfs": [
    { title: "Binary Tree DFS - Striver", url: "https://www.youtube.com/watch?v=UrTMvNjsMnY", channel: "take U forward" },
    { title: "Tree Traversals Explained", url: "https://www.youtube.com/watch?v=5IU24w00d8c", channel: "NeetCode" },
  ],
  "binary-tree-bfs": [
    { title: "Binary Tree Level Order Traversal", url: "https://www.youtube.com/watch?v=EoAsWbO7sqg", channel: "NeetCode" },
    { title: "BFS on Trees - Striver", url: "https://www.youtube.com/watch?v=EoAsWbO7sqg", channel: "take U forward" },
  ],
  "graph-dfs": [
    { title: "Graph DFS - LeetCode", url: "https://www.youtube.com/watch?v=fMZzkB1VcFw", channel: "NeetCode" },
    { title: "DFS Graph Algorithm - Striver", url: "https://www.youtube.com/watch?v=P KK9LDEQ0ZQ", channel: "take U forward" },
  ],
  "graph-bfs": [
    { title: "Graph BFS - LeetCode", url: "https://www.youtube.com/watch?v=CB8nIM2FOLQ", channel: "NeetCode" },
  ],
  backtracking: [
    { title: "Backtracking Explained - Striver", url: "https://www.youtube.com/watch?v=A8N1Gk_ZbDs", channel: "take U forward" },
    { title: "Backtracking - LeetCode", url: "https://www.youtube.com/watch?v=ur2JqGjM0ro", channel: "NeetCode" },
  ],
  "dp-1d": [
    { title: "Dynamic Programming for Beginners", url: "https://www.youtube.com/watch?v=73r3KWiEvyk", channel: "freeCodeCamp" },
    { title: "1D DP - Striver", url: "https://www.youtube.com/watch?v=aPwyYDuX88s", channel: "take U forward" },
  ],
  "dp-2d": [
    { title: "2D Dynamic Programming - Striver", url: "https://www.youtube.com/watch?v=TmQKcLVa-ds", channel: "take U forward" },
    { title: "2D DP Problems - LeetCode", url: "https://www.youtube.com/watch?v=NNnIGkv87MQ", channel: "NeetCode" },
  ],
  greedy: [
    { title: "Greedy Algorithms - Striver", url: "https://www.youtube.com/watch?v=3PIAnOPOb3U", channel: "take U forward" },
    { title: "Greedy Algorithm Problems - LeetCode", url: "https://www.youtube.com/watch?v=bM3oJk5AINU", channel: "NeetCode" },
  ],
  "union-find": [
    { title: "Union Find / Disjoint Set - Striver", url: "https://www.youtube.com/watch?v=HwdKFW_41zc", channel: "take U forward" },
    { title: "Union Find Explained - LeetCode", url: "https://www.youtube.com/watch?v=bxFaJEdaL0E", channel: "NeetCode" },
  ],
  "topological-sort": [
    { title: "Topological Sort - Striver", url: "https://www.youtube.com/watch?v=ZmnQCi-Lqdk", channel: "take U forward" },
  ],
  "bit-manipulation": [
    { title: "Bit Manipulation - LeetCode", url: "https://www.youtube.com/watch?v=rrJnrr1RqCM", channel: "NeetCode" },
    { title: "Bit Manipulation in Java", url: "https://www.youtube.com/watch?v=v57rYD1tVbA", channel: "take U forward" },
  ],
};

export const problemVideos: Record<string, YouTubeVideo> = {
  "two-sum": { title: "Two Sum - LeetCode 1", url: "https://www.youtube.com/watch?v=UXDSeD9mN7o", channel: "NeetCode" },
  "contains-duplicate": { title: "Contains Duplicate - LeetCode 217", url: "https://www.youtube.com/watch?v=3OamzRcSWV0", channel: "NeetCode" },
  "valid-anagram": { title: "Valid Anagram - LeetCode 242", url: "https://www.youtube.com/watch?v=9UtInB2RsrE", channel: "NeetCode" },
  "valid-parentheses": { title: "Valid Parentheses - LeetCode 20", url: "https://www.youtube.com/watch?v=WTzJhfb8GzI", channel: "NeetCode" },
  "reverse-linked-list": { title: "Reverse Linked List - LeetCode 206", url: "https://www.youtube.com/watch?v=D2vI2DNJGd8", channel: "NeetCode" },
  "maximum-subarray": { title: "Maximum Subarray - LeetCode 53", url: "https://www.youtube.com/watch?v=86CQq3pKSUw", channel: "NeetCode" },
  "merge-two-sorted-lists": { title: "Merge Two Sorted Lists - LeetCode 21", url: "https://www.youtube.com/watch?v=K51EhH0v2Hs", channel: "NeetCode" },
  "best-time-to-buy-and-sell-stock": { title: "Best Time to Buy and Sell Stock - LeetCode 121", url: "https://www.youtube.com/watch?v=1pkOgXDxh3U", channel: "NeetCode" },
  "number-of-islands": { title: "Number of Islands - LeetCode 200", url: "https://www.youtube.com/watch?v=p62AUGlF4kA", channel: "NeetCode" },
  "course-schedule": { title: "Course Schedule - LeetCode 207", url: "https://www.youtube.com/watch?v=EgKOY5RM0PU", channel: "NeetCode" },
  "binary-search": { title: "Binary Search - LeetCode 704", url: "https://www.youtube.com/watch?v=GU7DvgHMCuI", channel: "NeetCode" },
  "climbing-stairs": { title: "Climbing Stairs - LeetCode 70", url: "https://www.youtube.com/watch?v=73r3KWiEvyk", channel: "NeetCode" },
  "longest-common-subsequence": { title: "Longest Common Subsequence - LeetCode 1143", url: "https://www.youtube.com/watch?v=NnD96abizB8", channel: "NeetCode" },
  "coin-change": { title: "Coin Change - LeetCode 322", url: "https://www.youtube.com/watch?v=H9bfqCjoTUs", channel: "NeetCode" },
  "product-of-array-except-self": { title: "Product of Array Except Self - LeetCode 238", url: "https://www.youtube.com/watch?v=bNvIQI2wBjE", channel: "NeetCode" },
  "trap-rain-water": { title: "Trapping Rain Water - LeetCode 42", url: "https://www.youtube.com/watch?v=ZI2z5pqN0Ro", channel: "NeetCode" },
  "word-break": { title: "Word Break - LeetCode 139", url: "https://www.youtube.com/watch?v=Sx9NNgPjTjw", channel: "NeetCode" },
  "merge-k-sorted-lists": { title: "Merge K Sorted Lists - LeetCode 23", url: "https://www.youtube.com/watch?v=q5a5z1vmL1I", channel: "NeetCode" },
  "lru-cache": { title: "LRU Cache - LeetCode 146", url: "https://www.youtube.com/watch?v=7ABFK3MDeRg", channel: "NeetCode" },
  "serialize-and-deserialize-binary-tree": { title: "Serialize and Deserialize Binary Tree - LeetCode 297", url: "https://www.youtube.com/watch?v=u4J6mAmrsXU", channel: "NeetCode" },
};
