using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class Organisation
    {
        public Organisation()
        {
            ApplicationIds = new List<Guid>();
        }

        public Guid? Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Guid> ApplicationIds { get; set; }

        public OneAdvisor.Model.Directory.Model.Organisation.Configuration.Config Config { get; set; }

    }
}