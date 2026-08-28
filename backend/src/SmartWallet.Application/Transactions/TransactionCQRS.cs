using Contracts.Responses;
using Mapster;
using MediatR;
using SmartWallet.Application.Abstractions;
using SmartWallet.Application.Abstractions.Persistence;
using SmartWallet.Domain.Entities;
using SmartWallet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartWallet.Application.Transactions
{
    // --- Queries ---

    public record GetTransactionByIdQuery(Guid Id) : IRequest<TransactionResponse?>;

    public class GetTransactionByIdQueryHandler : IRequestHandler<GetTransactionByIdQuery, TransactionResponse?>
    {
        private readonly ITransactionRepository _repository;
        public GetTransactionByIdQueryHandler(ITransactionRepository repository) => _repository = repository;

        public async Task<TransactionResponse?> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var transaction = await _repository.GetByIdAsync(request.Id);
            return transaction?.Adapt<TransactionResponse>();
        }
    }

    public record GetTransactionsByWalletQuery(Guid WalletId) : IRequest<List<TransactionResponse>>;

    public class GetTransactionsByWalletQueryHandler : IRequestHandler<GetTransactionsByWalletQuery, List<TransactionResponse>>
    {
        private readonly ITransactionRepository _repository;
        public GetTransactionsByWalletQueryHandler(ITransactionRepository repository) => _repository = repository;

        public async Task<List<TransactionResponse>> Handle(GetTransactionsByWalletQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _repository.GetByWalletAsync(request.WalletId);
            return transactions.Adapt<List<TransactionResponse>>();
        }
    }

    public record GetTransactionsByDateRangeQuery(DateTime From, DateTime To) : IRequest<List<TransactionResponse>>;

    public class GetTransactionsByDateRangeQueryHandler : IRequestHandler<GetTransactionsByDateRangeQuery, List<TransactionResponse>>
    {
        private readonly ITransactionRepository _repository;
        public GetTransactionsByDateRangeQueryHandler(ITransactionRepository repository) => _repository = repository;

        public async Task<List<TransactionResponse>> Handle(GetTransactionsByDateRangeQuery request, CancellationToken cancellationToken)
        {
            var transactions = await _repository.GetByDateRangeAsync(request.From, request.To);
            return transactions.Adapt<List<TransactionResponse>>();
        }
    }

    // --- Commands ---

    public record CreateDepositCommand(Guid WalletId, decimal Amount, CurrencyCode Currency) : IRequest<TransactionResponse>;

    public class CreateDepositCommandHandler : IRequestHandler<CreateDepositCommand, TransactionResponse>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ITransactionLedgerRepository _ledgerRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreateDepositCommandHandler(ITransactionRepository transactionRepository, ITransactionLedgerRepository ledgerRepository, IWalletRepository walletRepository, ICurrentUserService currentUserService)
        {
            _transactionRepository = transactionRepository;
            _ledgerRepository = ledgerRepository;
            _walletRepository = walletRepository;
            _currentUserService = currentUserService;
        }

        public async Task<TransactionResponse> Handle(CreateDepositCommand request, CancellationToken cancellationToken)
        {
            var wallet = await _walletRepository.GetByIdAsync(request.WalletId) ?? throw new KeyNotFoundException("Wallet no encontrada.");

            var userId = _currentUserService.GetUserId();
            var isAdmin = _currentUserService.IsAdmin();

            if (!isAdmin && wallet.UserID != userId)
                throw new UnauthorizedAccessException("No puedes operar sobre una wallet que no es tuya");

            var transaction = wallet.Deposit(request.Amount, request.Currency);

            await _transactionRepository.AddAsync(transaction);
            var ledgers = TransactionLedger.FromTransaction(transaction);
            await _ledgerRepository.AddRangeAsync(ledgers);

            transaction.MarkAsCompleted();
            await _transactionRepository.UpdateAsync(transaction);
            await _walletRepository.UpdateAsync(wallet);

            return transaction.Adapt<TransactionResponse>();
        }
    }

    public record CreateWithdrawalCommand(Guid WalletId, decimal Amount, CurrencyCode Currency) : IRequest<TransactionResponse>;

    public class CreateWithdrawalCommandHandler : IRequestHandler<CreateWithdrawalCommand, TransactionResponse>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ITransactionLedgerRepository _ledgerRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreateWithdrawalCommandHandler(ITransactionRepository transactionRepository, ITransactionLedgerRepository ledgerRepository, IWalletRepository walletRepository, ICurrentUserService currentUserService)
        {
            _transactionRepository = transactionRepository;
            _ledgerRepository = ledgerRepository;
            _walletRepository = walletRepository;
            _currentUserService = currentUserService;
        }

        public async Task<TransactionResponse> Handle(CreateWithdrawalCommand request, CancellationToken cancellationToken)
        {
            var wallet = await _walletRepository.GetByIdAsync(request.WalletId) ?? throw new KeyNotFoundException("Wallet no encontrada.");

            var userId = _currentUserService.GetUserId();
            var isAdmin = _currentUserService.IsAdmin();

            if (!isAdmin && wallet.UserID != userId)
                throw new UnauthorizedAccessException("No puedes operar sobre una wallet que no es tuya");

            var transaction = wallet.Withdrawal(request.Amount, request.Currency);

            await _transactionRepository.AddAsync(transaction);
            var ledgers = TransactionLedger.FromTransaction(transaction);
            await _ledgerRepository.AddRangeAsync(ledgers);

            transaction.MarkAsCompleted();
            await _transactionRepository.UpdateAsync(transaction);
            await _walletRepository.UpdateAsync(wallet);

            return transaction.Adapt<TransactionResponse>();
        }
    }

    public record CreateTransferCommand(Guid SourceWalletId, Guid DestinationWalletId, decimal Amount, CurrencyCode Currency) : IRequest<TransactionResponse>;

    public class CreateTransferCommandHandler : IRequestHandler<CreateTransferCommand, TransactionResponse>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ITransactionLedgerRepository _ledgerRepository;
        private readonly IWalletRepository _walletRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreateTransferCommandHandler(ITransactionRepository transactionRepository, ITransactionLedgerRepository ledgerRepository, IWalletRepository walletRepository, ICurrentUserService currentUserService)
        {
            _transactionRepository = transactionRepository;
            _ledgerRepository = ledgerRepository;
            _walletRepository = walletRepository;
            _currentUserService = currentUserService;
        }

        public async Task<TransactionResponse> Handle(CreateTransferCommand request, CancellationToken cancellationToken)
        {
            var sourceWallet = await _walletRepository.GetByIdAsync(request.SourceWalletId) ?? throw new KeyNotFoundException("Wallet origen no encontrada.");
            var destinationWallet = await _walletRepository.GetByIdAsync(request.DestinationWalletId) ?? throw new KeyNotFoundException("Wallet destino no encontrada.");

            var userId = _currentUserService.GetUserId();
            var isAdmin = _currentUserService.IsAdmin();

            if (!isAdmin && sourceWallet.UserID != userId)
                throw new UnauthorizedAccessException("No puedes operar sobre una wallet que no es tuya");

            var transaction = sourceWallet.Transfer(destinationWallet, request.Amount, request.Currency);

            await _transactionRepository.AddAsync(transaction);
            var ledgers = TransactionLedger.FromTransaction(transaction);
            await _ledgerRepository.AddRangeAsync(ledgers);

            transaction.MarkAsCompleted();
            await _transactionRepository.UpdateAsync(transaction);
            await _walletRepository.UpdateAsync(sourceWallet);
            await _walletRepository.UpdateAsync(destinationWallet);

            return transaction.Adapt<TransactionResponse>();
        }
    }

    public record MarkTransactionAsFailedCommand(Guid Id) : IRequest<TransactionResponse>;

    public class MarkTransactionAsFailedCommandHandler : IRequestHandler<MarkTransactionAsFailedCommand, TransactionResponse>
    {
        private readonly ITransactionRepository _transactionRepository;

        public MarkTransactionAsFailedCommandHandler(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<TransactionResponse> Handle(MarkTransactionAsFailedCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _transactionRepository.GetByIdAsync(request.Id) ?? throw new KeyNotFoundException("Transacción no encontrada");
            transaction.MarkAsFailed();
            await _transactionRepository.UpdateAsync(transaction);
            return transaction.Adapt<TransactionResponse>();
        }
    }

    public record MarkTransactionAsCanceledCommand(Guid Id) : IRequest<TransactionResponse>;

    public class MarkTransactionAsCanceledCommandHandler : IRequestHandler<MarkTransactionAsCanceledCommand, TransactionResponse>
    {
        private readonly ITransactionRepository _transactionRepository;

        public MarkTransactionAsCanceledCommandHandler(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<TransactionResponse> Handle(MarkTransactionAsCanceledCommand request, CancellationToken cancellationToken)
        {
            var transaction = await _transactionRepository.GetByIdAsync(request.Id) ?? throw new KeyNotFoundException("Transacción no encontrada");
            transaction.MarkAsCanceled();
            await _transactionRepository.UpdateAsync(transaction);
            return transaction.Adapt<TransactionResponse>();
        }
    }
}
