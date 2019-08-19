using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationEdit
    {
        public OrganisationEdit()
        {
            OrganisationCompanyIds = new List<Guid>();
        }

        public Guid? Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Guid> OrganisationCompanyIds { get; set; }

    }
}