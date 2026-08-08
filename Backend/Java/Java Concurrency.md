========================================================
JAVA CONCURRENCY CHEATSHEET
========================================================

--------------------------------------------------------
1. PROCESS vs THREAD
--------------------------------------------------------

Process
--------
Independent program
Own memory space

Examples:
Chrome
VS Code
Spotify

Thread
--------
Lightweight execution unit
Shares process memory

Example:

Process
 |
 +-- Thread 1
 +-- Thread 2
 +-- Thread 3

--------------------------------------------------------
2. CREATING THREADS
--------------------------------------------------------

Method 1:

class MyThread extends Thread {

    @Override
    public void run() {
        System.out.println("Running");
    }
}

MyThread t = new MyThread();
t.start();

--------------------------------------------------------

Method 2 (Preferred)

class Task implements Runnable {

    @Override
    public void run() {
        System.out.println("Running");
    }
}

Thread t = new Thread(new Task());

t.start();

--------------------------------------------------------
3. start() vs run()
--------------------------------------------------------

Wrong:

t.run();

No new thread created.

--------------------------------------------------------

Correct:

t.start();

JVM creates new thread.

--------------------------------------------------------
4. RACE CONDITION
--------------------------------------------------------

class Counter {

    int count = 0;

    void increment() {
        count++;
    }
}

Thread A:
count = 5

Thread B:
count = 5

Both write 6

Expected:
7

Actual:
6

Race condition.

--------------------------------------------------------
5. synchronized
--------------------------------------------------------

class Counter {

    int count;

    synchronized void increment() {
        count++;
    }
}

Only one thread enters method.

--------------------------------------------------------

Equivalent:

void increment() {

    synchronized(this) {
        count++;
    }
}

--------------------------------------------------------
6. OBJECT LOCK
--------------------------------------------------------

class User {

    synchronized void update() {

    }
}

Lock acquired on:

this

Each object has separate lock.

--------------------------------------------------------
7. CLASS LOCK
--------------------------------------------------------

class User {

    static synchronized
    void update() {

    }
}

Lock acquired on:

User.class

Shared across all objects.

--------------------------------------------------------
8. DEADLOCK
--------------------------------------------------------

Thread A

lock(A)
lock(B)

Thread B

lock(B)
lock(A)

Result:

Forever waiting.

--------------------------------------------------------

Avoid:

Always acquire locks
in same order.

--------------------------------------------------------
9. VOLATILE
--------------------------------------------------------

volatile boolean running = true;

Thread 1:

while(running) {

}

Thread 2:

running = false;

Without volatile:

Thread 1 may never see update.

--------------------------------------------------------

volatile guarantees:

Visibility

NOT Atomicity

--------------------------------------------------------
10. ATOMICINTEGER
--------------------------------------------------------

AtomicInteger count =
    new AtomicInteger(0);

Increment:

count.incrementAndGet();

Decrement:

count.decrementAndGet();

Read:

count.get();

--------------------------------------------------------

Better than:

synchronized

for simple counters.

--------------------------------------------------------
11. REENTRANTLOCK
--------------------------------------------------------

Lock lock =
    new ReentrantLock();

lock.lock();

try {

    // critical section

}
finally {

    lock.unlock();
}

--------------------------------------------------------

Advantages over synchronized:

tryLock()

fair locking

interruptible lock

--------------------------------------------------------
12. TRY LOCK
--------------------------------------------------------

if(lock.tryLock()) {

    try {

    }
    finally {
        lock.unlock();
    }
}

Else:

skip work

--------------------------------------------------------

Used often in interviews.

--------------------------------------------------------
13. READ WRITE LOCK
--------------------------------------------------------

ReadWriteLock lock =
    new ReentrantReadWriteLock();

Read:

lock.readLock().lock();

Write:

lock.writeLock().lock();

--------------------------------------------------------

Multiple readers allowed

Only one writer

--------------------------------------------------------

Use Case:

User Profile Cache
Catalog Service
Seat Lookup

--------------------------------------------------------
14. CONDITION VARIABLE
--------------------------------------------------------

Lock lock =
    new ReentrantLock();

Condition condition =
    lock.newCondition();

Wait:

condition.await();

Signal One:

condition.signal();

Signal All:

condition.signalAll();

--------------------------------------------------------

Java version of:

wait/notify

--------------------------------------------------------
15. WAIT / NOTIFY
--------------------------------------------------------

synchronized(queue) {

    queue.wait();
}

synchronized(queue) {

    queue.notify();
}

--------------------------------------------------------

Producer Consumer interviews.

--------------------------------------------------------
16. THREAD POOL
--------------------------------------------------------

ExecutorService executor =
    Executors.newFixedThreadPool(10);

executor.submit(
    () -> doWork()
);

executor.shutdown();

--------------------------------------------------------

Never create:

new Thread()

for every request.

--------------------------------------------------------
17. EXECUTOR SERVICE
--------------------------------------------------------

ExecutorService executor =
    Executors.newFixedThreadPool(10);

executor.submit(task);

executor.shutdown();

--------------------------------------------------------

Most common interview answer.

--------------------------------------------------------
18. FUTURE
--------------------------------------------------------

Future<Integer> future =
    executor.submit(
        () -> 42
    );

Integer result =
    future.get();

--------------------------------------------------------

Blocks until result available.

--------------------------------------------------------
19. COMPLETABLE FUTURE
--------------------------------------------------------

CompletableFuture<String> future =
    CompletableFuture
        .supplyAsync(
            () -> fetchData()
        );

String result =
    future.join();

--------------------------------------------------------

Parallel APIs.

--------------------------------------------------------

CompletableFuture
    .supplyAsync(...)
    .thenApply(...)
    .thenAccept(...);

--------------------------------------------------------
20. THREAD SAFE COLLECTIONS
--------------------------------------------------------

Not Thread Safe:

HashMap
ArrayList
HashSet

--------------------------------------------------------

Thread Safe:

ConcurrentHashMap

CopyOnWriteArrayList

ConcurrentLinkedQueue

BlockingQueue

--------------------------------------------------------
21. CONCURRENTHASHMAP
--------------------------------------------------------

Map<String,User> users =
    new ConcurrentHashMap<>();

users.put(id,user);

users.get(id);

--------------------------------------------------------

Preferred over:

Collections.synchronizedMap()

--------------------------------------------------------
22. BLOCKING QUEUE
--------------------------------------------------------

BlockingQueue<Task> queue =
    new LinkedBlockingQueue<>();

Producer:

queue.put(task);

Consumer:

queue.take();

--------------------------------------------------------

Automatically waits.

--------------------------------------------------------

Interview favorite.

--------------------------------------------------------
23. PRODUCER CONSUMER
--------------------------------------------------------

Producer

queue.put(task);

Consumer

while(true) {

    Task task =
        queue.take();

    process(task);
}

--------------------------------------------------------

Examples:

Message Queue

Notification Service

Order Processing

Ride Matching

--------------------------------------------------------
24. COUNTDOWN LATCH
--------------------------------------------------------

CountDownLatch latch =
    new CountDownLatch(3);

Worker:

latch.countDown();

Main:

latch.await();

--------------------------------------------------------

Wait for N tasks.

--------------------------------------------------------
25. SEMAPHORE
--------------------------------------------------------

Semaphore sem =
    new Semaphore(5);

Acquire:

sem.acquire();

Release:

sem.release();

--------------------------------------------------------

Only 5 threads allowed.

--------------------------------------------------------

Use Cases:

DB connections

Rate limiting

Parking lot slots

--------------------------------------------------------
26. CYCLIC BARRIER
--------------------------------------------------------

CyclicBarrier barrier =
    new CyclicBarrier(3);

barrier.await();

--------------------------------------------------------

All threads wait
until everyone arrives.

--------------------------------------------------------
27. THREAD LOCAL
--------------------------------------------------------

ThreadLocal<UserContext> context =
    new ThreadLocal<>();

context.set(user);

context.get();

--------------------------------------------------------

Each thread gets own copy.

--------------------------------------------------------

Use Cases:

Request Context

Trace ID

User Session

--------------------------------------------------------
28. DOUBLE CHECKED LOCKING
--------------------------------------------------------

class Singleton {

    private static
    volatile Singleton instance;

    public static Singleton
    getInstance() {

        if(instance == null) {
            synchronized(
                Singleton.class
            ) {
                if(instance == null) {

                    instance =
                        new Singleton();
                }
            }
        }

        return instance;
    }
}

--------------------------------------------------------

Senior level topic.

--------------------------------------------------------
29. COMMON INTERVIEW PROBLEMS
--------------------------------------------------------

Counter

AtomicInteger

--------------------------------------------------------

Cache

ConcurrentHashMap

--------------------------------------------------------

Seat Booking

Lock
Optimistic Locking
Distributed Lock

--------------------------------------------------------

Parking Lot

Semaphore

--------------------------------------------------------

Notification System

BlockingQueue

Producer Consumer

--------------------------------------------------------

Uber Driver Matching

PriorityQueue
Lock

--------------------------------------------------------

Rate Limiter

Semaphore
AtomicInteger

--------------------------------------------------------

Order Processing

Thread Pool
BlockingQueue

--------------------------------------------------------
30. INTERVIEW PROGRESSION
--------------------------------------------------------

SDE-1

synchronized
AtomicInteger
Thread Pool

--------------------------------------------------------

SDE-2

ReentrantLock
ConcurrentHashMap
BlockingQueue
Producer Consumer

--------------------------------------------------------

Senior / Staff

ReadWriteLock
CompletableFuture
Semaphore
CountDownLatch
Deadlock
Double Checked Locking

--------------------------------------------------------
31. GOLDEN RULES
--------------------------------------------------------

Use AtomicInteger
for counters.

Use ConcurrentHashMap
for shared maps.

Use BlockingQueue
for producer-consumer.

Use ExecutorService
instead of new Thread().

Use ReentrantLock
when synchronized is insufficient.

Use ReadWriteLock
for read-heavy systems.

Keep lock scope small.

Always unlock in finally.

Avoid nested locks.

Acquire locks in same order.

========================================================