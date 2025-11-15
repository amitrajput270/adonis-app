import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees_data'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Increase varchar lengths for columns that might have longer data
      table.string('academic_year', 100).nullable().alter()
      table.string('session', 100).nullable().alter()
      table.string('alloted_category', 200).nullable().alter()
      table.string('voucher_type', 100).nullable().alter()
      table.string('voucher_no', 100).nullable().alter()
      table.string('roll_no', 100).nullable().alter()
      table.string('admno_uniqueid', 150).nullable().alter()
      table.string('status', 100).nullable().alter()
      table.string('fee_category', 200).nullable().alter()
      table.string('faculty', 200).nullable().alter()
      table.string('program', 255).nullable().alter()
      table.string('department', 200).nullable().alter()
      table.string('batch', 150).nullable().alter()
      table.string('receipt_no', 150).nullable().alter()
      table.string('fee_head', 200).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Revert to original sizes
      table.string('academic_year', 50).nullable().alter()
      table.string('session', 50).nullable().alter()
      table.string('alloted_category', 100).nullable().alter()
      table.string('voucher_type', 50).nullable().alter()
      table.string('voucher_no', 50).nullable().alter()
      table.string('roll_no', 50).nullable().alter()
      table.string('admno_uniqueid', 100).nullable().alter()
      table.string('status', 50).nullable().alter()
      table.string('fee_category', 100).nullable().alter()
      table.string('faculty', 100).nullable().alter()
      table.string('program', 100).nullable().alter()
      table.string('department', 100).nullable().alter()
      table.string('batch', 100).nullable().alter()
      table.string('receipt_no', 100).nullable().alter()
      table.string('fee_head', 100).nullable().alter()
    })
  }
}