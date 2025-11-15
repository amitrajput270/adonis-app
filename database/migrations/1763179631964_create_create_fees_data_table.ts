import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees_data'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('sr').nullable()
      table.date('date').nullable()
      table.string('academic_year', 100).nullable()
      table.string('session', 100).nullable()
      table.string('alloted_category', 200).nullable()
      table.string('voucher_type', 100).nullable()
      table.string('voucher_no', 100).nullable()
      table.string('roll_no', 100).nullable()
      table.string('admno_uniqueid', 150).nullable()
      table.string('status', 100).nullable()
      table.string('fee_category', 200).nullable()
      table.string('faculty', 200).nullable()
      table.string('program', 255).nullable()
      table.string('department', 200).nullable()
      table.string('batch', 150).nullable()
      table.string('receipt_no', 150).nullable()
      table.string('fee_head', 200).nullable()
      table.decimal('due_amount', 12, 2).nullable()
      table.decimal('paid_amount', 12, 2).nullable()
      table.decimal('concession_amount', 12, 2).nullable()
      table.decimal('scholarship_amount', 12, 2).nullable()
      table.decimal('reverse_concession_amount', 12, 2).nullable()
      table.decimal('write_off_amount', 12, 2).nullable()
      table.decimal('adjusted_amount', 12, 2).nullable()
      table.decimal('refund_amount', 12, 2).nullable()
      table.decimal('fund_trancfer_amount', 12, 2).nullable()
      table.text('remarks').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}