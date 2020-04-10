using System;

namespace OneAdvisor.Model.Storage.Model.Path.Directory
{
    public class OrganisationLogoFileQuery : FileQueryBase
    {
        public OrganisationLogoFileQuery(Guid organisationId, string storageName)
            : base(new OrganisationLogoDirectoryPath(organisationId), storageName)
        { }
    }
}