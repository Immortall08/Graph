using System.Data.Entity.Migrations;

namespace Graph.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<Graph.EntityFramework.GraphDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "Graph";
        }

        protected override void Seed(Graph.EntityFramework.GraphDbContext context)
        {
            // This method will be called every time after migrating to the latest version.
            // You can add any seed data here...
        }
    }
}
