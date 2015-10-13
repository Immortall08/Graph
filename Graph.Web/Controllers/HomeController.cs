using System.Web.Mvc;

namespace Graph.Web.Controllers
{
    public class HomeController : GraphControllerBase
    {
        public ActionResult Index()
        { 
            return View("~/App/Main/views/layout/layout.cshtml"); //Layout of the angular application.
        }
	}
}