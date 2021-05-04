using System;

namespace MicroWin.Authorization
{
    public record AuthorizationUserResponse(bool IsAuthenticated, int? SessionTimeInMins, string[] Roles, string JwtToken);
}