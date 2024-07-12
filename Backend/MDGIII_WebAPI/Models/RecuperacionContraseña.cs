namespace MDGIII_WebAPI.Models
{
    public class RecuperacionContraseña
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
