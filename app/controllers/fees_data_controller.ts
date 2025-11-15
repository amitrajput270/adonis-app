import type { HttpContext } from '@adonisjs/core/http'
import FeesDatum from '#models/fees_datum'
import { feesDataUploadValidator } from '#validators/fees_data_upload'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'

export default class FeesDataController {
    /**
     * Upload and process large CSV file with streaming
     */
    async upload({ request, response }: HttpContext) {
        let filePath: string | null = null

        try {
            // Validate the uploaded file
            const { csv_file } = await request.validateUsing(feesDataUploadValidator)

            if (!csv_file) {
                return response.badRequest({
                    success: false,
                    message: 'CSV file is required',
                })
            }

            // Move the file to a temporary location
            const fileName = `${Date.now()}-${csv_file.clientName}`
            await csv_file.move(app.tmpPath('uploads'), {
                name: fileName,
                overwrite: true,
            })

            if (!csv_file.fileName) {
                return response.badRequest({
                    success: false,
                    message: 'Failed to process CSV file',
                })
            }

            filePath = app.tmpPath('uploads', csv_file.fileName)
            let processedRows = 0
            let failedRows = 0
            const batchSize = 2000 // Process in batches of 1000 rows
            let batch: any[] = []

            // Create a promise to handle the streaming
            await new Promise((resolve, reject) => {
                const stream = createReadStream(filePath!)
                const parser = parse({
                    columns: true, // Use first row as column names
                    skip_empty_lines: true,
                    trim: true,
                    bom: true, // Handle BOM in UTF-8 files
                })

                stream.pipe(parser)

                parser.on('data', async (row) => {
                    try {
                        // Pause the stream while processing
                        parser.pause()

                        // Map CSV columns to database columns (use snake_case for raw DB insert)
                        const feesData = {
                            sr: row.sr ? parseInt(row.sr) : null,
                            date: row.date || null,
                            academic_year: row.academic_year || null,
                            session: row.session || null,
                            alloted_category: row.alloted_category || null,
                            voucher_type: row.voucher_type || null,
                            voucher_no: row.voucher_no || null,
                            roll_no: row.roll_no || null,
                            admno_uniqueid: row.admno_uniqueid || null,
                            status: row.status || null,
                            fee_category: row.fee_category || null,
                            faculty: row.faculty || null,
                            program: row.program || null,
                            department: row.department || null,
                            batch: row.batch || null,
                            receipt_no: row.receipt_no || null,
                            fee_head: row.fee_head || null,
                            due_amount: row.due_amount ? parseFloat(row.due_amount) : null,
                            paid_amount: row.paid_amount ? parseFloat(row.paid_amount) : null,
                            concession_amount: row.concession_amount ? parseFloat(row.concession_amount) : null,
                            scholarship_amount: row.scholarship_amount ? parseFloat(row.scholarship_amount) : null,
                            reverse_concession_amount: row.reverse_concession_amount
                                ? parseFloat(row.reverse_concession_amount)
                                : null,
                            write_off_amount: row.write_off_amount ? parseFloat(row.write_off_amount) : null,
                            adjusted_amount: row.adjusted_amount ? parseFloat(row.adjusted_amount) : null,
                            refund_amount: row.refund_amount ? parseFloat(row.refund_amount) : null,
                            fund_trancfer_amount: row.fund_trancfer_amount
                                ? parseFloat(row.fund_trancfer_amount)
                                : null,
                            remarks: row.remarks || null,
                        }
                        batch.push(feesData)

                        // When batch is full, insert into database
                        if (batch.length >= batchSize) {
                            try {
                                await db.table('fees_data').multiInsert(batch)
                                processedRows += batch.length
                                batch = []
                            } catch (error) {
                                console.error('Batch insert error:', error)
                                failedRows += batch.length
                                batch = []
                            }
                        }

                        // Resume the stream
                        parser.resume()
                    } catch (error) {
                        console.error('Row processing error:', error)
                        failedRows++
                        parser.resume()
                    }
                })

                parser.on('end', async () => {
                    // Insert any remaining rows in the batch
                    if (batch.length > 0) {
                        try {
                            await db.table('fees_data').multiInsert(batch)
                            processedRows += batch.length
                        } catch (error) {
                            console.error('Final batch insert error:', error)
                            failedRows += batch.length
                        }
                    }
                    resolve(true)
                })

                parser.on('error', (error) => {
                    console.error('CSV parsing error:', error)
                    reject(error)
                })

                stream.on('error', (error) => {
                    console.error('File reading error:', error)
                    reject(error)
                })
            })

            // Clean up the temporary file after processing
            if (filePath) {
                try {
                    await unlink(filePath)
                } catch (unlinkError) {
                    console.error('Failed to delete temp file:', unlinkError)
                }
            }

            return response.ok({
                success: true,
                message: 'CSV file processed successfully',
                data: {
                    processedRows,
                    failedRows,
                    totalRows: processedRows + failedRows,
                },
            })
        } catch (error) {
            console.error('Upload error:', error)
            // Clean up the temporary file on error
            if (filePath) {
                try {
                    await unlink(filePath)
                } catch (unlinkError) {
                    console.error('Failed to delete temp file:', unlinkError)
                }
            }

            return response.internalServerError({
                success: false,
                message: 'Failed to process CSV file',
                error: error.message,
            })
        }
    }

    /**
     * Get paginated fees data
     */
    async index({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 20)

        const feesData = await FeesDatum.query().paginate(page, limit)

        return response.ok({
            success: true,
            data: feesData,
        })
    }

    /**
     * Get single fees data record
     */
    async show({ params, response }: HttpContext) {
        const feesData = await FeesDatum.find(params.id)

        if (!feesData) {
            return response.notFound({
                success: false,
                message: 'Record not found',
            })
        }

        return response.ok({
            success: true,
            data: feesData,
        })
    }

    /**
     * Delete fees data record
     */
    async destroy({ params, response }: HttpContext) {
        const feesData = await FeesDatum.find(params.id)

        if (!feesData) {
            return response.notFound({
                success: false,
                message: 'Record not found',
            })
        }

        await feesData.delete()

        return response.ok({
            success: true,
            message: 'Record deleted successfully',
        })
    }

    /**
     * Get statistics about fees data
     */
    async stats({ response }: HttpContext) {
        const totalRecords = await FeesDatum.query().count('* as total')
        const totalPaidAmount = await FeesDatum.query().sum('paid_amount as total')
        const totalDueAmount = await FeesDatum.query().sum('due_amount as total')

        return response.ok({
            success: true,
            data: {
                totalRecords: totalRecords[0].$extras.total,
                totalPaidAmount: totalPaidAmount[0].$extras.total || 0,
                totalDueAmount: totalDueAmount[0].$extras.total || 0,
            },
        })
    }
}
