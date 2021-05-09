using System;

namespace MicroWin.Configuration
{
    public class ApplicationConfigurationProperties
    {
        public ApplicationConfigurationProperties()
        {
            this.OrganizingBodyName = AppEnvironment.OrganizingBodyName;
            this.OrganizingBodyMemberName=AppEnvironment.OrganizingBodyMemberName;
            this.OrganizingBodyFaqUrl = AppEnvironment.OrganizingBodyFaqUrl;
            this.SourceUrl = AppEnvironment.SourceUrl;
            this.IdentifierName = AppEnvironment.IdentifierName;
            this.MinYear = AppEnvironment.MinYear;
            this.MaxYear = AppEnvironment.MaxYear;
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