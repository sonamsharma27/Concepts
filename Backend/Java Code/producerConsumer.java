import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class ProducerConsumer {

    private final Queue<Integer> buffer = new LinkedList<>();
    private final int capacity;

    private final ReentrantLock lock = new ReentrantLock();

    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public ProducerConsumer(int capacity) {
        this.capacity = capacity;
    }

    public void produce(int item) throws InterruptedException {
        lock.lock();

        try {
            // Buffer is full → producer waits
            while (buffer.size() == capacity) {
                notFull.await();
            }

            buffer.add(item);
            System.out.println("Produced: " + item);

            // Notify consumers that buffer is no longer empty
            notEmpty.signal();

        } finally {
            lock.unlock();
        }
    }

    public int consume() throws InterruptedException {
        lock.lock();

        try {
            // Buffer is empty → consumer waits
            while (buffer.isEmpty()) {
                notEmpty.await();
            }

            int item = buffer.poll();
            System.out.println("Consumed: " + item);

            // Notify producers that buffer is no longer full
            notFull.signal();

            return item;

        } finally {
            lock.unlock();
        }
    }
}