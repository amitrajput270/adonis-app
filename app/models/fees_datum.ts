import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FeesDatum extends BaseModel {
  static table = 'fees_data'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sr: number | null

  @column.date()
  declare date: DateTime | null

  @column({ columnName: 'academic_year' })
  declare academicYear: string | null

  @column()
  declare session: string | null

  @column({ columnName: 'alloted_category' })
  declare allotedCategory: string | null

  @column({ columnName: 'voucher_type' })
  declare voucherType: string | null

  @column({ columnName: 'voucher_no' })
  declare voucherNo: string | null

  @column({ columnName: 'roll_no' })
  declare rollNo: string | null

  @column({ columnName: 'admno_uniqueid' })
  declare admnoUniqueid: string | null

  @column()
  declare status: string | null

  @column({ columnName: 'fee_category' })
  declare feeCategory: string | null

  @column()
  declare faculty: string | null

  @column()
  declare program: string | null

  @column()
  declare department: string | null

  @column()
  declare batch: string | null

  @column({ columnName: 'receipt_no' })
  declare receiptNo: string | null

  @column({ columnName: 'fee_head' })
  declare feeHead: string | null

  @column({ columnName: 'due_amount' })
  declare dueAmount: number | null

  @column({ columnName: 'paid_amount' })
  declare paidAmount: number | null

  @column({ columnName: 'concession_amount' })
  declare concessionAmount: number | null

  @column({ columnName: 'scholarship_amount' })
  declare scholarshipAmount: number | null

  @column({ columnName: 'reverse_concession_amount' })
  declare reverseConcessionAmount: number | null

  @column({ columnName: 'write_off_amount' })
  declare writeOffAmount: number | null

  @column({ columnName: 'adjusted_amount' })
  declare adjustedAmount: number | null

  @column({ columnName: 'refund_amount' })
  declare refundAmount: number | null

  @column({ columnName: 'fund_trancfer_amount' })
  declare fundTrancferAmount: number | null

  @column()
  declare remarks: string | null
}