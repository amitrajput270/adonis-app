# Fees Data Management System

A robust AdonisJS application for managing and importing large CSV files containing fees data. Built with streaming capabilities to handle files up to 300MB efficiently.

## 🚀 Features

- **Large CSV File Upload** - Handle CSV files up to 300MB with streaming
- **Memory Efficient** - Batch processing (2000 rows per batch) prevents memory overflow
- **RESTful API** - Complete CRUD operations for fees data
- **Data Statistics** - Get insights on total records and amounts
- **Error Handling** - Robust error tracking and reporting
- **Progress Tracking** - Real-time feedback on upload progress

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/amitrajput270/adonis-app.git
   cd adonis-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:

   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   ```

4. **Run migrations**

   ```bash
   node ace migration:run
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3333`

## 📊 Database Schema

The `fees_data` table contains 27 columns:

| Column                    | Type              | Description               |
| ------------------------- | ----------------- | ------------------------- |
| id                        | INT (Primary Key) | Auto-increment ID         |
| sr                        | INT               | Serial number             |
| date                      | DATE              | Transaction date          |
| academic_year             | VARCHAR(100)      | Academic year             |
| session                   | VARCHAR(100)      | Session                   |
| alloted_category          | VARCHAR(200)      | Alloted category          |
| voucher_type              | VARCHAR(100)      | Voucher type              |
| voucher_no                | VARCHAR(100)      | Voucher number            |
| roll_no                   | VARCHAR(100)      | Roll number               |
| admno_uniqueid            | VARCHAR(150)      | Admission unique ID       |
| status                    | VARCHAR(100)      | Status                    |
| fee_category              | VARCHAR(200)      | Fee category              |
| faculty                   | VARCHAR(200)      | Faculty                   |
| program                   | VARCHAR(255)      | Program                   |
| department                | VARCHAR(200)      | Department                |
| batch                     | VARCHAR(150)      | Batch                     |
| receipt_no                | VARCHAR(150)      | Receipt number            |
| fee_head                  | VARCHAR(200)      | Fee head                  |
| due_amount                | DECIMAL(12,2)     | Due amount                |
| paid_amount               | DECIMAL(12,2)     | Paid amount               |
| concession_amount         | DECIMAL(12,2)     | Concession amount         |
| scholarship_amount        | DECIMAL(12,2)     | Scholarship amount        |
| reverse_concession_amount | DECIMAL(12,2)     | Reverse concession amount |
| write_off_amount          | DECIMAL(12,2)     | Write off amount          |
| adjusted_amount           | DECIMAL(12,2)     | Adjusted amount           |
| refund_amount             | DECIMAL(12,2)     | Refund amount             |
| fund_trancfer_amount      | DECIMAL(12,2)     | Fund transfer amount      |
| remarks                   | TEXT              | Remarks                   |

## 🔌 API Endpoints

### Base URL

```
http://localhost:3333/api/fees-data
```

### 1. Upload CSV File

**POST** `/api/fees-data/upload`

Upload and process a CSV file with fees data.

**Request:**

- Content-Type: `multipart/form-data`
- Body: `csv_file` (File, max 300MB)

**Response:**

```json
{
  "success": true,
  "message": "CSV file processed successfully",
  "data": {
    "processedRows": 500000,
    "failedRows": 0,
    "totalRows": 500000
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3333/api/fees-data/upload \
  -F "csv_file=@/path/to/your/file.csv"
```

### 2. Get All Records (Paginated)

**GET** `/api/fees-data?page=1&limit=20`

Retrieve paginated fees data.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Records per page

**Response:**

```json
{
  "success": true,
  "data": {
    "meta": {
      "total": 500000,
      "per_page": 20,
      "current_page": 1,
      "last_page": 25000
    },
    "data": [...]
  }
}
```

### 3. Get Single Record

**GET** `/api/fees-data/:id`

Get a specific record by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "sr": 1,
    "date": "2024-01-15",
    "academicYear": "2023-2024",
    ...
  }
}
```

### 4. Get Statistics

**GET** `/api/fees-data/stats`

Get overall statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRecords": 500000,
    "totalPaidAmount": 125000000.5,
    "totalDueAmount": 15000000.0
  }
}
```

### 5. Delete Record

**DELETE** `/api/fees-data/:id`

Delete a specific record.

**Response:**

```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

## 📝 CSV File Format

Your CSV file must include these columns (header row required):

```csv
sr,date,academic_year,session,alloted_category,voucher_type,voucher_no,roll_no,admno_uniqueid,status,fee_category,faculty,program,department,batch,receipt_no,fee_head,due_amount,paid_amount,concession_amount,scholarship_amount,reverse_concession_amount,write_off_amount,adjusted_amount,refund_amount,fund_trancfer_amount,remarks
```

**Sample CSV:**

```csv
sr,date,academic_year,session,alloted_category,voucher_type,voucher_no,roll_no,admno_uniqueid,status,fee_category,faculty,program,department,batch,receipt_no,fee_head,due_amount,paid_amount,concession_amount,scholarship_amount,reverse_concession_amount,write_off_amount,adjusted_amount,refund_amount,fund_trancfer_amount,remarks
1,2024-01-15,2023-2024,Spring,General,Payment,V001,R001,ADM001,Active,Regular,Engineering,B.Tech,Computer Science,2023,RCP001,Tuition Fee,50000.00,50000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,Payment completed
```

## 🧪 Testing

### Using the Test Script

```bash
chmod +x test-csv-upload.sh
./test-csv-upload.sh
```

### Using cURL

```bash
# Upload CSV
curl -X POST http://localhost:3333/api/fees-data/upload \
  -F "csv_file=@sample_fees_data.csv"

# Get records
curl http://localhost:3333/api/fees-data?page=1&limit=10

# Get statistics
curl http://localhost:3333/api/fees-data/stats

# Get single record
curl http://localhost:3333/api/fees-data/1

# Delete record
curl -X DELETE http://localhost:3333/api/fees-data/1
```

### Using Postman

Import the collection: `Fees_Data_API.postman_collection.json`

## ⚡ Performance

### For a 250MB CSV file (~500,000 rows):

- **Processing Time:** 2-5 minutes
- **Memory Usage:** ~100-200MB (constant)
- **Batch Size:** 2000 rows per batch
- **Database Load:** Moderate

### Optimization Tips

1. **Increase MySQL packet size:**

   ```sql
   SET GLOBAL max_allowed_packet=536870912; -- 512MB
   ```

2. **Optimize for bulk inserts:**

   ```sql
   SET GLOBAL innodb_buffer_pool_size=2147483648; -- 2GB
   SET GLOBAL innodb_log_file_size=536870912; -- 512MB
   ```

3. **Add to `my.cnf` or `my.ini`:**
   ```ini
   [mysqld]
   max_allowed_packet=512M
   innodb_buffer_pool_size=2G
   innodb_log_file_size=512M
   ```

## 🛠️ Tech Stack

- **Framework:** AdonisJS v6
- **Database:** MySQL 8.0
- **ORM:** Lucid ORM
- **CSV Parser:** csv-parse
- **Validation:** VineJS
- **Language:** TypeScript

## 📁 Project Structure

```
adonis-app/
├── app/
│   ├── controllers/
│   │   └── fees_data_controller.ts    # Main controller
│   ├── models/
│   │   └── fees_datum.ts               # Fees data model
│   └── validators/
│       └── fees_data_upload.ts         # Upload validator
├── database/
│   └── migrations/
│       └── *_create_fees_data_table.ts # Database schema
├── start/
│   └── routes.ts                       # API routes
├── config/
│   ├── bodyparser.ts                   # File upload config
│   └── database.ts                     # Database config
├── sample_fees_data.csv                # Sample CSV file
├── test-csv-upload.sh                  # Test script
└── README.md                           # This file
```

## 🐛 Troubleshooting

### Issue: "File too large"

**Solution:** Increase limit in `config/bodyparser.ts`:

```typescript
multipart: {
  limit: '500mb',
}
```

### Issue: "Data too long for column"

**Solution:** Column sizes have been increased. If still occurring, run:

```bash
node ace migration:run
```

### Issue: "Out of memory"

**Solution:**

- Reduce batch size in controller (from 2000 to 1000)
- Increase Node.js memory: `node --max-old-space-size=4096 ace serve`

### Issue: "Database connection timeout"

**Solution:**

```sql
SET GLOBAL wait_timeout=28800;
SET GLOBAL interactive_timeout=28800;
```

## 📚 Documentation

- [Detailed API Documentation](README_CSV_UPLOAD.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [AdonisJS Documentation](https://docs.adonisjs.com)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## 👤 Author

**Amit Rajput**

- GitHub: [@amitrajput270](https://github.com/amitrajput270)

## 🙏 Acknowledgments

- AdonisJS Team for the amazing framework
- csv-parse library for efficient CSV processing
- Community contributors

---

**Note:** This application is designed to handle large CSV files efficiently. For files larger than 300MB, consider splitting them into smaller chunks or contact support for enterprise solutions.
