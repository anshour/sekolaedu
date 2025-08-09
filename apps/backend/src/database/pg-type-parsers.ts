import pg from "pg";

pg.types.setTypeParser(20, (val) => parseInt(val, 10)); // BIGINT
pg.types.setTypeParser(23, (val) => parseInt(val, 10)); // INTEGER
