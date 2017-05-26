CREATE TABLE IF NOT EXISTS boards (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL
);
--CREATE INDEX owner_index on boards (owner);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER NOT NULL PRIMARY KEY,
    tag TEXT,
    board_id INTEGER NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id)
);
--CREATE INDEX board_id_index on tags (board_id);

CREATE TABLE IF NOT EXISTS paths (
    id INTEGER NOT NULL PRIMARY KEY,
    color INTEGER NOT NULL,
    width INTEGER NOT NULL,
    board_id INTEGER NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id)
);
--CREATE INDEX board_id_index on paths (board_id);

CREATE TABLE IF NOT EXISTS points (
    id INTEGER NOT NULL PRIMARY KEY,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    path_id INTEGER NOT NULL,
    FOREIGN KEY (path_id) REFERENCES paths(id)
);
--CREATE INDEX path_id_index on points (path_id);
