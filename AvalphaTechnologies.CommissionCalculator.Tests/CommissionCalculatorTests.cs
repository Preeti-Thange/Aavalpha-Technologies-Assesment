using Xunit;
using AvalphaTechnologies.CommissionCalculator.Services;
using AvalphaTechnologies.CommissionCalculator.Models;
using System.Linq;

namespace Tests
{
    public class CommissionCalculatorTests
    {
        private readonly CommissionService _service = new();

        [Fact]
        public void Calculate_ShouldReturnCorrectTotals()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 10,
                ForeignSalesCount = 10,
                AverageSaleAmount = 100
            };

            // Act
            var result = _service.Calculate(request);

            // Assert
            Assert.Equal(200, result.AvalphaTechnologies.Local);
            Assert.Equal(350, result.AvalphaTechnologies.Foreign);
            Assert.Equal(550, result.AvalphaTechnologies.Total);

            Assert.Equal(20, result.Competitor.Local);
            Assert.Equal(75.5m, result.Competitor.Foreign);
            Assert.Equal(95.5m, result.Competitor.Total);
        }

        [Fact]
        public void Calculate_ShouldHandleZeroSales()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 0,
                ForeignSalesCount = 0,
                AverageSaleAmount = 100
            };

            // Act
            var result = _service.Calculate(request);

            // Assert
            Assert.Equal(0, result.AvalphaTechnologies.Local);
            Assert.Equal(0, result.AvalphaTechnologies.Foreign);
            Assert.Equal(0, result.AvalphaTechnologies.Total);
            Assert.Equal(0, result.Competitor.Local);
            Assert.Equal(0, result.Competitor.Foreign);
            Assert.Equal(0, result.Competitor.Total);
        }

        [Fact]
        public void Validate_ShouldReturnErrors_ForNegativeInputs()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = -5,
                ForeignSalesCount = -2,
                AverageSaleAmount = -100
            };

            // Act
            var errors = request.Validate();

            // Assert
            Assert.Contains("LocalSalesCount must be >= 0.", errors);
            Assert.Contains("ForeignSalesCount must be >= 0.", errors);
            Assert.Contains("AverageSaleAmount must be >= 0.", errors);
        }

        [Fact]
        public void Validate_ShouldReturnErrors_ForExceedingLimits()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 2_000_000, // exceeds max 1,000,000
                ForeignSalesCount = 2_000_000,
                AverageSaleAmount = 20_000_000m // exceeds max 10,000,000
            };

            // Act
            var errors = request.Validate();

            // Assert
            Assert.Contains("LocalSalesCount must be <= 1000000.", errors);
            Assert.Contains("ForeignSalesCount must be <= 1000000.", errors);
            Assert.Contains("AverageSaleAmount must be <= 10000000.", errors);
        }

        [Fact]
        public void Calculate_ShouldRoundValuesToTwoDecimals()
        {
            // Arrange
            var request = new CommissionCalculationRequest
            {
                LocalSalesCount = 3,
                ForeignSalesCount = 5,
                AverageSaleAmount = 123.4567m
            };

            // Act
            var result = _service.Calculate(request);

            // Assert
            Assert.Equal(decimal.Round(0.20m * 3 * 123.4567m, 2), result.AvalphaTechnologies.Local);
            Assert.Equal(decimal.Round(0.35m * 5 * 123.4567m, 2), result.AvalphaTechnologies.Foreign);
        }
    }
}
