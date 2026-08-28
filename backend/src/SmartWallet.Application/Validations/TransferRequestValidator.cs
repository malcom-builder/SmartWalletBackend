using FluentValidation;
using SmartWallet.Contracts.Requests;
using SmartWallet.Domain.Enums;
using System;

namespace SmartWallet.Application.Validations
{
    public class TransferRequestValidator : AbstractValidator<TransferRequest>
    {
        public TransferRequestValidator()
        {
            RuleFor(x => x.SourceWalletId)
                .NotEmpty().WithMessage("La billetera de origen es requerida.");

            RuleFor(x => x.DestinationWalletId)
                .NotEmpty().WithMessage("La billetera de destino es requerida.")
                .NotEqual(x => x.SourceWalletId).WithMessage("La billetera de destino no puede ser la misma que la de origen.");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("El monto debe ser mayor a cero.");

            RuleFor(x => x.CurrencyCode)
                .NotEmpty().WithMessage("El código de moneda es requerido.")
                .Length(3).WithMessage("El código de moneda debe tener 3 caracteres (ISO 4217).")
                .Must(code => Enum.TryParse<CurrencyCode>(code, true, out _))
                .WithMessage("El código de moneda es inválido.");
        }
    }
}
