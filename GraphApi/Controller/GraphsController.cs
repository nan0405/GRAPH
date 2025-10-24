using GraphApi.Models;
using GraphApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace GraphApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphsController : ControllerBase
{
    private readonly DijkstraService _service;

    public GraphsController(DijkstraService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Create([FromBody] GraphRequest request)
    {
        var id = _service.CreateGraph(request);
        return Ok(new { id });
    }

    [HttpGet("{id}/teach")]
    public IActionResult Teach(Guid id, [FromQuery] string start)
    {
        var steps = _service.Run(id, start);
        // chia steps thành pages size = 6 để khớp frontend
        var pages = steps
            .Select((s, i) => new { s, i })
            .GroupBy(x => x.i / 6)
            .Select(g => g.Select(x => x.s).ToList())
            .ToList();

        return Ok(new { pages });
    }
}
