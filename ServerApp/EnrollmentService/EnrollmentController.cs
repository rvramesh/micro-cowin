using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWin.IdService;

namespace MicroWin.EnrollmentService
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles="AcceptedTerms")]
    public class EnrollmentController: Controller
    {
        private readonly EnrollmentRepo enrollmentRepo;

        public EnrollmentController(EnrollmentRepo enrollmentRepo) {
            this.enrollmentRepo = enrollmentRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EnrollmentModel>>> GetAll(){
            string id = base.User.Claims.SingleOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            long telegramId;
            if(long.TryParse(id, out telegramId))
            {
               return await Task.FromResult(Ok(this.enrollmentRepo.GetByScheduler(telegramId)));
            } else {
                return BadRequest(new { sucess = false, message = "Invalid Token" });
            }
        }

        [HttpPost()]
        public async Task<ActionResult<IEnumerable<int>>> Enroll(IEnumerable<EnrollmentRequest> persons)
        {
            string id = base.User.Claims.SingleOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            string unit = base.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.UserData)?.Value;
            long telegramId;
            if (long.TryParse(id, out telegramId))
            {
               var entrollments = persons.Select(entry=>new EnrollmentModel(){
                    Name = entry.Name,
                    Yob = entry.Yob,
                    ScheduleFrom = entry.ScheduleFrom,
                    ScheduledBy = telegramId,
                    Unit = unit,
                    Status = 'E',
                    InviteCount = 0,
                    LastUpdatedAt = DateTime.UtcNow,
                    LastUpdatedBy = telegramId,
                    VaccinesPreference = entry.VaxIds.ToList()
                       
                });
                return await Task.FromResult(Ok(this.enrollmentRepo.Enroll(unit, telegramId,entrollments)));
            }
            else
            {
                return BadRequest(new { sucess = false, message = "Invalid Token" });
            }
        }

        [HttpPost("/{id}")]
        public async Task<ActionResult<IEnumerable<int>>> Update(long id, EnrollmentRequest request)
        {
            var enrollment = this.enrollmentRepo.Get(id);
            if(enrollment ==null)
            {
                return NotFound();
            }
            if(enrollment.Status != EnrollmentStatus.Enrolled){
                return BadRequest(new {success = false, message = "Only records with status Enrolled can be updated."})
            }
            string userId = base.User.Claims.SingleOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            string unit = base.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.UserData)?.Value;
            long telegramId;
            if (long.TryParse(userId, out telegramId))
            {
                return await Task.FromResult(Ok(this.enrollmentRepo.UpdateEnrollment(unit, telegramId, enrollment)));
            }
            else
            {
                return BadRequest(new { sucess = false, message = "Invalid Token" });
            }
        }
    }
}