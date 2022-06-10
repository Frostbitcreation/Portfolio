using EcomTools.Business.DataObjects.ABTestManager;
using EcomTools.Web.ViewModels.ABTestManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EcomTools.Web.Converter
{
    public class AbTestManagerConverter
    {
        public AbTestExperimentListView TestExperimentList_to_TestExperimentListView(AbTestExperimentList experiments)
        {
            return new AbTestExperimentListView(experiments.ExperimentsList.Select(experiment => {

                return new AbTestExperimentView
                {
                    ID = experiment.ID,
                    Name = experiment.Name,
                    Description = experiment.Description,
                    BranchCode = experiment.BranchCode,
                    SWVALUE = experiment.SWVALUE,
                    Reference = experiment.Reference,
                    CookieName = experiment.CookieName,
                    CookiePersistenceDays = experiment.CookiePersistenceDays,
                    ExternalID = experiment.ExternalID,
                    CreatedDate = experiment.CreatedDate,
                    Status = experiment.Status
                };
            }).ToList());
        }

        public AbTestVariantListView AbTestVariantList_to_AbTestVariantListView(AbTestVariantList variants)
        {
            return new AbTestVariantListView(variants.VariantsList.Select(variant =>
            {
                return new AbTestVariantView
                {
                    Name = variant.Name,
                    CookieValue = variant.CookieValue,
                    AbTestID = variant.AbTestID,
                    ExternalID = variant.ExternalID,
                    PercentageOfTestUsers = variant.PercentageOfTestUsers
                };
            }).ToList());
        }

        public AbTestTypeView AbTestVariantTemplate_to_AbTestVariantTemplateView(AbTestType testType)
        {
            return new AbTestTypeView(testType.Variants.Select(v =>
            {
                return new TestVariantView
                {
                    Name = v.Name,
                    TypeID = v.TypeID,
                    CookieValue = v.CookieValue,
                    TestType = v.TestType,
                    ExternalID = v.ExternalID,
                    CookieName = v.CookieName
                };
            }).ToList());
        }

        public AbTestNewTest AbTestNewTestView_to_AbTestNewTest(AbTestNewTestView newTest)
        {
            return new AbTestNewTest(
                newTest.Name,
                newTest.BranchCode,
                newTest.Description,
                newTest.Reference,
                newTest.CookieName,
                newTest.CookiePersistenceDays,
                newTest.ExternalID,
                newTest.Status,
                newTest.Variants.Select(v =>
                {
                   return new TestVariant
                   {
                       CookieValue = v.CookieValue,
                       Name = v.Name,
                       ExternalID = v.ExternalID,
                       Percentage = v.Percentage,
                       TestType = v.TestType,
                       TypeID = v.TypeID
                   };
                }).ToArray());
        }
    }
}