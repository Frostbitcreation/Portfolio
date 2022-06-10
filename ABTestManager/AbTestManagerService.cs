using EcomTools.Business.App;
using EcomTools.Business.DataObjects.ABTestManager;
using EcomTools.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EcomTools.Business.Services.ABTestManager
{
    public class AbTestManagerService
    {
        #region Get
        public IEnumerable<Website> GetAllWebsites()
        {
            using (EcommerceEntities entity = new EcommerceEntities())
            {
                return entity.Websites.Where(w => w.SWSTORE != 11 && w.IsActive == true).AsEnumerable().Select(w =>
                {
                    return new Website
                    {
                        SWSTORE = w.SWSTORE,
                        SHORTNAME = w.SHORTNAME,
                        SWVALUE = w.SWVALUE,
                        WebSite = w.WebSite
                    };
                }).ToList();
            }
        }

        public AbTestExperimentList GetExperiments()
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    return new AbTestExperimentList(entity.EcomToolGetABTests().Select(index =>
                    {
                        return new AbTestExperiment
                        {
                            ID = index.ID,
                            Name = index.Name,
                            Description = index.Description,
                            BranchCode = index.BranchCode,
                            SWVALUE = index.SWVALUE,
                            Reference = index.Reference,
                            CookieName = index.CookieName,
                            CookiePersistenceDays = index.CookiePersistenceDays,
                            ExternalID = index.ExternalID,
                            CreatedDate = (DateTime)index.CreatedDate,
                            Status = index.Status
                        };
                    }).ToList());
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Get Experiments Failed.", ex);
                throw;
            }
        }

        public AbTestVariantList GetVariants(int id)
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    return new AbTestVariantList(entity.EcomToolGetAbTestVariants(id).Select(index =>
                    {
                        return new AbTestVariant
                        {
                            Name = index.Name,
                            CookieValue = index.CookieValue,
                            AbTestID = index.AbTestID,
                            ExternalID = index.ExternalID,
                            PercentageOfTestUsers = index.PercentageOfTestUsers
                        };
                    }).ToList());
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Get variants Failed.", ex);
                throw;
            }
        }

        public AbTestType GetTestType()
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    return new AbTestType(entity.AbTests_GetTypeVariants().Select(v =>
                    {
                        return new TestVariant
                        {
                            Name = v.Name,
                            CookieValue = v.CookieValue,
                            TypeID = v.TypeID,
                            TestType = v.TestType,
                            CookieName = v.CookieName,
                            ExternalID = v.ExternalID
                        };
                    }).ToList());
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Get types Failed.", ex);
                throw;
            }
        }
        #endregion

        #region Update
        public void UpdateVariants(int testid, int variantid, int percentage)
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    entity.UpdateAbTestVariantWeight(testid, variantid, percentage);
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Updates Failed.", ex);
                throw;
            }
        }

        public bool UpdateStatus(string update)
        {
            try
            {
                var status = Jil.JSON.Deserialize<AbTestUpdate>(update);
                using (var entity = new EcommerceEntities())
                {
                    return entity.UpdateAbTestStatus(status.Id, status.Status) != 0;
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Update experiment Failed.", ex);
                throw;
            }
        }
        #endregion

        public void DeleteExperiment(int abTestId)
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    entity.DeleteAbTestExperiment(abTestId);
                }
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests - Delete experiment Failed.", ex);
                throw;
            }
        }

        /* */
        public bool CreateExperiment(string jsonString)
        {
            using (var entity = new EcommerceEntities())
            {
                var experiment = Jil.JSON.Deserialize<AbTestNewTest>(jsonString);

                try
                {
                    if (experiment != null)
                    {
                        //Add Experiment to dbo.AbTest
                        entity.AbTestsAddExperiment(experiment.Name, experiment.Reference, experiment.CookieName,
                            experiment.CookiePersistenceDays, experiment.ExternalID, experiment.Status.Contains("Enabled"), experiment.Status, experiment.Description);

                        //Add test Variants to dbo.AbTestVariant
                        experiment.Variants.ToList().ForEach(v =>
                        {
                            if (v.Percentage != 0)
                            {
                                entity.AbTestsAddVariants(v.Name, v.CookieValue, experiment.ExternalID, v.ExternalID, v.Percentage);
                            }
                        });

                        //Add test log to AbTestWebsite
                        entity.AbTestsAddSite(experiment.ExternalID, experiment.BranchCode);
                        return true;
                    }

                    return false;
                }
                catch (Exception ex)
                {
                    App.Logger.Error("Ab Tests Create - Add Test Failed.", ex);
                    throw;
                }
            }
        }

        public bool FlushCache()
        {
            try
            {
                using (var entity = new EcommerceEntities())
                {
                    entity.CacheClear_Request_ABTests(false, null);
                }
                return true;
            }
            catch (Exception ex)
            {
                App.Logger.Error("Ab Tests Flush - Error requesting cache flush", ex);
                return false;
            }
        }
    }
}
