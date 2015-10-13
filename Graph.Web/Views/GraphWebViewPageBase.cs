using Abp.Web.Mvc.Views;

namespace Graph.Web.Views
{
    public abstract class GraphWebViewPageBase : GraphWebViewPageBase<dynamic>
    {

    }

    public abstract class GraphWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected GraphWebViewPageBase()
        {
            LocalizationSourceName = GraphConsts.LocalizationSourceName;
        }
    }
}