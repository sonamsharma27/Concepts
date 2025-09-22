class Node {
    public:
    bool isEnd=0;
    unordered_map<char,Node*> children;
};

class Trie {
  public:
    Node* root;
    Trie() {
        // implement Trie
        root = new Node();
    }

    void insert(string &word) {
        // insert word into Trie
        Node* tmp=root;
        for(auto &c: word){
            auto &mp=tmp->children;
            if(mp.find(c)==mp.end()){
                mp[c]=new Node();
            }
            tmp=mp[c];
        }
        tmp->isEnd=1;
    }

    bool search(string &word) {
        // search word in the Trie
        Node* tmp=root;
        for(auto &c: word){
            auto mp=tmp->children;
            if(mp.find(c)==mp.end()){
                return false;
            }
            tmp=mp[c];
        }
        return tmp->isEnd;
    }

    bool isPrefix(string &word) {
        // search prefix word in the Trie
        Node* tmp=root;
        for(auto &c: word){
            auto mp=tmp->children;
            if(mp.find(c)==mp.end()){
                return false;
            }
            tmp=mp[c];
        }
        return true;
    }
};