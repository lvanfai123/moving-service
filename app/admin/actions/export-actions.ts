"use server"

export async function exportData(
  dataType: "orders" | "users" | "partners" | "payments",
  format: "excel" | "csv",
  filters: Record<string, any> = {},
) {
  try {
    // 在實際應用中，這裡會處理數據導出
    // 但為了解決初始化錯誤，我們先返回一個模擬的成功響應
    return {
      success: true,
      fileName: `${dataType}_export_${new Date().toISOString().split("T")[0]}.${format}`,
      fileUrl: `/api/mock-export?type=${dataType}&format=${format}`,
    }
  } catch (error) {
    console.error("Export error:", error)
    return {
      success: false,
      error: "導出過程中發生錯誤",
    }
  }
}

// async function exportToExcel(data: any[], headers: { header: string; key: string }[], fileName: string) {
//   // 創建一個新的工作簿
//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Data")

//   // 設置列標題
//   worksheet.columns = headers

//   // 添加數據行
//   worksheet.addRows(data)

//   // 設置列寬
//   worksheet.columns.forEach((column) => {
//     let maxLength = 0
//     column.eachCell({ includeEmpty: true }, (cell) => {
//       const columnLength = cell.value ? cell.value.toString().length : 10
//       if (columnLength > maxLength) {
//         maxLength = columnLength
//       }
//     })
//     column.width = maxLength < 10 ? 10 : maxLength + 2
//   })

//   // 設置標題行樣式
//   worksheet.getRow(1).font = { bold: true }
//   worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" }

//   // 保存文件
//   const filePath = path.join(process.cwd(), "public", "exports", fileName)
//   await workbook.xlsx.writeFile(filePath)

//   return {
//     success: true,
//     fileName,
//     fileUrl: `/exports/${fileName}`,
//   }
// }

// async function exportToCsv(data: any[], headers: { header: string; key: string }[], fileName: string) {
//   const filePath = path.join(process.cwd(), "public", "exports", fileName)

//   // 設置CSV寫入器
//   const csvWriter = createObjectCsvWriter({
//     path: filePath,
//     header: headers.map((h) => ({ id: h.key, title: h.header })),
//     encoding: "utf8",
//   })

//   // 寫入數據
//   await csvWriter.writeRecords(data)

//   return {
//     success: true,
//     fileName,
//     fileUrl: `/exports/${fileName}`,
//   }
// }
