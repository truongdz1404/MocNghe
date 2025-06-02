using System.Text.Json.Serialization;

namespace SpaceY.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum OrderStatus
    {
        Pending,
        Shipped,
        Delivered,
        Canceled
    }
}