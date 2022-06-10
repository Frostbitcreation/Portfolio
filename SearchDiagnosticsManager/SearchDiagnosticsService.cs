using EcomTools.Business.App;
using EcomTools.Business.DataObjects.SearchDiagnosticsManager;
using EcomTools.Data.Repositories;
using EcomTools.Data.Repositories.SearchConfigManager;
using EcomTools.Data.Repositories.SearchDiagnosticsManager;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EcomTools.Business.Services.SearchDiagnosticsManager
{
    public class SearchDiagnosticsService
    {
        #region Read
        public IEnumerable<IndexVersion> GetIndexVersions() {
                try
                {
                    using (var entity = new SearchDiagnosticsEntities())
                    {
                        return entity.SearchDiagnosticsGetIndexVersions().Select(index =>
                        {
                            return new IndexVersion
                            {
                                VersionId = index.Id,
                                IndexId = index.IndexId,
                                IndexName = index.DisplayName,
                                VersionNumber = index.VersionNumber,
                                Live = index.Live,
                                Working = index.Working,
                                Comment = index.Comment,
                                CreatedDateTime = index.CreatedDateTime,
                                Websites = GetWebsites(index.IndexId),
                                PreviewIndex = index.PreviewIndex,
                                LiveIndex = index.LiveIndex
                            };
                        }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    App.Logger.Error("Search Diagnostics - Get Index Versions Failed.", ex);
                    throw;
                }
        }

        public IEnumerable<IndexWebsite> GetWebsites(int indexId)
        {
            try
            {
                using (var entity = new SearchConfigEntities())
                {
                    return entity.SearchConfigGetIndexWebsites(indexId).Select(website =>
                    {
                        return new IndexWebsite
                        {
                            Name = website.SWVALUE,
                            SiteCode = website.SWSTORE
                        };
                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Search Config - Get Index Websites Failed.", ex);
                throw;
            }
        }
            #endregion
    }
}
