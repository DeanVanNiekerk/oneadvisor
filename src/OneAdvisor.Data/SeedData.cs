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
        #region Directory

        public static List<ApplicationEntity> GetApplications()
        {
            var list = new List<ApplicationEntity>();

            list.Add(new ApplicationEntity() { Id = Application.DIRECTORY_ID, Name = "Directory", ColourHex = "#CC3F0C" });
            list.Add(new ApplicationEntity() { Id = Application.CLIENT_ID, Name = "Client", ColourHex = "#009FFD" });
            list.Add(new ApplicationEntity() { Id = Application.COMMISSION_ID, Name = "Commission", ColourHex = "#2A2A72" });
            list.Add(new ApplicationEntity() { Id = Application.COMPLIANCE_ID, Name = "Compliance", ColourHex = "#005A38" });
            list.Add(new ApplicationEntity() { Id = Application.INVEST_ID, Name = "Invest", ColourHex = "#AE1827" });

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

        public static List<VATRateEntity> GetVATRates()
        {
            var list = new List<VATRateEntity>();

            list.Add(new VATRateEntity() { Id = Guid.Parse("327abe6a-c200-2e53-ba63-e665174438b9"), Rate = 14, EndDate = new DateTime(2018, 4, 1).AddSeconds(-1) });
            list.Add(new VATRateEntity() { Id = Guid.Parse("490e393a-71bb-b54c-99cf-87ca4e8a88dc"), Rate = 15, StartDate = new DateTime(2018, 4, 1) });

            return list;
        }

        public static List<AdviceScopeEntity> GetAdviceScopes()
        {
            var list = new List<AdviceScopeEntity>();

            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("f1d1bdcd-83cc-4ae9-9c33-9a4de93f9af1"), Name = "Estate Planning" });
            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("a17d7c4d-4159-4cd0-a37d-7d0d006d11f6"), Name = "Retirement Planning" });
            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("e26f2a86-832e-47c5-a6e4-00920102ce0c"), Name = "Investment Planning" });
            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("b415119f-4070-4ddf-8329-c946496bcb2f"), Name = "Medical Benefits" });
            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("76c1dc96-ba96-4136-ac70-386d355354da"), Name = "Short Term Insurance" });
            list.Add(new AdviceScopeEntity() { Id = Guid.Parse("b9336610-828b-490c-9b4d-b4478d3c958b"), Name = "Fiduciary services" });

            return list;
        }

        public static List<AdviceServiceEntity> GetAdviceServices()
        {
            var list = new List<AdviceServiceEntity>();

            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("f8d0f35b-9eb5-4be4-b2ab-0a9c3547360d"), Name = "Full financial needs analysis", DisplayOrder = 1 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("b2435736-8fa7-4b34-a7b8-ee08f949e863"), Name = "Risk Planning for death", DisplayOrder = 2 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("6ef0e93b-a4fd-babc-030e-09c7ab293b88"), Name = "Risk Planning for disability", DisplayOrder = 3 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("247c5a3b-cb44-4bd2-5881-d8e146ab75ec"), Name = "Risk Planning for for dread disease/trauma ", DisplayOrder = 4 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("04815a0f-6102-47db-8a5c-e28baa9cf428"), Name = "Planning for retirement", DisplayOrder = 5 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("7f3eb0b1-5431-4501-a257-f6c76b96f17a"), Name = "Planning at retirement", DisplayOrder = 6 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("e3751712-0324-4be4-b2dc-332890e72b0c"), Name = "Savings planning", DisplayOrder = 7 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("68523839-e035-43e2-a8e3-f54eaa273750"), Name = "Investment planning", DisplayOrder = 8 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("96dadc7a-7b5a-4fa0-bea8-8423335d7c45"), Name = "Employee Benefits", DisplayOrder = 9 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("d016b488-c4f8-47ff-a833-626b476648d4"), Name = "Planning for Business Assurance", DisplayOrder = 10 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("009c5cec-9b9e-451f-98a9-8335671dc480"), Name = "Planning for Medical Benefits", DisplayOrder = 11 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("27da6f44-891c-46b5-a215-6120eef79ac3"), Name = "Funeral Benefits", DisplayOrder = 12 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("dbc296a3-34d3-4102-a5c0-c84061d88c3d"), Name = "Wills", DisplayOrder = 13 });
            list.Add(new AdviceServiceEntity() { Id = Guid.Parse("44cc8294-b725-4d34-9900-fe662365c475"), Name = "Medical Gap Cover", DisplayOrder = 14 });

            return list;
        }

        public static List<LicenseCategoryEntity> GetLicenseCategories()
        {
            var list = new List<LicenseCategoryEntity>();

            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("50fb5d14-10d7-40f1-9e3d-b842fe756989"), Code = "1.1", Name = "Long-term Insurance subcategory A" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("de6e5ba3-82a8-4622-bf21-bf13ae3df492"), Code = "1.2", Name = "Short-term Insurance Personal Lines" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("a8626ca9-acfd-4476-b8bd-d2c1659fe67f"), Code = "1.3", Name = "Long-term Insurance" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("1ab9fac3-6171-4653-8618-e627f95d3759"), Code = "1.3.1", Name = "Subcategory B1" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("75719355-6db5-4620-9537-b710bf7d71e8"), Code = "1.3.2", Name = "Subcategory B2" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("37059d66-8d91-424d-9c76-146e28ce01d4"), Code = "1.4", Name = "Long-term Insurance subcategory C" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("83ba73cf-c0b0-4c55-8ffb-e11098289b7e"), Code = "1.5", Name = "Retail Pension Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("dc03a55e-41eb-4284-80ab-2cafdf6a60c4"), Code = "1.6", Name = "Short-term Insurance Commercial Lines" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("34660bf9-8396-4bfd-8edb-481ce214a6b9"), Code = "1.7", Name = "Pension Fund Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("19ade5aa-81e0-456e-aff2-84a4f8b58c44"), Code = "1.8", Name = "Securities and instruments: Shares" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("b5c7d31a-177b-491a-a142-b1662febc6bf"), Code = "1.9", Name = "Securities and Instruments: Money market instruments" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("6b7b8c1d-9d05-44ac-9afc-2b4594dfae9f"), Code = "1.10", Name = "Securities and Instruments: Debentures and securitised debt" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("e1b47d47-1109-4c6a-bfdf-681dce8fc596"), Code = "1.11", Name = "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("e47a4a36-ed52-4d1c-b9c7-080df298d58d"), Code = "1.12", Name = "Securities and Instruments: Bonds" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("3f35cf49-fb8c-48a7-a7ce-7e2de19eb0ad"), Code = "1.13", Name = "Securities and Instruments: Derivative instruments excluding warrants" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("bf1c2f4e-9444-4795-b245-059f3bd1f11f"), Code = "1.14", Name = "Participatory Interests in one or more collective Investments schemes" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("bdca849f-ff58-4dec-a3f8-2c2397fcec1d"), Code = "1.15", Name = "Forex Investment Business" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("01ef566a-fd9a-4ed7-a166-45a15bd0ff05"), Code = "1.16", Name = "Health Service Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("d7c3a276-53a7-40be-b596-26eceec8b801"), Code = "1.17", Name = "Long-term Deposits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("21664afe-a0ff-4dcf-9618-8cd19ad6022e"), Code = "1.18", Name = "Short-term Deposits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("be5c076f-a279-49f3-bac2-eac51106d872"), Code = "1.19", Name = "Friendly Society Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("f91cec3f-1a03-4d6c-8ec9-0d2c8f1b0080"), Code = "2.1", Name = "Long-term Insurance" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("89bd2ad2-3e82-4ea9-9c70-2c1dcb7be2df"), Code = "2.1.1", Name = "Subcategory B1" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("95af0aa3-0048-4a92-aae6-9bf6a08ea269"), Code = "2.1.2", Name = "Subcategory B2" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("60314bbd-1330-4893-b81f-704372a62915"), Code = "2.2", Name = "Long-term Insurance subcategory C" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("61616b5b-d0c9-4418-b5e1-459bf50501e4"), Code = "2.3", Name = "Retail Pension Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("554467e1-caf9-4703-8ae8-65c802ca7964"), Code = "2.4", Name = "Pension Fund Benefits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("bcbaf86e-dd7a-4649-a244-32e7a3811bca"), Code = "2.5", Name = "Securities and instruments: Shares" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("69bd2568-b0c8-408b-b43b-9d2979f26707"), Code = "2.6", Name = "Securities and Instruments: Money market instruments" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("0350fdd6-bf18-4ad0-b876-e74000fcecaa"), Code = "2.7", Name = "Securities and Instruments: Debentures and securitised debt" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("0c205964-0bff-4f59-817c-3274e07941f7"), Code = "2.8", Name = "Securities and Instruments: Warrants, certificates and other instruments acknowledging debt" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("d12d9ba6-2618-4294-9357-17bc439fc80e"), Code = "2.9", Name = "Securities and Instruments: Bonds" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("04fe22be-ed1b-4221-8b87-3f6b3e64138d"), Code = "2.10", Name = "Securities and Instruments: Derivative instruments excluding warrants" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("d91e5fbc-b425-48c2-8c4d-d38dadb2c372"), Code = "2.11", Name = "Participatory Interests in one or more collective Investments schemes" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("261ba3b0-be07-48d7-83e1-70faaed8298c"), Code = "2.12", Name = "Forex Investment Business" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("d65982e7-12f0-40e5-83cb-3c3035b21bb8"), Code = "2.13", Name = "Long-term Deposits" });
            list.Add(new LicenseCategoryEntity() { Id = Guid.Parse("f82de6cf-6106-4bc5-9c02-938b069deb66"), Code = "2.14", Name = "Short-term Deposits" });

            return list;
        }


        #endregion

        #region Client

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

        #endregion

        #region Commission

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

        #endregion

    }
}