#define pi pair<int,int>
#define vi vector<int>
#define ff first
#define ss second
class Solution {
  public:
    // Function to find sum of weights of edges of the Minimum Spanning Tree.
    int spanningTree(int V, vector<vector<int>> adj[]) {
        // code here
        priority_queue<pi,vector<pi>,greater<pi>> pq;
        vector<int> vis(V,0);
        pq.emplace(0,0);
        int ans=0;
        int edgesTaken=0;
        while(edgesTaken!=V && !pq.empty()){
            int cost = pq.top().ff;
            int node = pq.top().ss;
            pq.pop();
            if(vis[node]){
                continue;
            }
            edgesTaken++;
            vis[node]=1;
            ans+=cost;
            for(auto e: adj[node]){
                if(!vis[e[0]]){
                    pq.emplace(e[1],e[0]);
                }
            }
        }
        return ans;
    }
};