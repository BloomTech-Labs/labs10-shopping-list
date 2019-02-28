//
//  Item.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct ItemList: Codable {
    let data: [Item]
}

struct Item: Codable {
    
    var createdAt: String?
    var measurement: String?
    var name: String
    var price: Double
    var quantity: Int?
    var updatedAt: String?
    var purchased: Bool
    // var category: String
    var groupID: Int?
    var id: Int?
    var purchasedOn: String
    
    init(name: String, measurement: String? = nil, purchased: Bool, /*category: String,*/ price: Double, quantity: Int? = nil, groupID: Int? = nil) {
        //  self.groupID = groupIDs
        self.name = name
        self.measurement = measurement
        self.purchased = purchased
        //   self.category = category
        self.createdAt = Date().dateToString()
        self.updatedAt = Date().dateToString()
        self.purchasedOn = Date().dateToString()
        self.price = price
        self.quantity = quantity
        self.id = nil
        self.groupID = groupID
    }
}
