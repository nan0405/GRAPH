using System.Data;

namespace GraphApi.Models;

public class StepDto
{
    public string Step { get; set; } = "";
    public string Pseudo { get; set; } = "";
    public string Explain { get; set; } = "";
    public string Color { get; set; } = "";
    public string State { get; set; } = "";

    // Highlight cho animation
    public HighlightDto Highlight { get; set; } = new HighlightDto();

    // Các node/cạnh đã duyệt (chốt xanh lá)
    public List<string> AcceptedNodes { get; set; } = new();
    public List<string> AcceptedEdges { get; set; } = new();

    public string? VoiceUrl { get; set; }
}
public class HighlightDto
{
    public List<string>? Nodes { get; set; } = new();
    public List<string>? Edges { get; set; } = new();
    public List<string>? RemovedEdges { get; set; } = new(); // ✅ thêm dòng này
}
