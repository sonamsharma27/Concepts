#include <iostream>
#include <vector>
using namespace std;

const int N = 1e5;
int seg[4 * N]; // 4n size for safety

// Build segment tree
void build(int idx, int low, int high, int arr[]) {
    if (low == high) {
        seg[idx] = arr[low];
        return;
    }
    int mid = (low + high) / 2;
    build(2*idx + 1, low, mid, arr);
    build(2*idx + 2, mid+1, high, arr);
    seg[idx] = seg[2*idx + 1] + seg[2*idx + 2];
}

// Query sum in range [l, r]
// [low, high] is the range of the current segment of array 
// seg[idx] is the sum of the segment of elements  of array from index low to index high
int query(int idx, int low, int high, int l, int r) {
    // No overlap
    if (r < low || high < l)
        return 0;

    // Complete overlap
    if (l <= low && high <= r)
        return seg[idx];

    // Partial overlap
    int mid = (low + high) / 2;
    int left = query(2*idx + 1, low, mid, l, r);
    int right = query(2*idx + 2, mid+1, high, l, r);
    return left + right;
}

// Point update: arr[i] = val
void update(int idx, int low, int high, int i, int val) {
    if (low == high) {
        seg[idx] = val;
        return;
    }
    int mid = (low + high) / 2;
    if (i <= mid)
        update(2*idx + 1, low, mid, i, val);
    else
        update(2*idx + 2, mid+1, high, i, val);

    seg[idx] = seg[2*idx + 1] + seg[2*idx + 2];
}

int main() {
    int arr[] = {1, 3, 5, 7, 9, 11};
    int n = 6;

    build(0, 0, n-1, arr);

    cout << "Sum of range [1, 3]: " << query(0, 0, n-1, 1, 3) << "\n";

    update(0, 0, n-1, 1, 10); // arr[1] = 10

    cout << "After update, sum of range [1, 3]: " << query(0, 0, n-1, 1, 3) << "\n";

    return 0;
}
