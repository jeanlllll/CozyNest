package com.cozynest.controllers;

import com.cozynest.dtos.ProductDto;
import com.cozynest.services.TrendingProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    TrendingProductService trendingProductService;

    /* get the most trending products in each category
       criteria is based on sales amount per unit * sales unit
       data is updated every 6 hours by scheduler in background    */
    @GetMapping("/trendingProducts")
    public ResponseEntity<Map<String, List<ProductDto>>> getTrendingProductsFromAllCategories() throws IOException {
        return ResponseEntity.ok(trendingProductService.getTrendingProductsForAllCategory());
    }
}
