using Microsoft.AspNetCore.Mvc;
using MicroWin.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MicroWin.Authorization
{
    [Route("api/authorization/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private static readonly string[] AdminRole = new string[] {"Admin"};
        private static readonly string[] MemberRole = new string[] { "Member" };

        private readonly TelegramTokenValidator tokenValidator;
        private readonly AdminUserNamesProvider adminUserNameProvider;
        public UserController(TelegramTokenValidator tokenValidator, AdminUserNamesProvider adminUserNameProvider){
            this.tokenValidator = tokenValidator;
            this.adminUserNameProvider = adminUserNameProvider;
        }
        [HttpPost("getToken")]
        public async Task<ActionResult<AuthorizationUserResponse>> GetToken(AuthorizationUserRequest request)
        {
            var fields = new SortedDictionary<string, string>();
            fields.Add("auth_date", request.Auth_date.ToString());
            fields.Add("first_name", request.First_name);
            fields.Add("hash", request.Hash);
            fields.Add("id", request.Id.ToString());
            fields.Add("last_name", request.Last_name);
            fields.Add("username", request.Username);
            var isValid = tokenValidator.CheckAuthorization(fields);
            return await Task.FromResult(new AuthorizationUserResponse(isValid,null, adminUserNameProvider.IsAdmin(request.Username) ? AdminRole : MemberRole , null));
        }
    }
}