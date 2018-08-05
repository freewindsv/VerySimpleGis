using OSGeo.OGR;
using System;
using System.Globalization;
using VerySimpleGis.Models.Entities;

namespace VerySimpleGis.Models
{
    public class GisAccess : IDisposable
    {
        private const int OGRERR_NONE = 0;
        private const int GEOM_FIELD_IDX = 0;
        private const int COUNTRY_ATTR_NAME_IDX = 4;

        private NumberFormatInfo nfi = new NumberFormatInfo() { CurrencyDecimalSeparator = "." };

        protected bool disposed = false;
        protected DataSource ds;
        protected Layer layer;

        public GisAccess(string dataSource)
        {
            ds = Ogr.Open(dataSource, 0);

            if (ds == null)
            {
                throw new GisException("DataSource object is null");
            }

            if (ds.GetLayerCount() == 0)
            {
                ds.Dispose();
                ds = null;
                throw new GisException("Datasource has no layers");
            }

            layer = ds.GetLayerByIndex(0);
        }

        public Country GetCountryByCoordinates(double x, double y)
        {
            x = Normalize(x);
            string wkt = $"POINT({x.ToString(nfi)} {y.ToString(nfi)})";
            Geometry filter = null;
            Feature feature = null;
            try
            {
                filter = Ogr.CreateGeometryFromWkt(ref wkt, layer.GetLayerDefn().GetGeomFieldDefn(GEOM_FIELD_IDX).GetSpatialRef());
                layer.SetSpatialFilter(filter);
                feature = layer.GetNextFeature();
                if (feature != null)
                {
                    string featureWkt = null;
                    int error = feature.GetGeomFieldRef(GEOM_FIELD_IDX).ExportToWkt(out featureWkt);
                    if (error == OGRERR_NONE)
                    {
                        return new Country() { Name = feature.GetFieldAsString(COUNTRY_ATTR_NAME_IDX), GeomWKT = featureWkt };
                    }
                }
            }
            catch(Exception ex)
            {
                throw new GisException("Error getting feature by coordinates", ex);
            }
            finally
            {
                if (filter != null)
                {
                    filter.Dispose();
                }
                if (feature != null)
                {
                    feature.Dispose();
                }
            }
            return null;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Защищенная реализация метода Dispose
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                // Очистить все управляемые объекты
                if (layer != null)
                {
                    layer.Dispose();
                    layer = null;
                }

                if (ds != null)
                {
                    ds.Dispose();
                    ds = null;
                }
            }

            // Освободить все неуправляемые ресурсы
            // ...
            disposed = true;
        }

        private double Normalize(double x)
        {
            x = x % 360;
            if (x > 180)
            {
                x -= 360;
            }
            else if (x < -180)
            {
                x += 360;
            }
            return x;
        }

        ~GisAccess()
        {
            Dispose(false);
        }
    }
}