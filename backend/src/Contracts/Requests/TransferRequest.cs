namespace SmartWallet.Contracts.Requests
{
    public class TransferRequest
    {
        public Guid SourceWalletId { get; init; }
        public Guid DestinationWalletId { get; init; }
        public decimal Amount { get; init; }
        public string CurrencyCode { get; init; } = string.Empty;
    }
}
