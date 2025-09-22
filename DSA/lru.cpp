class LRUCache {
    int capacity;
    list<int> l;
    unordered_map<int,pair<int,list<int>::iterator>> mp;
public:
    LRUCache(int capacity) {
        this->capacity=capacity;
    }
    
    int get(int key) {
        if(mp.find(key)==mp.end()){
            return -1;
        } else {
            auto pos = mp[key].second;
            l.erase(pos);
            l.push_back(key);
            mp[key]={mp[key].first,prev(l.end())};
            return mp[key].first;
        }
    }
    
    void put(int key, int value) {
        if(mp.find(key)==mp.end()){
            if(l.size()==capacity){
                mp.erase(l.front());
                l.pop_front();
            }
            l.push_back(key);
            mp[key]={value,prev(l.end())};
        } else {
            auto pos = mp[key].second;
            l.erase(pos);
            l.push_back(key);
            mp[key]={value,prev(l.end())};
        }
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */