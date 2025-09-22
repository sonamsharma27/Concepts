#include <bits/stdc++.h>
using namespace std;

bool searchRotatedMatrix(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size();
    int cols = matrix[0].size();
    int n = rows * cols;

    int low = 0, high = n - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int midVal = matrix[mid / cols][mid % cols];
        int lowVal = matrix[low / cols][low % cols];
        int highVal = matrix[high / cols][high % cols];

        if (midVal == target) return true;

        // Left half sorted
        if (lowVal <= midVal) {
            if (target >= lowVal && target < midVal) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        // Right half sorted
        else {
            if (target > midVal && target <= highVal) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }

    return false;
}

int main() {
    vector<vector<int>> matrix = {
        {7, 8, 9},
        {1, 2, 3},
        {4, 5, 6}
    };

    int target = 2;

    if (searchRotatedMatrix(matrix, target))
        cout << target << " exists in matrix\n";
    else
        cout << target << " does NOT exist in matrix\n";

    return 0;
}
