using System.Data.Entity;
using System.Reflection;
using Abp.EntityFramework;
using Abp.Modules;
using Graph.EntityFramework;

namespace Graph
{
    [DependsOn(typeof(AbpEntityFrameworkModule), typeof(GraphCoreModule))]
    public class GraphDataModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = "Default";
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
            Database.SetInitializer<GraphDbContext>(null);
        }
    }
}
