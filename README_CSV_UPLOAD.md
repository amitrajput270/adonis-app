# CSV Upload API Documentation

## Overview

This API endpoint handles large CSV file uploads (up to 300MB) for fees data with streaming processing to efficiently handle memory usage.

## Features

- ✅ Stream-based CSV processing (handles 250MB+ files)
- ✅ Batch inserts (1000 rows per batch)
- ✅ Memory efficient
- ✅ Progress tracking
- ✅ Error handling and reporting

## Endpoints

### 1. Upload CSV File

**POST** `/api/fees-data/upload`

Upload a CSV file containing fees data. The file will be processed in streaming mode.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `csv_file`: CSV file (max 300MB)

**CSV Format:**
The CSV file must have the following columns (header row required):

```
sr,date,academic_year,session,alloted_category,voucher_type,voucher_no,roll_no,admno_uniqueid,status,fee_category,faculty,program,department,batch,receipt_no,fee_head,due_amount,paid_amount,concession_amount,scholarship_amount,reverse_concession_amount,write_off_amount,adjusted_amount,refund_amount,fund_trancfer_amount,remarks
```

**Response:**

```json
{
  "success": true,
  "message": "CSV file processed successfully",
  "data": {
    "processedRows": 50000,
    "failedRows": 0,
    "totalRows": 50000
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3333/api/fees-data/upload \
  -F "csv_file=@/path/to/fees_data.csv"
```

**Postman:**

1. Method: POST
2. URL: `http://localhost:3333/api/fees-data/upload`
3. Body: form-data
4. Key: `csv_file` (type: File)
5. Value: Select your CSV file

---

### 2. Get All Fees Data (Paginated)

**GET** `/api/fees-data`

Retrieve paginated fees data.

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Records per page

**Response:**

```json
{
  "success": true,
  "data": {
    "meta": {
      "total": 50000,
      "per_page": 20,
      "current_page": 1,
      "last_page": 2500
    },
    "data": [...]
  }
}
```

---

### 3. Get Single Record

**GET** `/api/fees-data/:id`

Get a specific fees data record by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "sr": 1,
    "date": "2024-01-01",
    "academicYear": "2023-2024",
    ...
  }
}
```

---

### 4. Get Statistics

**GET** `/api/fees-data/stats`

Get overall statistics about fees data.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRecords": 50000,
    "totalPaidAmount": 125000000.5,
    "totalDueAmount": 15000000.0
  }
}
```

---

### 5. Delete Record

**DELETE** `/api/fees-data/:id`

Delete a specific fees data record.

**Response:**

```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

---

## Database Schema

The `fees_data` table has the following structure:

| Column                    | Type          | Description               |
| ------------------------- | ------------- | ------------------------- |
| id                        | int (primary) | Auto-increment ID         |
| sr                        | int           | Serial number             |
| date                      | date          | Transaction date          |
| academic_year             | varchar(50)   | Academic year             |
| session                   | varchar(50)   | Session                   |
| alloted_category          | varchar(100)  | Alloted category          |
| voucher_type              | varchar(50)   | Voucher type              |
| voucher_no                | varchar(50)   | Voucher number            |
| roll_no                   | varchar(50)   | Roll number               |
| admno_uniqueid            | varchar(100)  | Admission unique ID       |
| status                    | varchar(50)   | Status                    |
| fee_category              | varchar(100)  | Fee category              |
| faculty                   | varchar(100)  | Faculty                   |
| program                   | varchar(100)  | Program                   |
| department                | varchar(100)  | Department                |
| batch                     | varchar(100)  | Batch                     |
| receipt_no                | varchar(100)  | Receipt number            |
| fee_head                  | varchar(100)  | Fee head                  |
| due_amount                | decimal(12,2) | Due amount                |
| paid_amount               | decimal(12,2) | Paid amount               |
| concession_amount         | decimal(12,2) | Concession amount         |
| scholarship_amount        | decimal(12,2) | Scholarship amount        |
| reverse_concession_amount | decimal(12,2) | Reverse concession amount |
| write_off_amount          | decimal(12,2) | Write off amount          |
| adjusted_amount           | decimal(12,2) | Adjusted amount           |
| refund_amount             | decimal(12,2) | Refund amount             |
| fund_trancfer_amount      | decimal(12,2) | Fund transfer amount      |
| remarks                   | text          | Remarks                   |

---

## Sample CSV File

Create a file named `sample_fees_data.csv`:

```csv
sr,date,academic_year,session,alloted_category,voucher_type,voucher_no,roll_no,admno_uniqueid,status,fee_category,faculty,program,department,batch,receipt_no,fee_head,due_amount,paid_amount,concession_amount,scholarship_amount,reverse_concession_amount,write_off_amount,adjusted_amount,refund_amount,fund_trancfer_amount,remarks
1,2024-01-15,2023-2024,Spring,General,Payment,V001,R001,ADM001,Active,Regular,Engineering,B.Tech,Computer Science,2023,RCP001,Tuition Fee,50000.00,50000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,Payment completed
2,2024-01-16,2023-2024,Spring,SC/ST,Payment,V002,R002,ADM002,Active,Regular,Engineering,B.Tech,Mechanical,2023,RCP002,Tuition Fee,50000.00,25000.00,25000.00,0.00,0.00,0.00,0.00,0.00,0.00,Concession applied
3,2024-01-17,2023-2024,Spring,General,Payment,V003,R003,ADM003,Active,Regular,Science,M.Sc,Physics,2023,RCP003,Lab Fee,10000.00,10000.00,0.00,5000.00,0.00,0.00,0.00,0.00,0.00,Scholarship received
```

---

## Performance Considerations

### Memory Efficiency

- The API uses **streaming** to read CSV files
- Processes data in **batches of 1000 rows**
- Minimal memory footprint even for 250MB+ files

### Processing Speed

- Expected processing time for 250MB file (~500k rows): 2-5 minutes
- Depends on database server performance and network latency

### Recommendations

1. Ensure MySQL has sufficient `max_allowed_packet` size:

   ```sql
   SET GLOBAL max_allowed_packet=536870912; -- 512MB
   ```

2. Optimize MySQL for bulk inserts:

   ```sql
   SET GLOBAL innodb_buffer_pool_size=2G;
   SET GLOBAL innodb_log_file_size=512M;
   ```

3. For very large files, consider:
   - Splitting into multiple smaller files
   - Running during off-peak hours
   - Monitoring server resources

---

## Error Handling

The API handles various error scenarios:

1. **Invalid file format**: Returns 400 Bad Request
2. **File too large**: Returns 413 Payload Too Large
3. **CSV parsing errors**: Logs errors and continues processing
4. **Database errors**: Reports failed rows in response

---

## Testing

To test the upload endpoint:

```bash
# Create a test CSV file
cat > test_fees.csv << 'EOF'
sr,date,academic_year,session,alloted_category,voucher_type,voucher_no,roll_no,admno_uniqueid,status,fee_category,faculty,program,department,batch,receipt_no,fee_head,due_amount,paid_amount,concession_amount,scholarship_amount,reverse_concession_amount,write_off_amount,adjusted_amount,refund_amount,fund_trancfer_amount,remarks
1,2024-01-15,2023-2024,Spring,General,Payment,V001,R001,ADM001,Active,Regular,Engineering,B.Tech,CS,2023,RCP001,Tuition,50000.00,50000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,Test
EOF

# Upload the file
curl -X POST http://localhost:3333/api/fees-data/upload \
  -F "csv_file=@test_fees.csv"

# Check the data
curl http://localhost:3333/api/fees-data

# Get statistics
curl http://localhost:3333/api/fees-data/stats
```

---

## Configuration

The following configurations have been updated:

### Body Parser Config (`config/` )

```typescript
multipart: {
  limit: '350mb', // Supports files up to 350MB
}
```

### CSV Validator (`app/validators/fees_data_upload.ts`)

```typescript
csv_file: vine.file({
  size: '300mb',
  extnames: ['csv'],
})
```

---

## Routes

All routes are prefixed with `/api/fees-data`:

```typescript
POST   /api/fees-data/upload     - Upload CSV file
GET    /api/fees-data            - Get all records (paginated)
GET    /api/fees-data/stats      - Get statistics
GET    /api/fees-data/:id        - Get single record
DELETE /api/fees-data/:id        - Delete record
```

View all routes:

```bash
node ace list:routes
```
