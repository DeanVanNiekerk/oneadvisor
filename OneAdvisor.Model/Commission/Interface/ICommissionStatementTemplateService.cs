using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionStatementTemplateService
    {
        Task<PagedItems<CommissionStatementTemplate>> GetTemplates();
        Task<CommissionStatementTemplateEdit> GetTemplate(Guid templateId);
        Task<Result> UpdateTemplate(CommissionStatementTemplateEdit template);
        Task<Result> InsertTemplate(CommissionStatementTemplateEdit template);
    }
}