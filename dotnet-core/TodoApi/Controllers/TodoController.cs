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
        public async Task<ActionResult<IEnumerable<TodoItem>>> Get()
        {
            using var conn = DbHelper.GetConnection();
            var todos = await conn.QueryAsync<TodoItem>("SELECT Id, Title, Completed FROM Todos");
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetById(long id)
        {
            using var conn = DbHelper.GetConnection();
            var todo = await conn.QueryFirstOrDefaultAsync<TodoItem>(
                "SELECT Id, Title, Completed FROM Todos WHERE Id = @Id", new { Id = id });
            if (todo == null) return NotFound();
            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<TodoItem>> Post([FromBody] TodoItem item)
        {
            using var conn = DbHelper.GetConnection();
            var sql = "INSERT INTO Todos (Title, Completed) VALUES (@Title, @Completed); SELECT last_insert_rowid();";
            var id = await conn.ExecuteScalarAsync<long>(sql, item);
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