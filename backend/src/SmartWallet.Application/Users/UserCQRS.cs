using Contracts.Requests;
using Contracts.Responses;
using Mapster;
using MediatR;
using SmartWallet.Application.Abstractions;
using SmartWallet.Application.Services;
using SmartWallet.Domain.Entities;
using SmartWallet.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace SmartWallet.Application.Users
{
    // --- Queries ---

    public record GetAllUsersQuery() : IRequest<List<UserResponse>>;

    public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserResponse>>
    {
        private readonly IUserRepository _repository;
        public GetAllUsersQueryHandler(IUserRepository repository) => _repository = repository;

        public async Task<List<UserResponse>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _repository.GetAllAsync();
            return users.Adapt<List<UserResponse>>();
        }
    }

    public record GetUserByIdQuery(Guid Id) : IRequest<UserResponse?>;

    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserResponse?>
    {
        private readonly IUserRepository _repository;
        public GetUserByIdQueryHandler(IUserRepository repository) => _repository = repository;

        public async Task<UserResponse?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _repository.GetByIdAsync(request.Id);
            return user?.Adapt<UserResponse>();
        }
    }

    public record GetUserByEmailQuery(string Email) : IRequest<UserResponse?>;

    public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, UserResponse?>
    {
        private readonly IUserRepository _repository;
        public GetUserByEmailQueryHandler(IUserRepository repository) => _repository = repository;

        public async Task<UserResponse?> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            var user = await _repository.GetUserByEmailAsync(request.Email);
            return user?.Adapt<UserResponse>();
        }
    }

    // --- Commands ---

    public record RegisterUserCommand(string Name, string Email, string Password) : IRequest<UserwithWalletResponse?>;

    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, UserwithWalletResponse?>
    {
        private readonly IUserRepository _userRepository;
        private readonly ISender _sender;

        public RegisterUserCommandHandler(IUserRepository userRepository, ISender sender)
        {
            _userRepository = userRepository;
            _sender = sender;
        }

        public async Task<UserwithWalletResponse?> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
            if (existingUser != null) return null;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new User(request.Name, request.Email, passwordHash, SmartWallet.Domain.Enums.UserRole.Regular, true);

            var created = await _userRepository.CreateAsync(newUser);
            if (!created) return null;

            Guid walletId = Guid.Empty;
            string walletAlias = string.Empty;

            try
            {
                var alias = GenerateAlias(newUser.Name, newUser.Email);
                var wallet = await _sender.Send(new SmartWallet.Application.Wallets.CreateWalletCommand(newUser.Id, $"{newUser.Name} - Principal", CurrencyCode.ARS, alias, 0m));
                if (wallet != null)
                {
                    walletId = wallet.Id;
                    walletAlias = wallet.Alias;
                }
            }
            catch
            {
                try { await _userRepository.DeleteAsync(newUser); } catch { /* swallow */ }
                return null;
            }

            var response = newUser.Adapt<UserwithWalletResponse>();
            response.WalletId = walletId;
            response.WalletAlias = walletAlias;
            return response;
        }

        private string GenerateAlias(string name, string email)
        {
            var source = string.IsNullOrWhiteSpace(name) ? (email?.Split('@')[0] ?? "user") : name;
            var normalized = source.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();
            foreach (var ch in normalized)
            {
                var cat = CharUnicodeInfo.GetUnicodeCategory(ch);
                if (cat == UnicodeCategory.UppercaseLetter || cat == UnicodeCategory.LowercaseLetter)
                    sb.Append(ch);
                else if (char.IsWhiteSpace(ch))
                    sb.Append('.');
                else if (ch == '.')
                    sb.Append('.');
            }

            var s = sb.ToString().ToLowerInvariant();
            s = Regex.Replace(s, "[^a-z.]", "");
            s = Regex.Replace(s, @"\.{2,}", ".");
            s = s.Trim('.');
            if (s.Length < 6) s = s + new string('x', 6 - s.Length);
            if (s.Length > 20) s = s.Substring(0, 20);
            return s;
        }
    }

    public record CreateAdminUserCommand(string Name, string Email, string Password, int Role) : IRequest<UserResponse?>;

    public class CreateAdminUserCommandHandler : IRequestHandler<CreateAdminUserCommand, UserResponse?>
    {
        private readonly IUserRepository _userRepository;

        public CreateAdminUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse?> Handle(CreateAdminUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
            if (existingUser != null) return null;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var newUser = new User(request.Name, request.Email, passwordHash, (SmartWallet.Domain.Enums.UserRole)request.Role, true);

            var created = await _userRepository.CreateAsync(newUser);
            if (!created) return null;

            return newUser.Adapt<UserResponse>();
        }
    }

    public record UpdateUserCommand(Guid Id, string? Name, string? Password, bool? Active) : IRequest<UserResponse?>;

    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserResponse?>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse?> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Name))
                user.ChangeName(request.Name);

            if (!string.IsNullOrWhiteSpace(request.Password))
                user.ChangePassword(BCrypt.Net.BCrypt.HashPassword(request.Password));

            if (request.Active != null)
                user.SetActive(request.Active.Value);

            var updated = await _userRepository.UpdateAsync(user);
            if (!updated) return null;

            return user.Adapt<UserResponse>();
        }
    }

    public record ChangeUserActiveStatusCommand(Guid Id) : IRequest<UserResponse?>;

    public class ChangeUserActiveStatusCommandHandler : IRequestHandler<ChangeUserActiveStatusCommand, UserResponse?>
    {
        private readonly IUserRepository _userRepository;

        public ChangeUserActiveStatusCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse?> Handle(ChangeUserActiveStatusCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (user == null) return null;
            user.SetActive(!user.Active);
            var updated = await _userRepository.UpdateAsync(user);
            if (!updated) return null;
            return user.Adapt<UserResponse>();
        }
    }

    public record DeleteUserCommand(Guid Id) : IRequest<bool>;

    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private readonly IUserRepository _userRepository;

        public DeleteUserCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (user == null) return false;
            user.SetActive(false);
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
}
