# Strategies

1. Append-Only Storage with LSM Trees , SSTables, Compaction


2. Delta Encoding and Compression

    Time-series data has a unique property: adjacent values are often similar. If you're recording CPU usage every second, the values might be 45.2%, 45.3%, 45.1%, 45.4%. Storing the full value each time wastes space.
    Delta encoding stores the difference between consecutive values instead of the absolute values:
    Raw values:     [45.2] [45.3] [45.1] [45.4]
    Delta encoded:  [45.2] [+0.1] [-0.2] [+0.3]
    The deltas are much smaller numbers, requiring fewer bits to store using varint (variable-length integer).

    Time-series databases go even further with specialized compression algorithms.
    Timestamps use delta-of-delta encoding. Timestamps in time-series data are often regular - every 10 seconds, for example. The delta between timestamps might be constant or nearly constant:
    Raw timestamps:     1000, 1010, 1020, 1030, 1040
    Deltas:             10  , 10  , 10  , 10  , 10  , ...
    Delta-of-deltas:    10  , 0   , 0   , 0   , 0   , ...

3. Time-Based Partitioning (Sharding by Time)

    Writes are localized. All incoming data goes to the current time partition. There's no need to figure out which of many partitions should receive the data - it's always the "now" partition.
   
    Reads are efficient. When you query "show me the last hour of data," the database knows exactly which partitions to examine. It doesn't need to scan data from last month.

    Retention becomes trivial. Want to keep only 7 days of data? Just delete partitions older than 7 days. No expensive DELETE queries scanning through a massive table - just drop the old files.

4. Bloom Filters for Read Optimization

5. Downsampling and Rollups

    Bloom filters help with point lookups, but what about aggregate queries over large time ranges? Raw metrics at 10-second resolution are great for debugging recent issues, but nobody needs that granularity when looking at last year's data. Downsampling automatically reduces the resolution of older data, trading precision for storage efficiency.

    A typical policy might look like:
    Last 24 hours: Full resolution (10-second intervals)
    Last 7 days: 1-minute averages
    Last 30 days: 5-minute averages
    Last year: 1-hour averages

    The database computes these rollups in the background, storing pre-aggregated values (typically min, max, sum, count) that can answer most queries without touching the raw data. When you ask "what was the average CPU usage last month?", the database reads from the 5-minute rollup table - 288x less data than the raw 10-second data.

    Raw data (10s):     [45.2] [45.3] [45.1] [45.4] [45.0] [45.5] ... (8,640 points/day)
    1-min rollup:       [min:45.0, max:45.5, avg:45.25, count:6] ... (1,440 points/day)
    1-hour rollup:      [min:44.1, max:47.2, avg:45.8, count:360] ... (24 points/day)


    This is a form of pre-computation that trades storage and write amplification for dramatically faster reads on historical data. If you want to see downsampling in action in a problem context, check out our Ad Click Aggregator breakdown where we use this technique to handle billions of ad events.


    Downsampling and rollups frequently show up in interviews as a negotiation in requirements. Your interviewer says "we need to store 10s samples for 1 year", and you say "that's a ton of data, I think we probably only need the fine resolution for a week, and can downsample to 5 minute averages for a month ... does this work?" The key is (a) you anticipating a future problem, (b) explaining the challenge, and (c) offering an alternative. Even if the interviewer says no, they're marking down your ability to think outside of the rigid requirements that were given to you — a hallmark of a staff+ candidate.

6. Block-Level Metadata

    Our last optimization is a twist on the query planning ideas we covered in our Elasticsearch deep dive. When scanning data files, time-series databases maintain metadata about each block's contents - particularly min/max timestamps and sometimes min/max values. This enables block pruning during queries.
    If a query asks for CPU usage above 10%, and a block's metadata shows it only contains data from 0-5%, the database skips that entire block without reading it. Combined with time-based partitioning (which already limits which partitions to check), this provides another layer of filtering that keeps queries fast even as data volumes grow


# The Data Model

Time-series databases typically organize data into:
Measurements or metrics - like tables (e.g., "cpu_usage", "memory")
Tags - indexed metadata for filtering (e.g., host="server-1", region="us-west")
Fields - the actual measured values (e.g., value=45.2)
Timestamps - when the measurement was taken

cpu_usage,host=server-1,region=us-west value=45.2 1699999200000000000
└─────────────────────────────────────┘ └────────┘ └─────────────────┘
        measurement + tags               field          timestamp

Tags are crucial because they're indexed. Queries filtering by tags are fast. Fields are not indexed - they're the actual time-series data you're storing.

The file format is heavily optimized:
File Structure:
┌──────────────────────────────────────────────────────────────┐
│                          Header                              │
├──────────────────────────────────────────────────────────────┤
│  Block 1: Timestamps (delta-of-delta + varint encoded)       │
│  Block 1: Values (XOR compressed)                            │
├──────────────────────────────────────────────────────────────┤
│  Block 2: Timestamps                                         │
│  Block 2: Values                                             │
├──────────────────────────────────────────────────────────────┤
│                         ...                                  │
├──────────────────────────────────────────────────────────────┤
│                    Index (series → block offsets)            │
├──────────────────────────────────────────────────────────────┤
│                         Footer                               │
└──────────────────────────────────────────────────────────────┘

Each file contains an index at the end that maps series keys (measurement + tag combinations) to the blocks containing their data. This means looking up data for a specific series is a seek to the index, then a seek to the data - two disk operations regardless of how much data is in the file.


The query engine:

- Identifies relevant partitions based on the time filter. Only partitions overlapping the query time range are considered.

- Locates series by looking up the tag filter (host='server-1') in the in-memory tag index.
Reads from buffer and disk files. The buffer has the most recent data; disk files have older data. Results are merged.

- Applies aggregations as data is read. This is a streaming operation - the database doesn't need to load all data into memory before computing the mean.



# Where Things Break

These advantages are not without their challenges. A particularly poignant example is the cardinality problem.
Cardinality refers to the number of unique tag combinations. If you have 1,000 hosts and 50 metric names, that's 50,000 series. Manageable. But what if you add a tag for user_id with 10 million unique users? Suddenly you have 500 billion potential series.
Why is this a problem? Time-series databases maintain an in-memory index of all series. Each unique tag combination needs an entry. With billions of series, you run out of memory. Queries also slow down because the index becomes massive.
This is why user IDs, request IDs, or any high-cardinality value can only be stored as fields, not tags. In essence, we can write them but we lose all the performance benefits of the time-series database in reading them.
