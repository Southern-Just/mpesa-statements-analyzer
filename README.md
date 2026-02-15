# Mpesa-Statements-Analyzer
An aide for the cloud that is preparing, analysed mpesa transactions

User uploads PDF (form action)
        ↓
Server Action receives file + password
        ↓
Job pushed to internal queue
        ↓
Background worker processes statement
        ↓
Result stored (DB / file / cache)
        ↓
UI subscribes / refreshes to show parsed data


## integration with savings-systeme

1️⃣ tempFileManager.ts

2️⃣ enqueue.ts + worker.ts

3️⃣ Server Action wiring

4️⃣ unlockPdf.ts


<!-- mpesa-parser/
│
├── app/
│   ├── upload/
│   │   ├── page.tsx
│   │   └── actions.ts       
│
├── server/
│   ├── queue/
│   │   ├── enqueue.ts
│   │   └── worker.ts
│   │
│   ├── temp-files/
│   │   └── tempFileManager.ts
│   │
│   ├── pipeline/
│   │   ├── unlockPdf.ts
│   │   ├── rasterizePdf.ts
│   │   ├── normalizeImage.ts
│   │   ├── runOcr.ts
│   │   ├── detectLayout.ts
│   │   ├── extractTransactions.ts
│   │   └── validateLedger.ts
│
├── types/
│   └── mpesa.ts
│
└── data/ -->

install execa
