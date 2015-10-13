using System.Reflection;
using Abp.Modules;

namespace Graph
{
    public class GraphCoreModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
