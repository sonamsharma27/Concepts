int numSubmat(vector<vector<int>>& a) {
        int ans = 0;
        int n = a.size();
        int m = a[0].size();
        vector<int> heights(m,0);  //histogram heights poss
        for(int i=0; i<n; i++){
            for(int j=0; j<m; j++){
                if(a[i][j]==0){
                    heights[j]=0;
                } else {
                    heights[j]++;
                }
            }
            for(int j=0; j<m; j++){
                int minht=heights[j];
                for(int k=j; k>=0 && minht>0; k--){
                    minht=min(minht,heights[k]);
                    ans+=minht;
                }
            }
        }
        return ans;
    }

    //https://leetcode.com/problems/count-submatrices-with-all-ones/description/?envType=daily-question&envId=2025-08-21