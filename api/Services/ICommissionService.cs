
using AvalphaTechnologies.CommissionCalculator.Models;

namespace AvalphaTechnologies.CommissionCalculator.Services
{
    public interface ICommissionService
    {
        CommissionCalculationResponse Calculate(CommissionCalculationRequest request);
    }
}
