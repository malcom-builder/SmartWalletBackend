using SmartWallet.Application.Services;
using MediatR;
using Contracts.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SmartWallet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly ISender _sender;

        public UserController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _sender.Send(new SmartWallet.Application.Users.GetAllUsersQuery());
            return Ok(users);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var user = await _sender.Send(new SmartWallet.Application.Users.GetUserByIdQuery(userId));
            if (user is null)
                return NotFound();

            return Ok(user);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpGet("by-email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _sender.Send(new SmartWallet.Application.Users.GetUserByEmailQuery(email));
            if (user is null)
                return NotFound();

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterRequest request)
        {
            var userWithWallet = await _sender.Send(new SmartWallet.Application.Users.RegisterUserCommand(request.Name, request.Email, request.Password));
            if (userWithWallet is null)
                return BadRequest();

            return CreatedAtAction(nameof(GetUserById), new { userId = userWithWallet.Id }, userWithWallet);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateAdminUser([FromBody] UserCreateRequest request)
        {
            var createdUser = await _sender.Send(new SmartWallet.Application.Users.CreateAdminUserCommand(request.Name, request.Email, request.Password, (int)request.Role));
            if (createdUser is null)
                return BadRequest();

            return CreatedAtAction(nameof(GetUserById), new { userId = createdUser.Id }, createdUser);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDataRequest request)
        {
            var updated = await _sender.Send(new SmartWallet.Application.Users.UpdateUserCommand(id, request.Name, request.Password, request.Active));
            if (updated is null)
                return BadRequest();

            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:guid}/active")]
        public async Task<IActionResult> ChangeUserActiveStatus(Guid id)
        {
            var changed = await _sender.Send(new SmartWallet.Application.Users.ChangeUserActiveStatusCommand(id));
            if (changed is null)
                return BadRequest();

            return Ok(changed);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _sender.Send(new SmartWallet.Application.Users.DeleteUserCommand(id));
            if (!result)
                return BadRequest();

            return Ok();
        }
    }
}