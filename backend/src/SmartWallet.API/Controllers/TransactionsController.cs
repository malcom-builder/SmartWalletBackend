using Contracts.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartWallet.Application.Services;
using SmartWallet.Contracts.Requests;
using SmartWallet.Domain.Entities;
using SmartWallet.Domain.Enums;
using Mapster;
using MediatR;

namespace SmartWallet.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ISender _sender;

        public TransactionsController(ISender sender)
        {
            _sender = sender;
        }

        // --- consultas ---
        // --- obtiene una transaccion por id ---
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.GetTransactionByIdQuery(id));
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        // --- obtiene todas las transacciones de una wallet especifica ---
        [HttpGet("wallet/{walletId:guid}")]
        [Authorize]
        public async Task<IActionResult> GetByWallet(Guid walletId)
        {
            var transactions = await _sender.Send(new SmartWallet.Application.Transactions.GetTransactionsByWalletQuery(walletId));
            return Ok(transactions);
        }

        // --- obtiene todas las transacciones dentro de un rango de fechas ---
        [HttpGet("range")]
        [Authorize]
        public async Task<IActionResult> GetByDateRange([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var transactions = await _sender.Send(new SmartWallet.Application.Transactions.GetTransactionsByDateRangeQuery(from, to));
            return Ok(transactions);
        }
            
        // --- operaciones de dominio ---
        // --- crear deposito ---
        [HttpPost("deposits")]
        [Authorize]
        public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
        {
            var currency = Enum.Parse<CurrencyCode>(request.CurrencyCode, ignoreCase: true);
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.CreateDepositCommand(
                request.WalletId,
                request.Amount,
                currency
            ));
            return Ok(transaction);
        }

        // --- crear retiro ---
        [HttpPost("withdrawals")]
        [Authorize]
        public async Task<IActionResult> Withdrawal([FromBody] WithdrawalRequest request)
        {
            var currency = Enum.Parse<CurrencyCode>(request.CurrencyCode, ignoreCase: true);
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.CreateWithdrawalCommand(
                request.WalletId,
                request.Amount,
                currency
            ));
            return Ok(transaction);
        }


        // --- crear transferencia ---
        [HttpPost("transfers")]
        [Authorize]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            var currency = Enum.Parse<CurrencyCode>(request.CurrencyCode, ignoreCase: true);
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.CreateTransferCommand(
                request.SourceWalletId,
                request.DestinationWalletId,
                request.Amount,
                currency
            ));
            return Ok(transaction);
        }
        // --- marca una transaccion como fallida ---
        [HttpPatch("{id:guid}/fail")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsFailed(Guid id)
        {
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.MarkTransactionAsFailedCommand(id));
            return Ok(transaction);  
        }

        // --- marca una transaccion como cancelada ---
        [HttpPatch("{id:guid}/cancel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsCanceled(Guid id)
        {
            var transaction = await _sender.Send(new SmartWallet.Application.Transactions.MarkTransactionAsCanceledCommand(id));
            return Ok(transaction);
        }
    }
}

