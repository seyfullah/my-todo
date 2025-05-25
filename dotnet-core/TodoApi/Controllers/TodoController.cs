using Microsoft.AspNetCore.Mvc;
using Dapper;
using TodoApi.Models;
using TodoApi.Data;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        public TodoController()
        {
            DbHelper.EnsureDb();
        }

        [HttpGet]
        public IActionResult Get()
        {
            using var conn = DbHelper.GetConnection();
            var todos = conn.Query<TodoItem>("SELECT * FROM Todos").ToList();
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            using var conn = DbHelper.GetConnection();
            var todo = conn.QueryFirstOrDefault<TodoItem>("SELECT * FROM Todos WHERE Id = @Id", new { Id = id });
            if (todo == null) return NotFound();
            return Ok(todo);
        }

        [HttpPost]
        public IActionResult Post([FromBody] TodoItem item)
        {
            using var conn = DbHelper.GetConnection();
            var sql = "INSERT INTO Todos (Title, Completed) VALUES (@Title, @Completed); SELECT last_insert_rowid();";
            var id = conn.ExecuteScalar<long>(sql, item);
            item.Id = id;
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            using var conn = DbHelper.GetConnection();
            var affected = conn.Execute("DELETE FROM Todos WHERE Id = @Id", new { Id = id });
            if (affected == 0) return NotFound();
            return NoContent();
        }
    }
}