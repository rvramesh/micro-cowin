using System;
using System.Collections.Generic;
using Dapper.Contrib.Extensions;

namespace MicroWin.EnrollmentService
{
    [Table("Vax_Pref")]
    public class VaccinePreferenceModel
    {
        public long EnrollmentId {get;set;}
        
        public int VaxId {get;set;}

        public int Priority {get;set;}
        public short Status {get;set;}
    }
}