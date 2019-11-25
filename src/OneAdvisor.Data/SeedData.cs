using System;
using System.Collections.Generic;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Model.Directory.Model.Application;

namespace OneAdvisor.Data
{
    public class SeedData
    {
        public static List<ApplicationEntity> GetApplications()
        {
            var list = new List<ApplicationEntity>();

            list.Add(new ApplicationEntity() { Id = Application.DIRECTORY_ID, Name = "Directory" });
            list.Add(new ApplicationEntity() { Id = Application.CLIENT_ID, Name = "Client" });
            list.Add(new ApplicationEntity() { Id = Application.COMMISSION_ID, Name = "Commission" });

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
            var unknownEntity = Guid.Parse("bc0b4043-25cc-dbb6-cfd5-981557a10ca1");

            var list = new List<ClientTypeEntity>();

            list.Add(new ClientTypeEntity() { Id = individual, Name = "Individual", Code = "individual", DisplayOrder = 1 });
            list.Add(new ClientTypeEntity() { Id = company, Name = "Company", Code = "company", DisplayOrder = 2 });
            list.Add(new ClientTypeEntity() { Id = trust, Name = "Trust", Code = "trust", DisplayOrder = 3 });
            list.Add(new ClientTypeEntity() { Id = unknownEntity, Name = "Unknown Entity", Code = "unknown", DisplayOrder = 4 });

            return list;
        }

        public static readonly Guid earningsMonthAn = Guid.Parse("8b42edc0-fac6-e946-c779-9d90a805c294");
        public static readonly Guid earningsAnnualAn = Guid.Parse("e8799015-6f4a-5d45-5be9-0fcd516e0951");
        public static readonly Guid earningsLife = Guid.Parse("e7f98561-f018-3edd-2118-e3646c89e2a2");
        public static readonly Guid earningsOnceOff = Guid.Parse("9f8fc29d-0f1c-b952-d446-79cc3ed967d7");
        public static readonly Guid earningsUnknown = Guid.Parse("27ec936b-5db7-64b8-1a1b-5edb3b56a20d");

        public static List<CommissionEarningsTypeEntity> GetCommissionEarningsTypes()
        {
            var list = new List<CommissionEarningsTypeEntity>();

            list.Add(new CommissionEarningsTypeEntity() { Id = earningsMonthAn, Name = "Monthly Annuity", DisplayOrder = 0 });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsAnnualAn, Name = "Annual Annuity", DisplayOrder = 1 });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsLife, Name = "Life 1st Years", DisplayOrder = 2 });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsOnceOff, Name = "Once Off Commissions", DisplayOrder = 3 });
            list.Add(new CommissionEarningsTypeEntity() { Id = earningsUnknown, Name = "Unknown", DisplayOrder = 4 });

            return list;
        }


        public static readonly Guid policyTypeInv = Guid.Parse("a98bb718-4acb-4fad-afe9-5fbba00203b9");
        public static readonly Guid policyTypeLife = Guid.Parse("f3d877b4-1800-4711-8cc9-35169f8bd60b");
        public static readonly Guid policyTypeShort = Guid.Parse("a90a5869-4da5-4cce-8973-9a8194c2bdcb");
        public static readonly Guid policyTypeMed = Guid.Parse("023107f5-97a6-456d-9182-7bbda72ca82a");
        public static readonly Guid policyTypeRewards = Guid.Parse("3d991459-2043-46b9-9357-5446a993b81d");
        public static readonly Guid policyTypeGroupScheme = Guid.Parse("8fe8751f-c4f0-01c5-26bd-a92f918651d2");
        public static readonly Guid policyTypeUnknown = Guid.Parse("c498f023-a7c9-f6c3-e021-c265972a209c");
        public static List<PolicyTypeEntity> GetPolicyTypes()
        {
            var list = new List<PolicyTypeEntity>();

            list.Add(new PolicyTypeEntity() { Id = policyTypeInv, Name = "Investment", Code = "investment", DisplayOrder = 1 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeLife, Name = "Life Insurance", Code = "life_insurance", DisplayOrder = 2 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeShort, Name = "Short Term Insurance", Code = "short_term", DisplayOrder = 3 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeMed, Name = "Medical Cover", Code = "medical_cover", DisplayOrder = 4 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeRewards, Name = "Rewards Program", Code = "rewards", DisplayOrder = 5 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeGroupScheme, Name = "Group scheme", Code = "group_scheme", DisplayOrder = 6 });
            list.Add(new PolicyTypeEntity() { Id = policyTypeUnknown, Name = "Unknown", Code = "unknown", DisplayOrder = 7 });

            return list;
        }

        //Medical Cover
        public static readonly Guid policyProductTypeMedicalAid = Guid.Parse("95b24f26-5d16-0289-ea4d-754603c3e950");
        public static readonly Guid policyProductTypeGapCover = Guid.Parse("f6db6be4-2672-7063-6920-ae95a0130b73");
        public static readonly Guid policyProductTypeAddMedSavings = Guid.Parse("0269860e-a5ab-7912-e65a-539c124d5593");

        //Life Insurance
        public static readonly Guid policyProductTypeLifeInsBen = Guid.Parse("178c71d8-f378-fc92-6347-149108b4f24f");

        //Investment
        public static readonly Guid policyProductTypeUnitTrust = Guid.Parse("0c55f316-f446-a8f8-488c-ac1eb587a9c9");
        public static readonly Guid policyProductTypeEndowment = Guid.Parse("3b7ccd1e-44b5-d81e-b6b4-18c56c1c077f");
        public static readonly Guid policyProductTypeTaxFree = Guid.Parse("62007d95-7d61-4182-b998-9ffb4c5fda0b");
        public static readonly Guid policyProductTypePreservationPension = Guid.Parse("4df79496-16cd-9375-eb86-3cbcd8eb47fc");
        public static readonly Guid policyProductTypePreservationProvident = Guid.Parse("5541cf6c-50ef-5fcd-f584-6673a125c817");
        public static readonly Guid policyProductTypeRA = Guid.Parse("273e862c-abd5-ac36-3bb7-31ea2e18cb9d");

        //Short Term Insurance
        public static readonly Guid policyProductTypePersonalCover = Guid.Parse("062d7233-f743-9e5a-8c07-d5580bfa11a4");
        public static readonly Guid policyProductTypeCommercialCover = Guid.Parse("67c1d0a3-b5b4-3c23-4256-4e79266f5378");

        //Group Scheme
        public static readonly Guid policyProductTypePension = Guid.Parse("a202bce5-8e20-a795-1a38-c93b0cfd41ac");
        public static readonly Guid policyProductTypeProvident = Guid.Parse("988d7de4-1760-f6e8-b9c2-c68e4d95e7e2");
        public static readonly Guid policyProductTypeRisk = Guid.Parse("bdb36139-07a5-13aa-7431-128329c3bb28");

        //Rewards
        public static readonly Guid policyProductTypeRewards = Guid.Parse("da086441-91a9-6e5e-5ad6-3167b2076329");


        public static List<PolicyProductTypeEntity> GetPolicyProductTypes()
        {
            var list = new List<PolicyProductTypeEntity>();

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeMedicalAid, Name = "Medical Aid", Code = "med_medical_aid", PolicyTypeId = policyTypeMed });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeGapCover, Name = "Gap Cover", Code = "med_gap_cover", PolicyTypeId = policyTypeMed });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeAddMedSavings, Name = "Extra Medical Savings", Code = "med_add_medical_savings", PolicyTypeId = policyTypeMed });

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeLifeInsBen, Name = "Life Insurance", Code = "life_life_insurance", PolicyTypeId = policyTypeLife });

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeUnitTrust, Name = "Unit Trust", Code = "inv_unit_trust", PolicyTypeId = policyTypeInv });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeEndowment, Name = "Endowment", Code = "inv_endowment", PolicyTypeId = policyTypeInv });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeTaxFree, Name = "Tax Free Savings", Code = "inv_tax_free", PolicyTypeId = policyTypeInv });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypePreservationPension, Name = "Preservation Pension", Code = "inv_preservation_pension", PolicyTypeId = policyTypeInv });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypePreservationProvident, Name = "Preservation Provident", Code = "inv_preservation_provident", PolicyTypeId = policyTypeInv });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeRA, Name = "Retirement Annuity", Code = "inv_retirement_annuity", PolicyTypeId = policyTypeInv });

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypePersonalCover, Name = "Personal Lines", Code = "short_personal_lines", PolicyTypeId = policyTypeShort });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeCommercialCover, Name = "Commercial Lines", Code = "short_commercial_lines", PolicyTypeId = policyTypeShort });

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeRewards, Name = "Rewards Program", Code = "rewards_rewards_program", PolicyTypeId = policyTypeRewards });

            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypePension, Name = "Pension Fund", Code = "group_scheme_pension", PolicyTypeId = policyTypeGroupScheme });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeProvident, Name = "Provident Fund", Code = "group_scheme_provident", PolicyTypeId = policyTypeGroupScheme });
            list.Add(new PolicyProductTypeEntity() { Id = policyProductTypeRisk, Name = "Group Risk", Code = "group_scheme_risk", PolicyTypeId = policyTypeGroupScheme });

            return list;
        }

        public static List<ContactTypeEntity> GetContactTypes()
        {
            var list = new List<ContactTypeEntity>();

            list.Add(new ContactTypeEntity() { Id = Guid.Parse("d6349e22-3e27-404a-8584-58e420510834"), Name = "Cellphone Number" });
            list.Add(new ContactTypeEntity() { Id = Guid.Parse("b3c261d0-4e1d-4dd8-b944-6d6afd1795e0"), Name = "Email Address" });

            return list;
        }

        public static List<UserTypeEntity> GetUserTypes()
        {
            var list = new List<UserTypeEntity>();

            list.Add(new UserTypeEntity() { Id = Guid.Parse("70a67bcf-f8d3-8fe7-9c3e-b4b8b9bf9cc8"), Name = "Broker", DisplayOrder = 1 });
            list.Add(new UserTypeEntity() { Id = Guid.Parse("442f9050-bde4-9aa6-75f5-a9a7e5f84a5c"), Name = "Admin", DisplayOrder = 2 });
            list.Add(new UserTypeEntity() { Id = Guid.Parse("d3155541-8b53-64d7-343e-57d6e5c959db"), Name = "Support", DisplayOrder = 3 });

            return list;
        }

        public static List<UseCaseEntity> GetUseCases()
        {
            var list = new List<UseCaseEntity>();

            //Directory Use Cases
            list.Add(new UseCaseEntity() { Id = "dir_view_users", Name = "View Users", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_edit_users", Name = "Edit Users", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_view_organisations", Name = "View Organisations", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_edit_organisations", Name = "Edit Organisations", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_view_branches", Name = "View Branches", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_edit_branches", Name = "Edit Branches", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_view_roles", Name = "View Roles", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_edit_roles", Name = "Edit Roles", ApplicationId = Application.DIRECTORY_ID });
            list.Add(new UseCaseEntity() { Id = "dir_view_audit_logs", Name = "View Audit Logs", ApplicationId = Application.DIRECTORY_ID });

            //Client Use Cases
            list.Add(new UseCaseEntity() { Id = "clt_view_clients", Name = "View Clients", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_edit_clients", Name = "Edit Clients", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_view_policies", Name = "View Policies", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_edit_policies", Name = "Edit Policies", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_view_contacts", Name = "View Contacts", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_edit_contacts", Name = "Edit Contacts", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_import_clients", Name = "Import Clients", ApplicationId = Application.CLIENT_ID });
            list.Add(new UseCaseEntity() { Id = "clt_export_clients", Name = "Export Clients", ApplicationId = Application.CLIENT_ID });

            //Commission Use Cases
            list.Add(new UseCaseEntity() { Id = "com_import_commissions", Name = "Import Commissions", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_commissions", Name = "View Commissions", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_edit_commissions", Name = "Edit Commissions", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_commission_statements", Name = "View Commission Statements", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_edit_commission_statements", Name = "Edit Commission Statements", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_report_client_revenue", Name = "View Commission Client Revenue Report", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_commission_allocations", Name = "View Commission Allocations", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_edit_commission_allocations", Name = "Edit Commission Allocations", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_report_user_monthly_commission", Name = "View Commission User Monthly Commission Report", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_edit_commission_split_rules", Name = "Edit Commission Split Rules", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_commission_split_rules", Name = "View Commission Split Rules", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_report_past_revenue_commission", Name = "View Commission Projections Report", ApplicationId = Application.COMMISSION_ID });
            list.Add(new UseCaseEntity() { Id = "com_view_report_commission_lapse", Name = "View Commission Lapse Report", ApplicationId = Application.COMMISSION_ID });

            return list;
        }

    }
}