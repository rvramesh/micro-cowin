using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MicroWin.Configuration
{
    [Route("api/configuration/[controller]")]
    [ApiController] 
    public class ApplicationConfigurationController : Controller
    {
        public ApplicationConfigurationRepo ApplicationConfigurationProperties { get;init;}
        public ApplicationConfigurationController(ApplicationConfigurationRepo properties){
            this.ApplicationConfigurationProperties = properties;
        }
        [HttpGet]
        public async Task<ActionResult<ApplicationConfigurationProperties>> Get()
        {
            return await Task.FromResult(this.ApplicationConfigurationProperties.Get());
        }
    }
}