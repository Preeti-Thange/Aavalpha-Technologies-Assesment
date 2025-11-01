
using System.Collections.Generic;

namespace AvalphaTechnologies.CommissionCalculator.Models
{
    public class CommissionCalculationRequest
    {
        public int LocalSalesCount { get; set; }
        public int ForeignSalesCount { get; set; }
        public decimal AverageSaleAmount { get; set; }

        public IList<string> Validate()
        {
            var errors = new List<string>();
            if (LocalSalesCount < 0) errors.Add("LocalSalesCount must be >= 0.");
            if (ForeignSalesCount < 0) errors.Add("ForeignSalesCount must be >= 0.");
            if (AverageSaleAmount < 0) errors.Add("AverageSaleAmount must be >= 0.");

            const int MaxSalesCount = 1_000_000;
            const decimal MaxAverageAmount = 10_000_000m;
            if (LocalSalesCount > MaxSalesCount) errors.Add($"LocalSalesCount must be <= {MaxSalesCount}.");
            if (ForeignSalesCount > MaxSalesCount) errors.Add($"ForeignSalesCount must be <= {MaxSalesCount}.");
            if (AverageSaleAmount > MaxAverageAmount) errors.Add($"AverageSaleAmount must be <= {MaxAverageAmount}.");

            return errors;
        }
    }
}
