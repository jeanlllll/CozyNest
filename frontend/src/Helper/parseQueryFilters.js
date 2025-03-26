export const parseQueryFilters = (request) => {
    const url = new URL(request.url);
    const search = url.searchParams;

    return {
        page: parseInt(search.get("page")),
        sortByArrivalDateDesc: search.get("sortByArrivalDateDesc") === "true",
        sortByPriceAsc: search.get("sortByPriceAsc") === "true",
        sortByPriceDesc: search.get("sortByPriceDesc") === "true",
        sortByRatingDesc: search.get("sortByRatingDesc") === "true",
        keywords: search.get("keywords"),
        categoryTypes: search.getAll("categoryTypes"),
        sizes: search.getAll("sizes"),
        minPrice: search.get("minPrice"),
        maxPrice: search.get("maxPrice")
    };
}