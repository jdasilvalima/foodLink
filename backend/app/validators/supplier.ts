import vine from '@vinejs/vine'

export const createSupplierValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().email().unique({ table: 'suppliers', column: 'email' }),
    phoneNumber: vine.string().trim().minLength(10).maxLength(20),
  })
)
