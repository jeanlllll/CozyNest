package com.cozynest.services;

import com.cozynest.Helper.ConvertToDtoListHelper;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.AddressDto;
import com.cozynest.dtos.ApiResponse;
import com.cozynest.dtos.ProfileDto;
import com.cozynest.entities.profiles.Address;
import com.cozynest.repositories.AddressRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.apache.logging.log4j.ThreadContext.containsKey;

@Service
public class ClientProfileService {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ConvertToDtoListHelper convertToDtoListHelper;

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    AddressRepository addressRepository;

    final private int SORTED_ADDRESS_LIMIT = 5;

    public ProfileDto getClientProfile(UUID clientId) {
        Client client = clientRepository.findById(clientId).get();
        String phoneNumber = client.getPhoneNumber();
        ShopUser shopuser = shopUserRepository.findById(clientId).get();

        List<Address> addressList = client.getAddressList();
        List<AddressDto> addressDtoList = convertToDtoListHelper.convertAddressListToAddressDtoList(addressList);
        return ProfileDto.builder()
                .phoneNumber(phoneNumber)
                .addressList(addressDtoList)
                .firstName(shopuser.getFirstName())
                .lastName(shopuser.getLastName())
                .build();
    }

    @Transactional
    public ApiResponse updateClientProfile(UUID clientId, ProfileDto profileDto) throws Exception {
        ShopUser shopUser = shopUserRepository.findById(clientId).get();
        shopUser.setFirstName(profileDto.getFirstName());
        shopUser.setLastName(profileDto.getLastName());
        shopUserRepository.save(shopUser);

        Client client = clientRepository.findById(clientId).get();
        client.setPhoneNumber(profileDto.getPhoneNumber());
        List<Address> addressList = client.getAddressList();

        Map<UUID, Address> addressMap = new HashMap<>();
        for (Address address: addressList) {
            addressMap.put(address.getId(), address);
        }

        List<String> errors = new ArrayList<>();
        List<AddressDto> updatedAddressDtoList = profileDto.getAddressList();

        for (AddressDto addressDto : updatedAddressDtoList) {
            if (addressDto.getAddressId() == null) {
                if (addressList.size() >= SORTED_ADDRESS_LIMIT) {
                    throw new IllegalArgumentException("Only " + SORTED_ADDRESS_LIMIT + " address can be stored.");
                }
                Address address = new Address();
                address.setClient(client);
                udpateAddressDtoInAddress(addressDto, address);
                addressList.add(address);
            } else if (addressMap.containsKey(addressDto.getAddressId())) {
                Address address = addressMap.get(addressDto.getAddressId());
                udpateAddressDtoInAddress(addressDto, address);
                addressMap.remove(addressDto.getAddressId());
            } else if (!addressMap.containsKey(addressDto.getAddressId())) {
                throw new EntityNotFoundException("Address Id not found.");
            }
        }

        for (UUID addressId : addressMap.keySet()) {
            addressRepository.deleteById(addressId);
        }
        clientRepository.save(client);

        return new ApiResponse("Updated Successfully.", 200);
    }

    private void udpateAddressDtoInAddress(AddressDto addressDto, Address address) {
        address.setFloorNBuilding(addressDto.getFloorNBuilding());
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setCountry(addressDto.getCountry());
        address.setPostalCode(addressDto.getPostalCode());
    }


}
