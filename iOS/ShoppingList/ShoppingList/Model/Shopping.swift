//
//  Shopping.swift
//  ShoppingList
//
//  Created by Shopping List on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


struct ShoppingUser: Codable {
    let id: Int
    let name: String
    let email: String
    let password: String
    let profilePicture: URL
    let emailNotification: Bool
    let textNotification: Bool
    let role: String
    let createdAt: Date
    let updatedAt: Date
}


struct ShopGroups: Codable {
    let id: Int
    let userID: ShoppingUser
    let name: String
    let token: String
    let createdAt: Date
    let updatedAt: Date
}

struct ShopItems: Codable {
    let id: Int
    let name: String
    let purchased: Bool
    let group: [ShopGroups]
    let price: Double
    let quantity: Int
    let measurement: Int
    let purchasedOn: Date
    let category: CategoryItem
    let createdAt: Date
    let updateAt: Date
    }

struct CategoryItem: Codable {
    let id: Int
    let name: String
    
}
