package com.cozynest.services;

import com.cozynest.Exceptions.InvalidLanguageException;
import com.cozynest.Exceptions.MaterialTranslationNotFoundException;
import com.cozynest.Exceptions.ProductNotFoundException;
import com.cozynest.Exceptions.ProductTranslationNotFoundException;
import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.dtos.*;
import com.cozynest.entities.languages.Languages;
import com.cozynest.entities.products.Category;
import com.cozynest.entities.products.categoryType.CategoryType;
import com.cozynest.entities.products.materials.MaterialTranslation;
import com.cozynest.entities.products.materials.MaterialTranslationId;
import com.cozynest.entities.products.product.*;
import com.cozynest.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    LanguageRepository languageRepository;

    @Autowired
    ProductTranslationRepository productTranslationRepository;

    @Autowired
    MaterialTranslationRepository materialTranslationRepository;

    @Autowired
    ReviewService reviewService;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CategoryTypesRepository categoryTypesRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    @Autowired
    RedisTemplate<String, Object> redis;

    final int REVIEW_SIZE_PER_PAGE = 3;

    @Transactional
    public ProductResponse getProductDetailsById(UUID productId, String languageCode) {
        UUID languageId = getLanguageIdFromLanguageRepository(languageCode);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with Id"));

        ProductResponse productResponse = new ProductResponse();
        productResponse.setProductId(productId);
        productResponse.setPrice(product.getPrice());
        productResponse.setAvgRating(product.getAvgRating());
        productResponse.setIsNewArrival(product.getIsNewArrival());

        ProductTranslationId productTranslationId = new ProductTranslationId(productId, languageId);
        ProductTranslation productTranslation = productTranslationRepository.findById(productTranslationId)
                .orElseThrow(() -> new ProductTranslationNotFoundException("Product translation not found"));
        productResponse.setName(productTranslation.getName());
        productResponse.setDescription(productTranslation.getDescription());

        Category category = product.getCategory();
        productResponse.setCategoryDto(new CategoryDto(category));

        CategoryType categoryType = product.getCategoryType();
        productResponse.setCategoryTypeDto(new CategoryTypeDto(categoryType));

        List<ProductVariant> productVariantList = product.getProductVariants();
        List<ProductVariantDto> productVariantDtoList = productVariantList.stream()
                .map(productVariant ->
                    {
                        ProductDisplayDto productDisplayDto = new ProductDisplayDto(productVariant.getProductDisplay());
                        return new ProductVariantDto(productVariant);
                    })
                .collect(Collectors.toList());
        productResponse.setProductVariantDtoList(productVariantDtoList);

        //logN (b tree) + m, m is the item in list
        List<ProductDisplay> productDisplayList = product.getProductDisplays();
        List<ProductDisplayDto> productDisplayDtosList =
                productDisplayList.stream()
                        .map(productDisplay -> new ProductDisplayDto(productDisplay))
                        .collect(Collectors.toList());
        productResponse.setProductDisplayDtoList(productDisplayDtosList);

        List<ProductMaterial> productMaterialList = product.getProductMaterials();
        List<ProductMaterialDto> productMaterialDtoList = productMaterialList.stream()
                .map(productMaterial -> {
                    UUID materialId = productMaterial.getMaterial().getId();
                    MaterialTranslationId materialTranslationId = new MaterialTranslationId(materialId, languageId);
                    MaterialTranslation materialTranslation = materialTranslationRepository.findById(materialTranslationId)
                            .orElseThrow(() -> new MaterialTranslationNotFoundException("Material translation not found."));
                    return new ProductMaterialDto(materialTranslation.getName(), productMaterial.getPercentage());
                }).collect(Collectors.toList());
        productResponse.setProductMaterialDtoList(productMaterialDtoList);

        Page<ReviewDto> reviewDtosOnPage = reviewService.getPaginatedReviews(productId, 0, REVIEW_SIZE_PER_PAGE, "createdOn", true);
        productResponse.setReviewList(reviewDtosOnPage.getContent());

        return productResponse;

    }

    public Page<ProductDto> getFilteredProducts(
            String category, int page, int pageSize, String sortBy, String keywords,
            List<String> categoryTypes, Double minPrice, Double maxPrice, List<String> sizes) {

        UUID categoryId = categoryRepository.findByCode(category.toUpperCase()).getId();

        //TODO can be improved by connecting list<categoryType> to category
        List<UUID> categoryTypeIds = new ArrayList<>();
        if (categoryTypes != null && !categoryTypes.isEmpty()) {
            for (String categoryCode : categoryTypes) {
                categoryTypeIds.add(categoryTypesRepository.findByCodeAndCategory_id(categoryCode.toUpperCase(), categoryId).getId());
            }
        }

        List<String> sizeList = new ArrayList<>();
        if (sizes != null && !sizes.isEmpty()) {
            for (String size : sizes) {
                sizeList.add(size.toUpperCase());
            }
        }
        Pageable pageable = createPageable(page, pageSize, sortBy);

        Page<Object[]> filteredProduct = productRepository.findByFilters(categoryId, categoryTypeIds, minPrice,
                maxPrice, sizeList, keywords,pageable);

        Page<ProductDto> categoryProductDtoPage = filteredProduct.map(obj -> {
            ProductDto productDto = convertFilteredProductObjectToDto(obj);
            Optional<Product> product = productRepository.findById(productDto.getProductId());

            List<ProductDisplayDto>  productDisplayDtoList = convertToDtoListHelper.getProductDisplayDtoList(product.get());
            productDto.setProductDisplayDtoList(productDisplayDtoList);

            List<ProductTranslationDto> productTranslationList = convertToDtoListHelper.getProductTranslationDtoList(product.get());
            productDto.setProductTranslationDtoList(productTranslationList);

            productDto.setCategory(product.get().getCategory().getCode());
            productDto.setCategoryTypes(product.get().getCategoryType().getCode());
            return productDto;
        });

        return categoryProductDtoPage;
    }


    private ProductDto convertFilteredProductObjectToDto(Object[] object) {
        ProductDto productDto = new ProductDto();
        productDto.setProductId((UUID) object[0]);
        productDto.setProductPrice((Float) object[1]);
        return productDto;
    }

    private Pageable createPageable(int page, int pageSize, String sortBy) {
        if (sortBy == null) {
            return PageRequest.of(page, pageSize);
        }
        switch (sortBy) {
            case "priceAsc":
                return PageRequest.of(page, pageSize, Sort.by("price").ascending());
            case "priceDesc":
                return PageRequest.of(page, pageSize, Sort.by("price").descending());
            case "rating":
                return PageRequest.of(page, pageSize, Sort.by("avg_rating").descending());
        }
        return PageRequest.of(page, pageSize);
    }

    private UUID getLanguageIdFromLanguageRepository(String languageCode) {
        Languages language = languageRepository.findByCode(languageCode);
        if (language == null) {
            throw new InvalidLanguageException("Invalid language code");
        }
        return language.getId();
    }

    private boolean isNewArrival(Product product) {
        if (product.getCreatedOn().isAfter(LocalDateTime.now().minusDays(7))){
            product.setIsNewArrival(true);
            productRepository.save(product);
            return true;
        }
        return false;
    }

}
