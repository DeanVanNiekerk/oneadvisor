using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionStatementTemplateService
    {
        Task<PagedItems<CommissionStatementTemplate>> GetTemplates(CommissionStatementTemplateQueryOptions queryOptions);
        Task<CommissionStatementTemplateEdit> GetTemplate(Guid templateId);
        Task<Result> UpdateTemplate(CommissionStatementTemplateEdit template);
        Task<Result> InsertTemplate(CommissionStatementTemplateEdit template);
        Task<OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration.Config> GetDefaultConfig();
        Task UpdateUnknownCommissionTypes(Guid commissionStatementTemplateId);
    }
}