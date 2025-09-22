class maxHeap {
    vector<int> a;

public:
    maxHeap(vector<int> arr) {
        a = arr;
        buildHeap();
    }

    void heapify(int idx) {
        int n = a.size();
        while (idx < n) {
            int lc = 2 * idx + 1;
            int rc = 2 * idx + 2;
            int largest = idx;
            if (lc < n && a[largest] < a[lc]) largest = lc;
            if (rc < n && a[largest] < a[rc]) largest = rc;
            if (largest == idx) break;
            swap(a[largest], a[idx]);
            idx = largest;
        }
    }

    void buildHeap() {
        for (int i = a.size() / 2 - 1; i >= 0; i--) {
            heapify(i);
        }
    }

    void pop() {
        if (!a.empty()) {
            swap(a[0], a[a.size() - 1]);
            a.pop_back();
            heapify(0);
        }
    }

    int top() {
        return a.empty() ? -1 : a[0];
    }

    void push(int val) {
        a.push_back(val);
        int idx = a.size() - 1;
        while (idx > 0) {
            int parent = (idx - 1) / 2;
            if (a[parent] >= a[idx]) break;
            swap(a[parent], a[idx]);
            idx = parent;
        }
    }
};
