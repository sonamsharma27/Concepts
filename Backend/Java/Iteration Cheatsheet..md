=========================================================
JAVA ITERATION CHEATSHEET (C++ STL -> JAVA)
=========================================================

---------------------------------------------------------
1. ARRAY
---------------------------------------------------------

Declaration

int[] arr = {1,2,3,4};

---------------------------------------------------------

Normal For Loop (Most Common)

for(int i=0; i<arr.length; i++) {

    System.out.println(arr[i]);

}

Equivalent C++

for(int i=0; i<n; i++)

---------------------------------------------------------

Enhanced For Loop (Range-based)

for(int x : arr) {

    System.out.println(x);

}

Equivalent C++

for(auto x : arr)

=========================================================
2. ARRAYLIST / LIST
=========================================================

Declaration

List<Integer> list = new ArrayList<>();

list.add(10);
list.add(20);
list.add(30);

---------------------------------------------------------

Index Based

for(int i=0; i<list.size(); i++) {

    System.out.println(list.get(i));

}

Equivalent C++

for(int i=0;i<v.size();i++)

---------------------------------------------------------

Enhanced For Loop (Most Common)

for(Integer x : list) {

    System.out.println(x);

}

Equivalent C++

for(auto x : vec)

---------------------------------------------------------

Iterator

Iterator<Integer> it = list.iterator();

while(it.hasNext()) {

    Integer x = it.next();

    System.out.println(x);

}

Equivalent C++

for(auto it=v.begin(); it!=v.end(); it++)

---------------------------------------------------------

Lambda

list.forEach(System.out::println);

OR

list.forEach(x -> System.out.println(x));

=========================================================
3. HASHSET / TREESET
=========================================================

Declaration

Set<Integer> set = new HashSet<>();

OR

TreeSet<Integer> set = new TreeSet<>();

---------------------------------------------------------

Enhanced For Loop (Most Common)

for(Integer x : set) {

    System.out.println(x);

}

Equivalent C++

for(auto x : st)

---------------------------------------------------------

Iterator

Iterator<Integer> it = set.iterator();

while(it.hasNext()) {

    Integer x = it.next();

    System.out.println(x);

}

---------------------------------------------------------

Lambda

set.forEach(System.out::println);

=========================================================
4. HASHMAP / TREEMAP
=========================================================

Declaration

Map<String,Integer> map = new HashMap<>();

map.put("A",10);
map.put("B",20);

---------------------------------------------------------

Best Way (Most Used)

for(Map.Entry<String,Integer> entry : map.entrySet()) {

    System.out.println(entry.getKey());

    System.out.println(entry.getValue());

}

Equivalent C++

for(auto &[key,value] : mp)

---------------------------------------------------------

Iterate Keys Only

for(String key : map.keySet()) {

    System.out.println(key);

}

Equivalent C++

for(auto &[key,value] : mp)

    cout << key;

---------------------------------------------------------

Iterate Values Only

for(Integer value : map.values()) {

    System.out.println(value);

}

Equivalent C++

for(auto &[key,value] : mp)

    cout << value;

---------------------------------------------------------

Iterator

Iterator<Map.Entry<String,Integer>> it =
        map.entrySet().iterator();

while(it.hasNext()) {

    Map.Entry<String,Integer> entry = it.next();

    System.out.println(entry.getKey());

    System.out.println(entry.getValue());

}

---------------------------------------------------------

Lambda

map.forEach((key,value) -> {

    System.out.println(key);

    System.out.println(value);

});

=========================================================
5. QUEUE
=========================================================

Declaration

Queue<Integer> q = new LinkedList<>();

q.offer(10);
q.offer(20);
q.offer(30);

---------------------------------------------------------

Typical Queue Processing

while(!q.isEmpty()) {

    System.out.println(q.peek());

    q.poll();

}

Equivalent C++

while(!q.empty()) {

    cout << q.front();

    q.pop();

}

---------------------------------------------------------

For Each (Without Removing)

for(Integer x : q) {

    System.out.println(x);

}

=========================================================
6. DEQUE
=========================================================

Declaration

Deque<Integer> dq = new ArrayDeque<>();

---------------------------------------------------------

Forward Iteration

for(Integer x : dq) {

    System.out.println(x);

}

---------------------------------------------------------

Reverse Iteration

Iterator<Integer> it =
        dq.descendingIterator();

while(it.hasNext()) {

    System.out.println(it.next());

}

Equivalent C++

for(auto it=dq.rbegin(); it!=dq.rend(); it++)

=========================================================
7. PRIORITY QUEUE
=========================================================

Declaration

PriorityQueue<Integer> pq =
        new PriorityQueue<>();

---------------------------------------------------------

Correct Way

while(!pq.isEmpty()) {

    System.out.println(pq.peek());

    pq.poll();

}

Equivalent C++

while(!pq.empty()) {

    cout << pq.top();

    pq.pop();

}

---------------------------------------------------------

Don't Do This

for(Integer x : pq) {

    System.out.println(x);

}

Reason:

PriorityQueue iterator DOES NOT
return elements in sorted order.

=========================================================
8. STRING
=========================================================

Declaration

String s = "hello";

---------------------------------------------------------

Using Index

for(int i=0; i<s.length(); i++) {

    System.out.println(s.charAt(i));

}

Equivalent C++

for(int i=0;i<s.size();i++)

---------------------------------------------------------

Using Character Array

for(char ch : s.toCharArray()) {

    System.out.println(ch);

}

Equivalent C++

for(char ch : s)

=========================================================
9. STRINGBUILDER
=========================================================

Declaration

StringBuilder sb =
        new StringBuilder("hello");

---------------------------------------------------------

Index Based

for(int i=0; i<sb.length(); i++) {

    System.out.println(sb.charAt(i));

}

=========================================================
10. UNIVERSAL ITERATOR PATTERN
=========================================================

Every Collection supports:

Iterator<T> it = collection.iterator();

while(it.hasNext()) {

    T obj = it.next();

}

Works for

✓ List

✓ Set

✓ Queue

✓ Deque

=========================================================
11. REMOVING ELEMENTS WHILE ITERATING
=========================================================

Wrong

for(Integer x : list) {

    if(x == 5)

        list.remove(x);

}

Throws

ConcurrentModificationException

---------------------------------------------------------

Correct

Iterator<Integer> it = list.iterator();

while(it.hasNext()) {

    Integer x = it.next();

    if(x == 5)

        it.remove();

}

=========================================================
12. WHEN TO USE WHICH ITERATION
=========================================================

Array
-----
for(int i=0;i<arr.length;i++)     // Need index

for(int x:arr)                    // Just values

---------------------------------------------------------

List
----
for(int i=0;i<list.size();i++)    // Need index

for(Integer x:list)               // Most common

Iterator                          // Removing while iterating

---------------------------------------------------------

Set
---
for(Integer x:set)                // Most common

Iterator                          // Removing while iterating

---------------------------------------------------------

Map
---
entrySet()                        // Key + Value ⭐⭐⭐⭐⭐

keySet()                          // Keys only

values()                          // Values only

---------------------------------------------------------

Queue
-----
while(!q.isEmpty())               // Queue processing ⭐⭐⭐⭐⭐

for(Integer x:q)                  // Read only

---------------------------------------------------------

Deque
-----
for(Integer x:dq)                 // Forward

descendingIterator()              // Reverse

---------------------------------------------------------

PriorityQueue
-------------
while(!pq.isEmpty())              // Correct ⭐⭐⭐⭐⭐

Never use for-each if you expect sorted order.

---------------------------------------------------------

String
------
for(int i=0;i<s.length();i++)     // Need index

for(char c:s.toCharArray())       // Characters only

=========================================================
MOST COMMON IN LLD INTERVIEWS
=========================================================

List

for(Type obj : list)

---------------------------------------------------------

Map

for(Map.Entry<K,V> entry : map.entrySet())

---------------------------------------------------------

Set

for(Type obj : set)

---------------------------------------------------------

Queue

while(!queue.isEmpty()) {

    Type obj = queue.poll();

}

---------------------------------------------------------

PriorityQueue

while(!pq.isEmpty()) {

    Type obj = pq.poll();

}

=========================================================