using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Storage.Model.Path.Commission
{
    public class CommissionStatementPath : PathBase
    {
        public CommissionStatementPath(Guid organisationId, Guid commissionStatementId)
            : this(organisationId, commissionStatementId, string.Empty)
        {
        }

        public CommissionStatementPath(Guid organisationId, Guid commissionStatementId, string fileName)
            : base(fileName)
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

        public override string GetFilePath()
        {
            var paths = new List<string>() { GetDirectoryPath(), Guid.NewGuid().ToString() };
            return Join(paths);
        }

        public override string GetDirectoryPath()
        {
            var paths = new List<string>() { "commission", "statements", CommissionStatementId.ToString() };
            return Join(paths);
        }
    }
}