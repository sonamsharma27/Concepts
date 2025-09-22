
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
    public:
    
        // Encodes a tree to a single string.
        string serialize(TreeNode* root) {
            string s="";
            queue<TreeNode*> q;
            q.push(root);
            while(!q.empty()){
                auto node = q.front();
                q.pop();
                if(node){
                    s+=to_string(node->val);
                    q.push(node->left);
                    q.push(node->right);
                } else {
                    s+='#';
                }
                s+=",";
            }
            return s;
        }
    
        // Decodes your encoded data to tree.
        TreeNode* deserialize(string data) {
            TreeNode* root=nullptr;
            stringstream ss(data);
            string nodeVal;
            getline(ss,nodeVal,',');
            queue<TreeNode*> q;
            if(nodeVal=="#") return root;
            root = new TreeNode(stoi(nodeVal));
            q.push(root);
            while(!q.empty()){
                auto node=q.front();
                q.pop();
                getline(ss,nodeVal,',');
                if(nodeVal!="#"){
                    node->left = new TreeNode(stoi(nodeVal));
                    q.push(node->left);
                }
                 getline(ss,nodeVal,',');
                if(nodeVal!="#"){
                    node->right = new TreeNode(stoi(nodeVal));
                     q.push(node->right);
                }
            }
            return root;
        }
    };