using System;
using System.Collections.Generic;
using OneAdvisor.Model.Client.Model.Client;

namespace OneAdvisor.Model.Client.Model.Client.Merge
{
    public class MergeClients
    {
        public MergeClients()
        {
            SourceClientIds = new List<Guid>();
        }

        public ClientEdit TargetClient { get; set; }
        public List<Guid> SourceClientIds { get; set; }
    }
}