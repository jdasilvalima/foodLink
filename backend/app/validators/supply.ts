import vine from '@vinejs/vine'

export const createSupplyValidator = vine.compile(
  vine.object({
    number: vine.string().trim().minLength(1).maxLength(50),
    name: vine.string().trim().minLength(1).maxLength(255),
    unitType: vine.string().trim().minLength(1).maxLength(50),
    unitsPerPackage: vine.number().positive(),
    type: vine.string().trim().minLength(1).maxLength(50),
  })
)
