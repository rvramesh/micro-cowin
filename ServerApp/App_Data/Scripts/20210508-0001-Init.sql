CREATE TABLE MigrationScripts (
    Name VARCHAR(100) NOT NULL UNIQUE,
    ExecutionDate DATETIME NOT NULL
);