========================================================
JAVA COLLECTIONS CHEATSHEET (C++ STL -> JAVA)
========================================================

--------------------------------------------------------
VECTOR -> ARRAYLIST
--------------------------------------------------------

Declaration:
List<Integer> list = new ArrayList<>();

C++                         Java
--------------------------------------------------------
v.push_back(x)              list.add(x)

v.pop_back()                list.remove(list.size()-1)

v[i]                        list.get(i)

v.front()                   list.get(0)

v.back()                    list.get(list.size()-1)

v.size()                    list.size()

v.empty()                   list.isEmpty()

v.clear()                   list.clear()

v.insert(v.begin()+i,x)     list.add(i,x)

v.erase(v.begin()+i)        list.remove(i)

find(...)                   list.contains(x)

sort(v.begin(),v.end())     Collections.sort(list)

sort(v.rbegin(),v.rend())   Collections.sort(list,
                            Collections.reverseOrder())

Iterate:

for(Integer x : list) {

}

--------------------------------------------------------
UNORDERED_MAP -> HASHMAP
--------------------------------------------------------

Declaration:
Map<String,Integer> map =
        new HashMap<>();

C++                         Java
--------------------------------------------------------
mp[key]=val                 map.put(key,val)

mp[key]                     map.get(key)

mp.erase(key)               map.remove(key)

mp.size()                   map.size()

mp.empty()                  map.isEmpty()

mp.clear()                  map.clear()

mp.count(key)               map.containsKey(key)

Frequency Count:

mp[x]++

map.put(
    x,
    map.getOrDefault(x,0)+1
);

Get Default Value:

int freq =
    map.getOrDefault(x,0);

Put If Absent:

map.putIfAbsent(
    key,
    new ArrayList<>()
);

Compute If Absent:

map.computeIfAbsent(
    key,
    k -> new ArrayList<>()
);

Iterate:

for(Map.Entry<String,Integer> e
        : map.entrySet()) {

    String key = e.getKey();
    Integer value = e.getValue();
}

--------------------------------------------------------
MAP -> TREEMAP
--------------------------------------------------------

Declaration:

Map<Integer,String> map =
        new TreeMap<>();

Sorted by key automatically.

Extra APIs:

map.firstKey()

map.lastKey()

--------------------------------------------------------
UNORDERED_SET -> HASHSET
--------------------------------------------------------

Declaration:

Set<Integer> set =
        new HashSet<>();

C++                         Java
--------------------------------------------------------
st.insert(x)                set.add(x)

st.erase(x)                 set.remove(x)

st.count(x)                 set.contains(x)

st.size()                   set.size()

st.empty()                  set.isEmpty()

st.clear()                  set.clear()

Iterate:

for(Integer x : set) {

}

--------------------------------------------------------
SET -> TREESET
--------------------------------------------------------

Declaration:

TreeSet<Integer> set =
        new TreeSet<>();

C++                         Java
--------------------------------------------------------
*st.begin()                 set.first()

*st.rbegin()                set.last()

st.lower_bound(x)           set.ceiling(x)

st.upper_bound(x)           set.higher(x)

st.erase(x)                 set.remove(x)

st.insert(x)                set.add(x)

--------------------------------------------------------
QUEUE
--------------------------------------------------------

Declaration:

Queue<Integer> q =
        new LinkedList<>();

C++                         Java
--------------------------------------------------------
q.push(x)                   q.offer(x)

q.pop()                     q.poll()

q.front()                   q.peek()

q.size()                    q.size()

q.empty()                   q.isEmpty()

--------------------------------------------------------
DEQUE
--------------------------------------------------------

Declaration:

Deque<Integer> dq =
        new ArrayDeque<>();

C++                         Java
--------------------------------------------------------
push_front(x)               dq.offerFirst(x)

push_back(x)                dq.offerLast(x)

pop_front()                 dq.pollFirst()

pop_back()                  dq.pollLast()

front()                     dq.peekFirst()

back()                      dq.peekLast()

size()                      dq.size()

empty()                     dq.isEmpty()

--------------------------------------------------------
PRIORITY_QUEUE (MIN HEAP)
--------------------------------------------------------

Declaration:

PriorityQueue<Integer> pq =
        new PriorityQueue<>();

C++                         Java
--------------------------------------------------------
pq.push(x)                  pq.offer(x)

pq.pop()                    pq.poll()

pq.top()                    pq.peek()

pq.size()                   pq.size()

pq.empty()                  pq.isEmpty()

--------------------------------------------------------
PRIORITY_QUEUE (MAX HEAP)
--------------------------------------------------------

PriorityQueue<Integer> pq =
    new PriorityQueue<>(
        Collections.reverseOrder()
    );

--------------------------------------------------------
CUSTOM PRIORITY QUEUE
--------------------------------------------------------

PriorityQueue<User> pq =
    new PriorityQueue<>(
        (a,b) ->
            b.rating - a.rating
    );

--------------------------------------------------------
STRING
--------------------------------------------------------

String s = "hello";

C++                         Java
--------------------------------------------------------
s.size()                    s.length()

s[i]                        s.charAt(i)

s.substr(l,len)             s.substring(l,r)

s.find("abc")               s.contains("abc")

                            s.startsWith("ab")

                            s.endsWith("yz")

Split:

String[] arr =
        s.split(",");

Join:

String result =
    String.join(",", list);

--------------------------------------------------------
STRINGBUILDER
--------------------------------------------------------

(Java equivalent of efficient string building)

StringBuilder sb =
        new StringBuilder();

sb.append("abc");

sb.append(123);

sb.toString();

Length:

sb.length();

Character:

sb.charAt(i);

Delete:

sb.deleteCharAt(i);

Reverse:

sb.reverse();

--------------------------------------------------------
ARRAYS UTILITY
--------------------------------------------------------

Sort:

Arrays.sort(arr);

Fill:

Arrays.fill(arr,-1);

Binary Search:

Arrays.binarySearch(arr,x);

Copy:

Arrays.copyOf(arr,n);

--------------------------------------------------------
COLLECTIONS UTILITY
--------------------------------------------------------

Sort:

Collections.sort(list);

Reverse Sort:

Collections.sort(
    list,
    Collections.reverseOrder()
);

Reverse:

Collections.reverse(list);

Shuffle:

Collections.shuffle(list);

Min:

Collections.min(list);

Max:

Collections.max(list);

Frequency:

Collections.frequency(
    list,
    value
);

--------------------------------------------------------
COMPARATOR
--------------------------------------------------------

Sort Ascending:

users.sort(
    (a,b) ->
        a.age - b.age
);

Sort Descending:

users.sort(
    (a,b) ->
        b.age - a.age
);

String Sort:

users.sort(
    (a,b) ->
        a.name.compareTo(
            b.name
        )
);

Safe Integer Compare:

users.sort(
    (a,b) ->
        Integer.compare(
            a.age,
            b.age
        )
);

Safe Double Compare:

users.sort(
    (a,b) ->
        Double.compare(
            a.rating,
            b.rating
        )
);

--------------------------------------------------------
ENUM
--------------------------------------------------------

enum BookingStatus {

    CREATED,
    CONFIRMED,
    CANCELLED
}

Usage:

BookingStatus status =
        BookingStatus.CREATED;

--------------------------------------------------------
OPTIONAL APIS OFTEN USED
--------------------------------------------------------

Math.max(a,b)

Math.min(a,b)

Math.abs(x)

Math.ceil(x)

Math.floor(x)

Math.sqrt(x)

--------------------------------------------------------
MOST COMMON LLD COLLECTIONS
--------------------------------------------------------

Users:

Map<String,User> users =
    new HashMap<>();

Bookings:

Map<String,Booking> bookings =
    new HashMap<>();

User Bookings:

Map<String,List<Booking>>
    userBookings =
        new HashMap<>();

Available Drivers:

PriorityQueue<Driver>
    availableDrivers;

Seat Inventory:

Map<String,Seat>
    seats =
        new HashMap<>();

Unique IDs:

Set<String> ids =
    new HashSet<>();

--------------------------------------------------------
MOST USED APIs IN INTERVIEWS
--------------------------------------------------------

Map:
put()
get()
getOrDefault()
containsKey()
computeIfAbsent()

List:
add()
get()
remove()

Set:
add()
contains()

PriorityQueue:
offer()
poll()
peek()

Collections.sort()

Arrays.sort()

Comparator

Enum

StringBuilder

These cover ~95% of DSA + LLD interview coding in Java.
========================================================