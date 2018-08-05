using System.Web.Mvc;
using System.Web.Routing;

namespace VerySimpleGis
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            GdalConfiguration.ConfigureOgr();  //register all vector drivers
        }
    }
}
