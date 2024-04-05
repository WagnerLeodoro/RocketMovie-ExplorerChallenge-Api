exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table.text('avatar').nullable()
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('users')
}
