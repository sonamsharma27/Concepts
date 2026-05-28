# Factors that affect choice of data
1. Structure of data
    - Structured data 
        - Need ACID (Payments)-> SQL
        - No need of ACID -> NoSQL or SQL
    - Unstructured data 
        - Many data types + Queries (E-Commerce) -> Document DB
        - Large amount of data + Not many queries -> Columnar DB (Cassandra, HBase)
2. Query pattern
3. Amount of scale 


# File storage options
1. Blob storage -> Images and Videos
    - Amazon S3

# Searching capability 
  - Text Search Engine -> Elastic Search or Solr
  - Elastic Search or Solr are built on top of Lucene
  - Lucene provides text searching capabilities
  - Fuzzy search

# Metrics
  - Time series database -> extension of relational DBs
    - Append only write mode
    - Bulk read
    - Influx DB

# Data storage for analytics
  - Data warehouse
    - Hadoop


# DBs for Amazon
   - Inventory and order management -> RDBMS
      - Afer order is placed can be archived to permanent store
   - Data / Permanent store -> Cassandra 
   - Random queries (eg tshirt ) 
     - store subset of info in MongoDB
     - take this info to query on RDBMS or Cassandra

# Conclusion : 
    Combinations of DBs gives more power

