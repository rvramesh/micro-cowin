using System;
using Dapper.Contrib.Extensions;

namespace MicroWin.Authorization
{
    [Table("Users")]
    public class UserModel
    {
        public long TelegramId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UnitIdentifier { get; set; }
        public DateTime TermsAcceptedUtc { get; set; }
        public bool IsAdmin {get;set;}
    }
}