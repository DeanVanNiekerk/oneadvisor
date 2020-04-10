using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path.Directory
{
    public class OrganisationLogoDirectoryPath : DirectoryPathBase
    {
        public OrganisationLogoDirectoryPath(Guid organisationId)
        {
            OrganisationId = organisationId;
        }

        public Guid OrganisationId { get; private set; }

        public override string GetContainerName()
        {
            return OrganisationId.ToString();
        }

        public override string GetDirectoryPath()
        {
            var paths = new List<string>() { "directory", "logos" };
            return Join(paths);
        }
    }
}