using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private static List<TodoItem> Todos = new List<TodoItem>();

        [HttpGet]
        public ActionResult<IEnumerable<TodoItem>> Get() => Todos;

        [HttpPost]
        public ActionResult<TodoItem> Post(TodoItem item)
        {
            item.Id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Todos.Add(item);
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var todo = Todos.FirstOrDefault(t => t.Id == id);
            if (todo == null) return NotFound();
            Todos.Remove(todo);
            return NoContent();
        }
    }
}