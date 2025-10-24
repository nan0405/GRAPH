namespace GraphApi.Models;

public class GraphRequest
{
    public List<string> Nodes { get; set; } = new();
    public List<Edge> Edges { get; set; } = new();
    public bool Directed { get; set; }
}

public class Edge
{
    public string From { get; set; } = "";
    public string To { get; set; } = "";
    public int Weight { get; set; }
}
