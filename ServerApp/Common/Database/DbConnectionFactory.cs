using System;
using System.Data;
using Microsoft.Data.Sqlite;

namespace MicroWin.Common.Database
{
    /// <summary>
    /// Register a single instance using whatever DI system you like.
    /// </summary>
    public class DbConnectionFactory
    {
        private readonly string _connectionString;

        public DbConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            return new SqliteConnection(_connectionString);
        }
    }
}