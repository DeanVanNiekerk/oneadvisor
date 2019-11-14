using System;

namespace OneAdvisor.Model.Directory.Model.ChangeLog
{
    public class ChangeLog
    {
        public Guid? Id { get; set; }
        public string VersionNumber { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public bool Published { get; set; }
        public string Log { get; set; }
    }
}