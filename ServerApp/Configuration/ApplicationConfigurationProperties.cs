using System;
using System.Collections.Generic;
using EnrollmentStatusMasterData = MicroWin.EnrollmentService.EnrollmentStatus;

namespace MicroWin.Configuration
{
    public class ApplicationConfigurationProperties
    {
        public ApplicationConfigurationProperties(Dictionary<int, string> vaccines)
        {
            this.OrganizingBodyName = AppEnvironment.OrganizingBodyName;
            this.OrganizingBodyMemberName=AppEnvironment.OrganizingBodyMemberName;
            this.OrganizingBodyFaqUrl = AppEnvironment.OrganizingBodyFaqUrl;
            this.SourceUrl = AppEnvironment.SourceUrl;
            this.IdentifierName = AppEnvironment.IdentifierName;
            this.MaxYear = AppEnvironment.MinYear;
            this.MinYear = AppEnvironment.MaxYear;
            this.Vaccines = vaccines;
            this.EnrollmentStatus = EnrollmentStatusMasterData.StatusMap;
            this.MaxEnrollmentPerUnit = 8;
        }
        public string OrganizingBodyName { get; init; }
        public string OrganizingBodyMemberName { get; init; }
        public string OrganizingBodyFaqUrl { get; init; }
        public string SourceUrl { get; init; }
        public string IdentifierName { get; init; }
       
        public int MinYear {get;init;}
        public int MaxYear{get;init;}

        public Dictionary<int, string> Vaccines {get;init;}
        public Dictionary<char, string> EnrollmentStatus { get; init; }
        public int MaxEnrollmentPerUnit { get; init; }
    }
}