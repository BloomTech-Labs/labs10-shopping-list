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
    
    var createdAt: String
    var measurement: String
    var name: String
    var purchasedBy: Int
    var price: Double
    var quantity: Int
    var updatedAt: String
    var purchased: Bool
    var category: String
    var groupId: Int?
    var id: Int?
    var purchasedOn: String
    
    init(name: String, measurement: String, purchased: Bool,purchasedBy: Int, category: String, price: Double, quantity: Int, groupId: Int?) {
     //  self.groupID = groupID
        self.name = name
        self.measurement = measurement
        self.purchased = purchased
        self.purchasedBy = purchasedBy
        self.category = category
        self.createdAt = Date().dateToString()
        self.updatedAt = Date().dateToString()
        self.purchasedOn = Date().dateToString()
        self.price = price
        self.quantity = quantity
        self.id = nil
        self.groupId = groupId
    }
}
