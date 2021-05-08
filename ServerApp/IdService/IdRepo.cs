using System.Collections.Generic;
using Dapper;
using Dapper.Contrib.Extensions;
using MicroWin.Common.Database;

namespace MicroWin.IdService {
    /// <summary>
    /// Generally, in a properly normalized database, your repos wouldn't map to a single table,
    /// but be an aggregate of data from several tables.
    /// </summary>
    public class IdRepo
    {
        private readonly DbConnectionFactory _connectionFactory;

        public IdRepo(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public IEnumerable<string> Get(string query)
        {
            // Allow connection pooling to worry about connection lifetime, that's its job.
            using (var con = _connectionFactory.CreateConnection())
            {
                return con.Query<string>("SELECT VAL FROM ID_VALS WHERE VAL LIKE @search LIMIT 10",new {search = $"%{query}%"});
            }
        }

        
    }
}