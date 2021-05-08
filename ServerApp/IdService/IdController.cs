using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MicroWin.IdService
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IdServiceController : Controller
    {
        private readonly IdRepo idRepository;
        public IdServiceController(IdRepo idRepository)
        {
            this.idRepository = idRepository;
        }
        [HttpGet("search")]
        public ActionResult<IEnumerable<string>> Get(string val)
        {
            return Ok(this.idRepository.Get(val));
        }
    }
}