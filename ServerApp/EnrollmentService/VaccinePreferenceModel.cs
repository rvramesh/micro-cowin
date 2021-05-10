using System;
using System.Collections.Generic;

namespace MicroWin.EnrollmentService
{
    public class VaccinePreferenceModel
    {
        public long EnrollmentId {get;set;}
        public int VaccineId {get;set;}

        public int Priority {get;set;}
        public bool IsTaken {get;set;}
    }
}