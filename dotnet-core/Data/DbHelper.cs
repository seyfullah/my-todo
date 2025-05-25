using Microsoft.Data.Sqlite;
using System.Data;
using Dapper;

namespace TodoApi.Data
{
    public static class DbHelper
    {
        public static IDbConnection GetConnection()
            => new SqliteConnection("Data Source=todos.db");

        public static void EnsureDb()
        {
            using var conn = GetConnection();
            conn.Open();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"CREATE TABLE IF NOT EXISTS Todos (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT NOT NULL,
                Completed INTEGER NOT NULL
            );";
            cmd.ExecuteNonQuery();

            // Insert sample data if table is empty
            var count = conn.ExecuteScalar<long>("SELECT COUNT(*) FROM Todos");
            if (count == 0)
            {
                conn.Execute("INSERT INTO Todos (Title, Completed) VALUES (@Title, @Completed)",
                    new[]
                    {
                        new { Title = "Next.js Öğren ", Completed = 0 },
                        new { Title = "Build a Todo API", Completed = 0 },
                        new { Title = "Test with .http file", Completed = 0 }
                    });
            }
        }
    }
}