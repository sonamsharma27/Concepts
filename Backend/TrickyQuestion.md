# User Clicks a Button → Website Freezes for 60 Seconds → Response Appears

Top suspects
1. Timeout
2. Slow DB query
3. Lock contention
4. Thread pool exhaustion
5. External API delay
6. Connection pool exhaustion

Medium probability
7. Load balancer issue
8. Cache issue
9. Kafka producer blocking
10. Service-to-service latency

Low probability
12. CDN issue
13. DNS issue


## Interview Mindset (SDE-3)

Never assume the issue is in one layer.

Think through the complete request path:

Browser
→ DNS
→ CDN
→ Load Balancer
→ Web Server
→ Application Server
→ Cache
→ Database
→ External Services
→ Response

A 60-second delay usually indicates one of:

* Blocking operation
* Resource starvation
* Network issue
* Lock contention
* Timeout being hit

---

# 1. Frontend Issues

## Main Thread Blocked

Heavy JavaScript computation runs on the browser's main thread.

Example:

```js
button.onclick = () => {
  for(let i=0;i<10000000000;i++) {}
}
```

Symptoms:

* Browser freezes
* UI becomes unresponsive
* High CPU usage

Investigation:

* Chrome DevTools → Performance Tab

---

## Large DOM Rendering

Example:

User clicks:

"Show all records"

Application attempts to render:

* 100k rows
* 1M rows

Symptoms:

* Long render times
* Browser freeze

Solutions:

* Pagination
* Virtualization
* Infinite Scroll

---

## Large JSON Parsing

Network response may arrive quickly.

However browser spends time parsing:

```json
100MB JSON
```

Symptoms:

* Network request appears complete
* UI still frozen

---

## Memory Pressure and Garbage Collection

Symptoms:

* Large memory growth
* Frequent GC pauses
* Browser freezes intermittently

---

# 2. Network Layer Problems

## Slow Internet Connection

Request itself takes a long time.

Check:

Chrome DevTools → Network Tab

Metrics:

* DNS Lookup
* TCP Connect
* TLS Handshake
* TTFB
* Content Download

---

## DNS Resolution Delay

Browser cannot resolve:

api.company.com

Symptoms:

* Delay before request starts

---

## TCP Connection Problems

Packet loss causes:

* Retransmissions
* Slow connection establishment

---

## TLS Handshake Delay

SSL certificate validation or handshake issues.

Symptoms:

* Long delay before request begins

---

## Packet Loss

TCP keeps retrying lost packets.

Can add significant latency.

---

## VPN / Proxy Issues

Traffic path:

Browser
→ Corporate Proxy
→ VPN
→ Datacenter

Additional hops increase latency.

---

# 3. CDN Problems

## Cache Miss

Expected:

Client → CDN

Actual:

Client
→ CDN
→ Origin Server

Origin may be overloaded.

---

## CDN-Origin Connectivity Issues

CDN waits for origin response.

Results in high latency.

---

# 4. Load Balancer Problems

## Unhealthy Backend Routing

Load balancer sends requests to unhealthy instances.

---

## Sticky Session Imbalance

One overloaded backend receives all requests from a user.

---

## Connection Queue Saturation

Load balancer queues requests before forwarding.

---

# 5. Application Server Problems

## Thread Pool Exhaustion

Example:

Tomcat Thread Pool = 200

All threads busy.

New requests wait in queue.

Symptoms:

User waits before request processing even starts.

---

## Deadlocks

Thread A:

Lock(User)
Wait(Order)

Thread B:

Lock(Order)
Wait(User)

Both wait forever until timeout.

---

## Synchronous Blocking Calls

Example:

Request
→ Service A (20s)
→ Service B (20s)
→ Service C (20s)

Total latency:

60 seconds

---

## CPU Saturation

CPU reaches:

100%

Requests spend time waiting in scheduler queues.

---

## Memory Pressure

JVM GC pauses.

Examples:

* Stop-The-World GC
* Full GC

Application becomes temporarily unresponsive.

---

## Event Loop Blocking (Node.js)

Example:

```js
while(true){}
```

or expensive computation.

Entire Node process becomes blocked.

---

## Lock Contention

Many requests waiting on:

```java
synchronized(account)
```

Only one request proceeds.

Others wait.

---

## Connection Pool Exhaustion

Application needs DB connection.

Pool Size = 50

All connections busy.

New requests wait.

Very common production issue.

---

# 6. Cache Layer Problems

## Cache Miss Storm

Expected:

Application → Redis

Actual:

Application → Database

Every request hits database.

---

## Cache Server Down

Application bypasses cache.

Database becomes overloaded.

---

## Redis Performance Problems

Examples:

* Large keys
* Expensive scans
* Network latency

---

## Distributed Lock Waiting

Request waits for lock release.

Example:

SETNX lock

---

# 7. Database Problems

One of the most common causes.

## Slow Query

Example:

```sql
SELECT *
FROM orders
WHERE email = 'abc'
```

No index exists.

Results:

Full table scan.

---

## Missing Index

Table grows.

Query performance degrades:

10ms → 60s

---

## Row Lock Contention

Transaction A:

```sql
UPDATE users
```

Transaction B waits for row lock.

---

## Table Lock

Operations like:

```sql
ALTER TABLE
```

can block other queries.

---

## Database Deadlock

Database detects deadlock.

Kills one transaction after timeout.

---

## Database Connection Pool Exhaustion

Application cannot obtain DB connection.

Request waits.

---

## Replication Lag

Application reads from replica.

Replica is behind primary.

Results may be delayed.

---

## Disk I/O Bottleneck

Database reads data from disk instead of memory.

Latency increases dramatically.

---

## Checkpoint / Flush Storm

Heavy writes force disk flushing.

Storage becomes saturated.

---

# 8. External Service Problems

Very common in microservice architectures.

## Payment Gateway Delay

Request path:

Application
→ Payment Gateway

Gateway hangs.

Application waits.

---

## Third-Party API Delay

Examples:

* Maps API
* SMS API
* Email API
* Tax API

Request blocks waiting for response.

---

## Dependency Chain Latency

Service A
→ Service B
→ Service C
→ Service D

One slow service impacts entire chain.

---

## Retry Storm

Request pattern:

Call
→ Fail
→ Retry
→ Retry
→ Retry

Response eventually succeeds after long delay.

---

# 9. Queueing Problems

## Kafka Consumer Lag

Request produces event.

Consumer is overloaded.

Processing delayed.

---

## RabbitMQ Backlog

Queue contains millions of messages.

Request waits.

---

## Worker Pool Exhaustion

No worker available.

Task sits in queue.

---

# 10. Infrastructure Problems

## Autoscaling Delays

New pods being created.

Requests wait until pods become healthy.

---

## Kubernetes Scheduling Issues

Pods remain pending due to insufficient resources.

---

## Pod Restart Loops

Traffic routed to unstable pods.

---

## Disk Full

Writes block.

Application becomes slow.

---

## Network Partition

Services become temporarily unreachable.

Timeouts occur.

---

# 11. Timeout-Related Issues (Most Important)

If delay is exactly:

* 30 seconds
* 60 seconds
* 90 seconds
* 120 seconds

Think:

TIMEOUT

Common defaults:

* Nginx: 60s
* ELB/ALB: 60s
* API Gateway: 60s
* HTTP Clients: 60s
* Database Clients: 60s
* Redis Clients: 60s

Typical flow:

Request
→ External Service Hangs
→ Wait 60 Seconds
→ Timeout Triggered
→ Response Returned

Exact round-number delays are strong indicators of timeout configurations.

---

# Senior Engineer Debugging Approach

## Step 1: Determine Where Time Is Spent

Question:

Did the browser freeze?

OR

Did the request take 60 seconds?

Use:

Chrome DevTools → Network Tab

---

## Step 2: Analyze Request Breakdown

Check:

* DNS
* TCP
* TLS
* Waiting (TTFB)
* Download

Find where latency accumulates.

---

## Step 3: Inspect Distributed Traces

Tools:

* OpenTelemetry
* Jaeger
* Zipkin
* Datadog
* New Relic

Trace:

Frontend
→ API Gateway
→ Service
→ Database
→ External Service

Identify slow hop.

---

## Step 4: Check Application Metrics

Look for:

* CPU Usage
* Memory Usage
* Thread Count
* Connection Pool Usage
* Queue Lengths

---

## Step 5: Check Database Metrics

Investigate:

* Slow Query Logs
* Lock Waits
* Deadlocks
* Connection Pool Saturation
* Disk I/O

---

## Step 6: Look for Timeouts

Search configs for:

* 30s
* 60s
* 90s
* 120s

Exact delays often map directly to timeout settings.

---

# SDE-3 Summary Answer

A 60-second freeze after clicking a button can originate from any layer of the request path:

* Frontend rendering or JavaScript execution
* Browser memory pressure
* DNS/TCP/TLS/network delays
* CDN or load balancer issues
* Thread pool exhaustion
* CPU or memory saturation
* Cache failures
* Database contention or slow queries
* External service latency
* Queue backlogs
* Infrastructure failures
* Timeout configurations

The first goal is to determine where the 60 seconds are spent (browser, network, application, cache, database, or dependency) using browser network traces, application metrics, distributed tracing, and database diagnostics. If the delay is exactly 60 seconds, a timeout somewhere in the request path should be considered the primary suspect.
