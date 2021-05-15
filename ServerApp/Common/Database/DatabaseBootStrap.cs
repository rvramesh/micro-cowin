using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MicroWin.Common.Database
{
    public interface IDatabaseBootstrap
    {
        void Setup();
    }



    public class DatabaseBootstrap : IDatabaseBootstrap
    {
        private readonly DbConnectionFactory connectionFactory;
        private readonly IHostEnvironment env;

        public DatabaseBootstrap(DbConnectionFactory connectionFactory, IHostEnvironment env
        )
        {
            this.connectionFactory = connectionFactory;
            this.env = env;
        }

        
        private readonly string MIGRATION_INSERT_SCRIPT = @"INSERT INTO MigrationScripts (Name, ExecutionDate) VALUES (@Name, datetime('now', 'utc'))";
        public void Setup()
        {
            using var connection = connectionFactory.CreateConnection();

            var path = Path.Combine(env.ContentRootPath, "App_Data", "Scripts");

            IEnumerable<string> executedScripts = new string[0];
            // check if the migrations table exists, otherwise execute the first script (which creates that table) 
            if (connection.ExecuteScalar<int>(@"SELECT count(1) FROM sqlite_master WHERE type='table' AND name = 'MigrationScripts'") != 0)
            {
                executedScripts = connection.Query<string>("SELECT Name FROM MigrationScripts");
            }

            // Get all scripts from the filesystem 
            Directory.GetFiles(path)
                    // strip out the extensions 
                    .Select(Path.GetFileNameWithoutExtension)
                    // filter the ones that have already been executed 
                    .Where(fileName => !executedScripts.Contains(fileName))
                    // Order by the date in the filename 
                    .OrderBy(fileName => DateTime.ParseExact(fileName.Substring(0, 13), "yyyyMMdd-HHmm", null))
                    .ToList()
                    .ForEach(script =>
                    {
                        try
                        {
                            Console.WriteLine($"Processing {script}");
                        // Execute each one of the scripts 
                        connection.Execute(GetSql(path,script));
                        }
                        catch (SqliteException ex){
                           throw new Exception($"Error executing {script}", ex);
                        }
                        // record that it was executed in the migrationscripts table 
                        connection.Execute(MIGRATION_INSERT_SCRIPT,
                                                 new { Name = script });
                    });
        }

        static string GetSql(string path, string fileName) =>
                     File.ReadAllText(Path.Combine(path,$"{fileName}.sql"));
       
    }
}