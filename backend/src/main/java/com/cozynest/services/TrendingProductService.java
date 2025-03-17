package com.cozynest.services;

import com.cozynest.entities.Sales;
import com.cozynest.entities.products.Category;
import com.cozynest.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.dtos.ProductDisplayDto;
import com.cozynest.dtos.ProductHomeDto;
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

    private final int TRENDING_PRODUCT_SIZE = 5;

    @Transactional
    @Scheduled(fixedRate = 1000 * 60 * 60 * 6)
    public void updateTrendingProductByScheduled() {

        Map<String, List<ProductHomeDto>> map = new HashMap<>();

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

            List<ProductHomeDto> productHomeDtoList = new ArrayList<>();

            // edge case, if not enough sales of product in that category

            if (productList.size() < TRENDING_PRODUCT_SIZE) {
                Page<Product> restProductPage = productRepository.findByCategoryNOrderByCreatedDate(categoryId, pageable);
                List<Product> restProductList = restProductPage.getContent();
                System.out.println(restProductList);
                for (Product product : restProductList) {
                    if (!productList.contains(product) && productList.size() < TRENDING_PRODUCT_SIZE) {
                        productList.add(product);
                    }
                }
            }
            for (Product product : productList) {
                ProductHomeDto productHomeDto = new ProductHomeDto();
                productHomeDto.setProductId(product.getId());
                productHomeDto.setProductPrice(product.getPrice());

                List<ProductTranslationDto> productTranslationDtoList = convertToDtoListHelper.getProductTranslationDtoList(product);
                List<ProductDisplayDto> productDisplayDtoList = convertToDtoListHelper.getProductDisplayDtoList(product);
                productHomeDto.setProductTranslattionDtoList(productTranslationDtoList);
                productHomeDto.setProductDisplayDtoList(productDisplayDtoList);
                productHomeDtoList.add(productHomeDto);
            }
            map.put(category.getCode(), productHomeDtoList);
        }
        productRedisService.saveTrendingProductsToRedis(map);
    }

    public Map<String, List<ProductHomeDto>> getTrendingProductsForAllCategory() throws IOException {
        Map<String, List<ProductHomeDto>>  map = productRedisService.getTrendingProductsFromRedis();
        if (map == null) {
            updateTrendingProductByScheduled();
        }
        return productRedisService.getTrendingProductsFromRedis();
    }


}



