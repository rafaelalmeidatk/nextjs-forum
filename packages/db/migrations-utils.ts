import { ColumnDefinitionBuilder, sql } from 'kysely'

// varchar(20) would probably be enough but I want to be extra sure this won't break
export const SnowflakeDataType = 'varchar(40)'
export const UuidDataType = sql`binary(16)`

export const uuidColumnBuilder = (col: ColumnDefinitionBuilder) =>
  col.primaryKey().defaultTo(sql`(uuid_to_bin(uuid()))`)
