import vine from '@vinejs/vine'

export const createUnitOfMeasureValidator = vine.compile(
  vine.object({
    unit: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(50)
      .unique({ table: 'unit_of_measures', column: 'unit' }),
    description: vine.string().trim().minLength(1).maxLength(255),
    isActive: vine.boolean().optional(),
  })
)

export const updateUnitOfMeasureValidator = (unitId: number) =>
  vine.compile(
    vine.object({
      unit: vine
        .string()
        .trim()
        .minLength(1)
        .maxLength(50)
        .unique({
          table: 'unit_of_measures',
          column: 'unit',
          whereNot: { id: unitId },
        }),
      description: vine.string().trim().minLength(1).maxLength(255),
      isActive: vine.boolean().optional(),
    })
  )
