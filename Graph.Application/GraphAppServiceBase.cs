using Abp.Application.Services;

namespace Graph
{
    /// <summary>
    /// Derive your application services from this class.
    /// </summary>
    public abstract class GraphAppServiceBase : ApplicationService
    {
        protected GraphAppServiceBase()
        {
            LocalizationSourceName = GraphConsts.LocalizationSourceName;
        }
    }
}