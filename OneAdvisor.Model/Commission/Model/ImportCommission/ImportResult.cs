using System;
using System.Collections.Generic;
using System.Linq;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Model.ImportCommission
{
    public class ImportResult
    {
        public ImportResult()
        {
            Results = new List<Result>();
            UnknownCommissionTypeValues = new List<string>();
        }

        public int ImportCount
        {
            get
            {
                return Results.Where(r => r.Success).Count();
            }
        }
        public int ErrorCount
        {
            get
            {
                return Results.Where(r => !r.Success).Count();
            }
        }
        public List<Result> Results { get; set; }
        public List<string> UnknownCommissionTypeValues { get; }

        public void AddUnknownCommissionTypeValue(string value)
        {
            if (!UnknownCommissionTypeValues.Contains(value))
                UnknownCommissionTypeValues.Add(value);
        }
    }
}