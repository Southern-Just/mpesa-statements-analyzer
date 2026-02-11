"use client"
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const exampleReports = [
  { name: 'Monthly Report', dateRange: 'Jan 2023', pdfUrl: '/sample-reports/report1.pdf' },
  { name: 'Quarterly Summary', dateRange: 'Q1 2023', pdfUrl: '/sample-reports/report2.pdf' },
  { name: 'Annual Overview', dateRange: '2022', pdfUrl: '/sample-reports/report3.pdf' },
  { name: 'Transaction Log', dateRange: 'Feb 2023', pdfUrl: '/sample-reports/report4.pdf' },
  { name: 'Expense Breakdown', dateRange: 'Mar 2023', pdfUrl: '/sample-reports/report5.pdf' },
  { name: 'Income Analysis', dateRange: 'Apr 2023', pdfUrl: '/sample-reports/report6.pdf' },
]

export default function Reports() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Your Reports</h1>
      <p className="text-gray-500">No reports generated yet. Upload a statement to get started.</p>
      <div className="flex gap-4 mt-6">
        {exampleReports.map((report, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-gray-600 rounded-lg">
            <div className="w-14 h-14 overflow-hidden rounded border">
              <Document file={report.pdfUrl}>
                <Page pageNumber={1} width={80} />
              </Document>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-800">{report.name}</h3>
            <p className="text-xs text-gray-500">{report.dateRange}</p>
          </div>
        ))}
      </div>
    </div>
  )
}