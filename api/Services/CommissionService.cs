
using AvalphaTechnologies.CommissionCalculator.Models;

namespace AvalphaTechnologies.CommissionCalculator.Services
{
    public class CommissionService : ICommissionService
    {
        private const decimal AvalphaLocalRate = 0.20m;
        private const decimal AvalphaForeignRate = 0.35m;
        private const decimal CompetitorLocalRate = 0.02m;
        private const decimal CompetitorForeignRate = 0.0755m;

        public CommissionCalculationResponse Calculate(CommissionCalculationRequest request)
        {
            var avalphaLocal = AvalphaLocalRate * request.LocalSalesCount * request.AverageSaleAmount;
            var avalphaForeign = AvalphaForeignRate * request.ForeignSalesCount * request.AverageSaleAmount;

            var competitorLocal = CompetitorLocalRate * request.LocalSalesCount * request.AverageSaleAmount;
            var competitorForeign = CompetitorForeignRate * request.ForeignSalesCount * request.AverageSaleAmount;

            return new CommissionCalculationResponse
            {
                AvalphaTechnologies = new CommissionBreakdown
                {
                    Local = decimal.Round(avalphaLocal, 2),
                    Foreign = decimal.Round(avalphaForeign, 2)
                },
                Competitor = new CommissionBreakdown
                {
                    Local = decimal.Round(competitorLocal, 2),
                    Foreign = decimal.Round(competitorForeign, 2)
                }
            };
        }
    }
}
