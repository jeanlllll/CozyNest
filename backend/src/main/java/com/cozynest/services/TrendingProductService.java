package com.cozynest.services;

import com.cozynest.entities.Sales;
import com.cozynest.entities.products.Category;
import com.cozynest.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.dtos.ProductDisplayDto;
import com.cozynest.dtos.ProductDto;
import com.cozynest.dtos.ProductTranslationDto;
import com.cozynest.entities.products.product.Product;
import com.cozynest.repositories.CategoryRepository;
import com.cozynest.repositories.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrendingProductService {

    @Autowired
    SalesRepository salesRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    @Autowired
    ProductRedisService productRedisService;

    @Autowired
    ProductRepository productRepository;

    private final int TRENDING_PRODUCT_SIZE = 8;

    @Transactional
    @Scheduled(fixedRate = 1000 * 60 * 60 * 6)
    public void updateTrendingProductByScheduled() {

        Map<String, List<ProductDto>> map = new HashMap<>();

        Pageable pageable = PageRequest.of(0, TRENDING_PRODUCT_SIZE);
        List<UUID> categoryIdList = categoryRepository.findAllCategoryId();

        for (UUID categoryId : categoryIdList) {
            Page<Sales> salesList = salesRepository.findTopSellingProductsIdByCategory(LocalDateTime.now().minusDays(7), categoryId, pageable);

            List<Product> productList = salesList.get().map(sales -> {
                return sales.getProduct();
            }).collect(Collectors.toCollection(() -> new ArrayList<>()));

            if (productList == null) {
                productList = new ArrayList<>();
            }

            for (Product product : productList) {
                product.getProductDisplays().size();
            }

            Category category = categoryRepository.findById(categoryId).get();

            List<ProductDto> productDtoList = new ArrayList<>();

            // edge case, if not enough sales of product in that category

            if (productList.size() < TRENDING_PRODUCT_SIZE) {
                Page<Product> restProductPage = productRepository.findByCategoryNOrderByCreatedDate(categoryId, pageable);
                List<Product> restProductList = restProductPage.getContent();
                for (Product product : restProductList) {
                    if (!productList.contains(product) && productList.size() < TRENDING_PRODUCT_SIZE) {
                        productList.add(product);
                    }
                }
            }
            for (Product product : productList) {
                ProductDto productDto = new ProductDto();
                productDto.setProductId(product.getId());
                productDto.setProductPrice(product.getPrice());
                productDto.setCategory(product.getCategory().getCode());
                productDto.setCategoryTypes(product.getCategoryType().getCode());
                List<ProductTranslationDto> productTranslationDtoList = convertToDtoListHelper.getProductTranslationDtoList(product);
                List<ProductDisplayDto> productDisplayDtoList = convertToDtoListHelper.getProductDisplayDtoList(product);
                productDto.setProductTranslationDtoList(productTranslationDtoList);
                productDto.setProductDisplayDtoList(productDisplayDtoList);
                productDtoList.add(productDto);
            }
            map.put(category.getCode(), productDtoList);
        }
        productRedisService.saveTrendingProductsToRedis(map);
    }

    public Map<String, List<ProductDto>> getTrendingProductsForAllCategory() throws IOException {
        Map<String, List<ProductDto>> map = productRedisService.getTrendingProductsFromRedis();
        if (map == null) {
            updateTrendingProductByScheduled();
        }
        return productRedisService.getTrendingProductsFromRedis();
    }
}



