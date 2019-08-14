using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Lookup
{
    public class UserType
    {
        public static readonly Guid BROKER = new Guid("70a67bcf-f8d3-8fe7-9c3e-b4b8b9bf9cc8");

        public Guid? Id { get; set; }
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
    }
}