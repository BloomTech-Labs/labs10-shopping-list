//
//  Item.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct Item: Codable {
    
    var createdAt: String
    var measurement: String
    var name: String
    var purchasedBy: String
    var price: Double
    var quantity: Int
    var updatedAt: String
    var purchased: Bool
    var category: String
    var groupID: [Group]?
    
    
    init(name: String, measurement: String, purchased: Bool, purchasedBy: String, category: String, price: Double, quantity: Int ) {
     //  self.groupID = groupID
        self.name = name
        self.measurement = measurement
        self.purchased = purchased
        self.purchasedBy = purchasedBy
        self.category = category
        self.createdAt = Date().dateToString()
        self.updatedAt = Date().dateToString()
        self.price = price
        self.quantity = quantity
    }
    
    
}
