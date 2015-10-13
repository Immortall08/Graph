using System.Reflection;
using Abp.Application.Services;
using Abp.Modules;
using Abp.WebApi;
using Abp.WebApi.Controllers.Dynamic.Builders;

namespace Graph
{
    [DependsOn(typeof(AbpWebApiModule), typeof(GraphApplicationModule))]
    public class GraphWebApiModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            DynamicApiControllerBuilder
                .ForAll<IApplicationService>(typeof(GraphApplicationModule).Assembly, "app")
                .Build();
        }
    }
}
