using AvalphaTechnologies.CommissionCalculator.Models;
using AvalphaTechnologies.CommissionCalculator.Services;
using Microsoft.AspNetCore.Mvc;

namespace AvalphaTechnologies.CommissionCalculator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommissionController : ControllerBase
    {
        private readonly ICommissionService _commissionService;

        public CommissionController(ICommissionService commissionService)
        {
            _commissionService = commissionService;
        }

        [HttpPost("calculate")]
        [ProducesResponseType(typeof(CommissionCalculationResponse), 200)]
        [ProducesResponseType(400)]
        public IActionResult Calculate([FromBody] CommissionCalculationRequest request)
        {
            if (request == null)
                return BadRequest("Request body is required.");

            var validationErrors = request.Validate();
            if (validationErrors.Any())
                return BadRequest(new { Errors = validationErrors });

            var result = _commissionService.Calculate(request);
            return Ok(result);
        }
    }
}
