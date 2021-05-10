using System;
using System.Linq;
using System.Collections.Generic;
using Dapper;
using MicroWin.Common.Database;
using Dapper.Contrib.Extensions;

namespace MicroWin.EnrollmentService
{
    public class EnrollmentRepo
    {
        private readonly DbConnectionFactory _connectionFactory;

        private const string ModelCols = "Enrollment.Id, Enrollment.Name,Enrollment.Yob,Enrollment.ScheduleFrom,Enrollment.ScheduledBy,Enrollment.Unit,Enrollment.Status,Enrollment.InviteCount,Enrollment.LastUpdatedBy,Enrollment.LastUpdatedDate";
        public EnrollmentRepo(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public IEnumerable<EnrollmentModel> GetByScheduler(long telegramUserId)
        {
            using (var con = _connectionFactory.CreateConnection())
            {
                var enrollments = new Dictionary<long, EnrollmentModel>();
                const string sql = "SELECT " + ModelCols + ",Vax_Pref.VaxId FROM Enrollment INNER JOIN Vax_Pref ON Enrollment.Id = Vax_Pref.Id WHERE Enrollment.ScheduledBy=@userId";

                con.Query<EnrollmentModel, VaccinePreferenceModel, EnrollmentModel>(
                    sql,
                    (enrollment, preference) =>
                    {
                        if (!enrollments.ContainsKey(enrollment.Id))
                        {
                            enrollments.Add(enrollment.Id, enrollment);
                        }

                        EnrollmentModel cachedEnrollment = enrollments[enrollment.Id];
                        IList<int> children = cachedEnrollment.VaccinesPreference;
                        children.Add(preference.VaccineId);
                        return cachedEnrollment;
                    },
                    new { userId = telegramUserId });

                return enrollments.Values;
            }
        }

        public int GetCountByUnit(string unit)
        {
            using (var con = _connectionFactory.CreateConnection())
            {
                return con.ExecuteScalar<int>("SELECT COUNT(1) FROM Enrollment Where Unit = '@unit'", new { unit = unit });
            }
        }

        internal EnrollmentModel Get(long id)
        {
            using (var con = _connectionFactory.CreateConnection())
            {
                var enrollments = new Dictionary<long, EnrollmentModel>();
                const string sql = "SELECT " + ModelCols + ",Vax_Pref.VaxId FROM Enrollment INNER JOIN Vax_Pref ON Enrollment.Id = Vax_Pref.Id WHERE Enrollment.Id=@id";

                con.Query<EnrollmentModel, VaccinePreferenceModel, EnrollmentModel>(
                    sql,
                    (enrollment, preference) =>
                    {
                        if (!enrollments.ContainsKey(enrollment.Id))
                        {
                            enrollments.Add(enrollment.Id, enrollment);
                        }

                        EnrollmentModel cachedEnrollment = enrollments[enrollment.Id];
                        IList<int> children = cachedEnrollment.VaccinesPreference;
                        children.Add(preference.VaccineId);
                        return cachedEnrollment;
                    },
                    new { id = id });

                return enrollments.Values.ElementAtOrDefault(0);
            }
        }

        public IEnumerable<long> Enroll(string unit, long telegramId,
           IEnumerable<EnrollmentModel> entries)
        {
            List<long> newIds = new List<long>();
            using (var con = _connectionFactory.CreateConnection())
            {
                var transaction = con.BeginTransaction();
                try
                {
                    foreach (var entry in entries)
                    {
                        long id = con.Insert<EnrollmentModel>(entry);
                        newIds.Add(id);
                        foreach (var vaxPref in entry.VaccinesPreference)
                        {
                            VaccinePreferenceModel vaxPrefModel = new VaccinePreferenceModel();
                            vaxPrefModel.EnrollmentId = id;
                            vaxPrefModel.VaccineId = vaxPref;
                            con.Insert(vaxPrefModel);
                        }
                    }
                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
            return newIds;
        }

        internal bool UpdateEnrollment(string unit, long telegramId, EnrollmentModel model)
        {
            using (var con = _connectionFactory.CreateConnection())
            {
                var transaction = con.BeginTransaction();
                try
                {
                    bool result = con.Update(model, transaction);
                    con.Query("DELETE FROM Vax_Pref WHERE EnrollmentId=@enrollmentId", new
                    {
                        enrollmentId = model.Id
                    }, transaction);
                    foreach (var vaxPref in model.VaccinesPreference)
                    {
                        VaccinePreferenceModel vaxPrefModel = new VaccinePreferenceModel();
                        vaxPrefModel.EnrollmentId = model.Id;
                        vaxPrefModel.VaccineId = vaxPref;
                        con.Insert(vaxPrefModel, transaction);
                    }
                    transaction.Commit();
                    return result;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }

            }
        }
    }
}