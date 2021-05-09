using System;
using System.Data;
using System.IO;
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
            var fileName = new SqliteConnectionStringBuilder(connectionString).DataSource;
            if(!File.Exists(fileName)) {
                File.WriteAllBytes(fileName, new byte[0]);
            }
            _connectionString = connectionString;
        }

        public IDbConnection CreateConnection()
        {
            var x = new SqliteConnection(_connectionString);
          
            return x;
        }
    }
}