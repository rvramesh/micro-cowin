Create Table ID_VALS (
    VAL VARCHAR(100) NOT NULL UNIQUE
);

CREATE UNIQUE INDEX idx_id_val ON ID_VALS(VAL);