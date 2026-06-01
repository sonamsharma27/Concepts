# How serving videos or content is faster from CDN that high capacity servers?

CDNs improve performance mainly by reducing network distance and serving cached content from edge locations close to users. Even a very powerful origin server cannot overcome transcontinental latency, routing hops, and congestion. CDNs also optimize delivery using edge caching, persistent TCP connections, TLS offloading, anycast routing, and adaptive streaming, which significantly reduces latency and improves throughput for static assets and videos.

1. Reduced Physical Distance
- Content served from edge servers near users
- Lower RTT (round-trip time)
- Avoids transcontinental latency

Example:
User in India → Bangalore CDN edge (~5–20ms)
vs
User in India → US origin server (~200ms+)

--------------------------------------------------

2. Fewer Network Hops
- Shorter routing path
- Fewer routers/backbone networks involved
- Lower congestion and packet loss

Without CDN:
Client → ISP → backbone → international links → origin

With CDN:
Client → nearby ISP peering → CDN edge

--------------------------------------------------

3. Edge Caching
- Static assets cached at edge:
  - videos
  - images
  - JS/CSS
- Requests often never reach origin server

--------------------------------------------------

4. Massive Traffic Distribution
- Traffic spread across thousands of edge servers
- Prevents origin bottlenecks
- Improves scalability and availability
- Instead of 1 origin handling 10M users, it becomes 1000 edges each handling 10K users
--------------------------------------------------

5. Faster Video Streaming
- Videos split into chunks (HLS/DASH)
- Chunks cached at CDN edge
- Reduces buffering and startup latency

--------------------------------------------------

6. TCP Connection Reuse
- CDN maintains warm persistent connections
- Avoids repeated TCP handshakes

--------------------------------------------------

7. TLS Offloading
- CDN handles HTTPS encryption/decryption
- Reduces CPU load on origin
- Faster TLS handshakes

--------------------------------------------------

8. Anycast Routing
- Same IP advertised from multiple locations
- Internet routes user to nearest/healthiest edge

--------------------------------------------------

9. Compression & Optimization
- Brotli/gzip compression
- Image optimization/transcoding
- Adaptive bitrate streaming

--------------------------------------------------

10. Range Requests Support
- Videos served partially using byte ranges
- Enables seeking and chunk streaming efficiently

Example:
Range: bytes=1000000-2000000

--------------------------------------------------

Core Insight:
Distributed proximity beats centralized power.

Even extremely powerful servers cannot overcome:
- speed-of-light latency
- ISP congestion
- long routing paths
- packet loss over long distances

--------------------------------------------------

Common CDN Challenges
- Cache invalidation
- Stale content
- Cache misses
- Eventual consistency
- Cost management


# Q. How Kafka is so fast ?
1. Zero copy technique
    - Reads without zero copy : Disc -> OS buffer -> Kafka Application buffer -> Socket buffer -> NIC buffer -> Consumer
    - Reads with zero copy : Disc -> OS buffer -> NIC buffer -> Consumer
2. Uses Sequential I/O access by using append only log as data structure as it follows the same access pattern


# Random Insertion Problem (UUIDs in B+Tree Indexes)

## Core Idea
Most relational databases (PostgreSQL, MySQL/InnoDB) use B+Trees for indexes.

B+Trees store keys in sorted order.

Sequential IDs (1,2,3,4...) are inserted at the right-most leaf page, which is highly efficient.

Random UUIDs insert into arbitrary positions across the tree, causing major performance problems at scale.

--------------------------------------------------

# Sequential Insertions (GOOD)

Example:
1 → 2 → 3 → 4 → 5

New inserts go to:
- right-most leaf page
- append-like behavior

Benefits:
- excellent cache locality
- fewer page splits
- fewer disk seeks
- predictable writes
- better buffer pool efficiency
- lower WAL generation
- less fragmentation

DBs are heavily optimized for this pattern.

--------------------------------------------------

# Random UUID Insertions (BAD)

UUIDs:
c82a...
1ff9...
a772...
09ab...

Insertion positions become random.

Problems:
- DB touches random leaf pages
- poor cache locality
- more page loads into memory
- more disk IO
- more fragmentation

--------------------------------------------------

# Page Split Problem

Suppose leaf page is full:

[40 50 60]

Insert:
45

DB must split page:

Before:
[40 50 60]

After:
[40 45]
[50 60]

Parent nodes also updated.

--------------------------------------------------

# Why Page Splits Are Expensive

Page splits involve:
- memory allocation
- disk writes
- tree rebalancing
- pointer updates
- WAL logging

At scale:
- write amplification increases
- SSD wear increases
- replication lag increases

--------------------------------------------------

# Cache Locality Issue

Sequential IDs:
- repeatedly reuse same hot tail pages
- high buffer cache hit ratio

UUIDs:
- constantly touch random pages
- lower cache efficiency
- more cache misses

--------------------------------------------------

# InnoDB Clustered Index Impact

In MySQL/InnoDB:
Primary key determines physical row order.

BIGINT auto-increment:
- rows appended sequentially

Random UUID PK:
- table rows physically fragmented
- more page splits in actual table storage too

Very expensive.

--------------------------------------------------

# Trade-Offs of UUIDs

Advantages:
- globally unique
- decentralized ID generation
- shard independence
- unguessable IDs
- no coordination required

Disadvantages:
- larger indexes (16 bytes vs 8 bytes BIGINT)
- poor B+Tree locality
- random writes
- fragmentation
- slower inserts

--------------------------------------------------

# Modern Solutions

Use time-ordered unique IDs:
- UUIDv7
- ULID
- KSUID
- Snowflake IDs

Benefits:
- globally unique
- mostly sequential insertion order
- preserve B+Tree locality
- reduce fragmentation

--------------------------------------------------

# Important Deep Insight

The real problem is NOT UUID itself.

The real problem is:
"random write distribution in B+Trees"

Sequential insertion preserves locality.
Random insertion destroys locality.

--------------------------------------------------

# LSM Tree Databases

Databases like:
- Cassandra
- RocksDB

use LSM Trees instead of B+Trees.

LSM Trees optimize sequential write batching.

Random UUIDs hurt much less in LSM-based systems.

--------------------------------------------------

# Strong Interview Summary

Random UUID primary keys degrade B+Tree performance because inserts occur across arbitrary leaf pages instead of append-only tail pages. This causes page splits, fragmentation, cache misses, additional WAL generation, and poorer buffer pool efficiency. Time-ordered identifiers preserve insertion locality and significantly improve write throughput and index maintenance efficiency.


--------------------------------------------------

- A database is the complete data management system providing query execution, transactions, replication, networking, and persistence. 
- A storage engine is the low-level subsystem responsible for physical data storage, indexing, caching, WAL logging, and recovery. 
- In distributed systems, a node is a running database server instance participating in the cluster; each node typically contains networking, replication, coordination logic, and an embedded storage engine.

# Distributed Database System
    ├── Node (server instance)
    │      ├── Networking
    │      ├── Replication
    │      ├── Query handling
    │      └── Storage Engine
    │             ├── WAL
    │             ├── Indexes
    │             ├── Cache
    │             └── Disk pages
    └── Node


 #  Database Server Process
    ├── SQL Parser
    ├── Query Planner
    ├── Transaction Manager
    ├── Replication Module
    ├── WAL Manager
    ├── Network Layer
    ├── Consensus Module
    └── Storage Engine



-  Replication, failover, consistency, WAL shipping, and leader election logic are implemented      inside the distributed database server software itself. 
- Each database node runs a server process containing modules such as the replication manager, consensus engine, WAL subsystem, networking layer, transaction manager, and storage engine. 
- These components are implemented by database engineers in the database source code and operate transparently beneath the SQL/query layer exposed to applications.


--------------------------------------------------


# How sloppy quorum is different from strict quorum consensus?
In strict quorum consensus, reads and writes must be acknowledged by the designated replica set, and guarantees like R + W > N ensure overlapping quorums and stronger consistency. In sloppy quorum, the system relaxes replica placement during failures and allows writes to be stored on temporary fallback nodes outside the canonical replica set. This improves availability and partition tolerance but weakens strict quorum overlap guarantees, leading to eventual consistency semantics. Mechanisms like hinted handoff are later used to synchronize data back to intended replicas.


The condition R + W > N guarantees that every read quorum overlaps with every successful write quorum, meaning at least one replica participating in the read has seen the latest committed write. However, this alone does not guarantee strict linearizable consistency during concurrent read-write races. If a read reaches the overlapping replica before the write is applied there, stale data can still be returned. Strong consistency requires additional guarantees such as ordered commit semantics, synchronous quorum acknowledgments, controlled read/write coordination, and often consensus protocols like Raft or Paxos to enforce real-time operation ordering.

# How data sync happens between master and slave DBs?
1. Execute query
2. Modify memory pages
3. Write WAL/binlog
4. Commit transaction
5. Notify replication thread
6. Replication thread streams logs to replicas

This logic is written inside database engine

Database Engine
 ├── Query Executor
 ├── Storage Engine
 ├── Transaction Manager
 ├── WAL/Binlog Writer
 ├── Replication Sender
 └── Replication Receiver

 Modern DBs stream changes nearly in real time.

Replication is fundamentally:
1. Write-ahead logging
2. Streaming ordered logs
3. Replay on replicas