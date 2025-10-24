using System.Text.Json.Serialization;

public class EdgeDto
{
    [JsonPropertyName("From")]
    public string From { get; set; }

    [JsonPropertyName("To")]
    public string To { get; set; }

    [JsonPropertyName("Weight")]
    public int Weight { get; set; }
}
