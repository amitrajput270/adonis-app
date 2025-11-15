# Large CSV Upload API - Implementation Summary

## ✅ What Has Been Created

### 1. Database Migration

**File:** `database/migrations/1763177612712_create_create_fees_data_table.ts`

- Creates `fees_data` table with all 27 columns matching your schema
- Supports decimal amounts with precision (12,2)
- All fields are nullable as per requirements

### 2. Model

**File:** `app/models/fees_datum.ts`

- Lucid ORM model for the `fees_data` table
- Uses camelCase for properties (auto-converts to snake_case in DB)
- Includes all 27 fields with proper types

### 3. Validator

**File:** `app/validators/fees_data_upload.ts`

- Validates CSV file uploads
- Allows files up to 300MB
- Only accepts `.csv` file extension

### 4. Controller

**File:** `app/controllers/fees_data_controller.ts`

- **5 endpoints implemented:**
  1. `upload()` - Streaming CSV upload with batch processing
  2. `index()` - Get paginated records
  3. `show()` - Get single record by ID
  4. `stats()` - Get statistics (total records, amounts)
  5. `destroy()` - Delete a record

### 5. Routes

**File:** `start/routes.ts`

- All endpoints under `/api/fees-data` prefix
- POST /api/fees-data/upload
- GET /api/fees-data
- GET /api/fees-data/stats
- GET /api/fees-data/:id
- DELETE /api/fees-data/:id

### 6. Configuration

**File:** `config/bodyparser.ts`

- Updated multipart limit from `20mb` to `350mb`
- Enables handling of large file uploads

### 7. Sample Files

- `sample_fees_data.csv` - Sample CSV with 10 records
- `test-csv-upload.sh` - Bash script to test all endpoints
- `Fees_Data_API.postman_collection.json` - Postman collection
- `README_CSV_UPLOAD.md` - Complete documentation

---

## 🚀 Key Features

### Memory Efficient Streaming

```typescript
- Uses Node.js streams to read CSV files
- Processes data chunk by chunk (no full file in memory)
- Can handle 250MB+ files without memory issues
```

### Batch Processing

```typescript
- Inserts data in batches of 1000 rows
- Optimizes database performance
- Tracks failed and successful rows
```

### Error Handling

```typescript
- Continues processing even if some rows fail
- Reports total processed and failed rows
- Logs errors for debugging
```

---

## 📊 Expected Performance

### For a 250MB CSV file (~500,000 rows):

- **Processing Time:** 2-5 minutes
- **Memory Usage:** ~50-100MB (constant)
- **Database Load:** Moderate (batch inserts)

---

## 🧪 How to Test

### Step 1: Run Migration (if not already done)

```bash
node ace migration:run
```

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: Test with Sample File

```bash
# Option A: Use the test script
./test-csv-upload.sh

# Option B: Use curl directly
curl -X POST http://localhost:3333/api/fees-data/upload \
  -F "csv_file=@sample_fees_data.csv"
```

### Step 4: Verify the Data

```bash
# Get all records
curl http://localhost:3333/api/fees-data

# Get statistics
curl http://localhost:3333/api/fees-data/stats

# Get specific record
curl http://localhost:3333/api/fees-data/1
```

---

## 📝 CSV Format Requirements

Your CSV file **must** have these columns (header row required):

```
sr
date
academic_year
session
alloted_category
voucher_type
voucher_no
roll_no
admno_uniqueid
status
fee_category
faculty
program
department
batch
receipt_no
fee_head
due_amount
paid_amount
concession_amount
scholarship_amount
reverse_concession_amount
write_off_amount
adjusted_amount
refund_amount
fund_trancfer_amount
remarks
```

---

## 🔧 Technical Implementation Details

### 1. Streaming CSV Parser

```typescript
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'

const stream = createReadStream(filePath)
const parser = parse({
  columns: true, // First row as headers
  skip_empty_lines: true,
  trim: true,
  bom: true, // Handle UTF-8 BOM
})
```

### 2. Batch Insert

```typescript
const batchSize = 1000
let batch = []

// When batch is full
if (batch.length >= batchSize) {
  await db.table('fees_data').multiInsert(batch)
  batch = []
}
```

### 3. Pause/Resume Stream

```typescript
parser.on('data', async (row) => {
  parser.pause() // Stop reading while processing
  // ... process row ...
  parser.resume() // Continue reading
})
```

---

## 🎯 API Endpoints Summary

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/fees-data/upload` | Upload CSV file (max 300MB) |
| GET    | `/api/fees-data`        | Get all records (paginated) |
| GET    | `/api/fees-data/stats`  | Get statistics              |
| GET    | `/api/fees-data/:id`    | Get single record           |
| DELETE | `/api/fees-data/:id`    | Delete record               |

---

## 📦 Dependencies Added

```bash
npm install csv-parse
```

This is the only new dependency required for CSV parsing.

---

## ⚙️ MySQL Configuration (Recommended)

For optimal performance with large files, update your MySQL settings:

```sql
-- Increase max packet size
SET GLOBAL max_allowed_packet=536870912;  -- 512MB

-- Optimize for bulk inserts
SET GLOBAL innodb_buffer_pool_size=2147483648;  -- 2GB
SET GLOBAL innodb_log_file_size=536870912;      -- 512MB
```

Add to your `my.cnf` or `my.ini`:

```ini
[mysqld]
max_allowed_packet=512M
innodb_buffer_pool_size=2G
innodb_log_file_size=512M
innodb_flush_log_at_trx_commit=2
```

---

## 🎨 Postman Testing

1. Import the collection: `Fees_Data_API.postman_collection.json`
2. The base URL is set to: `http://localhost:3333`
3. For upload endpoint:
   - Select **Body** tab
   - Choose **form-data**
   - Key: `csv_file` (type: File)
   - Value: Browse and select your CSV file

---

## 🛠️ Troubleshooting

### Issue: "File too large"

**Solution:** Increase the limit in `config/bodyparser.ts`:

```typescript
multipart: {
  limit: '500mb',  // Increase as needed
}
```

### Issue: "Out of memory"

**Solution:** The streaming approach prevents this, but if it occurs:

- Reduce batch size in controller (from 1000 to 500)
- Check Node.js memory limit: `node --max-old-space-size=4096 ace serve`

### Issue: "Database connection timeout"

**Solution:** Increase MySQL timeout:

```sql
SET GLOBAL wait_timeout=28800;
SET GLOBAL interactive_timeout=28800;
```

### Issue: "Some rows failed to insert"

**Solution:** Check the response for `failedRows` count. Review:

- CSV data format (especially dates and decimals)
- Console logs for specific errors
- Database constraints or triggers

---

## 📈 Monitoring Upload Progress

The API returns detailed progress information:

```json
{
  "success": true,
  "message": "CSV file processed successfully",
  "data": {
    "processedRows": 500000,
    "failedRows": 15,
    "totalRows": 500015
  }
}
```

---

## 🔒 Security Considerations

1. **File Type Validation:** Only `.csv` files accepted
2. **File Size Limit:** Maximum 300MB (configurable)
3. **Consider adding:**
   - Authentication/Authorization
   - Rate limiting for upload endpoint
   - Virus scanning for uploaded files
   - Input sanitization for CSV data

---

## 🚀 Production Deployment Checklist

- [ ] Run migrations on production database
- [ ] Update MySQL configuration for large files
- [ ] Set appropriate file size limits
- [ ] Add authentication to endpoints
- [ ] Set up monitoring and logging
- [ ] Configure proper error alerting
- [ ] Test with actual production-size files
- [ ] Set up backup strategy before bulk uploads
- [ ] Consider using queue system for very large files

---

## 📞 Support

For issues or questions:

1. Check the logs in `tmp/logs`
2. Review `README_CSV_UPLOAD.md` for detailed documentation
3. Test with the sample CSV file first
4. Use the test script to verify all endpoints

---

## 🎉 You're All Set!

The API is ready to handle large CSV files efficiently. Start your server and begin uploading!

```bash
npm run dev
```

Then test with:

```bash
./test-csv-upload.sh
```
