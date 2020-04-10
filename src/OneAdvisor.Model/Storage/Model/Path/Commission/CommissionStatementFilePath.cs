using System;

namespace OneAdvisor.Model.Storage.Model.Path.Commission
{
    public class CommissionStatementFilePath : FilePathBase
    {
        public CommissionStatementFilePath(Guid organisationId, Guid commissionStatementId, string fileName)
            : base(new CommissionStatementDirectoryPath(organisationId, commissionStatementId))
        {
            MetaData.Add(METADATA_FILENAME, fileName);
        }
    }
}