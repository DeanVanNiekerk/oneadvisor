using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path.Commission
{
    public class CommissionStatementDirectoryPath : DirectoryPathBase
    {
        public CommissionStatementDirectoryPath(Guid organisationId, Guid commissionStatementId)
        {
            OrganisationId = organisationId;
            CommissionStatementId = commissionStatementId;
        }

        public Guid OrganisationId { get; private set; }
        public Guid CommissionStatementId { get; private set; }

        public override string GetContainerName()
        {
            return OrganisationId.ToString();
        }

        public override string GetDirectoryPath()
        {
            var paths = new List<string>() { "commission", "statements", CommissionStatementId.ToString() };
            return Join(paths);
        }
    }
}