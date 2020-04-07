using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationEdit
    {
        public OrganisationEdit()
        {
            ApplicationIds = new List<Guid>();
            Config = new OneAdvisor.Model.Directory.Model.Organisation.Configuration.Config();
        }

        public Guid? Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Guid> ApplicationIds { get; set; }
        public OneAdvisor.Model.Directory.Model.Organisation.Configuration.Config Config { get; set; }
    }
}