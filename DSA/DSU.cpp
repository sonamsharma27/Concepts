class DSU {
    public:
        vector<int> parent;
        vector<int> size;
        DSU(int n) {
            for (int i = 0; i < n; i++) {
                parent.push_back(i);
            }
            size = vector<int>(n, 1);
        }
    
        int getParent(int a) {
            if (parent[a] == a) {
                return a;
            }
            return parent[a] = getParent(parent[a]);
        }
        
        void unionBySize(int a, int b, int weight) {
            int pa = getParent(a);
            int pb = getParent(b);
            if (pa == pb) {
                return;
            }
            if (size[pa] > size[pb]) {
                size[pa] += size[pb];
                parent[pb] = pa;
            } else {
                size[pb] += size[pa];
                parent[pa] = pb;
            }
        }
    
        bool areRelated(int a, int b) { return getParent(a) == getParent(b); }
    
};