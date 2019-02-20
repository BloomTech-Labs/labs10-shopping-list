//
//  Item.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct Item: Codable {
    
    var categoryID: Int
    var createdAt: Date
    var itemID: Int
    var measurement: String
    var name: String
    var price: Double
    var quantity: Int
    var updatedAt: Date
    
    var groupID: Int
}
