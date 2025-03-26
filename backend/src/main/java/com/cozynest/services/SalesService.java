package com.cozynest.services;

import com.cozynest.entities.Sales;
import com.cozynest.entities.orders.order.Order;
import com.cozynest.entities.orders.order.OrderItem;
import com.cozynest.entities.products.Category;
import com.cozynest.entities.products.categoryType.CategoryType;
import com.cozynest.entities.products.product.Product;
import com.cozynest.repositories.OrderRepository;
import com.cozynest.repositories.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SalesService {

    @Autowired
    SalesRepository salesRepository;

    public void updateSales(Order order) {
        List<OrderItem> orderItemList = order.getOrderItems();
        Map<Product, Integer> map = new HashMap<>();

        for (OrderItem orderItem : orderItemList) {
            Product product = orderItem.getProduct();
            int quantity = orderItem.getQuantity();
            if (!map.containsKey(product)) {
                map.put(product, quantity);
            } else {
                map.put(product, map.get(product) + quantity);
            }
        }

        Sales sales = new Sales();
        for (Product product : map.keySet()) {
            sales.setProduct(product);
            sales.setQuantity(map.get(product));
            sales.setSaleDate(order.getOrderDate());
            sales.setOrder(order);
            Category category = product.getCategory();
            CategoryType categoryType = product.getCategoryType();
            float price = product.getPrice();

            sales.setCategory(category);
            sales.setCategoryType(categoryType);
            sales.setSaleAmount(price * map.get(product));
        }
        salesRepository.save(sales);
    }


}

