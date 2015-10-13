using Abp.Web.Mvc.Controllers;

namespace Graph.Web.Controllers
{
    /// <summary>
    /// Derive all Controllers from this class.
    /// </summary>
    public abstract class GraphControllerBase : AbpController
    {
        protected GraphControllerBase()
        {
            LocalizationSourceName = GraphConsts.LocalizationSourceName;
        }
    }
}