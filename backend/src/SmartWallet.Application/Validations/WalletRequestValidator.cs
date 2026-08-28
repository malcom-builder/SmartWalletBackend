using Contracts.Requests;
using FluentValidation;
using SmartWallet.Domain.Enums;
using System;

namespace SmartWallet.Application.Validations
{
    public class WalletRequestValidator : AbstractValidator<WalletRequest>
    {
        public WalletRequestValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("El UserId es requerido.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre de la billetera es requerido.");

            RuleFor(x => x.CurrencyCode)
                .NotEmpty().WithMessage("El código de moneda es requerido.")
                .Must(code => Enum.TryParse<CurrencyCode>(code, true, out _))
                .WithMessage("El código de moneda es inválido.");

            RuleFor(x => x.Alias)
                .NotEmpty().WithMessage("El alias es requerido.");

            RuleFor(x => x.InitialBalance)
                .GreaterThanOrEqualTo(0).WithMessage("El balance inicial no puede ser negativo.");
        }
    }
}
