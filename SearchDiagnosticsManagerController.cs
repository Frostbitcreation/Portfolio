using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EcomTools.Business.App;
using EcomTools.Web.Attribute;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace EcomTools.Web.Controllers
{
    [SecurityFilter(AppType.SearchDiagnosticsManager, false)]
    public class SearchDiagnosticsManagerController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Versions()
        {
            return RedirectToAction("Index");
        }

        public ActionResult Help()
        {
            return RedirectToAction("Index");
        }
    }
}
