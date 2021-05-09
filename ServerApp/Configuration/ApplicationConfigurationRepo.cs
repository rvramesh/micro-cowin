using System.Threading;
using Dapper;
using MicroWin.Common.Database;
using System.Linq;
using System.Collections.Generic;

namespace MicroWin.Configuration
{

    public class ApplicationConfigurationRepo
    {
        private ApplicationConfigurationProperties properties;

        private ReaderWriterLockSlim cacheLock = new ReaderWriterLockSlim();
        
        private readonly DbConnectionFactory _connectionFactory;

        public ApplicationConfigurationRepo(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public ApplicationConfigurationProperties Get()
        {
            cacheLock.EnterReadLock();
            try
            {
                return properties;
            }
            finally
            {
                cacheLock.ExitReadLock();
            }
        }

        public ApplicationConfigurationProperties Refresh() {
            cacheLock.EnterWriteLock();
            try {
                properties = new ApplicationConfigurationProperties(this.RefreshImpl());
                return properties;
            }
            finally
            {
                cacheLock.ExitWriteLock();
            }
        }

        public Dictionary<int, string> RefreshImpl(){
            using (var con = _connectionFactory.CreateConnection())
            {
                return con.Query("SELECT Id,Name FROM Vax").ToDictionary(item=>(int)item.Id, item=>item.Name as string);
            }
        }

    }
}