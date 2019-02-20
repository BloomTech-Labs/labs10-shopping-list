//
//  Struct.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct Category: Codable {
    var createdAt: Date
    var groupID: Int
    var name: String
    var token: String
    var updatedAt: Date
    var userID: Int
    
    var items: [Item]
}
