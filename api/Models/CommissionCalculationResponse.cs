
namespace AvalphaTechnologies.CommissionCalculator.Models
{
    public class CommissionBreakdown
    {
        public decimal Local { get; set; }
        public decimal Foreign { get; set; }
        public decimal Total => Local + Foreign;
    }

    public class CommissionCalculationResponse
    {
        public CommissionBreakdown AvalphaTechnologies { get; set; } = new();
        public CommissionBreakdown Competitor { get; set; } = new();
    }
}
