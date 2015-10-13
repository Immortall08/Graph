using System.Reflection;
using Abp.Modules;

namespace Graph
{
    [DependsOn(typeof(GraphCoreModule))]
    public class GraphApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
