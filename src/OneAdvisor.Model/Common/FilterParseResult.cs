using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Common
{
    public class FilterParseResult<T>
    {
        public FilterParseResult()
        {
            Success = false;
        }

        public bool Success { get; set; }
        public T Value { get; set; }
    }

}