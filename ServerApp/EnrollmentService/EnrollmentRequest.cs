using System;
using System.Collections.Generic;
using Dapper.Contrib.Extensions;

namespace MicroWin.EnrollmentService
{
    public record EnrollmentRequest (string Name, int Yob, DateTime ScheduleFrom, int[] VaxIds);
}