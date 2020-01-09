using System;
using System.Collections.Generic;
using System.Linq;

namespace OneAdvisor.Model.Import.Commission
{
    public class SheetExchangeRates
    {
        public int SheetNumber { get; set; }
        public List<ExchangeRate> ExchangeRates { get; set; }


    }
}