using Contracts.Requests;
using FluentValidation;

namespace SmartWallet.Application.Validations
{
    public class UserRegisterRequestValidator : AbstractValidator<UserRegisterRequest>
    {
        public UserRegisterRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es requerido.")
                .Length(3, 100).WithMessage("El nombre debe tener entre 3 y 100 caracteres.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El correo es requerido.")
                .MaximumLength(200).WithMessage("El correo no puede exceder 200 caracteres.")
                .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es requerida.")
                .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.");
        }
    }
}
