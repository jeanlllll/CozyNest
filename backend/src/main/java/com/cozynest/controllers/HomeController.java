package com.cozynest.controllers;

import com.cozynest.dtos.ProductHomeDto;
import com.cozynest.services.TrendingProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    TrendingProductService trendingProductService;

    @GetMapping
    public ResponseEntity<Map<String, List<ProductHomeDto>>> getTrendingProductsFromAllCategories() throws IOException {
        return ResponseEntity.ok(trendingProductService.getTrendingProductsForAllCategory());
    }
}
