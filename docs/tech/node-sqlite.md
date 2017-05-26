# NodeJS Sqlite3 notes

[NodeJS Sqlite3 docs](https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback)

## Setup and configuration

* `sqlite3.Database(filename, [mode], [callback(error)])`
   * `filename`: `path`, or `:memory:` for in memory db
   * `mode`, `sqlite3.OPEN_READONLY`, `sqlite3.OPEN_READWRITE`, `sqlite3.OPEN_CREATE`, default: `OPEN_READWRITE |
   OPEN_CREATE`
* `sqlite3.verbose()`, produce long stack traces (can't be disabled once enabled), captures stack trace each time a
   statement is issued otherwise without this errors come without a full stack trace.
* `Database.close([callback(error)])`
* `Database.configure(option, value)`
  * `trace` to set callback each time a SQL statement is executed with a rendering of the statement text (e.g. debug
  logging)
  * `profile` to set a callback each time a SQL statement is executed
  * `busyTimeout` to set timeout for a handler for `SQLITE_BUSY` errors, presumably the lib retries at this timeout

## Executing SQL

* param formatting: injects parameters into SQL `?` placeholders
  * `db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2)`
  * `db.run("UPDATE tbl SET name = ? WHERE id = ?", ["bar", 2])`
  * `db.run("UPDATE tbl SET name = $name WHERE id = $id", {
      $id: 2,
      $name: "bar"
  })`

### DB Commands

Most commands return the db object for chaining

* `Database.run(sql, [param, ...], [callback(error)])`
  * failure: `this` in `callback` refers to `stmt` object
  * success: `this` has following properties: `lastID` (last inserted row ID) and `changes` (number of rows affected)
* `Database.get(sql, [param, ...], [callback(error, row)])`, `callback` run with first result row or `undefined` if
  none is returned
* `Database.all(sql, [param, ...], [callback(error, rows)])`, `callback` run with all resulting rows, not suitable
   for large queries, use a combination of `each`, `prepare` and `get` instead.
* `Database.each(sql, [param, ...], [callback(error, row)], [complete(error, rowCount)])`
* `Database.exec(sql, [callback(error)])`, run arbitrary SQL command, (N.B SQL comments not supported)
* `Database.prepare(sql, [param, ...], [callback(error)])`, prepare statement (optionally) binding parameters. (used
  to execute multiple similar queries with high efficiency)

### Statement Commands

Most commands return the statement object for chaining

* `Statement.bind([param, ...], [callback(error)])`, bind parameters to the last prepared statement
* `Statement.reset([callback(error)])`, Resets row cursor of the statement preserving parameter bindings (use to
  re-execute the same query with the same bindings)
* `Statement.finalize([callback[error]])`, (optional), used to solve long delays before next query is being executed by
  explicitly finalizing the statement (e.g. when running an exclusive query)
* `Statement.run([param, ...], [callback(error)])`, bindings and row cursor of the statement are reset if even a
  *single* parameter is bound, statement can be run multiple times
* `Statement.get([param, ...], [callback(error, row)])`
* `Statement.all([param, ...], [callback(error, rows)])`
* `Statement.each([param, ...], [callback(error, row)], [complete(error, rowCount)])`
