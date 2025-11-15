import vine from '@vinejs/vine'

/**
 * Validator for CSV file upload
 */
export const feesDataUploadValidator = vine.compile(
    vine.object({
        csv_file: vine
            .file({
                size: '300mb', // Allow up to 300MB
                extnames: ['csv'],
            })
            .optional(),
    })
)