namespace CsaposApi.Models.DTOs
{
    public class RatingDTO
    {
        public class RatingResponseDTO
        {
            public int Rating { get; set; }
        }

        public class CreateRatingDTO
        {
            public Guid LocationId { get; set; }
            public int Rating { get; set; }
        }
    }
}
