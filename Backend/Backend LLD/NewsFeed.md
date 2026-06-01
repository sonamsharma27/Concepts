# 1. Core Domain Models

## User
```java
class User {
    private String userId;
    private String name;
}
```

## Post
```java
class Post {
    private String postId;
    private String authorId;
    private String content;
    private List<String> mediaIds;
    private Instant createdAt;
}
```

## FeedEntry (most important)
```java
class FeedEntry {
    private String viewerUserId;
    private String postId;
    private String authorId;
    private double score;
    private Instant createdAt;
}
```

Why not store entire post?

- Memory explosion — store references only.

# 2. API Layer

## FeedController
```java
class FeedController {
    private FeedService feedService;

    FeedResponse getFeed(String userId, String cursor, int limit);

    CreatePostResponse createPost(CreatePostRequest request);
}
```
# 3. DTOs

## CreatePostRequest
```java
class CreatePostRequest {
    private String authorId;
    private String content;
    private List<String> mediaIds;
}
```

## FeedResponse
```java
class FeedResponse {
    private List<PostView> posts;
    private String nextCursor;
}
```

## PostView
```java
class PostView {
    private String postId;
    private String content;
    private UserSummary author;
    private Instant createdAt;
}
```
# 4. Service Layer

## PostService (responsible for post creation)
```java
interface PostService {
    String createPost(CreatePostRequest request);
}

class PostServiceImpl implements PostService {
    private PostRepository postRepository;
    private EventPublisher eventPublisher;
}
```

Flow: Create Post → Save Post → Publish Event → Return

## FeedService
```java
interface FeedService {
    FeedResponse getFeed(String userId, String cursor, int limit);
}

class FeedServiceImpl implements FeedService {
    private FeedCache feedCache;
    private FeedRepository feedRepository;
    private PostRepository postRepository;
}
```

Flow: Cache → Feed Store → Posts → Response
# 5. Fanout Layer

This is where most interviewers focus.

## PostCreatedEvent
```java
class PostCreatedEvent {
    private String postId;
    private String authorId;
}
```

## FanoutWorker (consumes Kafka)
```java
class FanoutWorker {
    private FollowerService followerService;
    private FeedRepository feedRepository;
    private FeedCache feedCache;

    public void process(PostCreatedEvent event) {
        // fanout logic
    }
}
```

Flow: PostCreatedEvent → Fetch Followers → Create Feed Entries → Store Feed Entries → Update Cache
# 6. Ranking Abstraction

Never hardcode chronology.

```java
interface RankingStrategy {
    List<FeedEntry> rank(List<FeedEntry> entries);
}

class ChronologicalRanking implements RankingStrategy {}

class MLRanking implements RankingStrategy {}
```

Future: Facebook, LinkedIn, Instagram — all use ML ranking.

# 7. Cache Layer

## FeedCache
```java
interface FeedCache {
    List<String> getFeedPostIds(String userId, int limit);
    void addPost(String userId, String postId);
}
```

Implementation: Redis Sorted Set

- Key: feed:user123
- Value: postId
- Score: timestamp
# 8. Repository Layer

## PostRepository
```java
interface PostRepository {
    void save(Post post);
    Optional<Post> findById(String postId);
    List<Post> findByIds(List<String> postIds);
}
```

## FeedRepository
```java
interface FeedRepository {
    void saveFeedEntries(List<FeedEntry> entries);
    List<FeedEntry> getFeed(String userId, String cursor, int limit);
}
```

## FollowerRepository
```java
interface FollowerRepository {
    List<String> getFollowers(String userId);
}
```
# 9. Event Publisher

```java
interface EventPublisher {
    void publish(PostCreatedEvent event);
}

class KafkaPublisher implements EventPublisher {}
```
# 10. Celebrity Handling

- Regular users: Fanout On Write
- Celebrities: Fanout On Read

Introduce strategy:
```java
interface FeedGenerationStrategy {
    void generateFeed(PostCreatedEvent event);
}

class FanoutOnWriteStrategy implements FeedGenerationStrategy {}

class FanoutOnReadStrategy implements FeedGenerationStrategy {}

class FeedStrategySelector {
    FeedGenerationStrategy select(String authorId);
}
```

Example:
- followers < 1M → Fanout On Write
- followers > 1M → Fanout On Read
# 11. Pagination

Avoid OFFSET for large offsets. Use cursor.

```java
class FeedCursor {
        private long timestamp;
        private String postId;
}
```

Query example:
SELECT * FROM FeedEntries
WHERE viewer_user_id = ?
    AND created_at < ?
ORDER BY created_at DESC
LIMIT 20
# 12. News Feed Sequence Diagram

Create Post:
Client -> POST /posts -> PostController -> PostService -> PostRepository -> KafkaPublisher -> Return Success

Async Fanout:
Kafka -> FanoutWorker -> { Followers, Feed DB, Redis }

Read Feed:
Client -> FeedController -> FeedService ->
    - Redis (HIT)
    - Feed DB
    - Post DB -> Response

## Design Patterns Used
- Strategy Pattern (FanoutOnWrite, FanoutOnRead)
- Ranking Algorithms
- Repository Pattern (PostRepository, FeedRepository, FollowerRepository)
- Observer / Event Driven (PostCreatedEvent -> FanoutWorker)
- Cache Aside (Read Redis -> Miss -> DB -> Populate Cache)

## SDE-3 Discussion Points
After presenting the LLD, proactively discuss:
- Scalability: Kafka partitioning, Redis sharding, Feed DB partitioning
- Reliability: At least once processing, idempotent fanout
- Consistency: Eventual consistency
- Hot Celebrities: Hybrid fanout
- Ranking: Pluggable ranking engine
- Memory Optimization: Store only postIds (not full post objects)