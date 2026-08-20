import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class Price {
    String seller;
    double amount;

    Price(String seller, double amount) {
        this.seller = seller;
        this.amount = amount;
    }

    @Override
    public String toString() {
        return seller + " : ₹" + amount;
    }
}

public class PriceAggregator {

    private final ExecutorService executor =
            Executors.newFixedThreadPool(3);

    public Price getBestPrice(String productId) throws InterruptedException {

        List<Price> prices = new ArrayList<>();

        CountDownLatch latch = new CountDownLatch(3);

        // SCATTER

        executor.submit(() -> {
            try {
                Price price = getAmazonPrice(productId);

                synchronized (prices) {
                    prices.add(price);
                }

            } finally {
                latch.countDown();
            }
        });

        executor.submit(() -> {
            try {
                Price price = getFlipkartPrice(productId);

                synchronized (prices) {
                    prices.add(price);
                }

            } finally {
                latch.countDown();
            }
        });

        executor.submit(() -> {
            try {
                Price price = getCromaPrice(productId);

                synchronized (prices) {
                    prices.add(price);
                }

            } finally {
                latch.countDown();
            }
        });

        // GATHER

        latch.await();

        // All sellers have responded
        return prices.stream()
                .min((p1, p2) ->
                        Double.compare(p1.amount, p2.amount))
                .orElseThrow();
    }

    private Price getAmazonPrice(String productId) {
        sleep(1000);
        return new Price("Amazon", 79999);
    }

    private Price getFlipkartPrice(String productId) {
        sleep(2000);
        return new Price("Flipkart", 78999);
    }

    private Price getCromaPrice(String productId) {
        sleep(1500);
        return new Price("Croma", 80499);
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void shutdown() {
        executor.shutdown();
    }
}

// Can also be implemented using CompletableFuture, which is more elegant and less verbose.