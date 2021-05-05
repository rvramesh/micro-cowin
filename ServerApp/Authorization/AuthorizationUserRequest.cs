using System;
using System.Collections.Generic;

namespace MicroWin.Authorization
{
    public record AuthorizationUserRequest(long Auth_date,
string First_name,
string Hash,
long Id,
string Last_name,
string Username)
    {
        private static readonly string _AuthDate = "auth_date";
        private static readonly string _FirstName = "first_name";

        private static readonly string _LastName = "last_name";
        private static readonly string _Hash = "hash";
        private static readonly string _Id = "id";
        private static readonly string _Username = "username";


        public SortedDictionary<string, string> ToSortedDictionary()
        {
            var fields = new SortedDictionary<string, string>();
            fields.Add(_AuthDate, this.Auth_date.ToString());
            fields.Add(_FirstName, this.First_name);
            fields.Add(_Hash, this.Hash);
            fields.Add(_Id, this.Id.ToString());
            fields.Add(_LastName, this.Last_name);
            fields.Add(_Username, this.Username);
            return fields;
        }
    }
}