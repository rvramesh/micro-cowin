using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MicroWin.Configuration
{
    [Route("api/configuration/[controller]")]
    [ApiController] 
    public class ApplicationConfigurationController : Controller
    {
        public ApplicationConfigurationProperties ApplicationConfigurationProperties { get;init;}
        public ApplicationConfigurationController(ApplicationConfigurationProperties properties){
            this.ApplicationConfigurationProperties = properties;
        }
        [HttpGet]
        public async Task<ActionResult<ApplicationConfigurationProperties>> Get()
        {
            return await Task.FromResult(this.ApplicationConfigurationProperties);
        }
    }
}