INSERT INTO boards (name, owner) VALUES ("testBoard", "willprice94");

INSERT INTO paths (board_id, color, width) VALUES (1, 0, 1);
INSERT INTO points (path_id, x, y) VALUES (1, 0, 0);
INSERT INTO points (path_id, x, y) VALUES (1, 500, 0);
INSERT INTO points (path_id, x, y) VALUES (1, 500, 500);
INSERT INTO points (path_id, x, y) VALUES (1, 0, 500);
INSERT INTO points (path_id, x, y) VALUES (1, 0, 0);

INSERT INTO paths (board_id, color, width) VALUES (1, 0, 5);
INSERT INTO points (path_id, x, y) VALUES (1, 250, 0);
INSERT INTO points (path_id, x, y) VALUES (1, 0, 150);
INSERT INTO points (path_id, x, y) VALUES (1, 400, 150);
INSERT INTO points (path_id, x, y) VALUES (1, 250, 0);

INSERT INTO tags (board_id, tag) VALUES (1, "testTag1");
INSERT INTO tags (board_id, tag) VALUES (1, "testTag2");
INSERT INTO tags (board_id, tag) VALUES (2, "testTag1");
INSERT INTO tags (board_id, tag) VALUES (2, "testTag3");
INSERT INTO tags (board_id, tag) VALUES (2, "testTag4");
