using Contracts.Requests;
using Contracts.Responses;
using Mapster;
using MediatR;
using SmartWallet.Application.Abstractions.Persistence;
using SmartWallet.Domain.Entities;
using SmartWallet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SmartWallet.Application.Wallets
{
    // --- Queries ---

    public record GetAllWalletsQuery() : IRequest<List<WalletResponse>>;

    public class GetAllWalletsQueryHandler : IRequestHandler<GetAllWalletsQuery, List<WalletResponse>>
    {
        private readonly IWalletRepository _repository;
        public GetAllWalletsQueryHandler(IWalletRepository repository) => _repository = repository;

        public async Task<List<WalletResponse>> Handle(GetAllWalletsQuery request, CancellationToken cancellationToken)
        {
            var wallets = await _repository.GetAllAsync();
            return wallets.Adapt<List<WalletResponse>>();
        }
    }

    public record GetWalletsByUserQuery(Guid UserId) : IRequest<List<WalletResponse>>;

    public class GetWalletsByUserQueryHandler : IRequestHandler<GetWalletsByUserQuery, List<WalletResponse>>
    {
        private readonly IWalletRepository _repository;
        public GetWalletsByUserQueryHandler(IWalletRepository repository) => _repository = repository;

        public async Task<List<WalletResponse>> Handle(GetWalletsByUserQuery request, CancellationToken cancellationToken)
        {
            var wallets = await _repository.GetByUserIdAsync(request.UserId);
            return wallets.Adapt<List<WalletResponse>>();
        }
    }

    public record GetWalletByAliasQuery(string Alias) : IRequest<WalletResponse?>;

    public class GetWalletByAliasQueryHandler : IRequestHandler<GetWalletByAliasQuery, WalletResponse?>
    {
        private readonly IWalletRepository _repository;
        public GetWalletByAliasQueryHandler(IWalletRepository repository) => _repository = repository;

        public async Task<WalletResponse?> Handle(GetWalletByAliasQuery request, CancellationToken cancellationToken)
        {
            var wallet = await _repository.GetByAliasAsync(request.Alias);
            return wallet?.Adapt<WalletResponse>();
        }
    }

    public record GetWalletByIdQuery(Guid Id) : IRequest<Wallet?>;

    public class GetWalletByIdQueryHandler : IRequestHandler<GetWalletByIdQuery, Wallet?>
    {
        private readonly IWalletRepository _repository;
        public GetWalletByIdQueryHandler(IWalletRepository repository) => _repository = repository;

        public async Task<Wallet?> Handle(GetWalletByIdQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetByIdAsync(request.Id);
        }
    }

    // --- Commands ---

    public record CreateWalletCommand(Guid UserId, string Name, CurrencyCode CurrencyCode, string Alias, decimal InitialBalance) : IRequest<WalletResponse>;

    public class CreateWalletCommandHandler : IRequestHandler<CreateWalletCommand, WalletResponse>
    {
        private readonly IWalletRepository _repository;

        public CreateWalletCommandHandler(IWalletRepository repository)
        {
            _repository = repository;
        }

        public async Task<WalletResponse> Handle(CreateWalletCommand request, CancellationToken cancellationToken)
        {
            var wallet = new Wallet(request.UserId, request.Name, request.CurrencyCode, request.Alias, request.InitialBalance);
            await _repository.AddAsync(wallet);
            return wallet.Adapt<WalletResponse>();
        }
    }
}
