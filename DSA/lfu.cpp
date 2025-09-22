#define T tuple<int,int,list<int>::iterator>

class LFUCache {
    unordered_map<int,T> mp;
    unordered_map<int,list<int>> freq_mp;
    int capacity;
    int minfreq;
public:
    LFUCache(int capacity) {
        this->capacity=capacity;
         minfreq=1;
    }
    int get(int key) {
        if(mp.find(key)==mp.end()){
            return -1;
        }
        auto [val,freq,it] = mp[key];
        freq_mp[freq].erase(it);

        if(freq_mp[freq].size()==0 && minfreq==freq){
                minfreq++;
        }
        freq_mp[freq+1].push_back(key);
        mp[key]={val,freq+1,prev( freq_mp[freq+1].end())};
        return val;
    }
    
    void put(int key, int value) {
        if(mp.find(key)==mp.end()){
            if(mp.size()==capacity){
                auto &l = freq_mp[minfreq];
                mp.erase(l.front());
                l.pop_front();
            }
            freq_mp[1].push_back(key);
            mp[key]={value,1,prev(freq_mp[1].end())};
            minfreq=1;
        }
        else {
            auto [val,freq,it] = mp[key];
            freq_mp[freq].erase(it);
            freq_mp[freq+1].push_back(key);
            mp[key]={value,freq+1,prev(freq_mp[freq+1].end())};
            if(freq_mp[freq].size()==0 && minfreq==freq){
                    minfreq++;
            }
        }
        
    }
};

/**
 * Your LFUCache object will be instantiated and called as such:
 * LFUCache* obj = new LFUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */