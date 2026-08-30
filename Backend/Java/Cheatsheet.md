=========================================
JAVA FOR LLD INTERVIEWS (C++ -> JAVA)
=========================================

-----------------------------------------
1. COLLECTIONS
-----------------------------------------

C++                     Java
-----------------------------------------
vector                  ArrayList
unordered_map           HashMap
unordered_set           HashSet
map                     TreeMap
set                     TreeSet
queue                   Queue/LinkedList
priority_queue          PriorityQueue

-----------------------------------------
2. ARRAYLIST
-----------------------------------------

List<String> list = new ArrayList<>();

list.add("A");
list.remove(0);
list.get(0);
list.size();

-----------------------------------------
3. HASHMAP
-----------------------------------------

Map<String, Integer> map = new HashMap<>();

map.put("A", 1);
map.get("A");
map.containsKey("A");
map.remove("A");

for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey());
    System.out.println(entry.getValue());
}

-----------------------------------------
4. HASHSET
-----------------------------------------

Set<Integer> set = new HashSet<>();

set.add(1);
set.remove(1);
set.contains(1);

-----------------------------------------
5. TREEMAP (ordered map)
-----------------------------------------

Map<Integer, String> map = new TreeMap<>();

map.put(3, "C");
map.put(1, "A");
map.put(2, "B");

Output:
1 A
2 B
3 C

Complexity:
Insert O(log n)
Delete O(log n)
Search O(log n)

-----------------------------------------
6. TREESET (ordered set)
-----------------------------------------

Set<Integer> set = new TreeSet<>();

set.add(5);
set.add(1);
set.add(3);

Output:
1 3 5

-----------------------------------------
7. QUEUE
-----------------------------------------

Queue<Integer> q = new LinkedList<>();

q.offer(1);
q.offer(2);

q.peek();
q.poll(); // q.front() & q.pop();

-----------------------------------------
8. PRIORITY QUEUE
-----------------------------------------

Min Heap

PriorityQueue<Integer> pq =
    new PriorityQueue<>();

Max Heap

PriorityQueue<Integer> pq =
    new PriorityQueue<>(
        Collections.reverseOrder()
    );

Custom Comparator

PriorityQueue<User> pq =
    new PriorityQueue<>(
        (a,b) -> b.rating - a.rating
    );

-----------------------------------------
9. CLASS
-----------------------------------------

class User {

    private String name;
    private int age;

    User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

-----------------------------------------
10. ACCESS MODIFIERS
-----------------------------------------

public
private
protected
default (package-private)

Most LLD classes:

private fields
public methods

-----------------------------------------
11. GETTERS & SETTERS
-----------------------------------------

class User {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

-----------------------------------------
12. STATIC
-----------------------------------------

class User {

    static int count = 0;
}

Access:

User.count++;

Meaning:
Belongs to class
Not object

-----------------------------------------
13. STATIC NESTED CLASS
-----------------------------------------

class User {

    static class Builder {

    }
}

Usage:

User.Builder builder =
    new User.Builder();

Common in Builder Pattern.

-----------------------------------------
14. FINAL
-----------------------------------------

final int MAX = 100; -> Cannot modify.

final class A {} -> Cannot inherit.

final void show() {} -> Cannot override.

-----------------------------------------
15. ENUM
-----------------------------------------

enum BookingStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}

Usage:

BookingStatus status =
    BookingStatus.CREATED;

Common:
BookingStatus
SeatStatus
PaymentStatus

-----------------------------------------
16. INHERITANCE
-----------------------------------------

class Vehicle {

}

class Car extends Vehicle {

}

-----------------------------------------
17. ABSTRACT CLASS
-----------------------------------------

abstract class Vehicle {

    abstract void start();

    void stop() {
        System.out.println("Stop");
    }
}

class Car extends Vehicle {

    @Override
    void start() {

    }
}

Use when:
Some implementation is common.

-----------------------------------------
18. INTERFACE
-----------------------------------------

interface PaymentStrategy {

    void pay(double amount);
}

class CreditCardPayment
implements PaymentStrategy {

    public void pay(double amount) {

    }
}

Use when:
Only contract is needed.

LLD favorite.

-----------------------------------------
19. COMPOSITION
-----------------------------------------

class Engine {

}

class Car {

    private Engine engine;

    Car(Engine engine) {
        this.engine = engine;
    }
}

HAS-A relationship.

Preferred over inheritance.

-----------------------------------------
20. GENERICS
-----------------------------------------

class Box<T> {

    T value;
}

Usage:

Box<Integer> box =
    new Box<>();

Equivalent of C++ templates.

-----------------------------------------
21. COMPARABLE
-----------------------------------------

Natural ordering.

class User
implements Comparable<User> {

    int age;

    @Override
    public int compareTo(
            User other) {

        return this.age - other.age;
    }
}

Usage:

Collections.sort(users);

Meaning:
User knows how to compare itself.

-----------------------------------------
22. COMPARATOR
-----------------------------------------

External comparison.

Comparator<User> ageComparator =
    (a,b) -> a.age - b.age;

users.sort(ageComparator);

Another comparator:

Comparator<User> nameComparator =
    (a,b) ->
      a.name.compareTo(b.name);

Meaning:
External object decides comparison.

Used heavily in LLD.

-----------------------------------------
23. LAMBDA
-----------------------------------------

(a,b) -> a.age - b.age

Equivalent to:

new Comparator<User>() {

    @Override
    public int compare(
            User a,
            User b) {

        return a.age - b.age;
    }
};

-----------------------------------------
24. EXCEPTION
-----------------------------------------

try {

}
catch(Exception e) {

}
finally {

}

Custom Exception:

class SeatUnavailableException
extends Exception {

    public SeatUnavailableException(
            String message) {

        super(message);
    }
}

-----------------------------------------
25. SINGLETON
-----------------------------------------

class ConfigManager {

    private static final
    ConfigManager INSTANCE =
        new ConfigManager();

    private ConfigManager() {}

    public static ConfigManager
    getInstance() {

        return INSTANCE;
    }
}

Usage:

ConfigManager manager =
    ConfigManager.getInstance();

-----------------------------------------
26. BUILDER PATTERN
-----------------------------------------

User user =
    new User.Builder()
        .setName("Sonam")
        .setAge(25)
        .build();

Used when object has many fields.

-----------------------------------------
27. COMMON INTERVIEW ENUMS
-----------------------------------------

enum SeatStatus {
    AVAILABLE,
    BOOKED,
    BLOCKED
}

enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED
}

enum BookingStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}

-----------------------------------------
28. COMMON INTERVIEW COLLECTIONS
-----------------------------------------

Store Users

Map<String, User> users;

Store Bookings

Map<String, Booking> bookings;

Store Seats

Map<String, Seat> seats;

Store User Bookings

Map<String, List<Booking>>
userBookings;

Store Available Drivers

PriorityQueue<Driver> drivers;

-----------------------------------------
29. MOST COMMON LLD SKELETON
-----------------------------------------

enum BookingStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}

class User {

    private String id;
    private String name;
}

class Booking {

    private String id;
    private User user;
    private BookingStatus status;
}

interface PaymentStrategy {

    void pay(double amount);
}

class CreditCardPayment
implements PaymentStrategy {

    public void pay(double amount) {

    }
}

class PaymentService {

    private PaymentStrategy strategy;

    PaymentService(
            PaymentStrategy strategy) {

        this.strategy = strategy;
    }

    public void processPayment(
            double amount) {

        strategy.pay(amount);
    }
}

-----------------------------------------
30. MUST KNOW FOR LLD
-----------------------------------------

1. Class
2. Interface
3. Abstract Class
4. Inheritance
5. Composition
6. Enum
7. ArrayList
8. HashMap
9. HashSet
10. TreeMap
11. TreeSet
12. PriorityQueue
13. Comparator
14. Singleton
15. Builder Pattern
16. Strategy Pattern
17. Factory Pattern
18. SOLID Principles

Master these and you'll be able to write
Parking Lot
BookMyShow
ATM
Splitwise
Library
Hotel Booking
Food Delivery
Ride Sharing
Elevator
and most LLD interview solutions.


# Notes:
* final class   → cannot extend the class
* final method  → cannot override the method
* final variable → cannot reassign the variable