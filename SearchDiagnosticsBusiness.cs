using EcomTools.Business.App;
using EcomTools.Business.DataObjects.SearchDiagnosticsManager;
using EcomTools.Business.DataObjects.SearchDiagnosticsManager.SearchAnalyzer;
using EcomTools.Business.Services.SearchDiagnosticsManager;
using EcomTools.Data.Repositories;
using EcomTools.Data.Repositories.SearchDiagnosticsManager;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;

namespace EcomTools.Business.Business
{
    public class SearchDiagnosticsBusiness
    {
        private SearchDiagnosticsService _service;
        public SearchDiagnosticsBusiness()
        {
            _service = new SearchDiagnosticsService();
        }

        #region Config Service Code
        public IEnumerable<IndexVersion> GetIndexVersions()
        {
            var retval = _service.GetIndexVersions();
            return retval;
        }
        #endregion

        public Dictionary<string, SearchIndicesContainer> GetElasticSearchIndices()
        {
            Dictionary<string, SearchIndicesContainer> retVal;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Config.SearchDiagnosticsManagerUrl + "_alias");
                {
                    request.ContentType = "application/json";
                    using (StreamReader reader = new StreamReader(((HttpWebResponse)request.GetResponse()).GetResponseStream()))
                    {
                        string value = reader.ReadToEnd();
                        retVal = JsonConvert.DeserializeObject<Dictionary<string, SearchIndicesContainer>>(value);
                    }
                }
            }
            catch (Exception ex)
            {
                retVal = null;
            }
            return retVal;
        }

        #region Product Search
        //Post request to elasticsearch
        public SearchResultWrapper GetElasticSearchResult(string query, string index)
        {
            SearchResultWrapper retVal = new SearchResultWrapper("");
            //regex
            RegexOptions options = RegexOptions.IgnoreCase;
            Match m = Regex.Match(query, Config.ProductStyleRegex, options);
            //If product code invalid add error + error message
            if (m.Value == "") //when code is invalid the regex 'value' property is left empty
            {
                retVal.Errors = true;
                retVal.ErrorMessages.Add("Invalid input");
            }
            //else, make request with valid code
            else
            {
                //Request Body File Path
                var folder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources\\ElasticSearchQueries");
                var path = Path.Combine(folder, "productIdGetRequest.json");

                //Request
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Config.SearchDiagnosticsManagerUrl + index + "/_search");

                //Headers
                string bodyContent = File.ReadAllText(path);
                request.Method = "POST";
                bodyContent = bodyContent.Replace("#value#", query);
                byte[] bytes = Encoding.UTF8.GetBytes(bodyContent);
                request.ContentType = "application/json; encoding='utf-8'";
                request.ContentLength = bytes.Length;

                //Request Stream
                using (Stream requestStream = request.GetRequestStream()) { requestStream.Write(bytes, 0, bytes.Length); }

                //Response Stream                   
                using (StreamReader reader = new StreamReader(((HttpWebResponse)request.GetResponse()).GetResponseStream()))
                {
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        string value = reader.ReadToEnd();
                        retVal = new SearchResultWrapper(value);
                    }
                    else
                    {
                        //TODO return error (bad request/request error
                    };
                }
            };
            return retVal;
        }
        #endregion

        #region Search Stats
        public SearchStatsWrapper GetElasticSearchStats(string query)
        {
            SearchStatsWrapper retVal = new SearchStatsWrapper("");

            //File Path
            var folder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources\\ElasticSearchQueries");
            var path = Path.Combine(folder, "productStatsGetRequest.json");

            //Request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Config.SearchDiagnosticsManagerUrl + "product-search-stats/_search");
            //Headers
            string bodyContent = File.ReadAllText(path);
            bodyContent = bodyContent.Replace("#value#", query);
            byte[] bytes = Encoding.UTF8.GetBytes(bodyContent);
            request.ContentType = "application/json; encoding='utf-8'";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            //Request Stream
            using (Stream requestStream = request.GetRequestStream()) { requestStream.Write(bytes, 0, bytes.Length); }

            //Response
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                using (StreamReader reader = new StreamReader(((HttpWebResponse)request.GetResponse()).GetResponseStream()))
                {
                    string value = reader.ReadToEnd();
                    retVal = new SearchStatsWrapper(value);
                }

            }
            else
            {
                //TODO return error (bad request/request error
            }

            return retVal;
        }
        #endregion

        #region Search Analyzer
        public SearchAnalyzerSearch GetElasticSearchAnalyzer(string product, string query, string index)
        {
            SearchAnalyzerSearch returnVal = new SearchAnalyzerSearch();

            string department = product.Substring(0, 2);
            string style = product.Substring(2, 4);
            string colour = null;
            string size = null;
            if (product.Length > 6)
            {
                colour = product.Substring(6, 2);
                if (product.Length > 8)
                {
                    size = product.Substring(8, 3);
                }
            }

            //Analyze the query
            var searchQueryResult = GetElasticSearch(query, index, "query").SearchAnalyzers.Detail.TokenFilters.Select(filter => new SearchAnalyzerAttributeResult
            {
                TokenName = filter.Name,
                TokenValues = filter.Tokens.Select(token => token.Token).ToArray()
            });

            returnVal.SearchAnalyzerResults = searchQueryResult.ToArray();

            List<SearchAnalyzerAttributeWrapper> productAnalyzerResults = new List<SearchAnalyzerAttributeWrapper>();
            string[] analyzerPropertyValues = Config.SearchAnalyzerProperties.Split(',');
            foreach (string property in analyzerPropertyValues)
            {
                SearchAnalyzerAttributeWrapper attributesWrapper = new SearchAnalyzerAttributeWrapper();

                using (var context = new SearchDiagnosticsEntities())
                {
                    //Retrieve property value from GlobalProductCreate
                    var attribute = context.GetAnalyzerProductPropertyValue(department, style, colour, size, property);

                    if (attribute != null)
                    {
                        //all ProductCreate fields will get an id of 0
                        attributesWrapper.AttributeId = 0;
                        attributesWrapper.AttributeName = property;

                        //Index Analyzer
                        var indexAnalyzerTokenResult = GetElasticSearch(attribute, index, "index").SearchAnalyzers.Detail.TokenFilters.Select(filter => new SearchAnalyzerAttributeResult
                        {
                            TokenName = filter.Name,
                            TokenValues = filter.Tokens.Select(token => token.Token).ToArray()
                        });
                        attributesWrapper.IndexAttributeValue = indexAnalyzerTokenResult.ToArray();

                        //Query Analyzer
                        var queryAnalzyerTokenResult = GetElasticSearch(attribute, index, "query").SearchAnalyzers.Detail.TokenFilters.Select(filter => new SearchAnalyzerAttributeResult
                        {
                            TokenName = filter.Name,
                            TokenValues = filter.Tokens.Select(token => token.Token).ToArray()
                        });
                        attributesWrapper.QueryAttributeValue = queryAnalzyerTokenResult.ToArray();
                        attributesWrapper.AnalyzerComparison = queryAnalzyerTokenResult.Last().TokenValues.Where(tokenVal => indexAnalyzerTokenResult.Last().TokenValues.Contains(tokenVal) != true).ToArray();
                    }
                    //If a return was successful, add to list of final product search fields
                    if (attributesWrapper.AttributeName != null) { productAnalyzerResults.Add(attributesWrapper); }
                };
            }

            string[] analyzerAttributeIds = Config.SearchAnalyzerAttributeIds.Split(',');
            //For each attributeId in attributeIds list, retrieve attribute values for product
            foreach (string id in analyzerAttributeIds)
            {
                int Id = Convert.ToInt32(id);
                SearchAnalyzerAttributeWrapper attributesWrapper = new SearchAnalyzerAttributeWrapper();
                var attribute = GetAttributeValues(Id, department, style, colour, size).FirstOrDefault();
                if (attribute != null)
                {
                    attributesWrapper.AttributeId = attribute.Id;
                    attributesWrapper.AttributeName = attribute.Name;

                    //Index Analyzer
                    var indexAnalyzerTokenResult = GetElasticSearch(attribute.Value, index, "index").SearchAnalyzers.Detail.TokenFilters.Select(filter => new SearchAnalyzerAttributeResult
                    {
                        TokenName = filter.Name,
                        TokenValues = filter.Tokens.Select(token => token.Token).ToArray()
                    });
                    attributesWrapper.IndexAttributeValue = indexAnalyzerTokenResult.ToArray();

                    //Query Analyzer
                    var queryAnalzyerTokenResult = GetElasticSearch(attribute.Value, index, "query").SearchAnalyzers.Detail.TokenFilters.Select(filter => new SearchAnalyzerAttributeResult
                    {
                        TokenName = filter.Name,
                        TokenValues = filter.Tokens.Select(token => token.Token).ToArray()
                    });
                    attributesWrapper.QueryAttributeValue = queryAnalzyerTokenResult.ToArray();
                    attributesWrapper.AnalyzerComparison = queryAnalzyerTokenResult.Last().TokenValues.Where(tokenVal => indexAnalyzerTokenResult.Last().TokenValues.Contains(tokenVal) != true).ToArray();
                }
                if (attributesWrapper.AttributeId != 0) { productAnalyzerResults.Add(attributesWrapper); }
            }
            returnVal.ProductAnalyzerResults = productAnalyzerResults.OrderBy(o => o.AttributeId).ToArray();

            foreach (SearchAnalyzerAttributeWrapper attributeWrapper in returnVal.ProductAnalyzerResults)
            {
                foreach (SearchAnalyzerAttributeResult attributeResult in attributeWrapper.IndexAttributeValue)
                {
                    attributeResult.CleanTokenName();
                }
                foreach (SearchAnalyzerAttributeResult attributeResult in attributeWrapper.QueryAttributeValue)
                {
                    attributeResult.CleanTokenName();
                }
            }

            //Analyzer Differences
            List<SearchAnalyzerTermComparison> terms = new List<SearchAnalyzerTermComparison>();
            string[] analzyedSearchTokens = searchQueryResult.Last().TokenValues;
            foreach (SearchAnalyzerAttributeWrapper attribute in returnVal.ProductAnalyzerResults)
            {
                SearchAnalyzerTermComparison ret = new SearchAnalyzerTermComparison();
                ret.Name = attribute.AttributeName;
                ret.Tokens = attribute.QueryAttributeValue.Last().TokenValues.Intersect(analzyedSearchTokens).ToArray();
                terms.Add(ret);
            }
            returnVal.SearchTermComparison = terms.ToArray();

            //Bad Terms
            List<string> filteredTerms = new List<string>();
            List<string> badTerms = new List<string>();
            foreach (SearchAnalyzerTermComparison term in terms)
            {
                if (term.Tokens != null)
                {
                    filteredTerms.AddRange(term.Tokens);
                }
            }
            foreach (string term in analzyedSearchTokens)
            {
                if (filteredTerms.Contains(term) != true)
                {
                    badTerms.Add(term);
                }
            }
            returnVal.BadSearchTerms = badTerms.ToArray();
            return returnVal;
        }

        public SearchAnalyzerWrapper GetElasticSearch(string search, string index, string analyzerType)
        {
            SearchAnalyzerWrapper retVal = new SearchAnalyzerWrapper("");
            //Request Body File Path
            var folder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources\\ElasticSearchQueries");
            var path = Path.Combine(folder, "analyzerExplainGetRequest.json");
            //Index Analyzer Request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Config.SearchDiagnosticsManagerUrl + index + "/_analyze");
            //Headers
            string bodyContent = File.ReadAllText(path);
            request.Method = "POST";
            bodyContent = bodyContent.Replace("#value#", search);
            bodyContent = bodyContent.Replace("#analyzer#", index + "_" + analyzerType + "_analyzer");
            byte[] bytes = Encoding.UTF8.GetBytes(bodyContent);
            request.ContentType = "application/json; encoding='utf-8'";
            request.ContentLength = bytes.Length;
            //Request Stream
            using (Stream requestStream = request.GetRequestStream()) { requestStream.Write(bytes, 0, bytes.Length); }
            //Response Stream                   
            using (StreamReader reader = new StreamReader(((HttpWebResponse)request.GetResponse()).GetResponseStream()))
            {
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    string value = reader.ReadToEnd();
                    retVal = new SearchAnalyzerWrapper(value);
                }
                else
                {
                    //TODO return error (bad request/request error
                };
            }

            return retVal;
        }

        public List<SearchDiagnosticsAnalyzerGetAttributeValue_Result> GetAttributeValues(int id, string dept, string style, string colour, string size)
        {
            using (var context = new SearchDiagnosticsEntities())
            {

                var attributes = context.SearchDiagnosticsAnalyzerGetAttributeValue(id, dept, style, colour, size);
                return attributes.ToList();
            }
        }

        public List<SearchDiagnosticsAnalyzerGetAttributeValue_Result> GetPropertyValues(string dept, string style, string colour, string size, string property)
        {
            using (var context = new SearchDiagnosticsEntities())
            {
                var properties = context.GetAnalyzerProductProperty(dept, style, colour, size, property);
                return null;
            }
        }
        #endregion

        public List<Website> GetWebsites()
        {
            List<Website> importantWebsites = new List<Website>();

            using (var context = new EcommerceEntities())
            {
                var websites = context.Websites.ToList();
                var websiteIds = new int[] { 804, 3, 1851 };

                importantWebsites.Add(websites.FirstOrDefault(w => w.SWSTORE == 804));
                importantWebsites.Add(websites.FirstOrDefault(w => w.SWSTORE == 3));
                importantWebsites.Add(websites.FirstOrDefault(w => w.SWSTORE == 1851));

                websites.RemoveAll(w => websiteIds.Contains(w.SWSTORE));

                websites = websites.OrderBy(w => w.SWVALUE).ToList();

                importantWebsites.AddRange(websites);

                return importantWebsites;
            }
        }
    }
}