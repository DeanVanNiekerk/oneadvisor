using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLogItems
    {
        public AuditLogItems()
        {
            //Defaults
            Items = new List<AuditLog>();
            Limit = 0;
        }

        public List<AuditLog> Items { get; set; }
        public int Limit { get; set; }

        public bool LimitReached
        {
            get { return Items.Count >= Limit; }
        }

    }
}