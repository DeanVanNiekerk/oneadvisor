using System;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationEdit
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }

        public OneAdvisor.Model.Directory.Model.Organisation.Configuration.Config Config { get; set; }
    }
}