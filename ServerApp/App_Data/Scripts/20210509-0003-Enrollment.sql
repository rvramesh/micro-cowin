CREATE TABLE Enrollment(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(100) NOT NULL,
    Yob INT NOT NULL,
    ScheduleFrom DATETIME NOT NULL,
    ScheduledBy INT NOT NULL,
    Unit varchar(100) NOT NULL,
    Status varchar(1) CHECK(Status = "E" OR Status = "W" OR Status = "V" OR Status="S"),
    InviteCount INT DEFAULT 0,
    LastUpdatedAt DATETIME,
    LastUpdatedBy INT
);

CREATE INDEX idx_vax_schedulefrom ON Enrollment(ScheduleFrom);
CREATE INDEX idx_vax_unit ON Enrollment(Unit);
CREATE INDEX idx_vax_scheduledBy ON Enrollment(ScheduledBy);
