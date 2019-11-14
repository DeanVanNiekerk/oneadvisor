using System.IO;

namespace OneAdvisor.Model.Email.Model
{
    public class Attachment
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Data { get; set; }
    }
}