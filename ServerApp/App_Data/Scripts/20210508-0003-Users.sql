Create Table Users (
    TelegramId BIGINT PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL UNIQUE,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    UnitIdentifier VARCHAR(100) NOT NULL,
    TermsAcceptedUtc DATETIME NOT NULL,
    IsAdmin BOOLEAN
);

CREATE UNIQUE INDEX idx_username ON Users(UserName);
