CREATE TABLE Vax_Pref (
    EnrollmentId BIGINT NOT NULL,
    VaxId SMALLINT NOT NULL,
    Priority SMALLINT NOT NULL,
    Status SMALLINT CHECK(
        Status = 0
        OR Status = 1
        OR Status = 2
        OR Status = 3
    ),
    AppointmentDate DATETIME,
    PRIMARY KEY (EnrollmentId, VaxId)
);
-- 0 default, 1- invited, 2-confirmed, 3-taken
CREATE INDEX idx_vaxpref_enrollmentid ON Vax_Pref(EnrollmentId);

CREATE INDEX idx_vaxpref_vaxid ON Vax_Pref(VaxId);