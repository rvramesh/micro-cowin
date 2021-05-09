using System;

public static class AppEnvironment
{
    public static string OrganizingBodyName => Environment.GetEnvironmentVariable("ORGANIZING_BODY_NAME");
    public static string OrganizingBodyMemberName => Environment.GetEnvironmentVariable("ORGANIZING_BODY_MEMBERS_NAME");
    public static string OrganizingBodyFaqUrl => Environment.GetEnvironmentVariable("ORGANIZING_BODY_FAQ_URL");
    public static string SourceUrl => Environment.GetEnvironmentVariable("SOURCE_URL");
    public static string IdentifierName => Environment.GetEnvironmentVariable("IDENTIFIER_NAME");
    public static int MinYear => Convert.ToInt32(Environment.GetEnvironmentVariable("MIN_YEAR"));
    public static int MaxYear => Convert.ToInt32(Environment.GetEnvironmentVariable("MAX_YEAR"));

    public static string BotToken => System.Environment.GetEnvironmentVariable("BOT_TOKEN");
    public static string BotId => System.Environment.GetEnvironmentVariable("BOT_ID");
    public static string[] AdminUserNames => System.Environment.GetEnvironmentVariable("ADMIN_USERNAMES_PIPE_SEPERATED").Split("|");
}