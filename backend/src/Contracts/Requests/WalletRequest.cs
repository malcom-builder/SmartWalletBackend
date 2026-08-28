namespace Contracts.Requests
{
    public class WalletRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string Alias { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; }
    }
}
