# CP Patterns

DS / CP Patterns
Prefix, suffix array
Left and right contributions for each element of the array
Sliding window
Monotonic stack
Binary search
Bit masking
Prefix sum difference + hashing (diff[i]=a1[i]-a2[i]) (Practice:https://www.geeksforgeeks.org/problems/longest-span-with-same-sum-in-two-binary-arrays5142/1)
2 heaps
Difference array
Using heap where binary search is not feasible
BST -> keeping track of max and min val possible for every node
BS -> if not have anything to compare mid with, then compare with mid-1 and mid+1
https://leetcode.com/problems/minimum-deletions-to-make-string-k-special/description/?envType=daily-question&envId=2025-06-21
https://www.geeksforgeeks.org/problems/police-and-thieves--141631/1
https://www.geeksforgeeks.org/problems/largest-divisible-subset--170643/1 -> very imp
Using concepts like LCS,  LIS with a parent array in questions like no 15. 
When you have to loop over only on chars from a-> z, O(n*n) will work for n=10^5 because O(26*26) ~ O(n)
In case of subsequences, try if sorting the array helps : https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/description/?envType=daily-question&envId=2025-06-29
Difference array + Binary Search: https://www.geeksforgeeks.org/problems/max-min-height--170647/1
Relative positioning for shape of islands in DFS
Instead of solving for at least k, can we solve for at most k - 1
Exact K = At least K - At least K+1
Using min heap + sorting to attend max meetings
Using binary search to find next attendable meeting + dp
kth product two approaches: using minheap  or using binary search to count product pairs
Dijkstra Algo -> in case of multiple factors like time, cost, etc, make a minheap of a vector having these factors in order of significance. If at any point a neighbour node, proves better in any  factor, then push that node.
Reverse pairs / Merge sort. Very Important
Try queue (BFS) for graphs when given with factors like: at most k steps. Bellmann ford algo can also be used by relaxing the edges k times or simple n*k DP will also work
Farthest smaller right: https://www.geeksforgeeks.org/problems/farthest-smaller-right/1 
Break the problem into small parts. 
https://leetcode.com/problems/count-submatrices-with-all-ones/description/?envType=daily-question&envId=2025-08-21
Binary Search Pattern :  Median in a row-wise sorted Matrix : Take the entire search space and count elements smaller than or equal to for shrinking search space
Using ordered set  : https://www.geeksforgeeks.org/problems/sum-of-mode/1 : Very important for hard level questions
Bases : https://leetcode.com/problems/minimum-operations-to-make-array-elements-zero/description/

DSA Core
Hash table implementation. Handling collisions
Max/min heap implementation
