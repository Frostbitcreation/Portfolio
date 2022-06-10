using EcomTools.Business.DataObjects.SearchDiagnosticsManager;
using EcomTools.Business.DataObjects.SearchDiagnosticsManager.SearchAnalyzer;
using EcomTools.Web.ViewModels.SearchDiagnosticsManager;
using EcomTools.Web.ViewModels.SearchDiagnosticsManager.ProductSearch;
using EcomTools.Web.ViewModels.SearchDiagnosticsManager.SearchAnalyzer;
using EcomTools.Web.ViewModels.SearchDiagnosticsManager.SearchStats;
using EcomTools.Web.ViewModels.SearchDiagnosticsManager.SearchStats.SearchProcessing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EcomTools.Web.Converter
{
    public class SearchDiagnosticsConverter
    {
        public static SearchFilter SearchFilterView_To_SearchFilter(SearchFilterView filter)
        {
            return new SearchFilter
            {
                Id = filter.Id,
                FilterType = filter.FilterType,
                Enabled = filter.Enabled,
                BaseTerm = filter.BaseTerm,
                CreatedBy = filter.CreatedBy,
                CreatedDate = filter.CreatedDate,
                VersionId = filter.VersionId,
                LinkedTerms = LinkedTermsView_To_LinkedTerms(filter.LinkedTerms).ToList()
            };
        }

        private static IEnumerable<SearchFilter> LinkedTermsView_To_LinkedTerms(IEnumerable<SearchFilterView> linkedTerms)
        {
            List<SearchFilter> retVal = new List<SearchFilter>();

            linkedTerms.ToList().ForEach(term =>
            {
                retVal.Add(new SearchFilter
                {
                    Id = term.Id,
                    FilterType = term.FilterType,
                    Enabled = term.Enabled,
                    BaseTerm = term.BaseTerm,
                    CreatedBy = term.CreatedBy,
                    CreatedDate = term.CreatedDate,
                    VersionId = term.VersionId,
                });
            });

            return retVal;
        }

        public SearchResultWrapperView SearchResultWrapper_to_SearchResultWrapperView(SearchResultWrapper result)
        {
            var shard = result.SearchResponse.Shards;
            var hits = result.SearchResponse.Hits;

            return new SearchResultWrapperView
            {
                ErrorMessages = result.ErrorMessages,
                Errors = result.Errors,
                SearchResponse = new SearchResultRootView(result.SearchResponse.Took,
                                                        result.SearchResponse.TimedOut,
                                                        new SearchResultShardView(shard.Total, shard.Successful, shard.Skipped, shard.Failed),
                                                        new SearchResultHitView(new SearchResultTotalView(result.SearchResponse.Hits.Total.Value, result.SearchResponse.Hits.Total.Relation),
                                                                                              hits.MaxScore,
                                                                                              hits.Hits.Select(hit =>
                                                                                              {
                                                                                                  return
                                                                        new SearchResultHitsView(hit.Index,
                                                                                                     hit.Type,
                                                                                                     hit.Id,
                                                                                                     hit.Score,
                                                                                                     new SearchResultSourceView(hit.Source.Activity,
                                                                                                                                hit.Source.Attributes.Select(attribute => {
                                                                                                                                    return new SearchResultAttributeView(
                                                                                                                                        attribute.Id,
                                                                                                                                        attribute.Colour,
                                                                                                                                        attribute.Size,
                                                                                                                                        attribute.Value);
                                                                                                                                }).ToList(),
                                                                                                                                hit.Source.Category,
                                                                                                                                hit.Source.Categories.Select(cat =>
                                                                                                                                {
                                                                                                                                    return new SearchResultCategoryView(
                                                                                                                                        cat.Code,
                                                                                                                                        cat.Order);
                                                                                                                                }).ToList(),
                                                                                                                                hit.Source.CleanColour,
                                                                                                                                hit.Source.ColourName,
                                                                                                                                hit.Source.ColourVariantID,
                                                                                                                                hit.Source.Gender,
                                                                                                                                hit.Source.HideFromSearch,
                                                                                                                                hit.Source.HideFromCategoryList,
                                                                                                                                hit.Source.Host,
                                                                                                                                hit.Source.IsHidden,
                                                                                                                                hit.Source.IsSearchable,
                                                                                                                                hit.Source.LastModified,
                                                                                                                                hit.Source.Name,
                                                                                                                                hit.Source.ProductId,
                                                                                                                                hit.Source.SellingPrice,
                                                                                                                                hit.Source.SubCategory,
                                                                                                                                hit.Source.SubCategoryGroup,
                                                                                                                                hit.Source.SearchRanking,
                                                                                                                                hit.Source.Sizes,
                                                                                                                                hit.Source.SizeVariantIDs,
                                                                                                                                hit.Source.SiteShortCode,
                                                                                                                                hit.Source.TicketPrice,
                                                                                                                                new SearchResultUnindexedView(hit.Source.Unindexed.ProductName, hit.Source.Unindexed.PriceLabel, hit.Source.Unindexed.ImageSash,
                                                                                                                                                                hit.Source.Unindexed.FlipHonPl, hit.Source.Unindexed.CreateDate, hit.Source.Unindexed.IsFromPrice,
                                                                                                                                                                hit.Source.Unindexed.AltImage, hit.Source.Unindexed.MainImage, hit.Source.Unindexed.HidePrice, 
                                                                                                                                                                hit.Source.Unindexed.ProdSeqNum),
                                                                                                                                hit.Source.WebCat,
                                                                                                                                hit.Source.WebStyle,
                                                                                                                                hit.Source.Timestamp,
                                                                                                                                hit.Source.Version
                                                                                                                                ));
                                                                                              }).ToList())),
                StringResult = result.StringResult
            };
        }

        public SearchStatsWrapperView SearchStatsWrapper_to_SearchSearchStatsWrapperView(SearchStatsWrapper indices)
        {
            var shard = indices.SearchResponse.Shard;
            var hits = indices.SearchResponse.Hits;

            return new SearchStatsWrapperView
            {
                ErrorMessages = indices.ErrorMessages,
                Errors = indices.Errors,
                SearchResponse = new SearchStatsResponseView(indices.SearchResponse.Took,
                                                             indices.SearchResponse.Timed_Out,
                                                             new SearchStatsResponseShardView(shard.Total, shard.Successful, shard.Skipped, shard.Failed),
                                                             new SearchStatsResponseResultContainerView(
                                                                       new StatsResponseResultTotalView(hits.Total.Value, hits.Total.Relation),
                                                                                                        hits.Max_Score,
                                                                                                        hits.Hits.Select(hit =>
                                                                                                        {
                                                                                                            return
                                                                                      new StatsResponseResultView(hit.Index,
                                                                                                                  hit.Type,
                                                                                                                  hit.Id,
                                                                                                                  hit.Score,
                                                                                                                   new StatsResponseSourceView(hit.Source.LogId,
                                                                                                                                               hit.Source.SearchDateTime,
                                                                                                                                               (hit.Source.SearchProcessing == null ? null :
                                                                                                                                               new StatsResponseSourceProcessView(hit.Source.SearchProcessing.DidNoResultsFallback,
                                                                                                                                                                                  hit.Source.SearchProcessing.MergedResultCount,
                                                                                                                                                                                  hit.Source.SearchProcessing.SearchClientElapsedTime,
                                                                                                                                                                                  hit.Source.SearchProcessing.SearchData?.Select(data =>
                                                                                                                                                                                  {
                                                                                                                                                                                      return
                                                                                                                                                        //SearchData array only returns 1 object

                                                                                                                                                        new StatsResponseSourceProcessDataView(data.OriginalResult,
                                                                                                                                                                                               data.Query,
                                                                                                                                                                                               data.RankRanges,
                                                                                                                                                                                               data.Results,
                                                                                                                                                                                               data.Spelling,
                                                                                                                                                                                               data.SpellingNoCat,
                                                                                                                                                                                               data.SuggestSpelling,
                                                                                                                                                                                               data.UsedSpelling,
                                                                                                                                                                                               data.SpellingResults);
                                                                                                                                                                                  }).ToArray(),
                                                                                                                                                                                  hit.Source.SearchProcessing.Team,
                                                                                                                                                                                  hit.Source.SearchProcessing.MatchedCategory,
                                                                                                                                                                                  hit.Source.SearchProcessing.ProductId,
                                                                                                                                                                                  hit.Source.SearchProcessing.SearchTermEnglish)),
                                                                                                                                               new StatsResponseSourceInputView(hit.Source.SearchInput.CategoryFilter,
                                                                                                                                                                                hit.Source.SearchInput.Referrer,
                                                                                                                                                                                hit.Source.SearchInput.UA,
                                                                                                                                                                                hit.Source.SearchInput.Url,
                                                                                                                                                                                hit.Source.SearchInput.UserSearch,
                                                                                                                                                                                hit.Source.SearchInput.Website),
                                                                                                                                               (hit.Source.SearchOutput == null ? null :
                                                                                                                                               new StatsResponseSourceOutputView(hit.Source.SearchOutput.PerformedSearch,
                                                                                                                                                                                 hit.Source.SearchOutput.ResultsFromCache,
                                                                                                                                                                                 hit.Source.SearchOutput.ResultsFromOutputCache,
                                                                                                                                                                                 hit.Source.SearchOutput.ResultCount)
                                                                                                                                               ),
                                                                                                                                               (hit.Source.SearchRedirect == null ? null :
                                                                                                                                               new StatsResponseSourceRedirectView(hit.Source.SearchRedirect.MatchedTerm,
                                                                                                                                                                                   hit.Source.SearchRedirect.ToUrl))));
                                                                                                        }).ToArray())),
                StringResult = indices.StringResult
            };
        }

        public SearchAnalyzerWrapperView SearchAnalyzerWrapper_to_SearchAnalyzerWrapperView(SearchAnalyzerWrapper searchWrapper)
        {
            var details = searchWrapper.SearchAnalyzers.Detail;
            var tokenizer = details.Tokenizer;

            return new SearchAnalyzerWrapperView
            {
                SearchResult = searchWrapper.SearchResult,
                SearchAnalyzer = new SearchAnalyzerContainerView
                {
                    Detail = new SearchAnalyzerResponseView(details.CustomAnalyzer,
                                                            new SearchAnalyzerResponseTokenLabelView(
                                                                    details.Tokenizer.Name,
                                                                    details.Tokenizer.Tokens.Select(token =>
                                                                         {
                                                                             return
                                                                             new SearchAnalyzerResponseTokenView(
                                                                                     token.Token,
                                                                                     token.StartOffset,
                                                                                     token.EndOffset,
                                                                                     token.Type,
                                                                                     token.Position,
                                                                                     token.Bytes,
                                                                                     token.PositionLength,
                                                                                     token.TermFrequency
                                                                                 );
                                                                         }).ToArray()),
                                                            details.TokenFilters.Select(filter =>
                                                            {
                                                                return
                                                                new SearchAnalyzerResponseTokenLabelView(
                                                                    filter.Name,
                                                                    filter.Tokens.Select(token =>
                                                                    {
                                                                        return
                                                                        new SearchAnalyzerResponseTokenView(
                                                                                token.Token,
                                                                                token.StartOffset,
                                                                                token.EndOffset,
                                                                                token.Type,
                                                                                token.Position,
                                                                                token.Bytes,
                                                                                token.PositionLength,
                                                                                token.TermFrequency
                                                                            );
                                                                    }).ToArray());
                                                            }).ToArray())
                }
            };

        }

        public SearchAnalyzerSearchView SearchAnalyzerSearch_to_SearchAnalyzerSearchView(SearchAnalyzerSearch analyzerSearch)
        {
            return new SearchAnalyzerSearchView
            {
                SearchAnalyzerResults = analyzerSearch.SearchAnalyzerResults.Select(token =>
                {
                    return new SearchAnalyzerAttributeResultView(
                      token.TokenName,
                      token.TokenValues);
                }).ToArray(),

                ProductAnalyzerResults = analyzerSearch.ProductAnalyzerResults.Select(attribute =>
                {
                    return new SearchAnalyzerAttributeWrapperView(attribute.AttributeId,
                                                                  attribute.AttributeName,
                                                                  attribute.QueryAttributeValue.Select(token =>
                                                                  {
                                                                      return new SearchAnalyzerAttributeResultView
                                                                      {
                                                                          TokenName = token.TokenName,
                                                                          TokenValues = token.TokenValues
                                                                      };
                                                                  }).ToArray(),
                                                                  attribute.IndexAttributeValue.Select(token =>
                                                                  {
                                                                      return new SearchAnalyzerAttributeResultView
                                                                      {
                                                                          TokenName = token.TokenName,
                                                                          TokenValues = token.TokenValues
                                                                      };
                                                                  }).ToArray(),
                                                                  attribute.AnalyzerComparison);
                }).ToArray(),
                SearchTermComparison = analyzerSearch.SearchTermComparison.Select(termLabel =>
                {
                    return new SearchAnalyzerTermComparisonView
                    {
                        Name = termLabel.Name,
                        Tokens = termLabel.Tokens
                    };
                }).ToArray(),
                BadSearchTerms = analyzerSearch.BadSearchTerms
            };
        }


        public Dictionary<string, SearchIndicesContainerView> SearchIndicesContainer_to_SearchIndicesContainerView(Dictionary<string, SearchIndicesContainer> indices)
        {
            Dictionary<string, SearchIndicesContainerView> retVal = new Dictionary<string, SearchIndicesContainerView>();
            foreach (var index in indices)
            {
                Dictionary<string, SearchIndicesFilterView> tempD = new Dictionary<string, SearchIndicesFilterView>();
                var val = index.Value;

                foreach (var alias in val.Aliases)
                {
                    var valChild = alias.Value;

                    SearchIndicesFilterView newVal = new SearchIndicesFilterView
                    {

                        Filter = valChild.Filter != null ? new SearchIndicesFilterTermView
                        {
                            Term = new SearchIndicesFilterTermShortcodeView
                            {
                                SiteShortCode = valChild.Filter.Term.SiteShortCode
                            }
                        } : null
                    };
                    tempD.Add(alias.Key, newVal);
                };
                retVal.Add(index.Key, new SearchIndicesContainerView { Aliases = tempD });
            }

            return retVal;

        }
    }
}
