using Contracts.Requests;
using Contracts.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWallet.Application.Services;
using SmartWallet.Domain.Entities;
using SmartWallet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mapster;
using MediatR;

namespace SmartWallet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class WalletController : ControllerBase
    {
        private readonly ISender _sender;

        public WalletController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<WalletResponse>>> GetAll()
        {
            var responses = await _sender.Send(new SmartWallet.Application.Wallets.GetAllWalletsQuery());
            return Ok(responses);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<List<WalletResponse>>> GetByUser(Guid userId)
        {
            var responses = await _sender.Send(new SmartWallet.Application.Wallets.GetWalletsByUserQuery(userId));
            if (responses == null || !responses.Any()) return NotFound();
            return Ok(responses);
        }

        [Authorize]
        [HttpGet("by-alias/{alias}")]
        public async Task<ActionResult<WalletResponse>> GetByAlias(string alias)
        {
            var response = await _sender.Send(new SmartWallet.Application.Wallets.GetWalletByAliasQuery(alias));
            if (response == null) return NotFound();
            return Ok(response);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Wallet>> GetById(Guid id)
        {
            var wallet = await _sender.Send(new SmartWallet.Application.Wallets.GetWalletByIdQuery(id));
            if (wallet == null) return NotFound();
            return Ok(wallet);
        }

        [Authorize(Policy = "SameUserOrAdmin")]
        [HttpPost]
        public async Task<ActionResult<WalletResponse>> CreateAsync([FromBody] WalletRequest request)
        {
            if (!Enum.TryParse<CurrencyCode>(request.CurrencyCode, true, out var currency))
                return BadRequest("Código de moneda inválido.");

            var response = await _sender.Send(new SmartWallet.Application.Wallets.CreateWalletCommand(
                request.UserId,
                request.Name,
                currency,
                request.Alias,
                request.InitialBalance
            ));

            // Para CreatedAtAction necesitamos el Id que nos devuelve el mapper
            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }
    }
}
