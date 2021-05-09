using System;
using System.Collections.Generic;
using Dapper;
using MicroWin.Common.Database;
using Dapper.Contrib.Extensions;

namespace MicroWin.EnrollmentService
{
    public class EnrollmentRepo
    {
        private readonly DbConnectionFactory _connectionFactory;

        public EnrollmentRepo(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public IEnumerable<EnrollmentModel> GetByScheduler(long telegramUserId)
        {
            using (var con = _connectionFactory.CreateConnection())
            {
                var enrollments = new Dictionary<int, EnrollmentModel>();
                const string sql = "SELECT Enrollment.Id,Enrollment.Name,Enrollment.Yob,Enrollment.ScheduleFrom,Enrollment.ScheduledBy,Enrollment.Unit,Enrollment.Status,Enrollment.InviteCount,Vax_Pref.VaxId FROM Enrollment INNER JOIN Vax_Pref ON Enrollment.Id = Vax_Pref.Id WHERE Enrollment.ScheduledBy=@userId";

                Dictionary<long, EnrollmentModel> cache = new Dictionary<long, EnrollmentModel>();
                con.Query<EnrollmentModel, VaccinePreferenceModel, EnrollmentModel>(
                    sql,
                    (enrollment, preference) =>
                    {
                        if (!cache.ContainsKey(enrollment.Id))
                        {
                            cache.Add(enrollment.Id, enrollment);
                        }

                        EnrollmentModel cachedParent = cache[enrollment.Id];
                        IList<int> children = cachedParent.VaccinesPreference;
                        children.Add(preference.VaccineId);
                        return cachedParent;
                    },
                    new { userId = telegramUserId });

                return cache.Values;
            }
        }

        public IEnumerable<long> Enroll(string unit, long telegramId,
            (string name, int yob, DateTime scheduleFrom, int[] vaxIdPref)[] entries)
        {
            List<long> newIds = new List<long>();
            using (var con = _connectionFactory.CreateConnection())
            {
                foreach (var entry in entries)
                {
                    EnrollmentModel model = new EnrollmentModel();
                    model.Name = entry.name;
                    model.Yob = entry.yob;
                    model.ScheduleFrom = entry.scheduleFrom;
                    model.ScheduledBy = telegramId;
                    model.Unit = unit;
                    model.Status = 'E';
                    model.InviteCount = 0;
                    long id = con.Insert<EnrollmentModel>(model);
                    newIds.Add(id);
                    foreach (var vaxPref in entry.vaxIdPref)
                    {
                        VaccinePreferenceModel vaxPrefModel = new VaccinePreferenceModel();
                        vaxPrefModel.EnrollmentId = id;
                        vaxPrefModel.VaccineId = vaxPref;
                        con.Insert(vaxPrefModel);
                    }

                }
            }
            return newIds;
        }

    }
}