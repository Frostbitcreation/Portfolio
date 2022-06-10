using EcomTools.Data.Repositories;
using EcomTools.Business.DataObjects.ABTestManager;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.IO;
using System.Text;
using EcomTools.Business.Services.ABTestManager;

namespace EcomTools.Business.Business
{
    public class AbTestManagerBusiness
    {
        private AbTestManagerService _service;
        public AbTestManagerBusiness()
        {
            _service = new AbTestManagerService();
        }

        public IEnumerable<Website> GetAllWebsites()
        {
            var retVal = _service.GetAllWebsites().ToList();
            retVal.RemoveAll(w => w.SWVALUE.ToLower().Contains("mobile"));
            retVal.RemoveAll(w => w.SWVALUE.ToLower().Contains("app"));
            retVal = retVal.OrderBy(w => w.SWVALUE).ToList();
            return retVal;
        }

        public AbTestExperimentList GetExperiments()
        {
            return _service.GetExperiments();
        }

        public AbTestVariantList GetVariants(int id)
        {
            return _service.GetVariants(id);
        }

        public AbTestType GetTestType()
        {
            return _service.GetTestType();
        }
        
        public void UpdateVariants(int testid, int variantid, int percentage)
        {
            _service.UpdateVariants(testid, variantid, percentage);
        }

        public void UpdateStatus(string update)
        {
            _service.UpdateStatus(update);
        }

        public void DeleteExperiment(int abTestId)
        {
            _service.DeleteExperiment(abTestId);
        }

        public bool CreateExperiment(string newTest)
        {
            return _service.CreateExperiment(newTest);
        }

        public bool CacheClear()
        {
            return _service.FlushCache();
        }
    }
}