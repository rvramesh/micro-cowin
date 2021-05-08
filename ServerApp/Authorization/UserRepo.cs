using System;
using System.Collections.Generic;
using Dapper;
using Dapper.Contrib.Extensions;
using MicroWin.Common.Database;

namespace MicroWin.Authorization
{
    /// <summary>
    /// Generally, in a properly normalized database, your repos wouldn't map to a single table,
    /// but be an aggregate of data from several tables.
    /// </summary>
    public class UserRepo
    {
        private readonly DbConnectionFactory _connectionFactory;

        public UserRepo(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public UserModel Get(long id)
        {
            // Allow connection pooling to worry about connection lifetime, that's its job.
            using (var con = _connectionFactory.CreateConnection())
            {
                return con.QuerySingleOrDefault<UserModel>("SELECT * FROM Users WHERE TelegramId = @id", new { id = id });
            }
        }

        public long Insert(UserModel user)
        {
            // Allow connection pooling to worry about connection lifetime, that's its job.
            using (var con = _connectionFactory.CreateConnection())
            {
                return con.Insert<UserModel>(user);
            }
        }

        internal void AcceptTerms(long telegramId, string unitId)
        {
            // Allow connection pooling to worry about connection lifetime, that's its job.
            using (var con = _connectionFactory.CreateConnection())
            {
                con.Execute("UPDATE Users SET UnitIdentifier = @unitId, TermsAcceptedDate=@time WHERE TelegramId = @id", new { id = telegramId, unitId=@unitId, @time=DateTime.UtcNow });
            }
            return;
        }
    }
}