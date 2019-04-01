using System;
using System.Collections.Generic;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Data.Entities.Directory;

namespace OneAdvisor.Data
{
    public class SeedData
    {
        public static readonly Guid dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
        public static readonly Guid cltGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
        public static readonly Guid comGuid = Guid.Parse("2fca4500-9142-4940-aaf4-b18925c96d66");

        public static readonly Guid policyTypeInv = Guid.Parse("a98bb718-4acb-4fad-afe9-5fbba00203b9");
        public static readonly Guid policyTypeLife = Guid.Parse("f3d877b4-1800-4711-8cc9-35169f8bd60b");
        public static readonly Guid policyTypeShort = Guid.Parse("a90a5869-4da5-4cce-8973-9a8194c2bdcb");
        public static readonly Guid policyTypeMed = Guid.Parse("023107f5-97a6-456d-9182-7bbda72ca82a");
        public static readonly Guid policyTypeRewards = Guid.Parse("3d991459-2043-46b9-9357-5446a993b81d");

        public static readonly Guid earningsMonthAn = Guid.Parse("8b42edc0-fac6-e946-c779-9d90a805c294");
        public static readonly Guid earningsAnnualAn = Guid.Parse("e8799015-6f4a-5d45-5be9-0fcd516e0951");
        public static readonly Guid earningsLife = Guid.Parse("e7f98561-f018-3edd-2118-e3646c89e2a2");
        public static readonly Guid earningsOnceOff = Guid.Parse("9f8fc29d-0f1c-b952-d446-79cc3ed967d7");

        public static List<ApplicationEntity> GetApplications()
        {
            var list = new List<ApplicationEntity>();

            list.Add(new ApplicationEntity() { Id = dirGuid, Name = "Directory" });
            list.Add(new ApplicationEntity() { Id = cltGuid, Name = "Client" });
            list.Add(new ApplicationEntity() { Id = comGuid, Name = "Commission" });

            return list;
        }

        public static List<MarritalStatusEntity> GetMarritalStatus()
        {
            var list = new List<MarritalStatusEntity>();

            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("77fa3769-7775-4cdd-b5d4-8b526b2d894c"), Name = "Single" });
            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("5f7a5d69-845c-4f8d-b108-7c70084f3f6a"), Name = "Married COP" });
            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("b31331ec-73cb-4985-aa93-e60e04a48095"), Name = "Married ANC" });
            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f"), Name = "Married ANC (with Accrual)" });
            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("e4f03497-5dbf-4bd0-bc14-660a3969f011"), Name = "Widowed" });
            list.Add(new MarritalStatusEntity() { Id = Guid.Parse("91ebd765-bd8b-4908-94dc-00f09fe37ca7"), Name = "Divorced" });

            return list;
        }

        public static List<ClientTypeEntity> GetClientTypes()
        {
            var individual = Guid.Parse("27bb22b3-4c3d-41a3-48bf-690a98f8f780");
            var company = Guid.Parse("295565bf-7485-85f1-6c98-947ab0b7770c");
            var trust = Guid.Parse("55f6c0ef-ae2c-faac-adff-ea3bd269043f");

            var list = new List<ClientTypeEntity>();

            list.Add(new ClientTypeEntity() { Id = individual, Name = "Individual", Code = "individual", DisplayOrder = 1 });
            list.Add(new ClientTypeEntity() { Id = company, Name = "Company", Code = "company", DisplayOrder = 2 });
            list.Add(new ClientTypeEntity() { Id = trust, Name = "Trust", Code = "trust", DisplayOrder = 3 });

            return list;
        }

        public static List<CommissionEarningsTypeEntity> GetCommissionEarningsTypes()
        {
            var list = new List<CommissionEarningsTypeEntity>();

            list.Add(new CommissionEarningsTypeEntity() { Id = earningsMonthAn, Name = "Monthly Annuity" });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsAnnualAn, Name = "Annual Annuity" });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsLife, Name = "Life 1st Years" });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsOnceOff, Name = "Once Off Commissions" });

            return list;
        }

        public static List<PolicyTypeEntity> GetPolicyTypes()
        {
            var list = new List<PolicyTypeEntity>();

            list.Add(new PolicyTypeEntity() { Id = policyTypeInv, Name = "Investment", Code = "investment" });
            list.Add(new PolicyTypeEntity() { Id = policyTypeLife, Name = "Life Insurance", Code = "life_insurance" });
            list.Add(new PolicyTypeEntity() { Id = policyTypeShort, Name = "Short Term Insurance", Code = "short_term" });
            list.Add(new PolicyTypeEntity() { Id = policyTypeMed, Name = "Medical Cover", Code = "medical_cover" });
            list.Add(new PolicyTypeEntity() { Id = policyTypeRewards, Name = "Rewards Program", Code = "rewards" });

            return list;
        }

        public static List<ContactTypeEntity> GetContactTypes()
        {
            var list = new List<ContactTypeEntity>();

            list.Add(new ContactTypeEntity() { Id = Guid.Parse("d6349e22-3e27-404a-8584-58e420510834"), Name = "Cellphone Number" });
            list.Add(new ContactTypeEntity() { Id = Guid.Parse("b3c261d0-4e1d-4dd8-b944-6d6afd1795e0"), Name = "Email Address" });

            return list;
        }

        public static List<UseCaseEntity> GetUseCases()
        {
            var list = new List<UseCaseEntity>();

            //Directory Use Cases
            list.Add(new UseCaseEntity() { Id = "dir_view_users", Name = "View Users", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_edit_users", Name = "Edit Users", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_organisations", Name = "View Organisations", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_edit_organisations", Name = "Edit Organisations", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_branches", Name = "View Branches", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_edit_branches", Name = "Edit Branches", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_roles", Name = "View Roles", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_edit_roles", Name = "Edit Roles", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_applications", Name = "View Applications", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_usecases", Name = "View UseCases", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_view_audit_logs", Name = "View Audit Logs", ApplicationId = dirGuid });

            //Directory - Lookup Use Cases
            list.Add(new UseCaseEntity() { Id = "dir_view_lookups", Name = "View Lookups", ApplicationId = dirGuid });
            list.Add(new UseCaseEntity() { Id = "dir_edit_lookups", Name = "Edit Lookups", ApplicationId = dirGuid });

            //Client Use Cases
            list.Add(new UseCaseEntity() { Id = "clt_view_clients", Name = "View Clients", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_edit_clients", Name = "Edit Clients", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_view_policies", Name = "View Policies", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_edit_policies", Name = "Edit Policies", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_view_contacts", Name = "View Contacts", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_edit_contacts", Name = "Edit Contacts", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_import_clients", Name = "Import Clients", ApplicationId = cltGuid });
            list.Add(new UseCaseEntity() { Id = "clt_export_clients", Name = "Export Clients", ApplicationId = cltGuid });

            //Commission Use Cases
            list.Add(new UseCaseEntity() { Id = "com_import_commissions", Name = "Import Commissions", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_view_commissions", Name = "View Commissions", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_edit_commissions", Name = "Edit Commissions", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_view_commission_statements", Name = "View Commission Statements", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_edit_commission_statements", Name = "Edit Commission Statements", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_view_commission_statement_templates", Name = "View Commission Statement Templates", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_edit_commission_statement_templates", Name = "Edit Commission Statement Templates", ApplicationId = comGuid });
            list.Add(new UseCaseEntity() { Id = "com_view_report_client_revenue", Name = "View Commission Client Revenue Report", ApplicationId = comGuid });

            return list;
        }

    }
}