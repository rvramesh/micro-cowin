using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWin.Common;
using MicroWin.IdService;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace MicroWin.Authorization
{
    [Route("api/authorization/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private static readonly string[] EmptyRole = new string[0];
        private static readonly string[] AdminAcceptedTermsRole = new string[] { "Admin", "AcceptedTerms" };
        private static readonly string[] MemberAcceptedTermsRole = new string[] { "Member", "AcceptedTerms" };
        private readonly UserRepo userRepo;
        private readonly IdRepo idRepo;
        private readonly TelegramTokenValidator tokenValidator;
        private readonly AdminUserNamesProvider adminUserNameProvider;
        private readonly AuthJwtTokenHandler authJwtTokenHandler;
        public UserController(TelegramTokenValidator tokenValidator,
            AdminUserNamesProvider adminUserNameProvider,
            AuthJwtTokenHandler authJwtTokenHandler,
            UserRepo userRepo,
            IdRepo idRepo)
        {
            this.userRepo = userRepo;
            this.idRepo = idRepo;
            this.tokenValidator = tokenValidator;
            this.adminUserNameProvider = adminUserNameProvider;
            this.authJwtTokenHandler = authJwtTokenHandler;
        }

        [HttpPost("getToken")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthorizationUserResponse>> GetToken(AuthorizationUserRequest request)
        {
            var fields = request.ToSortedDictionary();
            var isValid = tokenValidator.CheckAuthorization(fields);
            var token = string.Empty;

            var roles = EmptyRole;
            if (isValid)
            {
                (token, roles) = GetTokenAndRoles(request.Id);
            }
            return await Task.FromResult(new AuthorizationUserResponse(isValid, null, roles, token));
        }

        private (string Token, string[] Roles) GetTokenAndRoles(long id)
        {
            string[] roles = EmptyRole;
            string token = string.Empty;
            var user = userRepo.Get(id);
            if (user != null)
            {
                if (user.IsAdmin)
                {
                    roles = AdminAcceptedTermsRole;
                }
                else
                {
                    roles = MemberAcceptedTermsRole;
                }
                token = authJwtTokenHandler.GetJwtToken(id, user.UserName, user.FirstName, user.LastName, user.UnitIdentifier, roles);
            }
            else
            {
                token = authJwtTokenHandler.GetJwtToken(id, roles);
            }
            return (token, roles);
        }

        public record AcceptTermsRequest (string FirstName, string LastName, string UserName, string UnitId);

        [HttpPost("acceptTerms")]
        [Authorize]
        public async Task<ActionResult> AcceptTerms(AcceptTermsRequest input)
        {
            string id = base.User.Claims.SingleOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            bool isUnitValid = idRepo.Get(input.UnitId).Count() == 1;
            long userId;
            if (isUnitValid && long.TryParse(id, out userId))
            {
                this.userRepo.Insert(new UserModel()
                {
                    TelegramId = userId,
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    TermsAcceptedUtc = DateTime.UtcNow,
                    UnitIdentifier = input.UnitId,
                    UserName = input.UserName,
                    IsAdmin = adminUserNameProvider.IsAdmin(input.UserName)
                });
                return await Task.FromResult(Ok());
            }
            return NoContent();

        }
    }
}