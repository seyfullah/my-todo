using Microsoft.AspNetCore.Mvc;
using WebAPILambda.Models;
using System;

[Route("api/[controller]")]
public class ValuesController : ControllerBase
{

    [HttpGet]
    public string Get()
    {
        return $"Hello World from inside a Lambda {DateTime.Now}";
    }

    [HttpGet("{id}")]
    public string Get(int id)
    {
        return $"You asked for {id}";
    }

    [HttpPost]
    public IActionResult Post([FromBody] Person person)
    {
        return Ok($"You sent {person.ToString()}");
    }
}