#include <bits/stdc++.h>
using namespace std;
class Node {
    public:
    bool isEnd=0;
    vector<Node*> next;
    Node(){
        next = vector<Node*>(2,NULL);
    }
};

class Trie {
  public:
    Node* root;
    Trie() {
        // implement Trie
        root = new Node();
    }

    void insert(int num) {
        // insert word into Trie
        Node* tmp=root;
        for(int i=31; i>=0; i--){
            int idx = num&(1<<i) ? 1: 0;
            if(!tmp->next[idx]){
                tmp->next[idx] = new Node();
            }
            tmp=tmp->next[idx];
        }
        tmp->isEnd=1;
    }
    
    int maxXor(int n){
        int res=0;
        Node* tmp=root;
        for(int i=31; i>=0; i--){
            int idx=n&(1<<i) ? 1 : 0;
            if(tmp->next[1^idx]){
                res|=1<<i;
                tmp=tmp->next[1^idx];
            } else {
                tmp=tmp->next[idx];
            }
        }
       return res;
    }

};