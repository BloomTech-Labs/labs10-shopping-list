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
    
    var measurement: String?
    var name: String
    var price: Double
    var quantity: Int?
    var purchased: Bool
    var groupID: Int?
    var id: Int?
    
    init(name: String, measurement: String? = nil, purchased: Bool, price: Double, quantity: Int? = nil, group: Group) {
        self.groupID = group.groupID
        self.name = name
        self.measurement = measurement
        self.purchased = purchased
        self.price = price
        self.quantity = quantity
        self.id = nil
    }
}

extension Item: Equatable {
    
    static func ==(lhs: Item, rhs: Item) -> Bool {
        return lhs.name == rhs.name &&
            lhs.groupID == rhs.groupID
    }
    
}
