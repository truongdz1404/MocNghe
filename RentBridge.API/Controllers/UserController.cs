using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RentBridge.Application.Commands.Users;
using RentBridge.Application.DTOs;
using RentBridge.Application.Queries.Auth;

namespace RentBridge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile([FromQuery] string email)
        {
            var result = await _mediator.Send(new GetUserProfile(){Email = email});
            if (result == null)
                return BadRequest(new Response{
                    Status = ResponseStatus.ERROR,
                    Message = "User not found"
                });
            return Ok(new Response{
                Status = ResponseStatus.SUCCESS,
                Message = "Get profile successful",
                Data = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> PostProfile([FromBody] CreateUserCommand command){
            if(!ModelState.IsValid){
                return BadRequest(new Response{
                    Status = ResponseStatus.ERROR,
                    Message = "Invalid model state",
                    Data = ModelState.Values.SelectMany(e => e.Errors).Select(e => e.ErrorMessage)
                });
            }
            return await _mediator.Send(command);
        }
    }
}