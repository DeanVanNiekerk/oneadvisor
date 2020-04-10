using System;

namespace OneAdvisor.Model.Storage.Model.Path.Directory
{
    public class OrganisationLogoFilePath : FilePathBase
    {
        public OrganisationLogoFilePath(Guid organisationId, string fileName)
            : base(new OrganisationLogoDirectoryPath(organisationId))
        {
            MetaData.Add(METADATA_FILENAME, fileName);
        }
    }
}