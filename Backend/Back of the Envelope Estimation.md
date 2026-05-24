# URL Shortner 

## Storage Estimation for 10 Years

### 1. Database Row Size
Each record contains:
- Long URL: 100 bytes
- Short Hash: 7 bytes
- User ID: 8 bytes
- Created At: 8 bytes
- Expires At: 8 bytes
- **Raw Total: 131 bytes**

### 2. Database Overhead
With 25% overhead for indexes(primary + secondary + internal structuring):
- **Total Row Size: 163.75 bytes**

### 3. Base Database Storage
For 365 billion records:
- **Base Storage: ~59.77 TB**

### 4. System Replication (3x)
- **Replicated Storage: ~179.31 TB**

### 5. Analytics Log Storage
- Read volume: 11,600 ops/sec
- Daily clicks: ~1 billion
- Log entry size: 100 bytes
- 10-year total: 3.65 trillion entries
- **Raw Log Storage: 365 TB**
- **Replicated (3x): ~1.1 PB**

### 6. Total with 20% Buffer
- Subtotal: 1,274.31 TB
- **Total: ~1.53 PB**

# Component | Raw Data | Replicated (3x) |
|-----------|----------|-----------------|
| URL Database | 59.77 TB | 179.31 TB |
| Analytics Logs | 365.00 TB | 1,095.00 TB |
| System Backup (20%) | 84.95 TB | 254.86 TB |
| **Total** | **509.72 TB** | **1.53 PB** |
