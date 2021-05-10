using System.Collections.Generic;

namespace MicroWin.EnrollmentService
{
    public static class EnrollmentStatus
    {
        public static readonly char Enrolled = 'E';
        public static readonly char Withdrawn = 'W';
        public static readonly char Vaccinated = 'V';
        public static readonly char Scheduled = 'S';

        public static readonly Dictionary<char,string> StatusMap = new Dictionary<char, string>(){
             {Enrolled,"Enrolled"},
             {Withdrawn,"Withdrawn"},
             {Vaccinated,"Vaccinated"},
             {Scheduled,"Scheduled"}
        };
    }
}