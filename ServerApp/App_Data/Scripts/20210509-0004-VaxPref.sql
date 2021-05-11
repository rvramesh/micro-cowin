DROP TABLE Vax_Pref;

CREATE TABLE Vax_Pref (
    EnrollmentId BIGINT NOT NULL,
    VaxId SMALLINT NOT NULL,
    Priority SMALLINT NOT NULL,
    IsTaken boolean,
    PRIMARY KEY (EnrollmentId, IsTaken)
);

CREATE INDEX idx_vaxpref_enrollmentid ON Vax_Pref(EnrollmentId);

CREATE INDEX idx_vaxpref_vaxid ON Vax_Pref(VaxId);
