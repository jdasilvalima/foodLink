import vine from '@vinejs/vine'

export const createIngredientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).unique({
      table: 'ingredients',
      column: 'name',
    }),
  })
)
