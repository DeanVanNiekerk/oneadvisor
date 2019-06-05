using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionStatementTemplateService
    {
        Task<PagedItems<CommissionStatementTemplate>> GetTemplates(CommissionStatementTemplateQueryOptions queryOptions);
        Task<CommissionStatementTemplateEdit> GetTemplate(Guid templateId);
        Task<Result> UpdateTemplate(CommissionStatementTemplateEdit template);
        Task<Result> InsertTemplate(CommissionStatementTemplateEdit template);
        Task<OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration.Config> GetDefaultConfig();
    }
}