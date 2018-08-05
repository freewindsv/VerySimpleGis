using System.Configuration;
using System.Web.Mvc;
using VerySimpleGis.Models;
using VerySimpleGis.Models.Entities;

namespace VerySimpleGis.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetGeoData(double[] latlng)
        {
            using (GisAccess gis = new GisAccess(ConfigurationManager.AppSettings["SpatialDataSource"]))
            {
                //System.Threading.Thread.Sleep(2000);
                Country country = gis.GetCountryByCoordinates(latlng[1], latlng[0]);
                return country != null ? Json(country) : Json(new object());
            }
        }
    }
}