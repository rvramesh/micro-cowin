using System;
using System.Collections.Generic;

namespace MicroWin.Authorization
{
    public class AdminUserNamesProvider
    {
        public SortedSet<string> AdminUserNames { get; init; }
        public AdminUserNamesProvider(string[] adminUserNames)
        {
            this.AdminUserNames = new SortedSet<string>(adminUserNames);
        }

        public bool IsAdmin(string userName) {
            return this.AdminUserNames.Contains(userName);
        }
    }
}