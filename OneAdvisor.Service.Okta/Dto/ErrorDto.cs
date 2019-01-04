using System.Collections.Generic;
using System.Linq;

namespace OneAdvisor.Service.Okta.Dto
{
    public class ErrorDto
    {
        public ErrorDto()
        {
            errorCauses = new List<ErrorCauseDto>();
        }

        public string errorCode { get; set; }
        public string errorSummary { get; set; }
        public string errorLink { get; set; }
        public string errorId { get; set; }
        public List<ErrorCauseDto> errorCauses { get; set; }

        public string GetAllErrorCauses()
        {
            return string.Join(',', errorCauses.Select(e => e.errorSummary));
        }
    }

    public class ErrorCauseDto
    {
        public string errorSummary { get; set; }
    }
}