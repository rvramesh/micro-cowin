using System;
using System.Collections.Generic;
using Dapper.Contrib.Extensions;

namespace MicroWin.EnrollmentService
{
    public class EnrollmentModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int Yob { get; set; }
        public DateTime ScheduleFrom { get; set; }
        public long ScheduledBy {get;set;}
        public string Unit { get; set; }
        public char Status { get; set; }
        public int InviteCount { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public long LastUpdatedBy { get; set; }

        [Write(false)]
        public IList<int> VaccinesPreference {get;set;}
    }

}