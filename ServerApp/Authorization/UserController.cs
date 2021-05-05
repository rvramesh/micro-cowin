using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MicroWin.Common;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly AuthJwtTokenHandler authJwtTokenHandler;
        public UserController(TelegramTokenValidator tokenValidator, AdminUserNamesProvider adminUserNameProvider,
            AuthJwtTokenHandler authJwtTokenHandler){
            this.tokenValidator = tokenValidator;
            this.adminUserNameProvider = adminUserNameProvider;
            this.authJwtTokenHandler = authJwtTokenHandler;
        }

        [HttpPost("getToken")]
        public async Task<ActionResult<AuthorizationUserResponse>> GetToken(AuthorizationUserRequest request)
        {
            var fields = request.ToSortedDictionary();
            var isValid = tokenValidator.CheckAuthorization(fields);
            var token = string.Empty;
            var roles = adminUserNameProvider.IsAdmin(request.Username) ? AdminRole : MemberRole;
            if(isValid) { 
                token = authJwtTokenHandler.GetJwtToken(request.Id,request.Username,roles);
            }
            return await Task.FromResult(new AuthorizationUserResponse(isValid,null, roles, token));
        }
    }
}