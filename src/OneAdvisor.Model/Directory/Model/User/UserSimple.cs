using System;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserSimple
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid BranchId { get; set; }
        public Guid UserTypeId { get; set; }
        public string FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }
    }
}