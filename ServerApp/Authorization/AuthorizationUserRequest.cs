using System;

namespace MicroWin.Authorization
{
    public record AuthorizationUserRequest(long Auth_date,
string First_name,
string Hash,
long Id,
string Last_name,
string Username);
}