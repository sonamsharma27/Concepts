# LSM Tree (Log-Structured Merge Tree)

# LSM Tree (Log-Structured Merge Tree)

An LSM Tree is a write-optimized storage engine design used in databases such as RocksDB, LevelDB, Apache Cassandra, ScyllaDB and Apache HBase. It is optimized for very high write throughput, sequential disk writes and append-heavy workloads.

## Core idea

- Buffer writes in memory and append new data sequentially
- Flush sorted data to immutable files on disk (SSTables)
- Merge (compact) SSTables later in background

This avoids random in-place disk updates and costly seeks.

## Main components

- Write-Ahead Log (WAL)
- MemTable (in-memory sorted structure)
- Immutable MemTable
- SSTables (immutable sorted on-disk files)
- Compaction engine
- Bloom filters and block cache

## High-level flow

1. Client write → append to WAL (durable)
2. Insert into MemTable (in-memory)
3. When MemTable is full → freeze to immutable MemTable and flush to SSTable
4. Background compaction merges SSTables

---

## 1. Write-Ahead Log (WAL)

- Append-only log written to disk before acknowledging writes (durability, crash recovery)
- Example: PUT user:1 = Alice → WAL entry [user:1 -> Alice]
- Characteristics: sequential writes, fsync periodically

## 2. MemTable

- In-memory sorted, mutable structure (e.g. skip list, red-black tree)
- Stores recent writes; sorted order makes flush efficient

Example:

1 -> Alice
2 -> Bob
5 -> Charlie

## 3. Immutable MemTable & Flush

- When active MemTable is full it is frozen and becomes immutable while a new active MemTable handles incoming writes
- Immutable MemTable is flushed to disk as an SSTable (sequential write)

## 4. SSTable (Sorted String Table)

- Immutable, sorted on-disk file containing key→value entries
- Typically contains data blocks, a sparse index, a bloom filter and footer/metadata
- Data blocks are often compressed (Snappy, LZ4, ZSTD)

Internal layout (conceptual):

- Data blocks (actual KV entries)
- Sparse index (block boundaries)
- Bloom filter
- Metadata / footer

Read flow: binary-search sparse index → read relevant block → find key

## 5. Bloom filters

- Probabilistic structure answering "definitely not present?"
- No false negatives; may have false positives
- Used to avoid unnecessary SSTable reads

## Read path

To GET a key, search order is:

1. MemTable (active)
2. Immutable MemTables
3. SSTables (newest first, L0 → L1 → ...)

Newest checked first because newer entries shadow older ones.

## Important tradeoffs

- Read amplification: many SSTables need checking (mitigated by bloom filters, block cache, compaction)
- Write amplification: data rewritten multiple times during compaction
- Space amplification: temporary duplicates during compaction

## Compaction

- Background merging of SSTables to remove duplicates/tombstones and reduce overlapping ranges
- Example:

SST1: 1->A, 2->B
SST2: 2->C, 3->D

After compaction: 1->A, 2->C, 3->D

- Compaction reclaims space and improves read performance but increases write and space amplification while running

## Tombstones (deletes)

- Deletes are written as tombstones (e.g. key -> TOMBSTONE) and physical deletion happens during compaction

## Levels and compaction strategies

- Levels: L0 (newest, may overlap), L1, L2, ... (higher levels are larger and more compacted)
- Leveled compaction (e.g. RocksDB): non-overlapping SSTables per level, lower read amplification, higher write amplification
- Size-tiered compaction (e.g. Cassandra): merge similarly sized SSTables, lower write amplification but more SSTables and slower reads

## Performance considerations

- Sequential writes are fast (fewer seeks, SSD-friendly)
- SSDs benefit because LSM avoids random overwrites which cause internal write amplification and wear
- Caching: block cache, OS page cache, bloom filters, optional row cache improve read performance

## Range queries

- SSTables are sorted, so range scans are efficient, but data can span many SSTables and may require merging iterators

## LSM vs B+ Tree (summary)

Feature | LSM Tree | B+ Tree
--- | ---: | ---:
Write pattern | Sequential | Random
Write throughput | Very high | Moderate
Read latency | Higher | Lower
Range scan | Good | Excellent
Compaction needed | Yes | No
Page splits | No | Yes
Fragmentation | Lower | Higher
Write amplification | High | Lower
SSD optimization | Excellent | Good

## When to use

- LSM trees: logging, event ingestion, analytics, IoT, time-series, distributed and write-heavy workloads
- B+ trees: OLTP, heavy random reads, low-latency point lookups, transactional systems

## Interview concepts to remember

- Read amplification
- Write amplification
- Space amplification
- Compaction debt (when compaction lags writes it can cause latency spikes and storage growth)

## Advanced concepts

- Backpressure: throttle writes when compaction cannot keep up
- Hot keys: very frequently updated keys increase compaction overhead
- Snapshot reads: immutability enables MVCC-like snapshots without locking SSTables
- Multi-version data: older versions persist across SSTables until compaction removes them

## Real-world examples

- Cassandra: Client write → Commit log → MemTable → SSTable flush → Compaction. Used for massive write throughput.
- RocksDB: embedded, used in stream processors and Kafka state stores; tunable compaction strategies and SSD-optimized
