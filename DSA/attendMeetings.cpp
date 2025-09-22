/**
 * You are given an array of events where events[i] = [startDayi, endDayi]. Every event i starts at startDayi and ends at endDayi.You can attend an event i at any day d where startTimei <= d <= endTimei. You can only attend one event at any time d.Return the maximum number of events you can attend.
 
 Idea: Attend the event that ends earliest, so that you leave room for future events.

 ✅ Algorithm Steps:
Sort events by start day.
Use a min-heap (priority queue) to always pick the event that ends earliest.
Iterate day by day:
    Add all events starting today to the heap.
    Remove events from the heap that have already expired (i.e., endDay < today).
    If the heap is non-empty, attend the event with the earliest end day, and remove it from heap.
    Move to next day.

💡 Why This Works:
This greedy strategy ensures you're always choosing the event that leaves the most room for future options.


🔢 Time Complexity:
Sorting: O(n log n)
Heap operations across days: O(n log n)
Total: O(n log n)
 
 */

 #include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int maxEvents(vector<vector<int>>& events) {
    // Step 1: Sort events by start day
    sort(events.begin(), events.end());

    priority_queue<int, vector<int>, greater<int>> minHeap;
    int i = 0, n = events.size(), res = 0;
    
    int day = 1;
    // Find last day
    int lastDay = 0;
    for (auto& e : events) lastDay = max(lastDay, e[1]);

    // Step 2: Iterate over each day
    for (day = 1; day <= lastDay; ++day) {
        // Add events starting today
        while (i < n && events[i][0] == day) {
            minHeap.push(events[i][1]); // push endDay
            ++i;
        }

        // Remove events that are already expired
        while (!minHeap.empty() && minHeap.top() < day) {
            minHeap.pop();
        }

        // Attend the event that ends the earliest
        if (!minHeap.empty()) {
            minHeap.pop();
            ++res;
        }
    }

    return res;
}

/**
| Goal                              | Sort by `endDay` | Sort by `startDay` |
| --------------------------------- | ---------------- | ------------------ |
| Maximize **number of events**     | ✅ Works          | ❌ Not optimal      |
| Maximize **total value (with k)** | ❌ Fails          | ✅ Works with DP+BS |
*/