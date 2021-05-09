using System;

namespace MicroWin.Configuration
{
    public class ApplicationConfigurationProperties
    {
        public ApplicationConfigurationProperties()
        {
            this.OrganizingBodyName = Environment.GetEnvironmentVariable("ORGANIZING_BODY_NAME");
            this.OrganizingBodyMemberName=Environment.GetEnvironmentVariable("ORGANIZING_BODY_MEMBERS_NAME");
            this.OrganizingBodyFaqUrl = Environment.GetEnvironmentVariable("ORGANIZING_BODY_FAQ_URL");
            this.SourceUrl = Environment.GetEnvironmentVariable("SOURCE_URL");
            this.IdentifierName = Environment.GetEnvironmentVariable("IDENTIFIER_NAME");
            this.MinYear = Convert.ToInt32(Environment.GetEnvironmentVariable("MIN_YEAR"));
            this.MaxYear = Convert.ToInt32(Environment.GetEnvironmentVariable("MAX_YEAR"));
        }
        public string OrganizingBodyName { get; init; }
        public string OrganizingBodyMemberName { get; init; }
        public string OrganizingBodyFaqUrl { get; init; }
        public string SourceUrl { get; init; }
        public string IdentifierName { get; init; }
       
        public int MinYear {get;init;}
        public int MaxYear{get;init;}
    }
}