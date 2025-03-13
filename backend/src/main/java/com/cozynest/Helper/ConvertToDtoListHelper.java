package com.cozynest.Helper;

import com.cozynest.dtos.AddressDto;
import com.cozynest.dtos.ProductDisplayDto;
import com.cozynest.dtos.ProductTranslationDto;
import com.cozynest.dtos.ProductVariantDto;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductDisplay;
import com.cozynest.entities.products.product.ProductTranslation;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.entities.profiles.Address;
import com.cozynest.repositories.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.swing.plaf.nimbus.State;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class ConvertToDtoListHelper {

    @Autowired
    LanguageRepository languageRepository;

    public List<ProductTranslationDto> getProductTranslationDtoList(Product product) {
        List<ProductTranslationDto> productTranslationDtoList = new ArrayList<>();
        List<ProductTranslation> productTranslationList = product.getProductTranslationList();

        for (ProductTranslation productTranslation : productTranslationList) {
            ProductTranslationDto productTranslationDto = new ProductTranslationDto();
            UUID languageId = productTranslation.getId().getLanguageId();

            String languageCode = languageRepository.findById(languageId)
                    .map(languages -> languages.getCode())
                    .orElse(null);

            productTranslationDto.setLanguageCode(languageCode);
            productTranslationDto.setProductName(productTranslation.getName());
            productTranslationDtoList.add(productTranslationDto);
        }
        return productTranslationDtoList;
    }

    public List<ProductDisplayDto> getProductDisplayDetail(Product product) {
        List<ProductDisplay> productDisplays = product.getProductDisplays();
        List<ProductDisplayDto> productDisplayDtoList = new ArrayList<>();

        if (productDisplays != null) {
            for (ProductDisplay productDisplay : productDisplays) {
                ProductDisplayDto productDisplayDto = new ProductDisplayDto(productDisplay);
                productDisplayDtoList.add(productDisplayDto);
            }
        }
        return productDisplayDtoList;
    }

    public ProductDisplayDto getPrimaryProductDisplayDetail(Product product) {
        List<ProductDisplay> productDisplays = product.getProductDisplays();

        if (productDisplays != null) {
            for (ProductDisplay productDisplay : productDisplays) {
                if (productDisplay.getIsPrimary()) {
                    return new ProductDisplayDto(productDisplay);
                }
            }
        }
        return null;
    }

    public ProductVariantDto convertProductVariantDto(ProductVariant productVariant) {
        ProductVariantDto productVariantDto = new ProductVariantDto();
        productVariantDto.setId(productVariant.getId());
        productVariantDto.setColor(productVariant.getColor());
        productVariantDto.setSize(productVariant.getSize());
        productVariantDto.setStockQuantity(productVariant.getStockQuantity());
        productVariantDto.setGender(productVariant.getGender());
        return productVariantDto;
    }

    public AddressDto convertAddressToAddressDto(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setAddressId(address.getId());
        addressDto.setFloorNBuilding(address.getFloorNBuilding());
        addressDto.setStreet(address.getStreet());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        addressDto.setPostalCode(address.getPostalCode());
        addressDto.setCountry(address.getCountry());
        return addressDto;
    }

    public List<AddressDto> convertAddressListToAddressDtoList(List<Address> addressList) {
        List<AddressDto> addressDtoList = new ArrayList<>();
        for (Address address : addressList) {
            addressDtoList.add(convertAddressToAddressDto(address));
        }
        return addressDtoList;
    }
}
