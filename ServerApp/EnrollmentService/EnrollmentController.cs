using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MicroWin.Configuration;
using MicroWin.IdService;

namespace MicroWin.EnrollmentService
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles="AcceptedTerms")]
    public class EnrollmentController: Controller
    {
        private readonly EnrollmentRepo enrollmentRepo;
        private readonly ApplicationConfigurationRepo config;

        public EnrollmentController(EnrollmentRepo enrollmentRepo, ApplicationConfigurationRepo config) {
            this.enrollmentRepo = enrollmentRepo;
            this.config = config;

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
            int currentlyEnrolled = this.enrollmentRepo.GetCountByUnit(unit);
            int maxEnrollment = config.Get().MaxEnrollmentPerUnit;
            if((currentlyEnrolled+persons.Count())>maxEnrollment)
            {
                return BadRequest(new {success = false, message = $"You have exceeded the max enrollment. You can enroll maximum of {maxEnrollment}"});
            }
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
                return BadRequest(new {success = false, message = "Only records with status Enrolled can be updated."});
            }
            string userId = base.User.Claims.SingleOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub)?.Value;
            string unit = base.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.UserData)?.Value;
            long telegramId;
            if (long.TryParse(userId, out telegramId))
            {
                enrollment.LastUpdatedAt = DateTime.UtcNow;
                enrollment.LastUpdatedBy = telegramId;
                enrollment.Name = request.Name;
                enrollment.Yob = request.Yob;
                enrollment.ScheduleFrom = request.ScheduleFrom;
                enrollment.VaccinesPreference = request.VaxIds;
                return await Task.FromResult(Ok(this.enrollmentRepo.UpdateEnrollment(unit, telegramId, enrollment)));
            }
            else
            {
                return BadRequest(new { sucess = false, message = "Invalid Token" });
            }
        }
    }
}