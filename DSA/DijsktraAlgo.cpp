// User Function Template
#define T tuple<int,int>

class Solution {
  public:
    int INF = 1e9;
    vector<int> dijkstra(int V, vector<vector<int>> &edges, int src) {
        // Code here
        vector<int> dist(V,INF);
        dist[src]=0;
        vector<vector<pair<int,int>>> adj(V);
        for(auto e: edges){
            int u=e[0];
            int v=e[1];
            int w=e[2];
            adj[u].push_back({v,w});
            adj[v].push_back({u,w});
        }
        priority_queue<T,vector<T>,greater<T>> pq;
        pq.emplace(0,src); // cost, node
        while(!pq.empty()){
            int cost = get<0>(pq.top());
            int node = get<1>(pq.top());
            pq.pop();
            for(auto edge: adj[node]){
                int curNode = edge.first;
                int curCost = edge.second;
                if(dist[curNode]>cost+curCost){
                    dist[curNode]=cost+curCost;
                    pq.emplace(cost+curCost,curNode);
                }
            }
        }
        return dist;
    }
};