using System.ComponentModel.DataAnnotations;

namespace SpaceY.Domain.Entities;

public class ExternalAuthDTO
{
    [Required]
    public string Provider { get; set; } = string.Empty;
    [Required]
    public string IdToken { get; set; } = string.Empty;
}