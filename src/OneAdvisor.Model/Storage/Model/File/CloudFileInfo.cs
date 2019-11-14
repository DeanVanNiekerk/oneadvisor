using System;

namespace OneAdvisor.Model.Storage.Model.File
{
    public class CloudFileInfo
    {
        public string Name { get; set; }
        public string StorageName { get; set; }
        public string Url { get; set; }
        public long Size { get; set; }
        public string ContentType { get; set; }
        public bool Deleted { get; set; }
        public DateTimeOffset? Created { get; set; }
        public DateTimeOffset? LastModified { get; set; }
    }
}